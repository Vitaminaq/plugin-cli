import type Config from 'webpack-chain';

export const mergeVueConfig = (config: Config) => {
    config
        .module
        .rule('vue')
        .test(/\.vue$/)
        .use('vue-loader')
        .loader(require.resolve('vue-loader'));

    config
        .plugin('vue-loader')
        .use(require('vue-loader').VueLoaderPlugin);

    config
        .module
        .rules
        .get("css")
        .uses
        .delete("style-loader");

    config
        .module
        .rule('css')
        .test(/\.css$/i)
        .use('vue-style-loader')
        .loader(require.resolve('vue-style-loader'))
        .before("css-loader")
        .end();
}