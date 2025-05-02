const { resolve } = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
	target: 'node',
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options: {
					transpileOnly: true,
					configFile: resolve(__dirname, 'tsconfig.build.json'),
				},
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	output: {
		path: resolve(__dirname, 'dist'),
		filename: 'index.js',
	},
	externals: [nodeExternals()],
}
