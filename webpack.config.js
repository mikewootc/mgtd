let UglifyJSPlugin = require('uglifyjs-webpack-plugin')
let webpack = require('webpack')

let config = {
    //mode: 'development',
    entry: {
        'client': __dirname + "/client/src/main.js",
    },
    output: {                               // 输出
        path: __dirname,                    // 打包后的js文件存放的地方
        filename: "[name]/public/bundle.js" // 打包后输出的js的文件名
    },
 
    module: {
        rules: [ //loaders加载器
            {
                test: /\.(js|jsx)$/,    // 一个匹配loaders所处理的文件的拓展名的正则表达式, 这里用来匹配js和jsx文件(必须)
                exclude: /node_modules/,// 屏蔽不需要处理的文件(文件夹)(可选)
                loader: 'babel-loader',        // loader的名称(必须)
                query: {
                    presets: [
                        'es2015',
                        'react',
                        'stage-1',  // stage-1 for static properties in class.
                        'stage-3',  // stage-3 for '...' operator
                    ],
                    plugins: [
                        "transform-runtime", "babel-plugin-transform-regenerator", "babel-plugin-transform-es2015-modules-commonjs", // for async/await
                        //["import", [{ "libraryName": "antd", "style": true }]],
                    ],
                },
            },

            {
                test:/\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test:/\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader"
                    }, {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true
                        },
                    }
                ],
            },
        ]
    }
};

module.exports = (env, argv) => {
    //console.log(`mode: ${argv.dev}`);

    if (argv.dev) {
        // 开发模式
        console.log('[01;33mmode: development[0m');
        config.mode     = 'development',
        config.devtool  = 'source-map';
    } else {
        // 生产模式
        console.log('[34mmode: production[0m');

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        });

        config.mode     = 'production',
        config.devtool = 'none';
        config.plugins =  [
            new UglifyJSPlugin()
        ]
    }
    return config;
}
