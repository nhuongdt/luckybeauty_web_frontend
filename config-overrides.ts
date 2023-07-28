import { styles } from '@ckeditor/ckeditor5-dev-utils';
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
module.exports = function override(config, env) {
    config.module.rules = [
        ...config.module.rules,
        {
            test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
            use: ['raw-loader']
        },
        {
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
        },
        {
            test: cssRegex,
            exclude: [cssModuleRegex, /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/]
        },
        {
            test: cssModuleRegex,
            exclude: [/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/]
        },
        {
            loader: require.resolve('file-loader'),
            options: {
                exclude: [
                    /\.(js|mjs|jsx|ts|tsx)$/,
                    /\.html$/,
                    /\.json$/,
                    /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                    /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/
                ],
                name: 'static/media/[name].[hash:8].[ext]'
            }
        }
    ];
    return config;
};
