const pkg = require("./package.json");
const path = require("path");
const StringReplacePlugin = require("string-replace-webpack-plugin");

const config = {
	entry: {
		"rotate": "./src/index.js"
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
		library: [pkg.namespace.eg, "rotate"],
		libraryTarget: "umd",
		umdNamedDefine: true
	},
	externals: [],
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: "babel-loader"
		},
		{
			test: /(\.js)$/,
			loader: StringReplacePlugin.replace({
				replacements: [{
					pattern: /#__VERSION__#/ig,
					replacement: function (match, p1, offset, string) {
						return pkg.version;
					}
				}]
			})
		}]
	},
	plugins: [new StringReplacePlugin()],
	stats: "minimal",
	mode: "none"
};

module.exports = (env) => require(`./config/webpack.config.${env || "development"}.js`)(config);
