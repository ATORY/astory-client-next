const webpack = require('webpack');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// const { ANALYZE } = process.env

// module.exports = {
//   webpack: function (config) {
//     if (ANALYZE) {
//       config.plugins.push(new BundleAnalyzerPlugin({
//         analyzerMode: 'server',
//         analyzerPort: 8888,
//         openAnalyzer: true
//       }))
//     }

//     config.module.rules.push(
//       {
//         test: /\.js$/,
//         exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
//         loader: 'babel-loader',
//       }
//     )

//     config.plugins.push(new webpack.ProvidePlugin({
//       'window.Quill': 'quill'
//     }))

//     return config
//   }
// }

// // module: {
// //   rules: [
// //     {
// //       test: /\.js$/,
// //       exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
// //       loader: 'babel-loader',
// //       query: {...}
// //     }
// //   ]
// // }
// // plugins: [
  
// // ]

// module: {
//   loaders: [{
//     test: /\.css$/,
//     loaders: [
//       'style', 'css'
//     ]
//   }]
// }

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      loaders: [
        'style', 'css',
      ],
    });
    return config;
  },
};
