/*
 * fis
 * http://web.baidu.com/
 */

'use strict';

var UglifyJS = require('uglify-js');

module.exports = function(content, file, conf){
    conf.fromString = true;
    UglifyJS.AST_Node.warn_function = function(txt){
        var pos = txt.indexOf('?');
        if(pos === -1){
            txt += ' filename: ' + file.subpath;
        } else {
            txt = txt.substring(0, pos) + file.subpath + txt.substring(0, pos + 1);
        }
        fis.log.error(txt);
    };
    return UglifyJS.minify(content, conf).code;
};