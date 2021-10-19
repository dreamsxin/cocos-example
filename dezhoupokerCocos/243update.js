/*
 * @Author: burt
 * @Date: 2020-10-27 14:12:04
 * @LastEditors: burt
 * @LastEditTime: 2020-11-02 16:46:43
 * @Description:
 */
const Fs = require('fs');
const Path = require('path');
// const Os = require('os')

let huanjin = "online"
let pinpai = "test"
let upGameList = []
let curPath = Path.resolve('./');
let jsonConfigPath = curPath + '/version.json'
let versionTempPath = curPath + '/versiontemp.txt'
let hall_version = "1.0.0"
let gitPath = "D:\\Burt\\cocos_game\\allgame\\hotupdate\\upgrade-server" // 本地仓库位置
let gitSubPath = "\\com.test.dev.android" // 仓库下的那个文件夹
let buildPath = curPath + "\\build\\jsb-link" // 构建后项目所在

let parseArguments = function () {
    let i = 2;
    while (i < process.argv.length) {
        let arg = process.argv[i];
        switch (arg) {
            case '--game':
            case '-g':
                let game = process.argv[i + 1];
                upGameList.push(game)
                i += 2;
                break;
            case '--huanjin':
            case '-h':
                huanjin = process.argv[i + 1];
                i += 2;
                break;
            case '--pinpai':
            case '-p':
                pinpai = process.argv[i + 1];
                i += 2;
                break;
            default:
                i++;
                break;
        }
    }
    // if (Os.platform() == "win32") {
    gitSubPath = "\\com." + pinpai + "." + huanjin + ".android"
    // } else {
    //     throw "对于苹果系统未做兼容"
    // }
    moveFileToGitPath3()
    // changeVersion()
}

// 修改版本文件中的内容
var changeVersion = function () {
    let changefunc = (jsonConfig) => {
        let config = jsonConfig.version
        if (!config) {
            throw 'config is nothing'
        }
        let changeFile = "pinpai:" + pinpai + "; huanjin:" + huanjin + "; \n"
        if (upGameList.length > 0) {
            for (let i = 0; i < upGameList.length; i++) {
                if (config[upGameList[i]]) {
                    let vList = config[upGameList[i]].split(".")
                    let num = parseInt(vList[2]) + 1
                    let verstr = vList[0] + "." + vList[1] + "." + num
                    config[upGameList[i]] = verstr
                    changeFile += upGameList[i] + ":" + verstr + ";\n"
                    if (upGameList[i] == 'hall') {
                        hall_version = verstr
                    }
                } else {
                    changeFile += upGameList[i] + ";\n"
                }
            }
            jsonConfig.version = config
            for (let k in jsonConfig.version) {
                changeManifestVersion(k, jsonConfig.version[k])
            }
            Fs.writeFile(versionTempPath, changeFile, 'utf8', function (err) {
                if (err) {
                    throw err
                } else {
                    Fs.writeFile(jsonConfigPath, JSON.stringify(jsonConfig), 'utf8', function (err) {
                        if (err) {
                            throw err
                        } else {

                        }
                    });
                }
            });
        } else {
            throw 'upGameList must have something'
        }
    }
    if (Fs.existsSync(jsonConfigPath)) {
        Fs.readFile(jsonConfigPath, 'utf8', function (err, files) {
            if (err) {
                throw err
            } else {
                let jsonConfig = JSON.parse(files)
                changefunc(jsonConfig)
            }
        })
    } else {
        throw "不存在version.json文件"
    }
}
// 修改manifest中的版本
function changeManifestVersion(name, version) {
    let vPath = buildPath + "\\remote\\" + name + "_version.manifest"
    let pPath = buildPath + "\\remote\\" + name + "_project.manifest"
    if (name == "hall") {
        vPath = buildPath + "\\" + name + "_version.manifest"
        pPath = buildPath + "\\" + name + "_project.manifest"
    }
    if (Fs.existsSync(vPath)) {
        Fs.readFile(vPath, 'utf8', function (err, files) {
            if (err) {
                throw err
            } else {
                files = JSON.parse(files)
                files.version = version
                Fs.writeFile(vPath, JSON.stringify(files), 'utf8', function (err) {
                    if (err) {
                        throw err
                    }
                });
            }
        })
        Fs.readFile(pPath, 'utf8', function (err, files) {
            if (err) {
                throw err
            } else {
                files = JSON.parse(files)
                files.version = version
                Fs.writeFile(pPath, JSON.stringify(files), 'utf8', function (err) {
                    if (err) {
                        throw err
                    } else {
                        if (name == "hall") {
                            setTimeout(() => {
                                moveFileToGitPath()
                            }, 2000);
                        }
                    }
                });
            }
        })
    }
}
/**
 * @Description: 读取ccc版本，并移动文件到指定更新目录
 */
