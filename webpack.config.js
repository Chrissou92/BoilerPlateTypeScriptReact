const webpack = require('webpack');
const path = require('path');

// Plugins de traitement pour dist/
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// Config pour le devServer
const host = 'localhost';
const port = 3000;

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: 'development',

  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      src: path.join(__dirname, './app/src'),
      node_modules: path.join(__dirname, 'node_modules'),
      images: path.join(__dirname, './app/dist/images'),
    },
    plugins: [
      new TsconfigPathsPlugin({
        baseUrl: __dirname,
        extensions: [ '.tsx', '.ts', '.js' ],
      })
    ]
  },

  entry: {
    code: './app/src/index.tsx',
  },

  output: {
    // Nom du bundle
    // filename: '[name].bundle_[chunkhash].js', // in prod
    filename: '[name].bundle.js',
    // Nom du bundle vendors si l'option d'optimisation / splitChunks est activée
    chunkFilename: '[name].vendors.js',
    // Cible des bundles (dossier parent de wrapper/ aka. racine du projet)
    // path: path.resolve(__dirname, 'dist/demos'),
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  }, 

  module: {
    rules: [
       // HTML
        {
        test: /\.(html)$/,
        use: {
        loader: 'html-loader',
      }
  },

    // TypeScript
    {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules\/(?!phaser-webpack-loader)/
  },
  {
    test: /\.(sa|sc|c)ss$/,
    use: [
        // style-loader ou fichier
        devMode ? 'style-loader' :
          MiniCssExtractPlugin.loader,
        // Chargement du CSS
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [require('autoprefixer')],
            sourceMap: true,
          },
        },
        // SASS
        'sass-loader',
      ],
    },
    {
      test: /\.(png|svg|jpe?g|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]?[hash]'
          },
        },
      ],
    },
    {
      test: /\.ttf$/,
      use: [
        {
          loader: 'ttf-loader',
          options: {
            name: './font/[hash].[ext]',
          },
        },
      ]
  },
  ]
},
devServer: {
  contentBase: './app/dist',
  overlay: true, // Overlay navigateur si erreurs de build
  stats: 'minimal', // Infos en console limitées
  progress: true, // progression du build en console
  inline: true, // Rechargement du navigateur en cas de changement
  open: true, // on ouvre le navigateur
  historyApiFallback: true,
  host: host,
  port: port,
  hot: true
},

plugins: [
  // Permet de prendre le index.html de src comme base pour le fichier de dist/
  new HtmlWebPackPlugin({
  template: './app/src/index.html',
  chunks: ['code']
  }),
  // Permet d'exporter les styles CSS dans un fichier css de dist/
  new MiniCssExtractPlugin({
  filename: '[name].css',
  chunkFilename: '[id].css',
}),
],

};