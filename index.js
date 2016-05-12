/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var UglifyJS = require('uglify-js');
var util = require('util');

function uglify(content, file, conf) {
  conf.fromString = true;

  if (conf.sourceMap) {
  	var mapping = fis.file.wrap(file.dirname + '/' + file.filename + file.rExt + '.map');
      conf.outSourceMap = mapping.basename;
  }

  var ret = UglifyJS.minify(content, conf);

  if (conf.sourceMap) {
      // mapping.useDomain = true;
      // mapping.useHash = true;

      var mapData = JSON.parse(ret.map);

      mapData.sources = [file.filename + '.org' + file.rExt];
      mapData.sourcesContent = [content];

      var newData = {
          version: mapData.version,
          file: file.filename + file.rExt, //should point to the compressed file, not org
          sources: mapData.sources,
          sourcesContent: mapData.sourcesContent,
          names: mapData.names,
          mappings: mapData.mappings
      };

      mapping.setContent(JSON.stringify(newData));

      file.extras = file.extras || {};
      file.extras.derived = file.extras.derived || [];
      file.extras.derived.push(mapping);

      // 先删掉原始的 sourceMappingURL
      ret.code = ret.code.replace(/\n?\s*\/\/#\ssourceMappingURL=.*?(?:\n|$)/g, '');
      ret.code += '\n//# sourceMappingURL=' + mapping.getUrl(fis.compile.settings.hash, fis.compile.settings.domain) + '\n';
  }

  return ret.code;
}

module.exports = function(content, file, conf){

  try {
    content = uglify(content, file, conf);
  } catch (e) {
    fis.log.warning(util.format('Got Error %s while uglify %s', e.message, file.subpath));
    fis.log.debug(e.stack);
  }

  return content;
};
