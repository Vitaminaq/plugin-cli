import type Config from 'webpack-chain';

export const mergeSvelteConfig = (config: Config) => {
    config
        .resolve
        .extensions
        .add('.svelte')
        .end()
        .mainFields
        .clear()
        .add('svelte')
        .add('browser')
        .add('module')
        .add('main');
    config
        .module
        .rule('svelte')
        .test(/\.svelte$/)
        .use('svelte-loader')
        .loader(require.resolve('svelte-loader'))
        .end();
}