/* -*- Mode: JavaScript; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
 *******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, Scheffelstraße 31a, Leipzig, Germany 2011.
 *
 * All rights reserved. Holger Seelig <holger.seelig@yahoo.de>.
 *
 * The copyright notice above does not evidence any actual of intended
 * publication of such source code, and is an unpublished work by create3000.
 * This material contains CONFIDENTIAL INFORMATION that is the property of
 * create3000.
 *
 * No permission is granted to copy, distribute, or create derivative works from
 * the contents of this software, in whole or in part, without the prior written
 * permission of create3000.
 *
 * NON-MILITARY USE ONLY
 *
 * All create3000 software are effectively free software with a non-military use
 * restriction. It is free. Well commented source is provided. You may reuse the
 * source in any way you please with the exception anything that uses it must be
 * marked to indicate is contains 'non-military use only' components.
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright 2015, 2016 Holger Seelig <holger.seelig@yahoo.de>.
 *
 * This file is part of the X_ITE Project.
 *
 * X_ITE is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License version 3 only, as published by the
 * Free Software Foundation.
 *
 * X_ITE is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more
 * details (a copy is included in the LICENSE file that accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version 3
 * along with X_ITE.  If not, see <http://www.gnu.org/licenses/gpl.html> for a
 * copy of the GPLv3 License.
 *
 * For Silvio, Joy and Adi.
 *
 ******************************************************************************/


