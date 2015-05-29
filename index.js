/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var UglifyJS = require('uglify-js');

module.exports = function(content, file, conf){
    conf.fromString = true;
    if (conf.sourceMap) {
        conf.outSourceMap = file.filename + '.org' + file.rExt;
    }

    var ret = UglifyJS.minify(content, conf);

    if (conf.sourceMap) {
        var mapData = JSON.parse(ret.map);

        mapData.sources = [mapData.file];
        mapData.sourcesContent = [content];

        var newData = {
            version: mapData.version,
            file: mapData.file,
            sources: mapData.sources,
            sourcesContent: mapData.sourcesContent,
            names: mapData.names,
            mappings: mapData.mappings
        };
        //inline source map
        ret.code += '\n//# sourceMappingURL=data:application/json;base64,' + fis.util.base64(JSON.stringify(newData));
    }

    return ret.code;
};
