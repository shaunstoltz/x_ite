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
	"x_ite/Components/Core/X3DNode",
	"x_ite/Components/Networking/X3DUrlObject",
	"x_ite/Browser/Text/TextAlignment",
	"x_ite/InputOutput/FileLoader",
	"x_ite/Bits/X3DConstants",
	"x_ite/Browser/Networking/urls",
],
function (Fields,
          X3DNode,
          X3DUrlObject,
          TextAlignment,
          FileLoader,
          X3DConstants,
          urls)
{
"use strict";

	/*
	 * Font paths for default SERIF, SANS and TYPWRITER families.
	 */

	var Fonts =
	{
		SERIF: {
			PLAIN:      urls .getFontsUrl ("DroidSerif-Regular.ttf"),
			ITALIC:     urls .getFontsUrl ("DroidSerif-Italic.ttf"),
			BOLD:       urls .getFontsUrl ("DroidSerif-Bold.ttf"),
			BOLDITALIC: urls .getFontsUrl ("DroidSerif-BoldItalic.ttf"),
		},
		SANS: {
			PLAIN:      urls .getFontsUrl ("Ubuntu-R.ttf"),
			ITALIC:     urls .getFontsUrl ("Ubuntu-RI.ttf"),
			BOLD:       urls .getFontsUrl ("Ubuntu-B.ttf"),
			BOLDITALIC: urls .getFontsUrl ("Ubuntu-BI.ttf"),
		},
		TYPEWRITER: {
			PLAIN:      urls .getFontsUrl ("UbuntuMono-R.ttf"),
			ITALIC:     urls .getFontsUrl ("UbuntuMono-RI.ttf"),
			BOLD:       urls .getFontsUrl ("UbuntuMono-B.ttf"),
			BOLDITALIC: urls .getFontsUrl ("UbuntuMono-BI.ttf"),
		},
	};

	function X3DFontStyleNode (executionContext)
	{
		X3DNode .call (this, executionContext);

		this .addType (X3DConstants .X3DFontStyleNode);
		
		this .addChildObjects ("loadState", new Fields .SFInt32 (X3DConstants .NOT_STARTED_STATE));

		this .familyStack = [ ];
		this .alignments  = [ ];
		this .loader      = new FileLoader (this);
	}

	X3DFontStyleNode .prototype = Object .assign (Object .create (X3DNode .prototype),
	{
		constructor: X3DFontStyleNode,
		initialize: function ()
		{
			X3DNode .prototype .initialize .call (this);

			this .style_   .addInterest ("set_style__", this);
			this .justify_ .addInterest ("set_justify__", this);

			this .font        = null;
			this .familyIndex = 0;

			this .set_justify__ ();
			this .set_style__ ();

			this .requestAsyncLoad ();
		},
		setLoadState: X3DUrlObject .prototype .setLoadState,
		checkLoadState: X3DUrlObject .prototype .checkLoadState,
		getMajorAlignment: function ()
		{
			return this .alignments [0];
		},
		getMinorAlignment: function ()
		{
			return this .alignments [1];
		},
		set_style__: function ()
		{
			this .setLoadState (X3DConstants .NOT_STARTED_STATE);

			this .requestAsyncLoad ();
		},
		set_justify__: function ()
		{
			var majorNormal = this .horizontal_ .getValue () ? this .leftToRight_ .getValue () : this .topToBottom_ .getValue ();

			this .alignments [0] = this .justify_ .length > 0
			                       ? this .getAlignment (0, majorNormal)
			                       : majorNormal ? TextAlignment .BEGIN : TextAlignment .END;

			var minorNormal = this .horizontal_ .getValue () ? this .topToBottom_ .getValue () : this .leftToRight_ .getValue ();

			this .alignments [1] = this .justify_ .length > 1
			                       ? this .getAlignment (1, minorNormal)
			                       : minorNormal ? TextAlignment .FIRST : TextAlignment .END;
		},
		getAlignment: function (index, normal)
		{
			if (normal)
			{
				// Return for west-european normal alignment.

				switch (this .justify_ [index])
				{
					case "FIRST":  return TextAlignment .FIRST;
					case "BEGIN":  return TextAlignment .BEGIN;
					case "MIDDLE": return TextAlignment .MIDDLE;
					case "END":    return TextAlignment .END;
				}
			}
			else
			{
				// Return appropriate alignment if topToBottom or leftToRight are FALSE.

				switch (this .justify_ [index])
				{
					case "FIRST":  return TextAlignment .END;
					case "BEGIN":  return TextAlignment .END;
					case "MIDDLE": return TextAlignment .MIDDLE;
					case "END":    return TextAlignment .BEGIN;
				}
			}

			return index ? TextAlignment .FIRST : TextAlignment .BEGIN;
		},
		requestAsyncLoad: function ()
		{
			if (this .checkLoadState () === X3DConstants .COMPLETE_STATE || this .checkLoadState () === X3DConstants .IN_PROGRESS_STATE)
				return;

			this .setLoadState (X3DConstants .IN_PROGRESS_STATE);

			// Add default font to family array.

			var family = this .family_ .copy ();

			family .push ("SERIF");

			// Build family stack.

			this .familyStack .length = 0;

			for (var i = 0, length = family .length; i < length; ++ i)
			{
				var
					familyName  = family [i],
					defaultFont = this .getDefaultFont (familyName);
				
				if (defaultFont)
					this .familyStack .push (defaultFont);
				else
					this .familyStack .push (familyName);
			}

			this .loadNext ();
		},
		getDefaultFont: function (familyName)
		{
			var family = Fonts [familyName];

			if (family)
			{
				var style = family [this .style_ .getValue ()];

				if (style)
					return style;

				return family .PLAIN;
			}

			return;
		},
		loadNext: function ()
		{
			try
			{
				if (this .familyStack .length === 0)
				{
					this .setLoadState (X3DConstants .FAILED_STATE);
					this .font = null;
					return;
				}

				this .family = this .familyStack .shift ();
				this .URL    = this .loader .transform (this .family);

				this .getBrowser () .getFont (this .URL)
					.done (this .setFont .bind (this))
					.fail (this .setError .bind (this));
			}
			catch (error)
			{
				this .setError (error .message);
			}
		},
		setError: function (error)
		{
			if (this .URL .scheme !== "data")
				console .warn ("Error loading font '" + this .URL .toString () + "':", error);

			this .loadNext ();
		},
		setFont: function (font)
		{
			this .font = font;

			this .setLoadState (X3DConstants .COMPLETE_STATE);
			this .addNodeEvent ();
		},
		getFont: function ()
		{
			return this .font;
		},
	});

	return X3DFontStyleNode;
});


