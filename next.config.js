module.exports = {
  webpack: (config) => {
    config.resolve.extensions = ['.js', '.jsx'];
    config.module.rules.push(
      {test: /\.(js|jsx)$/, use: 'babel-loader'}
    );
    return config;
  }
}