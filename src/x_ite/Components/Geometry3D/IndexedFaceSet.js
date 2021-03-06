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
	"x_ite/Fields",
	"x_ite/Basic/X3DFieldDefinition",
	"x_ite/Basic/FieldDefinitionArray",
	"x_ite/Components/Rendering/X3DComposedGeometryNode",
	"x_ite/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Geometry/Triangle3",
],
function (Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DComposedGeometryNode,
          X3DConstants,
          Vector3,
          Matrix4,
          Triangle3)
{
"use strict";

	function IndexedFaceSet (executionContext)
	{
		X3DComposedGeometryNode .call (this, executionContext);

		this .addType (X3DConstants .IndexedFaceSet);

		this .creaseAngle_ .setUnit ("angle");
	}

	IndexedFaceSet .prototype = Object .assign (Object .create (X3DComposedGeometryNode .prototype),
	{
		constructor: IndexedFaceSet,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_colorIndex",    new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_texCoordIndex", new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_normalIndex",   new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_coordIndex",    new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",             new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "ccw",               new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "convex",            new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "creaseAngle",       new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "colorPerVertex",    new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "normalPerVertex",   new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "colorIndex",        new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "texCoordIndex",     new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "normalIndex",       new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "coordIndex",        new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "attrib",            new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "fogCoord",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "color",             new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "texCoord",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "normal",            new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "coord",             new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "IndexedFaceSet";
		},
		getComponentName: function ()
		{
			return "Geometry3D";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
		initialize: function ()
		{
			X3DComposedGeometryNode .prototype .initialize .call (this);

			this .set_colorIndex_    .addFieldInterest (this .colorIndex_);
			this .set_texCoordIndex_ .addFieldInterest (this .texCoordIndex_);
			this .set_normalIndex_   .addFieldInterest (this .normalIndex_);
			this .set_coordIndex_    .addFieldInterest (this .coordIndex_);
		},
		getTexCoordPerVertexIndex: function (index)
		{
			if (index < this .texCoordIndex_ .length)
				return this .texCoordIndex_ [index];

			return this .coordIndex_ [index];
		},
		getColorPerVertexIndex: function (index)
		{
			if (index < this .colorIndex_ .length)
				return this .colorIndex_ [index];

			return this .coordIndex_ [index];
		},
		getColorIndex: function (index)
		{
			if (index < this .colorIndex_ .length)
				return this .colorIndex_ [index];

			return index;
		},
		getNormalPerVertexIndex: function (index)
		{
			if (index < this .normalIndex_ .length)
				return this .normalIndex_ [index];

			return this .coordIndex_ [index];
		},
		getNormalIndex: function (index)
		{
			if (index < this .normalIndex_ .length)
				return this .normalIndex_ [index];

			return index;
		},
		build: function ()
		{
			// Triangulate

			var polygons = this .triangulate ();

			// Build arrays

			if (polygons .length === 0)
				return;

			// Fill GeometryNode

			var
				colorPerVertex     = this .colorPerVertex_ .getValue (),
				normalPerVertex    = this .normalPerVertex_ .getValue (),
				coordIndex         = this .coordIndex_ .getValue (),
				attribNodes        = this .getAttrib (),
				numAttrib          = attribNodes .length,
				attribs            = this .getAttribs (),
				fogCoordNode       = this .getFogCoord (),
				colorNode          = this .getColor (),
				texCoordNode       = this .getTexCoord (),
				normalNode         = this .getNormal (),
				coordNode          = this .getCoord (),
				fogDepthArray      = this .getFogDepths (),
				colorArray         = this .getColors (),
				multiTexCoordArray = this .getMultiTexCoords (),
				normalArray        = this .getNormals (),
				vertexArray        = this .getVertices ();

			if (texCoordNode)
				texCoordNode .init (multiTexCoordArray);

			for (var p = 0, numPolygons = polygons .length; p < numPolygons; ++ p)
			{
				var
					polygon   = polygons [p],
					triangles = polygon .triangles,
					face      = polygon .face;

				for (var v = 0, numVertices = triangles .length; v < numVertices; ++ v)
				{
					var
						i     = triangles [v],
						index = coordIndex [i];

					for (var a = 0; a < numAttrib; ++ a)
						attribNodes [a] .addValue (index, attribs [a]);

					if (fogCoordNode)
						fogCoordNode .addDepth (index, fogDepthArray);

					if (colorNode)
					{
						if (colorPerVertex)
							colorNode .addColor (this .getColorPerVertexIndex (i), colorArray);
						else
							colorNode .addColor (this .getColorIndex (face), colorArray);
					}

					if (texCoordNode)
						texCoordNode .addTexCoord (this .getTexCoordPerVertexIndex (i), multiTexCoordArray);

					if (normalNode)
					{
						if (normalPerVertex)
							normalNode .addVector (this .getNormalPerVertexIndex (i), normalArray);

						else
							normalNode .addVector (this .getNormalIndex (face), normalArray);
					}

					coordNode .addPoint (index, vertexArray);
				}

				++ face;
			}

			// Autogenerate normal if not specified.

			if (! this .getNormal ())
				this .buildNormals (polygons);

			this .setSolid (this .solid_ .getValue ());
			this .setCCW (this .ccw_ .getValue ());
		},
		triangulate: function ()
		{
			var
				convex      = this .convex_ .getValue (),
				coordLength = this .coordIndex_ .length,
				polygons    = [ ];

			if (! this .getCoord ())
				return polygons;

			if (coordLength)
			{
				// Add -1 (polygon end marker) to coordIndex if not present.
				if (this .coordIndex_ [coordLength - 1] > -1)
					this .coordIndex_ .push (-1);

				var
					coordIndex  = this .coordIndex_ .getValue (),
					coordLength = this .coordIndex_ .length;

				// Construct triangle array and determine the number of used points.
				var
					vertices = [ ],
					face     = 0;

				for (var i = 0; i < coordLength; ++ i)
				{
					var index = coordIndex [i];

					if (index > -1)
					{
						// Add vertex index.
						vertices .push (i);
					}
					else
					{
						// Negativ index.

						if (vertices .length)
						{
							// Closed polygon.
							//if (coordIndex [vertices [0]] === coordIndex [vertices [vertices .length - 1]])
							//	vertices .pop ();

							switch (vertices .length)
							{
								case 0:
								case 1:
								case 2:
								{
									vertices .length = 0;
									break;
								}
								case 3:
								{
									// Add polygon with one triangle.
									polygons .push ({ vertices: vertices, triangles: vertices, face: face });
									vertices = [ ];
									break;
								}
								default:
								{
									// Triangulate polygons.
									var
										triangles = [ ],
										polygon   = { vertices: vertices, triangles: triangles, face: face };

									if (convex)
										this .triangulateConvexPolygon (vertices, triangles);
									else
										this .triangulatePolygon (vertices, triangles);

									if (triangles .length < 3)
									{
										vertices .length = 0;
									}
									else
									{
										polygons .push (polygon);
										vertices = [ ];
									}

									break;
								}
							}
						}

						++ face;
					}
				}
			}

			return polygons;
		},
		triangulatePolygon: (function ()
		{
			var polygon = [ ];

			return function (vertices, triangles)
			{
				var
					coordIndex = this .coordIndex_ .getValue (),
					coord      = this .getCoord ();

				for (var v = 0, length = vertices .length; v < length; ++ v)
				{
					var
						vertex = polygon [v],
						i      = vertices [v];

					if (! vertex)
						vertex = polygon [v] = new Vector3 (0, 0, 0);

					vertex .index = i;

					coord .get1Point (coordIndex [i], vertex);
				}

				polygon .length = length;

				Triangle3 .triangulatePolygon (polygon, triangles);

				for (var i = 0, length = triangles .length; i < length; ++ i)
					triangles [i] = triangles [i] .index;
			};
		})(),
		triangulateConvexPolygon: function (vertices, triangles)
		{
			// Fallback: Very simple triangulation for convex polygons.
			for (var i = 1, length = vertices .length - 1; i < length; ++ i)
				triangles .push (vertices [0], vertices [i], vertices [i + 1]);
		},
		buildNormals: function (polygons)
		{
			var
				normals     = this .createNormals (polygons),
				normalArray = this .getNormals ();

			for (var p = 0, pl = polygons .length; p < pl; ++ p)
			{
				var triangles = polygons [p] .triangles;

				for (var v = 0, tl = triangles .length; v < tl; ++ v)
				{
					var normal = normals [triangles [v]];

					normalArray .push (normal .x, normal .y, normal .z);
				}
			}
		},
		createNormals: (function ()
		{
			var
				normals     = [ ],
				normalIndex = [ ];

			return function (polygons)
			{
				var
					cw          = ! this .ccw_ .getValue (),
					coordIndex  = this .coordIndex_ .getValue (),
					coord       = this .getCoord (),
					normal      = null;

				normals     .length = 0;
				normalIndex .length = 0;

				for (var p = 0, pl = polygons .length; p < pl; ++ p)
				{
					var
						polygon  = polygons [p],
						vertices = polygon .vertices,
						length   = vertices .length;

					switch (length)
					{
						case 3:
						{
							normal = coord .getNormal (coordIndex [vertices [0]],
							                           coordIndex [vertices [1]],
							                           coordIndex [vertices [2]]);
							break;
						}
						case 4:
						{
							normal = coord .getQuadNormal (coordIndex [vertices [0]],
							                               coordIndex [vertices [1]],
							                               coordIndex [vertices [2]],
							                               coordIndex [vertices [3]]);
							break;
						}
						default:
						{
							normal = this .getPolygonNormal (vertices, coordIndex, coord);
							break;
						}
					}

					// Add a normal index for each point.

					for (var i = 0; i < length; ++ i)
					{
						var
							index        = vertices [i],
							point        = coordIndex [index],
							pointNormals = normalIndex [point];

						if (! pointNormals)
							pointNormals = normalIndex [point] = [ ];

						pointNormals .push (index);
					}

					if (cw)
						normal .negate ();

					// Add this normal for each vertex.

					for (var i = 0; i < length; ++ i)
						normals [vertices [i]] = normal;
				}

				return this .refineNormals (normalIndex, normals, this .creaseAngle_ .getValue ());
			};
		})(),
		getPolygonNormal: (function ()
		{
			var
				current = new Vector3 (0, 0, 0),
				next    = new Vector3 (0, 0, 0);

			return function (vertices, coordIndex, coord)
			{
				// Determine polygon normal.
				// We use Newell's method https://www.opengl.org/wiki/Calculating_a_Surface_Normal here:

				var normal = new Vector3 (0, 0, 0);

				coord .get1Point (coordIndex [vertices [0]], next);

				for (var i = 0, length = vertices .length; i < length; ++ i)
				{
					var tmp = current;
					current = next;
					next    = tmp;

					coord .get1Point (coordIndex [vertices [(i + 1) % length]], next);

					normal .x += (current .y - next .y) * (current .z + next .z);
					normal .y += (current .z - next .z) * (current .x + next .x);
					normal .z += (current .x - next .x) * (current .y + next .y);
				}

				return normal .normalize ();
			};
		})(),
	});

	return IndexedFaceSet;
});
