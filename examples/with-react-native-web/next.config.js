const esNodeModules = /react-native-web(?!.*node_modules)/
const cjsNodeModules = /node_modules(?!\/react-native-web(?!.*node_modules))/

// TODO: BABEL - Why is babelrc necessary?
// TODO: SSR styles are broken
module.exports = {
  webpack: (config, { defaultLoaders }) => {
    // Alias RN to RNW
    config.resolve.alias['react-native'] = 'react-native-web'

    // Compile packages using ES modules
    config.resolve.symlinks = false
    config.externals = config.externals.map(
      external =>
        typeof external === 'function'
          ? (ctx, req, cb) => (esNodeModules.test(req) ? cb() : external(ctx, req, cb))
          : external
    )
    config.module.rules.push({
      test: /\.js$/,
      loader: defaultLoaders.babel,
      include: [esNodeModules]
    })

    return config
  },
  webpackDevMiddleware: config => {
    // Ignore packages using CJS modules
    const ignored = [config.watchOptions.ignored[0], cjsNodeModules]
    config.watchOptions.ignored = ignored
    return config
  }
}
