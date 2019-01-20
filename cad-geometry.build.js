
({
	baseUrl: "src",
	name: "components/cad-geometry",
	out: "dist/cad-geometry.js",
	optimize: "none",
	mainConfigFile: "src/components/cad-geometry.config.js",
	exclude: [
		"jquery",
		"text",
		"jquery-mousewheel",
		"pako_inflate",
		"libtess",
		"opentype",
		"bezier",
		"sprintf",
		"x_ite/Fields",
		"x_ite/Basic/X3DFieldDefinition",
		"x_ite/Basic/FieldDefinitionArray",
		"x_ite/Components/Core/X3DSensorNode",
		"x_ite/Components/Core/X3DNode",
		"x_ite/Components/Core/X3DChildNode",
		"x_ite/Components/Grouping/X3DBoundedObject",
		"x_ite/Configuration/SupportedNodes",
		"x_ite/Bits/X3DConstants",
		"x_ite/Bits/X3DCast",
		"standard/Math/Numbers/Vector3",
		"standard/Math/Numbers/Rotation4",
		"standard/Math/Numbers/Quaternion",
		"standard/Math/Numbers/Matrix4"
	],
	wrap: {
		startFile: "build/parts/cad-geometry.start.frag",
		endFile: "build/parts/cad-geometry.end.frag"
	},
})
