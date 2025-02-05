module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: "pre",
          use: ["source-map-loader"],
          exclude: /node_modules/, // ⬅️ Ignore les fichiers source map dans node_modules
        },
      ],
    },
  };
  