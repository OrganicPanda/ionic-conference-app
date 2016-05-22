'use strict';

let path = require('path')
  , webpack = require('webpack')
  , pkg = require('./package.json')
  , ExtractTextPlugin = require('extract-text-webpack-plugin')
  , HtmlWebpackPlugin = require('html-webpack-plugin')
  , MeteorImportsPlugin = require('meteor-imports-webpack-plugin');

let paths = {
  build: path.join(__dirname, 'www', 'build'),
  src: path.join(__dirname, 'app')
}
let devtool = '#cheap-eval-source-map';
let appEntries = [];
let baseAppEntries = [
  path.join(paths.src, 'app')
];

let devAppEntries = [
  'webpack-dev-server/client?http://localhost:8080/',
  'webpack/hot/only-dev-server'
];

let plugins = [];
let basePlugins = [
  new webpack.DefinePlugin({
    __DEV__: process.env.NODE_ENV !== 'production',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.optimize.CommonsChunkPlugin('vendor', '[name].[hash].js'),
  new HtmlWebpackPlugin({
    template: path.join(paths.src, 'index.html'),
    inject: 'body'
  }),
  new ExtractTextPlugin('[name].[hash].css'),
  new MeteorImportsPlugin({
	  ROOT_URL: 'http://localhost:3000/',
	  DDP_DEFAULT_CONNECTION_URL: 'http://localhost:3000/',
	  PUBLIC_SETTINGS: {},
	  meteorFolder: 'backend',
	  meteorEnv: { NODE_ENV: 'development' },
	  exclude: ['ecmascript']
	})
];

let devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
];

let prodPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
    compress: {
      warnings: false
    }
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins = basePlugins.concat(prodPlugins);
  appEntries = baseAppEntries.concat([]);
  devtool = '#source-map';
} else { // dev or rest
  plugins = basePlugins.concat(devPlugins);
  appEntries = baseAppEntries.concat(devAppEntries);
}

module.exports = {
  entry: {
    app: appEntries,
    vendor: [
      'es6-shim',
      'es6-promise',
      'reflect-metadata',
      'zone.js'
    ],
    style_ios: path.join(paths.src, 'theme', 'app.ios.scss'),
    style_md: path.join(paths.src, 'theme', 'app.md.scss'),
    style_wp: path.join(paths.src, 'theme', 'app.wp.scss')
  },
  output: {
    path: paths.build,
    filename: '[name].[hash].js',
    chunkFilename: '[id].chunk.js'
  },
  devtool: devtool,
  resolve: {
    extensions: ['', '.js', '.html', '.scss', '.png'],
    moduleDirectories: [
      'node_modules'
    ]
  },
  plugins: plugins,
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: {
        presets: ['es2015'],
        plugins: [
          'transform-decorators-legacy',
          'transform-object-rest-spread'
        ]
      },
      include: path.resolve('app'),
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loader: 'json',

      // The Meteor loader uses json files and this interferes
      exclude: /meteor/
    }, {
      test: /\.(png|jpg|svg)$/,
      loader: 'file?name=img/[name].[hash].[ext]'
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract(['css', 'autoprefixer', 'sass'])
    }, {
      test: /\.html$/,
      loader: 'html'
    }, {
      test: /(ionicons|roboto|noto).*?\.(svg|ttf|woff|eot)/,
      loader: 'file?name=fonts/[name].[hash].[ext]'
    }]
  },
  sassLoader: {
    includePaths: [
      // ionic-framework uses `@import 'ionicons-icons'` wanting this dir
      path.resolve(__dirname, './node_modules/ionicons/dist/scss'),

      // But we will use the standard `@import '~lib/dir/file'` syntax
      path.resolve(__dirname, './node_modules')
    ]
  }
};