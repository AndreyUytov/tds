const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
  return templateFiles.map((item) => {
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: true,
      minify: false,
    })
  })
}

const htmlPlugins = generateHtmlPlugins('./src/pages/views')

module.exports = (env) => {
  const isProduction = env.production === true

  const cssLoaders = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: !isProduction,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            (() => {
              if (isProduction) {
                return autoprefixer(), cssnano()
              } else return autoprefixer()
            })(),
          ],
        },
        sourceMap: !isProduction,
      },
    },
    {
      loader: 'resolve-url-loader',
      options: {
        sourceMap: !isProduction,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true, // always true for work resolve-url-loader!!!
      },
    },
  ]

  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      index: './src/index.js',
    },
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: './',
      filename: '[name].js',
    },

    // optimization: {
    //   splitChunks: {
    //     chunks: 'all',
    //   },
    // },

    devtool: isProduction ? '' : 'source-map',

    devServer: {
      publicPath: '/',
      openPage: 'index.html',
      // hot: !isProduction
    },

    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'index.css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './src/static',
            to: './static',
          },
        ],
      }),
      new webpack.HotModuleReplacementPlugin(),
      ...htmlPlugins,
    ],

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: [
                  '@babel/plugin-transform-runtime',
                  '@babel/plugin-proposal-class-properties',
                ],
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          oneOf: [
            {
              issuer: /components/,
              use: cssLoaders,
            },
            {
              issuer: /index.js/,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    hmr: !isProduction,
                    reloadAll: true,
                    sourceMap: !isProduction,
                  },
                },
                ...cssLoaders,
              ],
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|woff|woff2|ttf|svg|webp)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: () => {
                  if (isProduction) {
                    return '[contenthash].[ext]'
                  } else return '[name].[ext]'
                },
                outputPath: (url, resourcePath) => {
                  if (/svg/.test(resourcePath)) {
                    return `img/svg/${url}`
                  }
                  if (/images/.test(resourcePath)) {
                    return `img/${url}`
                  }
                  if (/fonts/.test(resourcePath)) {
                    return `fonts/${url}`
                  }
                },
              },
            },
          ],
        },
        // {
        //   test: /\.html$/i,
        //   use: [
        //     {
        //       loader: 'html-loader',
        //       options: {
        //         minimize: false,
        //       },
        //     },
        //   ],
        // },
      ],
    },
  }
}
