
({
	baseUrl: "../../src",
	name: "components/layout",
	out: "../../dist/components/layout.js",
	optimize: "none",
	mainConfigFile: "../../src/x_ite.config.js",
	exclude: [
		"x_ite"
	],
	wrap: {
		startFile: "../parts/components/layout.start.frag",
		endFile: "../parts/components/layout.end.frag"
	},
})