define ([
	"jquery",
	"x_ite/Rendering/TextureBuffer",
	"x_ite/Bits/TraverseType",
	"standard/Math/Algorithm",
	"standard/Math/Algorithms/MergeSort",
	"standard/Math/Geometry/Camera",
	"standard/Math/Geometry/Box3",
	"standard/Math/Geometry/ViewVolume",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Vector4",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Utility/MatrixStack",
],
function ($,
          TextureBuffer,
	       TraverseType,
          Algorithm,
          MergeSort,
          Camera,
          Box3,
          ViewVolume,
          Vector3,
          Vector4,
          Rotation4,
          Matrix4,
          MatrixStack)
{
"use strict";

	var
		DEPTH_BUFFER_WIDTH  = 16,
		DEPTH_BUFFER_HEIGHT = DEPTH_BUFFER_WIDTH;

	function compareDistance (lhs, rhs) { return lhs .distance < rhs .distance; }

	function X3DRenderObject (executionContext)
	{
		this .cameraSpaceMatrix        = new MatrixStack (Matrix4);
		this .inverseCameraSpaceMatrix = new MatrixStack (Matrix4);
		this .projectionMatrix         = new MatrixStack (Matrix4);
		this .modelViewMatrix          = new MatrixStack (Matrix4);
		this .viewVolumes              = [ ];
		this .globalObjects            = [ ];
		this .localObjects             = [ ];
		this .lights                   = [ ];
		this .shadow                   = [ false ];
		this .localFogs                = [ ];
		this .layouts                  = [ ];
		this .textureProjectors        = [ ];
		this .generatedCubeMapTextures = [ ];
		this .shaders                  = new Set ();
		this .collisions               = [ ];
		this .numOpaqueShapes          = 0;
		this .numTransparentShapes     = 0;
		this .numCollisionShapes       = 0;
		this .numDepthShapes           = 0;
		this .opaqueShapes             = [ ];
		this .transparentShapes        = [ ];
		this .transparencySorter       = new MergeSort (this .transparentShapes, compareDistance);
		this .collisionShapes          = [ ];
		this .activeCollisions         = { };
		this .depthShapes              = [ ];
		this .speed                    = 0;

		try
		{
			this .depthBuffer = new TextureBuffer (executionContext .getBrowser (), DEPTH_BUFFER_WIDTH, DEPTH_BUFFER_HEIGHT);
		}
		catch (error)
		{
			console .error (error);

		   this .getDepth = function () { return 0; };
		}
	}

	X3DRenderObject .prototype =
	{
		constructor: X3DRenderObject,
		initialize: function ()
		{ },
		isIndependent: function ()
		{
			return true;
		},
		getCameraSpaceMatrix: function ()
		{
			return this .cameraSpaceMatrix;
		},
		getInverseCameraSpaceMatrix: function ()
		{
			return this .inverseCameraSpaceMatrix;
		},
		getProjectionMatrix: function ()
		{
			return this .projectionMatrix;
		},
		getModelViewMatrix: function ()
		{
			return this .modelViewMatrix;
		},
		getViewVolumes: function ()
		{
			return this .viewVolumes;
		},
		getViewVolume: function ()
		{
			return this .viewVolumes [this .viewVolumes .length - 1];
		},
		getGlobalObjects: function ()
		{
			return this .globalObjects;
		},
		getLocalObjects: function ()
		{
			return this .localObjects;
		},
		getLights: function ()
		{
			return this .lights;
		},
		pushShadow: function (value)
		{
			this .shadow .unshift (value || this .shadow [0]);
		},
		popShadow: function (value)
		{
			this .shadow .pop ();
		},
		setGlobalFog: (function ()
		{
			var modelViewMatrix = new Matrix4 ();

			return function (fog)
			{
				var fogContainer = this .localFogs [0] || fog .getFogs () .pop ();

				modelViewMatrix .assign (fog .getModelMatrix ()) .multRight (this .getInverseCameraSpaceMatrix () .get ());
				fogContainer .set (fog, modelViewMatrix);

				this .localFog = this .localFogs [0] = fogContainer;
			};
		})(),
		pushLocalFog: function (localFog)
		{
			this .localFogs .push (localFog);

			this .localFog = localFog;
		},
		popLocalFog: function ()
		{
			var localFog = this .localFogs .pop ();

			this .localFog = this .localFogs [this .localFogs .length - 1];

			return localFog;
		},
		getLayouts: function ()
		{
			return this .layouts;
		},
		getParentLayout: function ()
		{
			return this .layouts .length ? this .layouts [this .layouts .length - 1] : null;
		},
		getTextureProjectors: function ()
		{
			return this .textureProjectors;
		},
		getGeneratedCubeMapTextures: function ()
		{
			return this .generatedCubeMapTextures;
		},
		getShaders: function ()
		{
			return this .shaders;
		},
		getCollisions: function ()
		{
			return this .collisions;
		},
		setNumCollisionShapes: function (value)
		{
			this .numCollisionShapes = value;
		},
		getNumCollisionShapes: function ()
		{
			return this .numCollisionShapes;
		},
		getCollisionShapes: function ()
		{
			return this .collisionShapes;
		},
		setNumDepthShapes: function (value)
		{
			this .numDepthShapes = value;
		},
		getNumDepthShapes: function ()
		{
			return this .numDepthShapes;
		},
		getDepthShapes: function ()
		{
			return this .depthShapes;
		},
		setNumOpaqueShapes: function (value)
		{
			this .numOpaqueShapes = value;
		},
		getNumOpaqueShapes: function ()
		{
			return this .numOpaqueShapes;
		},
		getOpaqueShapes: function ()
		{
			return this .opaqueShapes;
		},
		setNumTransparentShapes: function (value)
		{
			this .numTransparentShapes = value;
		},
		getNumTransparentShapes: function ()
		{
			return this .numTransparentShapes;
		},
		getTransparentShapes: function ()
		{
			return this .transparentShapes;
		},
		constrainTranslation: function (translation, stepBack)
		{
			///  Contrains @a translation to a possible value the avatar can move.  If the avatar reaches and intersects with an
			///  and obstacle and @a stepBack is true a translation in the opposite directiion is returned.  Future implementation will
			///  will then return a value where the avatar slides along the wall.  Modifies translation in place.

			var distance = this .getDistance (translation);

			// Constrain translation when the viewer collides with an obstacle.

			distance -= this .getNavigationInfo () .getCollisionRadius ();

			if (distance > 0)
			{
				// Move.

				var length = translation .abs ();

				if (length > distance)
				{
					// Collision, the avatar would intersect with the obstacle.

					return translation .normalize () .multiply (distance);
				}

				// Everything is fine.

				return translation;
			}

			// Collision, the avatar is already within an obstacle.

			if (stepBack)
				return this .constrainTranslation (translation .normalize () .multiply (distance), false);

			return translation .assign (Vector3 .Zero);
		},
		getDistance: (function ()
		{
			var
				projectionMatrix            = new Matrix4 (),
				cameraSpaceProjectionMatrix = new Matrix4 (),
				localOrientation            = new Rotation4 (0, 0, 1, 0),
				vector                      = new Vector3 (0, 0, 0),
				rotation                    = new Rotation4 (0, 0, 1, 0);

			return function (direction)
			{
				///  Returns the distance to the closest object in @a direction.  The maximum determinable value is avatarHeight * 2.

				try
				{
				   var t0 = performance .now ();

					var
						viewpoint       = this .getViewpoint (),
						navigationInfo  = this .getNavigationInfo (),
						collisionRadius = navigationInfo .getCollisionRadius (),
						bottom          = navigationInfo .getStepHeight () - navigationInfo .getAvatarHeight (),
						nearValue       = navigationInfo .getNearValue (),
						avatarHeight    = navigationInfo .getAvatarHeight ();

					// Determine width and height of camera

					// Reshape camera

					Camera .ortho (-collisionRadius,
					               collisionRadius,
					               Math .min (bottom, -collisionRadius), /// TODO: bottom could be a positive value if stepHeight > avatarHeight.
					               collisionRadius,
					               nearValue,
					               Math .max (collisionRadius * 2, avatarHeight * 2),
					               projectionMatrix);

					// Translate camera to user position and to look in the direction of the direction.

					localOrientation .assign (viewpoint .orientation_ .getValue ()) .inverse () .multRight (viewpoint .getOrientation ());
					rotation .setFromToVec (Vector3 .zAxis, vector .assign (direction) .negate ()) .multRight (localOrientation);
					viewpoint .straightenHorizon (rotation);

					cameraSpaceProjectionMatrix .assign (viewpoint .getModelMatrix ());
					cameraSpaceProjectionMatrix .translate (viewpoint .getUserPosition ());
					cameraSpaceProjectionMatrix .rotate (rotation);
					cameraSpaceProjectionMatrix .inverse ();

					cameraSpaceProjectionMatrix .multRight (projectionMatrix);
					cameraSpaceProjectionMatrix .multLeft (viewpoint .getCameraSpaceMatrix ());

					this .getProjectionMatrix () .pushMatrix (cameraSpaceProjectionMatrix);

					var depth = this .getDepth (projectionMatrix);

					this .getProjectionMatrix () .pop ();

					this .collisionTime += performance .now () - t0;
					return -depth;
				}
				catch (error)
				{
					console .log (error);
				}
			};
		})(),
		getDepth: (function ()
		{
			var
				depthBufferViewport   = new Vector4 (0, 0, DEPTH_BUFFER_WIDTH, DEPTH_BUFFER_HEIGHT),
				depthBufferViewVolume = new ViewVolume ();

			depthBufferViewVolume .set (Matrix4 .Identity, depthBufferViewport, depthBufferViewport);

			return function (projectionMatrix)
			{
				///  Returns the depth value to the closest object.  The maximum determinable value is avatarHeight * 2.

				this .depthBuffer .bind ();

				this .viewVolumes .push (depthBufferViewVolume);
				this .depth (this .collisionShapes, this .numCollisionShapes);
				this .viewVolumes .pop ();

				var depth = this .depthBuffer .getDepth (projectionMatrix, depthBufferViewport);

				this .depthBuffer .unbind ();

				return depth;
			};
		})(),
		render: function (type, callback, group)
		{
			switch (type)
			{
				case TraverseType .COLLISION:
				{
					// Collect for collide and gravite
					this .numCollisionShapes = 0;

					callback .call (group, type, this);
					this .collide ();
					this .gravite ();
					break;
				}
				case TraverseType .DEPTH:
				{
					this .numDepthShapes = 0;

					callback .call (group, type, this);
					this .depth (this .depthShapes, this .numDepthShapes);
					break;
				}
				case TraverseType .DISPLAY:
				{
					this .lightIndex           = 0;
					this .numOpaqueShapes      = 0;
					this .numTransparentShapes = 0;

					this .setGlobalFog (this .getFog ());

					callback .call (group, type, this);
					this .draw (group);
					break;
				}
			}
		},
		addCollisionShape: (function ()
		{
			var
				bboxSize   = new Vector3 (0, 0, 0),
				bboxCenter = new Vector3 (0, 0, 0);

			return function (shapeNode)
			{
				var modelViewMatrix = this .getModelViewMatrix () .get ();

				modelViewMatrix .multDirMatrix (bboxSize   .assign (shapeNode .getBBoxSize ()));
				modelViewMatrix .multVecMatrix (bboxCenter .assign (shapeNode .getBBoxCenter ()));

				var
					radius     = bboxSize .abs () / 2,
					viewVolume = this .viewVolumes [this .viewVolumes .length - 1];

				if (viewVolume .intersectsSphere (radius, bboxCenter))
				{
					if (this .numCollisionShapes === this .collisionShapes .length)
						this .collisionShapes .push ({ renderer: this, browser: this .getBrowser (), modelViewMatrix: new Float32Array (16), collisions: [ ], clipPlanes: [ ] });

					var context = this .collisionShapes [this .numCollisionShapes];

					++ this .numCollisionShapes;

					context .modelViewMatrix .set (modelViewMatrix);
					context .shapeNode = shapeNode;
					context .scissor   = viewVolume .getScissor ();

					// Collisions

					var
						sourceCollisions      = this .collisions,
						destinationCollisions = context .collisions;

					for (var i = 0, length = sourceCollisions .length; i < length; ++ i)
						destinationCollisions [i] = sourceCollisions [i];

					destinationCollisions .length = length;

					// Clip planes

					var
						sourceClipPlanes      = this .localObjects,
						destinationClipPlanes = context .clipPlanes;

					for (var i = 0, length = sourceClipPlanes .length; i < length; ++ i)
						destinationClipPlanes [i] = sourceClipPlanes [i];

					destinationClipPlanes .length = length;

					return true;
				}

				return false;
			};
		})(),
		addDepthShape: (function ()
		{
			var
				bboxSize   = new Vector3 (0, 0, 0),
				bboxCenter = new Vector3 (0, 0, 0);

			return function (shapeNode)
			{
				var modelViewMatrix = this .getModelViewMatrix () .get ();

				modelViewMatrix .multDirMatrix (bboxSize   .assign (shapeNode .getBBoxSize ()));
				modelViewMatrix .multVecMatrix (bboxCenter .assign (shapeNode .getBBoxCenter ()));

				var
					radius     = bboxSize .abs () / 2,
					viewVolume = this .viewVolumes [this .viewVolumes .length - 1];

				if (viewVolume .intersectsSphere (radius, bboxCenter))
				{
					if (this .numDepthShapes === this .depthShapes .length)
						this .depthShapes .push ({ renderer: this, browser: this .getBrowser (), modelViewMatrix: new Float32Array (16), clipPlanes: [ ] });

					var context = this .depthShapes [this .numDepthShapes];

					++ this .numDepthShapes;

					context .modelViewMatrix .set (modelViewMatrix);
					context .shapeNode = shapeNode;
					context .scissor   = viewVolume .getScissor ();

					// Clip planes

					var
						sourceClipPlanes      = this .localObjects,
						destinationClipPlanes = context .clipPlanes;

					for (var i = 0, length = sourceClipPlanes .length; i < length; ++ i)
						destinationClipPlanes [i] = sourceClipPlanes [i];

					destinationClipPlanes .length = length;

					return true;
				}

				return false;
			};
		})(),
		addDisplayShape: (function ()
		{
			var
				bboxSize   = new Vector3 (0, 0, 0),
				bboxCenter = new Vector3 (0, 0, 0);

			return function (shapeNode)
			{
				var modelViewMatrix = this .getModelViewMatrix () .get ();

				modelViewMatrix .multDirMatrix (bboxSize   .assign (shapeNode .getBBoxSize ()));
				modelViewMatrix .multVecMatrix (bboxCenter .assign (shapeNode .getBBoxCenter ()));

				var
					radius     = bboxSize .abs () / 2,
					viewVolume = this .viewVolumes [this .viewVolumes .length - 1];

				if (viewVolume .intersectsSphere (radius, bboxCenter))
				{
					if (shapeNode .getTransparent ())
					{
						var num = this .numTransparentShapes;

						if (num === this .transparentShapes .length)
							this .transparentShapes .push (this .createShapeContext (true));

						var context = this .transparentShapes [num];

						++ this .numTransparentShapes;
					}
					else
					{
						var num = this .numOpaqueShapes;

						if (num === this .opaqueShapes .length)
							this .opaqueShapes .push (this .createShapeContext (false));

						var context = this .opaqueShapes [num];

						++ this .numOpaqueShapes;
					}

					context .modelViewMatrix .set (modelViewMatrix);
					context .scissor .assign (viewVolume .getScissor ());
					context .shapeNode = shapeNode;
					context .distance  = bboxCenter .z;
					context .fogNode   = this .localFog;
					context .shadow    = this .shadow [0];

					// Clip planes and local lights

					var
						sourceShaderObjects      = this .localObjects,
						destinationShaderObjects = context .localObjects;

					for (var i = 0, length = sourceShaderObjects .length; i < length; ++ i)
						destinationShaderObjects [i] = sourceShaderObjects [i];

					destinationShaderObjects .length = length;

					return true;
				}

				return false;
			};
		})(),
		createShapeContext: function (transparent)
		{
			return {
				renderer: this,
				browser: this .getBrowser (),
				transparent: transparent,
				geometryType: 3,
				fogCoords: false,
				colorMaterial: false,
				modelViewMatrix: new Float32Array (16),
				scissor: new Vector4 (0, 0, 0, 0),
				localObjects: [ ],
				linePropertiesNode: null,
				materialNode: null,
				textureNode: null,
				textureTransformNode: null,
				shaderNode: null,
				shadow: false,
			};
		},
		collide: (function ()
		{
			var
				invModelViewMatrix = new Matrix4 (),
				modelViewMatrix    = new Matrix4 (),
				collisionBox       = new Box3 (Vector3 .Zero, Vector3 .Zero),
				collisionSize      = new Vector3 (0, 0, 0);

			return function ()
			{
				// Collision nodes are handled here.

				var
					activeCollisions = { }, // current active Collision nodes
					collisionRadius2 = 2.2 * this .getNavigationInfo () .getCollisionRadius (); // Make the radius a little bit larger.

				collisionSize .set (collisionRadius2, collisionRadius2, collisionRadius2);

				for (var i = 0, length = this .numCollisionShapes; i < length; ++ i)
				{
					try
					{
						var
							context    = this .collisionShapes [i],
							collisions = context .collisions;

						if (collisions .length)
						{
						   collisionBox .set (collisionSize, Vector3 .Zero);
							collisionBox .multRight (invModelViewMatrix .assign (context .modelViewMatrix) .inverse ());

							if (context .shapeNode .intersectsBox (collisionBox, context .clipPlanes, modelViewMatrix .assign (context .modelViewMatrix)))
							{
							   for (var c = 0; c < collisions .length; ++ c)
									activeCollisions [collisions [c] .getId ()] = collisions [c];
							}
						}
					}
					catch (error)
					{
						console .log (error);
					}
				}

				// Set isActive to FALSE for affected nodes.

				if (! $.isEmptyObject (this .activeCollisions))
				{
					var inActiveCollisions = $.isEmptyObject (activeCollisions)
					                         ? this .activeCollisions
					                         : Algorithm .set_difference (this .activeCollisions, activeCollisions, { });

					for (var key in inActiveCollisions)
						inActiveCollisions [key] .set_active (false);
				}

				// Set isActive to TRUE for affected nodes.

				this .activeCollisions = activeCollisions;

				for (var key in activeCollisions)
					activeCollisions [key] .set_active (true);
			};
		})(),
		gravite: (function ()
		{
			var
				projectionMatrix            = new Matrix4 (),
				cameraSpaceProjectionMatrix = new Matrix4 (),
				translation                 = new Vector3 (0, 0, 0),
				rotation                    = new Rotation4 (0, 0, 1, 0);

			return function ()
			{
			   try
			   {
					var
						browser    = this .getBrowser (),
						shaderNode = browser .getDepthShader ();

					if (shaderNode .getValid ())
					{
						// Terrain following and gravitation

						if (browser .getActiveLayer () === this)
						{
							if (browser .getCurrentViewer () !== "WALK")
								return;
						}
						else if (this .getNavigationInfo () .getViewer () !== "WALK")
							return;

						// Get NavigationInfo values

						var
							navigationInfo  = this .getNavigationInfo (),
							viewpoint       = this .getViewpoint (),
							collisionRadius = navigationInfo .getCollisionRadius (),
							nearValue       = navigationInfo .getNearValue (),
							avatarHeight    = navigationInfo .getAvatarHeight (),
							stepHeight      = navigationInfo .getStepHeight ();

						// Reshape viewpoint for gravite.

						Camera .ortho (-collisionRadius,
						               collisionRadius,
						               -collisionRadius,
						               collisionRadius,
						               nearValue,
						               Math .max (collisionRadius * 2, avatarHeight * 2),
						               projectionMatrix);

						// Transform viewpoint to look down the up vector

						var
							upVector = viewpoint .getUpVector (),
							down     = rotation .setFromToVec (Vector3 .zAxis, upVector);

						cameraSpaceProjectionMatrix .assign (viewpoint .getModelMatrix ());
						cameraSpaceProjectionMatrix .translate (viewpoint .getUserPosition ());
						cameraSpaceProjectionMatrix .rotate (down);
						cameraSpaceProjectionMatrix .inverse ();

						cameraSpaceProjectionMatrix .multRight (projectionMatrix);
						cameraSpaceProjectionMatrix .multLeft (viewpoint .getCameraSpaceMatrix ());

						this .getProjectionMatrix () .pushMatrix (cameraSpaceProjectionMatrix);

						var distance = -this .getDepth (projectionMatrix);

						this .getProjectionMatrix () .pop ();

						// Gravite or step up

						distance -= avatarHeight;

						var up = rotation .setFromToVec (Vector3 .yAxis, upVector);

						if (distance > 0)
						{
							// Gravite and fall down the to the floor

							var currentFrameRate = this .speed ? browser .getCurrentFrameRate () : 1000000;

							this .speed -= browser .getBrowserOptions () .Gravity_ .getValue () / currentFrameRate;

							var y = this .speed / currentFrameRate;

							if (y < -distance)
							{
								// The ground is reached.
								y = -distance;
								this .speed = 0;
							}

							viewpoint .positionOffset_ = viewpoint .positionOffset_ .getValue () .add (up .multVecRot (translation .set (0, y, 0)));
						}
						else
						{
							this .speed = 0;

							distance = -distance;

							if (distance > 0.01 && distance < stepHeight)
							{
								// Step up
								this .constrainTranslation (up .multVecRot (translation .set (0, distance, 0)), false);

								//if (getBrowser () -> getBrowserOptions () -> animateStairWalks ())
								//{
								//	float step = getBrowser () -> getCurrentSpeed () / getBrowser () -> getCurrentFrameRate ();
								//	step = abs (getInverseCameraSpaceMatrix () .mult_matrix_dir (Vector3f (0, step, 0) * up));
								//
								//	Vector3f offset = Vector3f (0, step, 0) * up;
								//
								//	if (math::abs (offset) > math::abs (translation) or getBrowser () -> getCurrentSpeed () == 0)
								//		offset = translation;
								//
								//	getViewpoint () -> positionOffset () += offset;
								//}
								//else
									viewpoint .positionOffset_ = translation .add (viewpoint .positionOffset_ .getValue ());
							}
						}
					}
				}
				catch (error)
				{
				   console .log (error);
				}
			};
		})(),
		depth: (function ()
		{
			var projectionMatrixArray = new Float32Array (16);

			return function (shapes, numShapes)
			{
				var
					browser    = this .getBrowser (),
					gl         = browser .getContext (),
					viewport   = this .getViewVolume () .getViewport (),
					shaderNode = browser .getDepthShader ();

				// Configure depth shader.

				if (shaderNode .getValid ())
				{
					shaderNode .enable (gl);

					projectionMatrixArray .set (this .getProjectionMatrix () .get ());

					gl .uniformMatrix4fv (shaderNode .x3d_ProjectionMatrix, false, projectionMatrixArray);

					// Configure viewport and background

					gl .viewport (viewport [0],
					              viewport [1],
					              viewport [2],
					              viewport [3]);

					gl .scissor (viewport [0],
					             viewport [1],
					             viewport [2],
					             viewport [3]);

					gl .clearColor (1, 0, 0, 0); // Must be '1, 0, 0, 0'.
					gl .clear (gl .COLOR_BUFFER_BIT | gl .DEPTH_BUFFER_BIT);

					// Render all objects

					gl .enable (gl .DEPTH_TEST);
					gl .depthMask (true);
					gl .disable (gl .BLEND);
					gl .disable (gl .CULL_FACE);

					for (var s = 0; s < numShapes; ++ s)
					{
						var
							context = shapes [s],
							scissor = context .scissor;

						// TODO: viewport must not be the browser or layer viewport.
						gl .scissor (scissor .x,
						             scissor .y,
						             scissor .z,
						             scissor .w);

						// Clip planes

						shaderNode .setLocalObjects (gl, context .clipPlanes);

						// modelViewMatrix

						gl .uniformMatrix4fv (shaderNode .x3d_ModelViewMatrix, false, context .modelViewMatrix);

						// Draw

						context .shapeNode .depth (gl, context, shaderNode);
					}

					shaderNode .disable (gl);
				}
			};
		})(),
		draw: (function ()
		{
			var
				viewportArray          = new Int32Array (4),
				projectionMatrixArray  = new Float32Array (16),
				cameraSpaceMatrixArray = new Float32Array (16);

			return function (group)
			{
				var
					browser                  = this .getBrowser (),
					gl                       = browser .getContext (),
					viewport                 = this .getViewVolume () .getViewport (),
					shaders                  = this .shaders,
					lights                   = this .lights,
					textureProjectors        = this .textureProjectors,
					generatedCubeMapTextures = this .generatedCubeMapTextures;


				// PREPARATIONS


				if (this .isIndependent ())
				{
					// Render shadow maps.

					for (var i = 0, length = lights .length; i < length; ++ i)
						lights [i] .renderShadowMap (this);

					// Render GeneratedCubeMapTextures.

					for (var i = 0, length = generatedCubeMapTextures .length; i < length; ++ i)
						generatedCubeMapTextures [i] .renderTexture (this, group);
				}


				// DRAW


				// Set up shadow matrix for all lights, and matrix for all projective textures.

				browser .getHeadlight () .setGlobalVariables (this);

				for (var i = 0, length = lights .length; i < length; ++ i)
					lights [i] .setGlobalVariables (this);

				for (var i = 0, length = textureProjectors .length; i < length; ++ i)
					textureProjectors [i] .setGlobalVariables (this);

				// Configure viewport and background

				gl .viewport (viewport [0],
				              viewport [1],
				              viewport [2],
				              viewport [3]);

				gl .scissor (viewport [0],
				             viewport [1],
				             viewport [2],
								 viewport [3]);

				// Draw background.

				gl .clear (gl .DEPTH_BUFFER_BIT);

				this .getBackground () .display (gl, this, viewport);

				// Set global uniforms.

				viewportArray          .set (viewport);
				cameraSpaceMatrixArray .set (this .getCameraSpaceMatrix () .get ());
				projectionMatrixArray  .set (this .getProjectionMatrix () .get ());

				if (browser .hasPointShader ())  shaders .add (browser .getPointShader ());
				if (browser .hasLineShader ())   shaders .add (browser .getLineShader ());
				if (browser .hasShadowShader ()) shaders .add (browser .getShadowShader ());
				shaders .add (browser .getDefaultShader ());

				shaders .forEach (function (shader)
				{
					shader .setGlobalUniforms (gl, this, cameraSpaceMatrixArray, projectionMatrixArray, viewportArray);
				},
				this);

				// Sorted blend

				// Render opaque objects first

				gl .enable (gl .DEPTH_TEST);
				gl .depthMask (true);
				gl .disable (gl .BLEND);

				var opaqueShapes = this .opaqueShapes;

				for (var i = 0, length = this .numOpaqueShapes; i < length; ++ i)
				{
					var
						context = opaqueShapes [i],
						scissor = context .scissor;

					gl .scissor (scissor .x,
					             scissor .y,
					             scissor .z,
					             scissor .w);

					context .shapeNode .display (gl, context);
				}

				// Render transparent objects

				gl .depthMask (false);
				gl .enable (gl .BLEND);

				var transparentShapes = this .transparentShapes;

				this .transparencySorter .sort (0, this .numTransparentShapes);

				for (var i = 0, length = this .numTransparentShapes; i < length; ++ i)
				{
					var
						context = transparentShapes [i],
						scissor = context .scissor;

					gl .scissor (scissor .x,
					             scissor .y,
					             scissor .z,
					             scissor .w);

					context .shapeNode .display (gl, context);
				}

				gl .depthMask (true);
				gl .disable (gl .BLEND);


				// POST DRAW


				gl .activeTexture (gl .TEXTURE0);

				if (this .isIndependent ())
				{
					// Recycle clip planes, local fogs, local lights, and local projective textures.

					var localObjects = browser .getLocalObjects ();

					for (var i = 0, length = localObjects .length; i < length; ++ i)
						localObjects [i] .dispose ();

					localObjects .length = 0;

					// Recycle global lights and global projective textures.

					var globalObjects = this .globalObjects;

					for (var i = 0, length = globalObjects .length; i < length; ++ i)
						globalObjects [i] .dispose ();
				}

				// Reset containers.

				shaders .clear ();

				this .globalObjects .length = 0;

				lights                   .length = 0;
				textureProjectors        .length = 0;
				generatedCubeMapTextures .length = 0;
			};
		})(),
	};

	return X3DRenderObject;
});
