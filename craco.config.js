/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
module.exports = {
    overrideWebpackConfig: ({
        webpackConfig,
        cracoConfig,
        pluginOptions,
        context: { env, paths }
    }) => {
        // start: (add new rule) for SVG and CSS loaders
        const svgLoader = {
            test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
            use: ['raw-loader']
        };
        const cssLoader = {
            test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
            use: [
                {
                    loader: 'style-loader',
                    options: {
                        injectType: 'singletonStyleTag',
                        attributes: {
                            'data-cke': true
                        }
                    }
                },
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: styles.getPostCssConfig({
                            themeImporter: {
                                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                            },
                            minify: true
                        })
                    }
                }
            ]
        };
        addBeforeLoader(webpackConfig, loaderByName('file-loader'), svgLoader);
        addBeforeLoader(webpackConfig, loaderByName('file-loader'), cssLoader);
        // end (add new rule)

        // update rule (find by name)
        const { cssFind, match: cssLoaderMatch } = getLoader(webpackConfig, loaderByName(cssRegex));
        if (!cssFind) {
            throwUnexpectedConfigError({
                message: `Can't find file-loader in the ${context.env} webpack config!`
            });
        }
        cssLoaderMatch.loader.exclude.push(/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/);

        const { cssModuleFind, match: cssModuleLoaderMatch } = getLoader(
            webpackConfig,
            loaderByName(cssModuleRegex)
        );
        if (!cssModuleFind) {
            throwUnexpectedConfigError({
                message: `Can't find file-loader in the ${context.env} webpack config!`
            });
        }
        cssModuleLoaderMatch.loader.exclude.push(/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/);

        const { isFound, match: fileLoaderMatch } = getLoader(
            webpackConfig,
            loaderByName('file-loader')
        );

        if (!isFound) {
            throwUnexpectedConfigError({
                message: `Can't find file-loader in the ${context.env} webpack config!`
            });
        }
        fileLoaderMatch.loader.exclude.push([
            /\.(js|mjs|jsx|ts|tsx)$/,
            /\.html$/,
            /\.json$/,
            /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
            /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/
        ]);
        return webpackConfig;
    }
};
