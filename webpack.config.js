

const path = require('path');

const webpack = require('webpack');

const CopywebpackPlugin = require('copy-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';


module.exports = {
    mode: "development",
    context: __dirname,
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        sourcePrefix: '',
        publicPath: "",
        library: 'webpackGhPages',
    },
    amd: {
        toUrlUndefined: true
    },
    module: {
      rules: [{
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
      }, {
          test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
          use: [ 'url-loader', 'file-loader' ]
      }]
    },
    plugins: [
      new HtmlWebpackPlugin({
          template: 'src/index.html'
      }),
      new CopywebpackPlugin({ 
        patterns: [
            { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
            { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
            { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' },
            { from: path.join(cesiumSource, 'ThirdParty'), to: 'ThirdParty' }
        ]
      }),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify('')
    })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, "dist")
      }
    },
    resolve: {
      fallback: {
        fs: false
      },
      alias: {
          // CesiumJS module name
          cesium: path.resolve(__dirname, cesiumSource)
      }
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
  }
};