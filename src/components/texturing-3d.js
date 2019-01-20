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


require ([
	"x_ite/Configuration/SupportedNodes",
//	"x_ite/Components/Texturing3D/ComposedTexture3D",
//	"x_ite/Components/Texturing3D/ImageTexture3D",
//	"x_ite/Components/Texturing3D/PixelTexture3D",
	"x_ite/Components/Texturing3D/TextureCoordinate3D",
	"x_ite/Components/Texturing3D/TextureCoordinate4D",
	"x_ite/Components/Texturing3D/TextureTransform3D",
	"x_ite/Components/Texturing3D/TextureTransformMatrix3D",
],
function (SupportedNodes,
//          ComposedTexture3D,
//          ImageTexture3D,
//          PixelTexture3D,
          TextureCoordinate3D,
          TextureCoordinate4D,
          TextureTransform3D,
          TextureTransformMatrix3D)
{
"use strict";

	var Texturing3D =
	{
//		ComposedTexture3D:        ComposedTexture3D,
//		ImageTexture3D:           ImageTexture3D,
//		PixelTexture3D:           PixelTexture3D,
		TextureCoordinate3D:      TextureCoordinate3D,
		TextureCoordinate4D:      TextureCoordinate4D,
		TextureTransform3D:       TextureTransform3D,
		TextureTransformMatrix3D: TextureTransformMatrix3D,
	};

	function createInstance (executionContext) { return new this (executionContext); }

	for (var typeName in Texturing3D)
	{
		var interfaceDeclaration = Texturing3D [typeName];

		interfaceDeclaration .createInstance = createInstance .bind (interfaceDeclaration);

		SupportedNodes [typeName]                 = interfaceDeclaration; 
		SupportedNodes [typeName .toUpperCase ()] = interfaceDeclaration; 
	}

	return Texturing3D;
});

