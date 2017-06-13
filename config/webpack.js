var pkg = require("../package.json");
var path = require("path");
var StringReplacePlugin = require("string-replace-webpack-plugin");

module.exports = {
	entry: {
		"rotate": "./src/index.js"
	},
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "[name].js",
		library: [pkg.namespace.eg, "rotate"],
		libraryTarget: "umd"
	},
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /(\.js)$/,
				exclude: /(node_modules)/,
				loader: "babel",
				options: {
					"presets": [
						[
							"es2015",
							{
								"loose": true
							}
						]
					]
				}
			},
			{
				test: /(\.js)$/,
				loader: StringReplacePlugin.replace({
					replacements: [
						{
							pattern: /#__VERSION__#/ig,
							replacement: function (match, p1, offset, string) {
								return pkg.version;
							}
						}
					]}
				)
            }
		]
	},
	plugins: [
		new StringReplacePlugin()
	],
	resolveLoader: {
		moduleExtensions: ["-loader"]
	}
};
