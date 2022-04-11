export default ({ app }) => {
  app.router.beforeEach( (to, from, next) => {
    // if (to.name === 'index') {
    //   to.meta.keepComponents = [to.name]
    // } else if (to.name === 'model') {
    //   to.meta.keepComponents = ['index', 'model'];
    // }
    next()
  })
}
