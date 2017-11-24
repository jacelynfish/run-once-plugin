# UNDER CONSTRUCTION
## Todo
- [] Implement deep clone algorithm with higher efficiency
- [] Support unit test

## Webpack Run Once plugin
This is a webpack plugin that enables developers to run specific webpack plugins only for the first compilation under webpack's watch mode.
### Installation
```shell
npm install run-once-plugin --save-dev
```
### Basic Usage
```javascript
var RunOncePlugin = require('run-once-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin'); // third party plugin
var webpackConfig = {
    entry: 'index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'index_bundle.js'
    },
    plugins: [
        new RunOncePlugin([
            {
                name: 'parse-html1', // names must be different
                plugin: HtmlWebpackPlugin,
                option: {
                    filename: './dist/index.html',
                    template: `./template/index.ejs`,
                    inject: false,
                    excludeChunks: [exclude],
                    chunksSortMode: 'dependency'
                }
            },
            {
                name: 'parse-html2',
                plugin: HtmlWebpackPlugin,
                option: {}
            },
        ]),
    ]
};
```
### Configuration
The plugin accepts an array of plugins and their configuration.
* `name: string` works as keys for different plugins
* `plugin: {...}` to specify the plugin you want to use
* `option: any` to pass into the specified plugin
