const path = require("path")

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ["../src/**/*.stories.js"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
    "@storybook/addon-controls",
    "storybook-dark-mode",
    {
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          // important! use local installed postcss (version 8)
          implementation: require("postcss"),
        },
      },
    },
  ],

  webpackFinal: async (config) => {
    // Default rule for images /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/
    // Exclude SVG files so that they can be loaded via svgr
    const fileLoaderRule = config.module.rules.find(rule => rule.test && rule.test.test('.svg'));
    fileLoaderRule.exclude = /\.svg$/;  

    config.module.rules.push({
      test: /\.svg$/,
      enforce: 'pre',
      issuer: /\.jsx?$/,
      loader: require.resolve('@svgr/webpack'),
      options: {
        svgo: false
      }
    })

    // this is for background svgs in css
    config.module.rules.push({
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      issuer: /\.s?css$/,
      loader: 'url-loader',
      options: {
        svgo: false
      }
    })

    config.module.rules.push({
      test: /\.scss$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "postcss-loader",
          // important! use local installed postcss (version 8)
          options: { implementation: require("postcss") },
        },
        "sass-loader",
      ],
      include: path.resolve(__dirname, "../src"),
    })

    return config
  },
}
