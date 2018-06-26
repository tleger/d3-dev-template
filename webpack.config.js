const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		path: path.resolve('dist'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{test: /\.css$/, use: ['style-loader','css-loader']},
			{test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			d3: "d3"
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
			inject: 'body'
		})
	]
}