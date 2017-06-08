module.exports = {
  entry: './app/scripts/main.js',
  output: {
    filename: './app/scripts/bundle.js'
  },
  module: {
      loaders: [
        { test: /\.css$/, loader: "style-loader!css-loader" },
        { test: /\.png$/, loader: "url-loader?mimetype=image/png" }
      ],
    },
  watch: true
};