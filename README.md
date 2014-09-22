# fis-optimizer-uglify-js

A optimizer for fis to compress js by using uglify-js.

## 使用

FIS内置

## 配置

在项目配置文件（默认fis-conf.js）配置

```javascript
fis.config.set('settings.optimizer.uglify-js', option);
```

eg:

```javascript
//export, module, require不压缩变量名
fis.config.set('settings.optimizer.uglify-js', {
    mangle: {
        except: 'exports, module, require, define'
    }
});

//自动去除console.log等调试信息
fis.config.set('settings.optimizer.uglify-js', {
    compress : {
        drop_console: true
    }
});
```

`option` 详细请参见 https://github.com/mishoo/UglifyJS2