function moveFileToGitPath() {
    Fs.readFile(curPath + "/project.json", 'utf8', function (err, files) {
        if (!err) {
            let projectjson = JSON.parse(files)
            let cccversion = projectjson.version
            let destpath = gitPath + gitSubPath
            if (cccversion != '2.1.3') {
                destpath = gitPath + gitSubPath + "\\ccc" + cccversion
            }
            Fs.access(destpath, function (err) {
                if (err) {
                    // console.log("目录不存在时创建目录")
                    Fs.mkdirSync(destpath);
                }
                Fs.access(destpath + "\\" + hall_version, function (err) {
                    if (err) {
                        // console.log("目录不存在时创建目录")
                        Fs.mkdirSync(destpath + "\\" + hall_version);
                    }
                    copyDir(buildPath + "\\assets", destpath + "\\" + hall_version + "\\assets", (err) => {
                        console.log("复制文件报错", err)
                    })
                    Fs.access(buildPath + "\\remote", (err) => {
                        if (!err) {
                            copyDir(buildPath + "\\remote", destpath + "\\" + hall_version + "\\remote", (err) => {
                                console.log("复制文件报错", err)
                            })
                        }
                    })
                    copyDir(buildPath + "\\src", destpath + "\\" + hall_version + "\\src", (err) => {
                        console.log("复制文件报错", err)
                    })
                    copyFile(buildPath + "\\hall_project.manifest", destpath + "\\" + hall_version + "\\hall_project.manifest")
                    copyFile(buildPath + "\\hall_version.manifest", destpath + "\\" + hall_version + "\\hall_version.manifest")
                    copyFile(curPath + "\\version.json", destpath + "\\" + hall_version + "\\version.json")

                    copyDir(buildPath + "\\assets", destpath + "\\assets", (err) => {
                        console.log("复制文件报错", err)
                    })
                    Fs.access(buildPath + "\\remote", (err) => {
                        if (!err) {
                            copyDir(buildPath + "\\remote", destpath + "\\remote", (err) => {
                                console.log("复制文件报错", err)
                            })
                        }
                    })
                    copyDir(buildPath + "\\src", destpath + "\\src", (err) => {
                        console.log("复制文件报错", err)
                    })
                    copyFile(buildPath + "\\hall_project.manifest", destpath + "\\hall_project.manifest")
                    copyFile(buildPath + "\\hall_version.manifest", destpath + "\\hall_version.manifest")
                    copyFile(curPath + "\\version.json", destpath + "\\version.json")
                });
            });
        } else {
            console.log(err);
        }
    })
}
/**
 * @Description: 读取ccc版本，并移动文件到指定更新目录
 */
function moveFileToGitPath3(versionlist) {
    Fs.readFile(curPath + "/project.json", 'utf8', function (err, files) {
        if (!err) {
            let projectjson = JSON.parse(files)
            let cccversion = projectjson.version
            let destpath = curPath + "\\upgrade" + "\\"
            if (cccversion != '2.1.3') {
                destpath = curPath + "\\upgrade" + "\\ccc" + cccversion + "\\"
            }
            Fs.access(destpath, function (err) {
                if (err) {
                    // console.log("目录不存在时创建目录")
                    Fs.mkdirSync(destpath);
                }
                Fs.access(destpath + "\\" + hall_version, function (err) {
                    if (err) {
                        // console.log("目录不存在时创建目录")
                        Fs.mkdirSync(destpath + "\\" + hall_version);
                    }
                    copyDir(buildPath + "\\assets", destpath + "\\" + hall_version + "\\assets", (err) => {
                        console.log("复制文件报错", err)
                    })
                    copyDir(buildPath + "\\src", destpath + "\\" + hall_version + "\\src", (err) => {
                        console.log("复制文件报错", err)
                    })
                    copyFile(buildPath + "\\hall_project.manifest", destpath + "\\" + hall_version + "\\hall_project.manifest")
                    copyFile(buildPath + "\\hall_version.manifest", destpath + "\\" + hall_version + "\\hall_version.manifest")
                    copyFile(curPath + "\\version.json", destpath + "\\" + hall_version + "\\version.json")

                    copyDir(buildPath + "\\assets", destpath + "\\assets", (err) => {
                        console.log("复制文件报错", err)
                    })
                    copyDir(buildPath + "\\src", destpath + "\\src", (err) => {
                        console.log("复制文件报错", err)
                    })
                    copyFile(buildPath + "\\hall_project.manifest", destpath + "\\hall_project.manifest")
                    copyFile(buildPath + "\\hall_version.manifest", destpath + "\\hall_version.manifest")
                    copyFile(curPath + "\\version.json", destpath + "\\version.json")
                });
            });
        } else {
            console.log(err);
        }
    })
}
// 复制文件
function copyFile(src, dist) {
    Fs.writeFileSync(dist, Fs.readFileSync(src));
}
/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
function copyDir(src, dist, callback) {
    Fs.access(dist, function (err) {
        if (err) {
            // 目录不存在时创建目录
            Fs.mkdirSync(dist);
        }
        _copy(null, src, dist);
    });

    function _copy(err, src, dist) {
        if (err) {
            callback(err);
        } else {
            Fs.readdir(src, function (err, paths) {
                if (err) {
                    callback(err)
                } else {
                    paths.forEach(function (path) {
                        var _src = src + '/' + path;
                        var _dist = dist + '/' + path;
                        Fs.stat(_src, function (err, stat) {
                            if (err) {
                                callback(err);
                            } else {
                                // 判断是文件还是目录
                                if (stat.isFile()) {
                                    Fs.writeFileSync(_dist, Fs.readFileSync(_src));
                                } else if (stat.isDirectory()) {
                                    // 当是目录是，递归复制
                                    copyDir(_src, _dist, callback)
                                }
                            }
                        })
                    })
                }
            })
        }
    }
}

parseArguments()