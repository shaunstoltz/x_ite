/* -*- Mode: JavaScript; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
 *******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This file is part of the X_ITE Project.
 *
 * NON-MILITARY USE ONLY
 *
 * All create3000 software are effectively free software with a non-military use
 * restriction. It is free. Well commented source is provided. You may reuse the
 * source in any way you please with the exception anything that uses it must be
 * marked to indicate is contains "non-military use only" components.
 *
 * Copyright 2016 Andreas Plesch.
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


define (function ()
{
"use strict";

	var keywords = [
		"accessType",
		"additionalInterface",
		"appinfo",
		"AS",
		"conversionFactor",
		"DEF",
		"dir",
		"documentation",
		"fromField",
		"fromNode",
		"http-equiv",
		"importedDEF",
		"inlineDEF",
		"lang",
		"localDEF",
		"nodeField",
		"profile",
		"USE",
	];

	var fields = [
		"actionKeyPress",
		"actionKeyRelease",
		"activate",
		"activeLayer",
		"address",
		"align",
		"alpha",
		"altKey",
		"ambientIntensity",
		"anchorPoint",
		"angle",
		"angleRate",
		"angularDampingFactor",
		"angularVelocity",
		"anisotropicDegree",
		"annotationGroupID",
		"annotations",
		"antennaLocation",
		"antennaPatternLength",
		"antennaPatternType",
		"applicationID",
		"applied",
		"appliedParameters",
		"articulationParameterArray",
		"articulationParameterChangeIndicatorArray",
		"articulationParameterCount",
		"articulationParameterDesignatorArray",
		"articulationParameterIdPartAttachedToArray",
		"articulationParameterTypeArray",
		"articulationParameterValue0_changed",
		"articulationParameterValue1_changed",
		"articulationParameterValue2_changed",
		"articulationParameterValue3_changed",
		"articulationParameterValue4_changed",
		"articulationParameterValue5_changed",
		"articulationParameterValue6_changed",
		"articulationParameterValue7_changed",
		"aspectRatio",
		"attenuation",
		"autoCalc",
		"autoDamp",
		"autoDisable",
		"autoOffset",
		"avatarSize",
		"axis",
		"axis1",
		"axis1Angle",
		"axis1Torque",
		"axis2",
		"axis2Angle",
		"axis2Torque",
		"axis3Angle",
		"axis3Torque",
		"axisOfRotation",
		"axisRotation",
		"backAmbientIntensity",
		"backDiffuseColor",
		"backEmissiveColor",
		"backShininess",
		"backSpecularColor",
		"backTransparency",
		"backUrl",
		"bboxCenter",
		"bboxSize",
		"beamWidth",
		"beginCap",
		"bindTime",
		"body1AnchorPoint",
		"body1Axis",
		"body2AnchorPoint",
		"body2Axis",
		"borderColor",
		"borderWidth",
		"bottom",
		"bottomRadius",
		"bottomUrl",
		"bounce",
		"boundaryModeR",
		"boundaryModeS",
		"boundaryModeT",
		"boundaryOpacity",
		"category",
		"ccw",
		"center",
		"centerOfMass",
		"centerOfRotation_changed",
		"centerOfRotation",
		"channels",
		"channelsEnabled",
		"child1Url",
		"child2Url",
		"child3Url",
		"child4Url",
		"class",
		"clipBoundary",
		"closed",
		"closureType",
		"collideTime",
		"collisionType",
		"color",
		"colorIndex",
		"colorKey",
		"colorMode",
		"colorPerVertex",
		"colorSteps",
		"constantForceMix",
		"contactNormal",
		"contactSurfaceThickness",
		"containerField",
		"content",
		"contentType",
		"contourStepSize",
		"controlKey",
		"controlPoint",
		"convex",
		"coolColor",
		"coordIndex",
		"country",
		"creaseAngle",
		"createParticles",
		"crossSection",
		"cryptoKeyID",
		"cryptoSystem",
		"cutOffAngle",
		"cycleInterval",
		"cycleTime",
		"data",
		"dataLength",
		"deadReckoning",
		"deletionAllowed",
		"depth",
		"description",
		"desiredAngularVelocity1",
		"desiredAngularVelocity2",
		"detonateTime",
		"detonationLocation",
		"detonationRelativeLocation",
		"detonationResult",
		"diffuseColor",
		"dimensions",
		"direction",
		"directOutput",
		"disableAngularSpeed",
		"disableLinearSpeed",
		"disableTime",
		"diskAngle",
		"displacements",
		"displayed",
		"displayPolicy",
		"domain",
		"duration_changed",
		"duration",
		"easeInEaseOut",
		"edgeColor",
		"elapsedTime",
		"emissiveColor",
		"enabled",
		"enabledAxes",
		"encodingScheme",
		"endAngle",
		"endCap",
		"enteredText",
		"enterTime",
		"entityCategory",
		"entityCountry",
		"entityDomain",
		"entityExtra",
		"entityID",
		"entityKind",
		"entitySpecific",
		"entitySubcategory",
		"errorCorrection",
		"eventApplicationID",
		"eventEntityID",
		"eventNumber",
		"eventSiteID",
		"exitTime",
		"extra",
		"family",
		"fanCount",
		"farDistance",
		"fieldOfView",
		"filled",
		"finalText",
		"finiteRotationAxis",
		"fired1",
		"fired2",
		"firedTime",
		"fireMissionIndex",
		"firingRange",
		"firingRate",
		"fixed",
		"fogType",
		"force",
		"forceID",
		"forceOutput",
		"forces",
		"forceTransitions",
		"fraction_changed",
		"frameCount",
		"frameDuration",
		"frameIncrement",
		"frameIndex",
		"frequency",
		"frictionCoefficients",
		"frictionDirection",
		"frontUrl",
		"function",
		"fuse",
		"generateMipMaps",
		"geoCenter",
		"geoCoord_changed",
		"geoCoords",
		"geoGridOrigin",
		"geometryType",
		"geoSystem",
		"geovalue_changed",
		"global",
		"gradientThreshold",
		"gravity",
		"groundAngle",
		"groundColor",
		"gustiness",
		"hatchColor",
		"hatched",
		"hatchStyle",
		"headlight",
		"height",
		"hinge1Angle",
		"hinge1AngleRate",
		"hinge2Angle",
		"hinge2AngleRate",
		"hitGeoCoord_changed",
		"hitNormal_changed",
		"hitPoint_changed",
		"hitTexCoord_changed",
		"horizontal",
		"image",
		"index",
		"inertia",
		"info",
		"initialDestination",
		"initialValue",
		"innerRadius",
		"inputFalse",
		"inputNegate",
		"inputSource",
		"inputTrue",
		"integerKey",
		"intensity",
		"intensityThreshold",
		"internal",
		"intersectionType",
		"isActive",
		"isBound",
		"isCollided",
		"isDetonated",
		"isLoaded",
		"isNetworkReader",
		"isNetworkWriter",
		"isOver",
		"isPaused",
		"isPickable",
		"isRtpHeaderHeard",
		"isSelected",
		"isStandAlone",
		"isValid",
		"iterations",
		"jump",
		"justify",
		"key",
		"keyPress",
		"keyRelease",
		"keyValue",
		"keyVelocity",
		"kind",
		"knot",
		"language",
		"layoutPolicy",
		"leadLineStyle",
		"leftToRight",
		"leftUrl",
		"length",
		"lengthOfModulationParameters",
		"level_changed",
		"level",
		"lifetimeVariation",
		"lighting",
		"limitOrientation",
		"linearAcceleration",
		"linearDampingFactor",
		"linearVelocity",
		"lineBounds",
		"lineSegments",
		"linetype",
		"linewidthScaleFactor",
		"llimit",
		"loa",
		"load",
		"loadTime",
		"location",
		"loop",
		"magnificationFilter",
		"marker",
		"marking",
		"mass",
		"matrix",
		"maxAngle",
		"maxAngle1",
		"maxBack",
		"maxCorrectionSpeed",
		"maxExtent",
		"maxFront",
		"maxParticles",
		"maxPosition",
		"maxSeparation",
		"maxTorque1",
		"maxTorque2",
		"minAngle",
		"minAngle1",
		"minBack",
		"minBounceSpeed",
		"minFront",
		"minificationFilter",
		"minPosition",
		"minSeparation",
		"mode",
		"modifiedFraction_changed",
		"modulationTypeDetail",
		"modulationTypeMajor",
		"modulationTypeSpreadSpectrum",
		"modulationTypeSystem",
		"momentsOfInertia",
		"motor1Angle",
		"motor1AngleRate",
		"motor1Axis",
		"motor2Angle",
		"motor2AngleRate",
		"motor2Axis",
		"motor3Angle",
		"motor3AngleRate",
		"motor3Axis",
		"multicastRelayHost",
		"multicastRelayPort",
		"munitionApplicationID",
		"munitionEndPoint",
		"munitionEntityID",
		"munitionQuantity",
		"munitionSiteID",
		"munitionStartPoint",
		"mustEvaluate",
		"name",
		"nearDistance",
		"networkMode",
		"next",
		"normal_changed",
		"normalIndex",
		"normalizeVelocity",
		"normalPerVertex",
		"numComponents",
		"objectType",
		"offset",
		"offsetUnits",
		"on",
		"opacityFactor",
		"order",
		"orientation_changed",
		"orientation",
		"origin",
		"orthogonalColor",
		"outerRadius",
		"parallelColor",
		"parameter",
		"particleLifetime",
		"particleSize",
		"pauseTime",
		"phaseFunction",
		"pickable",
		"pickedNormal",
		"pickedPoint",
		"pickedTextureCoordinate",
		"pitch",
		"plane",
		"point",
		"pointSize",
		"pointSizeAttenuation",
		"pointSizeMaxValue",
		"pointSizeMinValue",
		"pointSizeScaleFactor",
		"port",
		"position_changed",
		"position",
		"power",
		"preferAccuracy",
		"previous",
		"priority",
		"progress",
		"protoField",
		"radioEntityTypeCategory",
		"radioEntityTypeCountry",
		"radioEntityTypeDomain",
		"radioEntityTypeKind",
		"radioEntityTypeNomenclature",
		"radioEntityTypeNomenclatureVersion",
		"radioID",
		"radius",
		"range",
		"readInterval",
		"receivedPower",
		"receiverState",
		"reference",
		"referencePoint",
		"relativeAntennaLocation",
		"repeatR",
		"repeatS",
		"repeatT",
		"resumeTime",
		"retainedOpacity",
		"retainUserOffsets",
		"rightUrl",
		"rootUrl",
		"rotateYUp",
		"rotation_changed",
		"rotation",
		"rtpHeaderExpected",
		"sampleRate",
		"samples",
		"scale",
		"scaleMode",
		"scaleOrientation",
		"scheme",
		"segmentEnabled",
		"separateBackColor",
		"separation",
		"separationRate",
		"set_articulationParameterValue0",
		"set_articulationParameterValue1",
		"set_articulationParameterValue2",
		"set_articulationParameterValue3",
		"set_articulationParameterValue4",
		"set_articulationParameterValue5",
		"set_articulationParameterValue6",
		"set_articulationParameterValue7",
		"set_bind",
		"set_boolean",
		"set_colorIndex",
		"set_coordIndex",
		"set_crossSection",
		"set_destination",
		"set_fraction",
		"set_height",
		"set_index",
		"set_normalIndex",
		"set_orientation",
		"set_scale",
		"set_spine",
		"set_texCoordIndex",
		"set_triggerTime",
		"set_value",
		"shadows",
		"shiftKey",
		"shininess",
		"referencePoint",
		"side",
		"silhouetteBoundaryOpacity",
		"silhouetteRetainedOpacity",
		"silhouetteSharpness",
		"siteID",
		"size",
		"sizeUnits",
		"skinCoordIndex",
		"skinCoordWeight",
		"skyAngle",
		"skyColor",
		"sliderForce",
		"slipCoefficients",
		"slipFactors",
		"softnessConstantForceMix",
		"softnessErrorCorrection",
		"solid",
		"sortOrder",
		"source",
		"spacing",
		"spatialize",
		"specific",
		"specularColor",
		"speed",
		"speedFactor",
		"spine",
		"startAngle",
		"startTime",
		"stiffness",
		"stop1Bounce",
		"stop1ConstantForceMix",
		"stop1ErrorCorrection",
		"stop2Bounce",
		"stop2ErrorCorrection",
		"stop3Bounce",
		"stop3ErrorCorrection",
		"stopBounce",
		"stopErrorCorrection",
		"stopTime",
		"string",
		"stripCount",
		"style",
		"subcategory",
		"summary",
		"surfaceArea",
		"surfaceSpeed",
		"surfaceTolerance",
		"surfaceValues",
		"suspensionErrorCorrection",
		"suspensionForce",
		"tau",
		"tdlType",
		"tessellation",
		"tessellationScale",
		"texCoordIndex",
		"texCoordKey",
		"text",
		"textBounds",
		"textureCompression",
		"texturePriority",
		"time",
		"timeOut",
		"timestamp",
		"title",
		"toField",
		"toggle",
		"tolerance",
		"toNode",
		"top",
		"topToBottom",
		"topUrl",
		"torques",
		"touchTime",
		"trackPoint_changed",
		"transitionComplete",
		"transitionTime",
		"transitionType",
		"translation_changed",
		"translation",
		"transmitFrequencyBandwidth",
		"transmitState",
		"transmitterApplicationID",
		"transmitterEntityID",
		"transmitterRadioID",
		"transmitterSiteID",
		"transparency",
		"triggerTime",
		"triggerTrue",
		"triggerValue",
		"turbulence",
		"type",
		"uClosed",
		"uDimension",
		"uKnot",
		"ulimit",
		"uOrder",
		"update",
		"upVector",
		"url",
		"useFiniteRotation",
		"useGeometry",
		"useGlobalGravity",
		"uTessellation",
		"value_changed",
		"value",
		"values",
		"variation",
		"vClosed",
		"vDimension",
		"vector",
		"version",
		"vertexCount",
		"vertices",
		"visibilityLimit",
		"visibilityRange",
		"visible",
		"vKnot",
		"vOrder",
		"vTessellation",
		"warhead",
		"warmColor",
		"weight",
		"weightConstant1",
		"weightConstant2",
		"weightFunction1",
		"weightFunction2",
		"whichChoice",
		"whichGeometry",
		"writeInterval",
		"xDimension",
		"xSpacing",
		"yScale",
		"zDimension",
		"zSpacing",
	];

	var nonStandardFields = [
		"alphaEquation",
		"blendColor",
		"colorEquation",
		"destinationAlphaFactor",
		"destinationColorFactor",
		"sourceAlphaFactor",
		"sourceColorFactor",
	]

	function transform (value)
	{
		HTMLSupport .attributeLowerCaseToCamelCase [value .toLowerCase ()] = value;
	}

	var HTMLSupport =
	{
		attributeLowerCaseToCamelCase: { }
	};

	keywords          .forEach (transform);
	fields            .forEach (transform);
	nonStandardFields .forEach (transform);

	Object .preventExtensions (HTMLSupport);
	Object .freeze (HTMLSupport);
	Object .seal (HTMLSupport);

	return HTMLSupport;
});
