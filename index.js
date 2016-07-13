/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var UglifyJS = require('uglify-js');
var util = require('util');
var mergeMap = require('merge-source-map');

function uglify(content, file, conf) {
  conf.fromString = true;

  if (conf.sourceMap) {
      var mapping = fis.file.wrap(file.dirname + '/' + file.filename + file.rExt + '.map');
      conf.outSourceMap = mapping.subpath;
  }

  var ret = UglifyJS.minify(content, conf);

  if (conf.sourceMap) {
      var mapData = JSON.parse(ret.map);

      mapData.sources = [file.subpath];
      mapData.sourcesContent = [content];

      var newData = {
          version: mapData.version,
          file: mapData.file,
          sources: mapData.sources,
          sourcesContent: mapData.sourcesContent,
          names: mapData.names,
          mappings: mapData.mappings
      };


      var originMapFile = getMapFile(file);
      if (originMapFile) {
        file.extras.derived.shift();
        var merged = mergeMap(JSON.parse(originMapFile.getContent()), newData);
        mapping.setContent(JSON.stringify(merged));
      } else {
        mapping.setContent(JSON.stringify(newData));
      }

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

function getMapFile(file) {
  var derived = file.derived;
  if (!derived || !derived.length) {
    derived = file.extras && file.extras.derived;
  }

  if (derived && derived[0] && derived[0].rExt === '.map') {
    return derived[0];
  }

  return null;
}
