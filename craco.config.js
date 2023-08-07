/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const svgRegex = /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/;
const cssEditorRegex = /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/;
const { getLoader, loaderByName, addBeforeLoader } = require('@craco/craco');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
module.exports = {
    overrideWebpackConfig: ({ webpackConfig }) => {
        // start: (add new rule) for SVG and CSS loaders
        const svgLoader = {
            test: svgRegex,
            use: ['raw-loader']
        };
        const cssLoader = {
            test: cssEditorRegex,
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
        webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
            if (String(rule.test) === String(cssRegex)) {
                return {
                    ...rule,
                    exclude: [cssModuleRegex, cssEditorRegex]
                };
            }
            return rule;
        });
        webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
            if (String(rule.test) === String(cssModuleRegex)) {
                return {
                    ...rule,
                    exclude: [cssEditorRegex]
                };
            }
            return rule;
        });

        const { isFound, match: fileLoaderMatch } = getLoader(
            webpackConfig,
            loaderByName('file-loader')
        );
        if (isFound) {
            fileLoaderMatch.loader.exclude.push(/\.(js|mjs|jsx|ts|tsx)$/);
            fileLoaderMatch.loader.exclude.push(/\.html$/);
            fileLoaderMatch.loader.exclude.push(/\.json$/);
            fileLoaderMatch.loader.exclude.push(svgRegex);
            fileLoaderMatch.loader.exclude.push(cssEditorRegex);
        }

        // fileLoaderMatch.forEach(({ loader }) => {
        //     loader.options = {
        //         name: 'static/media/[name].[hash].[ext]',
        //         exclude: [
        //             /\.(js|mjs|jsx|ts|tsx)$/,
        //             /\.html$/,
        //             /\.json$/,
        //             svgRegex,
        //             cssEditorRegex
        //         ]
        //     };
        // });
        return webpackConfig;
    }
};
