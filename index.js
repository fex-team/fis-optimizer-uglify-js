/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var UglifyJS = require('uglify-js');

// 直接将源码嵌入到 map 表的版本，但是，似乎 chrome 不支持，先备份！
// module.exports = function(content, file, conf){

//     var mapping = fis.file.wrap(file.dirname + '/' + file.filename + '.map');

//     conf.fromString = true;
//     conf.outSourceMap = file.basename;

//     var ret = UglifyJS.minify(content, conf);

//     mapping.useDomain = true;

//     var mapData = JSON.parse(ret.map);

//     mapData.sources = [file.basename];
//     mapData.sourcesContent = [content];

//     var newData = {
//         version: mapData.version,
//         file: mapData.file,
//         sourceRoot: mapData.sourceRoot || "",
//         sources: mapData.sources,
//         sourcesContent: mapData.sourcesContent,
//         names: mapData.names,
//         mappings: mapData.mappings
//     };

//     mapping.setContent(JSON.stringify(newData));

//     file.extras = file.extras || {};
//     file.extras.derived = file.extras.derived || [];
//     file.extras.derived.push(mapping);

//     ret.code += '\n//# sourceMappingURL={{path:'+mapping.subpath + '}}\n';

//     return ret.code;
// };

module.exports = function(content, file, conf){

    var mapping = fis.file.wrap(file.dirname + '/' + file.filename + '.map');

    // chrome 不支持 sourcesContent 所以还需要一份源码。
    var source = fis.file.wrap(file.dirname + '/' + file.filename + '-original' + file.rExt);

    source.setContent(content);

    conf.fromString = true;
    conf.outSourceMap = file.basename;

    var ret = UglifyJS.minify(content, conf);

    mapping.useDomain = true;

    var mapData = JSON.parse(ret.map);

    mapData.sources = ['{{url:'+source.subpath+'}}'];

    var newData = {
        version: mapData.version,
        file: mapData.file,
        sourceRoot: mapData.sourceRoot || "",
        sources: mapData.sources,
        names: mapData.names,
        mappings: mapData.mappings
    };

    mapping.setContent(JSON.stringify(newData));

    file.extras = file.extras || {};
    file.extras.derived = file.extras.derived || [];
    file.extras.derived.push(mapping);
    file.extras.derived.push(source);

    ret.code += '\n//# sourceMappingURL={{url:'+mapping.subpath + '}}\n';

    return ret.code;
};