const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: "./src/game.js", // Path to your main JS file
  output: {
    filename: "bundle.js", // Output bundled JS file
    path: path.resolve(__dirname, "dist"),
    publicPath: "", // Ensures correct paths for assets
  },
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(), // Minify JS
      new CssMinimizerPlugin(), // Minify CSS
    ],
  },
  module: {
    rules: [
      // Rule for JavaScript files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      // Rule for CSS files
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // Extracts CSS into a separate file
          "css-loader", // Translates CSS into CommonJS
        ],
      },
      // Rule for assets (images, audio, etc.)
      {
        test: /\.(png|jpe?g|gif|mp3|wav)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[hash][ext][query]", // Output assets to an assets folder
        },
      },
    ],
  },
  plugins: [
    // Extracts CSS into a separate file
    new MiniCssExtractPlugin({
      filename: "style.min.css", // Output CSS file
    }),
  ],
};
