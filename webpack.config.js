const path = require("path");

// ...

const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",

    // ...
	entry: './src/client.js',
    output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, "./dist"),
	// ...
    },

    module: {
        rules: [

	    // Any wasm
	    // import 'asdf.wasm' -> ./dist/wasm/asdf.wasm
	    // see https://webpack.js.org/guides/asset-management/
	    {
		test: /\.wasm$/,
		type: 'asset/resource',
		generator: {
		    filename: 'wasm/[name][ext]'
		}
		
	    },
		{
			test: /\.tsx?$/,
			use: 'ts-loader',
			//exclude: /node_modules/,
		},
		{
			test: /\.css$/i,
			use: ['style-loader', 'css-loader'],
		}
	]
    },

    plugins: [

	// ...

	new WasmPackPlugin({
	    // ...
	    // see https://github.com/wasm-tool/wasm-pack-plugin
		crateDirectory: path.resolve(__dirname, 'lib/markov/'),
		args: '--log-level warn',
		 
		outDir: path.resolve(__dirname, 'lib/markov/pkg'),
		extraArgs: '--target web',
	}),

	// copies ./assets -> ./dist/assets
	new CopyPlugin({
	    patterns: [
		{ from: "assets", to: "assets" },  // dust to dust
		
	    ],
	}),
    ],

    // NOT REQUIRED TO SOLVE THE EXERCISE
    // Resolve aliases are a neat little webpack feature to simplify imports
    // by making them declarative.

    // WARNING: The typescript compiler also features a module system
    // and is not webpack aware. Do not use these aliases inside *.ts files!
    resolve: {
        preferRelative: true,
		extensions: ['.tsx', '.ts', '.js'],

	// https://webpack.js.org/configuration/resolve/#resolvealias
	alias: {
	    Css: path.resolve(__dirname, 'src/css/'),
	    Check: path.resolve(__dirname, 'lib/check/'),
	    Markov: path.resolve(__dirname, 'lib/markov/'),
	}
	// instead of resolving a stylesheet via '../css/style.css'
	// resolve it like 'Css/style.css'

    }


};
