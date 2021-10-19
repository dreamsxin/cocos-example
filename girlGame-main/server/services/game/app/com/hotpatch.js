const fs = require('fs');
const path = require('path');

class HotPatch
{
    constructor(logger)
    {
        this.logger_ = logger;
    }

    _cleanCache(modulePath) 
    {
        var module = require.cache[modulePath];
        if (module) {
            delete require.cache[modulePath];
        }
    }

    watchFiles(root)
    {
        var fullpath = path.resolve(root);
        fs.readdir(fullpath, (err, files) => {
            if (err) {
                this.logger_.Error(err);
                process.exit(-1);
            } else {
                files.forEach(filename => {
                    var fileDir = path.join(fullpath, filename);
                    fs.stat(fileDir, (err, stats) => {
                        if (err) {
                            console.error(err);
                            process.exit(-1);
                        } else {
                            if (stats.isFile()) {
                                if (fileDir.indexOf('.js') !== -1) {
                                    fs.watch(fileDir, (eventType, filename) => {
                                        if (eventType === "change") {
                                            this._cleanCache(fileDir);
                                            try {
                                                var _ = require(fileDir);
                                                this.logger_.Info("reload module:", filename);
                                            } catch (e) {
                                                this.logger_.Info("module reload failed:", e);
                                            }
                                        }
                                    });
                                }
                            }

                            if (stats.isDirectory()) {
                                this.watchFiles(fileDir);
                            }
                        }
                    });
                });
            } 
        });
    }
}

module.exports = HotPatch;