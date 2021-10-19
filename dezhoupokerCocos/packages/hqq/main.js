
'use strict';
const Os = require('os')
const Fs = require('fire-fs');
const Path = require('path');
const child_process = require("child_process");
const crypto = require('crypto');
//配置资源所属模块，仅需要配置scene 和 resources文件夹中文件,会自动计算依赖
//支持一个文件配置多个模块 以 & 连接
//配置文件迁移，具体配置建项目中 project.txt文件
let m_projectPath = ''
let m_pngPath = ''
let m_icnsPath = ''
let m_icoPath = ''
let m_projPath = ''
let m_packageName = ''
let m_plateform = '' // web-mobile android
let m_gamename = ''
let m_pinpai = ''
let m_huanjin = ''
let m_versionjson = null
let m_language = 'CN'
let m_country = 'china'
let m_currency = 'rmb'

function onBuildStart(options, callback) {
    // Editor.log("onBuildStart", options)
    m_projectPath = options.project
    m_pngPath = options.project + '/packages/hqq/icon/icon.png'
    m_icnsPath = options.project + '/packages/hqq/icon/Icon.icns'
    m_icoPath = options.project + '/packages/hqq/icon/game.ico'
    m_projPath = options.dest
    m_packageName = options.android.packageName
    m_plateform = options.actualPlatform
    m_gamename = options.title
    if (m_plateform == "android") {
        if (m_packageName.match('dev') || m_packageName.match('Dev')) {
            m_huanjin = 'dev'
        } else if (m_packageName.match('pre') || m_packageName.match('Pre')) {
            m_huanjin = 'pre'
        } else {
            m_huanjin = 'online'
        }
        if (m_packageName.match("AG") || m_packageName.match("Test") || m_packageName.match("test")) {
            m_pinpai = 'test'
        } else if (m_packageName.match("debi")) {
            m_pinpai = 'debi'
        } else if (m_packageName.match("xingba")) {
            m_pinpai = 'xingba'
        } else if (m_packageName.match("yuyu")) {
            m_pinpai = 'yuyu'
        }
    } else if (m_plateform == "web-mobile" || m_plateform == "web-desktop") {
        if (m_gamename.match('dev') || m_gamename.match('Dev')) {
            m_huanjin = 'dev'
        } else if (m_gamename.match('pre') || m_gamename.match('Pre')) {
            m_huanjin = 'pre'
        } else {
            m_huanjin = 'online'
        }
        if (m_gamename.match("Tst") || m_gamename.match("Test")) {
            m_pinpai = 'test'
        } else if (m_gamename.match("debi")) {
            m_pinpai = 'debi'
        } else if (m_gamename.match("xingba")) {
            m_pinpai = 'xingba'
        } else if (m_gamename.match("yuyu")) {
            m_pinpai = 'yuyu'
        }
    }
    Editor.log("<--Myplugin--> onBuildStart", m_pinpai, m_huanjin)
    let tversionjson = Fs.readFileSync(m_projectPath + "/version.json", 'utf8')
    m_versionjson = JSON.parse(tversionjson)
    if (m_plateform == "android") {
        if (!Fs.existsSync(m_projPath) || !Fs.isDirSync(m_projPath)) {
            _changeTemplatesPackageName(options)
        } else {
            _checkPackageName(options)
        }
        _replaceIcons()
        _changePackageInfoInJava()
        _changeApkName()
    }
    callback()
}
/*
1. 若资源 A被大厅引用，又被其他游戏引用，则此资源属于大厅
2. 若资源 B被多个游戏同时引用，记录所有引用的模块，打包模块时包含此资源
*/
function onBuildFinish(options, callback) {
    // Editor.log("onBuildFinish", options)
    if (m_plateform == "android") {
        _buildHotUpdata243(options)
    }
    // Editor.log('<--Myplugin--> onBuildFinish')
    callback()
}
module.exports = {
    load() {
        // 当 package 被正确加载的时候执行
        Editor.Builder.on('build-start', onBuildStart);
        Editor.Builder.on('build-finished', onBuildFinish);
    },
    unload() {
        // 当 package 被正确卸载的时候执行
        Editor.Builder.removeListener('build-start', onBuildStart);
        Editor.Builder.removeListener('build-finished', onBuildFinish);
    },
    messages: {
        open() {
            Editor.log("我的插件：1、热更新分包；2、替换应用图片")
            Editor.Panel.open('hqq');
        },
        'changeLanguage'(event, value) {
            Editor.log("我的插件：", value)
            m_language = value
        },
        'changeCountry'(event, value) {
            Editor.log("我的插件：", value)
            m_country = value

        },
        'changeCurrency'(event, value) {
            Editor.log("我的插件：", value)
            m_currency = value
        },
        'editor:build-finished'(event, target) {
            _replaceSearchPaths(target.dest)
            if (m_plateform == "android") {
                if (Os.platform() == "win32") {
                    // _runPackgenBat()
                }
            } else if (m_plateform == "web-mobile" || m_plateform == "web-desktop") {
                _replaceTitle(target.dest)
            }
            Editor.log("<--Myplugin--> build-finished")
        }
    },
}
/**
 * @Description: 替换 index.html 中的title标签
 */
function _replaceTitle(dest) {
    Editor.log("<--Myplugin--> _replaceTitle", dest)
    var root = Path.normalize(dest);
    var url = Path.join(root, "index.html");
    Fs.readFile(url, "utf8", function (err, data) {
        if (err) {
            throw err
        }
        let i0 = data.indexOf("<title>") + 7
        let i1 = data.indexOf("</title>") + 8
        var newData = data.substring(0, i0) + m_gamename
            + "</title>\n" + '  <meta http-equiv="Content-Security-Policy" content="connect-src * " />'
            + data.substring(i1)
        Fs.writeFile(url, newData, function (error) {
            if (error) {
                throw error;
            }
            _changeCss(root)
        });
    });
}
/**
 * @Description: 修改网页版css文件
 */
function _changeCss(root) {
    Editor.log("<--Myplugin--> changeCss", root)
    // var readDir = Fs.readdirSync("./build/web-mobile/")
    var readDir = Fs.readdirSync(root)
    let desktoppath = ""
    let mobilepath = ""
    for (let i = 0; i < readDir.length; i++) {
        if (readDir[i].match('style-desktop')) {
            desktoppath = root + "\\" + readDir[i]
        } else if (readDir[i].match('style-mobile')) {
            mobilepath = root + "\\" + readDir[i]
        }
    }
    Fs.readFile(desktoppath, 'utf8', function (err, files) {
        if (!err) {
            let newfiles = files.replace("url(./splash.85cfd.png)", "")
            Fs.writeFile(desktoppath, newfiles, function (error) {
                if (error) {
                    throw error;
                } else {
                    Editor.log("<--Myplugin--> style-desktop修改成功")
                    Fs.readFile(mobilepath, 'utf8', function (err, files) {
                        if (!err) {
                            let newfiles = files.replace("url(./splash.85cfd.png)", "")
                            Fs.writeFile(mobilepath, newfiles, function (error) {
                                if (error) {
                                    throw error;
                                } else {
                                    Editor.log("<--Myplugin--> style-mobile修改成功")
                                    Editor.log("<--Myplugin--> pack_gen 成功 打包完成！！！✿✿ヽ(°▽°)ノ✿")
                                }
                            });
                        } else {
                            Editor.log("<--Myplugin--> 读取style-mobile文件报错", err)
                        }
                    })
                }
            });
        } else {
            Editor.log("<--Myplugin--> 读取style-desktop文件报错", err)
        }
    })
}
/**
 * @Description: 替换 mian.js 中的文件读取路径
 */
function _replaceSearchPaths(dest) {
    console.log("<--Myplugin--> _replaceSearchPaths")
    var root = Path.normalize(dest);
    var url = Path.join(root, "main.js");
    Fs.readFile(url, "utf8", function (err, data) {
        if (err)
            throw err

        var newStr =
            "if (window.jsb) {\n" +
            "    window.__errorHandler = function (file, line, error) {\n" +
            "        if (file.indexOf('subGame') >= 0) {\n" +
            "            jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath() + 'subGame/res/')\n" +
            "            jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath() + 'subGame/src/')\n" +
            "            jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + 'subGame/hall_project.manifest')\n" +
            "            __restartVM();\n" +
            "        }\n" +
            "    };\n" +
            "    var searchPaths = jsb.fileUtils.getSearchPaths();\n" +
            "    var _storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'subGame/');\n" +
            "    searchPaths.unshift(_storagePath);\n" +
            "    jsb.fileUtils.setSearchPaths(searchPaths); \n" +
            "}\n";
        var newData = newStr + data
        Fs.writeFile(url, newData, function (error) {
            if (error) {
                throw error;
            }
        });
    });
}
/**
 * @Description: 热更新打包 bat
 */
function _runPackgenBat() {
    Editor.log("<--Myplugin--> _runPackgenBat")
    child_process.execFile("243update.bat", [m_pinpai, m_huanjin], { cwd: m_projectPath, maxBuffer: 1024 * 1024 * 20 }, function (error, stdout, stderr) {
        if (error !== null) {
            Editor.log("<--Myplugin--> exec error" + error)
        }
        if (stderr !== null) {
            Editor.log("<--Myplugin--> stderr " + stderr)
        }
        Editor.log("<--Myplugin--> 243update 成功 打包完成！！！✿✿ヽ(°▽°)ノ✿")
    })
}
// 构建manifest文件中的 assets 内容
function manifestReadDir(dir, obj, src) {
    var stat = Fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    var subpaths = Fs.readdirSync(dir), subpath, size, md5, compressed, relative;
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = Path.join(dir, subpaths[i]);
        stat = Fs.statSync(subpath);
        if (stat.isDirectory()) {
            manifestReadDir(subpath, obj, src);
        } else if (stat.isFile()) {
            // Size in Bytes
            size = stat['size'];
            // md5 = crypto.createHash('md5').update(Fs.readFileSync(subpath, 'binary')).digest('hex');
            md5 = crypto.createHash('md5').update(Fs.readFileSync(subpath)).digest('hex');
            compressed = Path.extname(subpath).toLowerCase() === '.zip';
            relative = Path.relative(src, subpath);
            relative = relative.replace(/\\/g, '/');
            relative = encodeURI(relative);
            obj[relative] = {
                'size': size,
                'md5': md5
            };
            if (compressed) {
                obj[relative].compressed = true;
            }
        }
    }
}
// 根据完整的 manifest 构建 version.manifest
var getVersion = function (d) {
    return {
        packageUrl: d.packageUrl,
        remoteManifestUrl: d.remoteManifestUrl,
        remoteVersionUrl: d.remoteVersionUrl,
        version: d.version,
        module: d.module
    }
}
// 构建热更manifest文件
function _buildHotUpdata243(options) {
    let remoteUrl = "https://upgrade.gzzfhz.com"
    if (m_huanjin == "dev") {
        remoteUrl = "http://upgrade.539316.com"
    } else if (m_huanjin == "pre") {
        remoteUrl = "https://upgrade.gzzfhz.com"
    }
    let manifestList = {}
    for (let k in m_versionjson.version) {
        manifestList[k] = {
            packageUrl: remoteUrl,
            remoteManifestUrl: remoteUrl + 'project.manifest',
            remoteVersionUrl: remoteUrl + 'version.manifest',
            version: m_versionjson.version[k],
            assets: {},
            searchPaths: [],
            module: k,
        };
    }
    options.bundles.forEach(bundle => {
        if (!bundle.name || bundle.name == "main" || bundle.name == "resources" || bundle.name == "internal") {
            return
        } else {
            let subGame = bundle.name
            for (let k in manifestList) {
                if (bundle.name.match(k)) {
                    subGame = k
                }
            }
            // Editor.log("manifestList.name", subGame)
            var buildResults = bundle.buildResults;
            let assets = buildResults.getAssetUuids()
            for (let i = 0; i < assets.length; ++i) {
                let asset = assets[i]
                let path = buildResults.getNativeAssetPath(asset)
                if (path) {
                    manifestReadDir(options.dest + "/assets/" + bundle.name + "/", manifestList[subGame].assets, options.dest + "/")
                }
            }
        }
    });
    options.bundles.forEach(bundle => {
        if (!bundle.name || bundle.name == "main" || bundle.name == "resources" || bundle.name == "internal") {
            return
        } else {
            let subGame = bundle.name
            for (let k in manifestList) {
                if (bundle.name.match(k)) {
                    subGame = k
                }
            }
            Fs.writeFile(options.dest + "/assets/" + subGame + "_project.manifest", JSON.stringify(manifestList[subGame]), (err) => {
                if (err) throw err;
                // Editor.log(subGame, 'Manifest successfully generated');
                Fs.writeFile(options.dest + "/assets/" + subGame + "_version.manifest", JSON.stringify(getVersion(manifestList[subGame])), (err) => {
                    if (err) throw err;
                    // Editor.log(subGame, 'v Manifest successfully generated');
                });
            });
        }
    })
    var hallmanifest = {
        packageUrl: remoteUrl,
        remoteManifestUrl: remoteUrl + 'hall_project.manifest',
        remoteVersionUrl: remoteUrl + 'hall_version.manifest',
        version: '1.0.0',
        assets: {},
        searchPaths: [],
        module: "hall",
    };
    if (m_versionjson.version["hall"]) {
        hallmanifest.version = m_versionjson.version["hall"]
    }
    manifestReadDir(options.dest + "/assets/", hallmanifest.assets, options.dest + "/")
    manifestReadDir(options.dest + "/src/", hallmanifest.assets, options.dest + "/")
    Fs.writeFile(options.dest + "/hall_project.manifest", JSON.stringify(hallmanifest), (err) => {
        if (err) throw err;
        // Editor.log('hall Manifest successfully generated');
        Fs.writeFile(options.dest + "/hall_version.manifest", JSON.stringify(getVersion(hallmanifest)), (err) => {
            if (err) throw err;
            // Editor.log('hall v Manifest successfully generated');
        })
    })
}
/**
 * @Description: 检查包名并修改
 */
function _checkPackageName(options) {
    // Editor.log("<--Myplugin--> _checkPackageName")
    var root = Path.normalize(options.project);
    var url = Path.join(root, "\\build-templates\\jsb-link\\frameworks\\runtime-src\\proj.android-studio\\app");
    var url0 = Path.join(url, "\\res\\xml\\file_paths.xml");
    Fs.readFile(url0, "utf8", function (err, data) {
        if (err) {
            throw err
        }
        var packageNameindex = data.indexOf(m_packageName)
        if (packageNameindex == -1) {
            _changeTemplatesPackageName(options)
        }
    });
}
// 改变 Templates 下模板文件的包名
function _changeTemplatesPackageName(options) {
    // Editor.log("<--Myplugin--> _changeTemplatesPackageName")
    var root = Path.normalize(options.project);
    var url = Path.join(root, "\\build-templates\\jsb-link\\frameworks\\runtime-src\\proj.android-studio\\app");

    var url0 = Path.join(url, "\\res\\xml\\file_paths.xml");
    Fs.readFile(url0, "utf8", function (err, data) {
        if (err) {
            throw err
        }
        var newStr =
            "<?xml version='1.0' encoding='utf-8'?>\n" +
            "<resources>\n" +
            "    <paths>\n" +
            "        <external-path path='Android/data/" + m_packageName + "/' name='files_root'/>\n" +
            "        <external-path path='.' name='external_storage_root'/>\n" +
            "    </paths>\n" +
            "    <path>\n" +
            "\n" +
            "        <root-path name='root_path' path='.'/>\n" +
            "\n" +
            "    </path>\n" +
            "</resources>"
        Fs.writeFile(url0, newStr, function (error) {
            if (err) {
                throw err;
            }
        });
    });

    var url2 = Path.join(url, "\\AndroidManifest.xml");
    Fs.readFile(url2, "utf8", function (err, data) {
        if (err) {
            throw err
        }
        var newFile = data
        var n0 = newFile.indexOf('package=') + 8
        var n1 = newFile.indexOf('android:installLocation', n0)
        newFile = newFile.substring(0, n0) + "'" + m_packageName + "'" + "\n\t" + newFile.substring(n1)
        var v0 = newFile.indexOf('authorities=', n1) + 12
        var v1 = newFile.indexOf('android:exported=')
        newFile = newFile.substring(0, v0) + "'" + m_packageName + ".fileProvider'" + "\n\t\t\t" + newFile.substring(v1)
        Fs.writeFile(url2, newFile, function (error) {
            if (err) {
                throw err;
            }
        });
    });

    var url3 = Path.join(url, "\\build.gradle");
    Fs.readFile(url3, "utf8", function (err, data) {
        if (err) {
            throw err
        }
        var n0 = data.indexOf('applicationId') + 13
        var n1 = data.indexOf('minSdkVersion', n0)
        var newFile = data.substring(0, n0) + " " + "'" + m_packageName + "'" + "\n\t\t" + data.substring(n1)
        Fs.writeFile(url3, newFile, function (error) {
            if (err) {
                throw err;
            }
        });
    });
}
function copyFile(src, dist) {
    Fs.writeFileSync(dist, Fs.readFileSync(src));
}
/**
 * @Description: 替换icon图片
 */
function _replaceIcons() {
    // Editor.log("<--Myplugin--> _replaceIcons")
    copyFile(m_projectPath + "/packages/hqq/icon/" + m_pinpai + "/mipmap-hdpi/ic_launcher.png",
        m_projectPath + "/build-templates/jsb-link/frameworks/runtime-src/proj.android-studio/res/mipmap-hdpi/ic_launcher.png")
    copyFile(m_projectPath + "/packages/hqq/icon/" + m_pinpai + "/mipmap-mdpi/ic_launcher.png",
        m_projectPath + "/build-templates/jsb-link/frameworks/runtime-src/proj.android-studio/res/mipmap-mdpi/ic_launcher.png")
    copyFile(m_projectPath + "/packages/hqq/icon/" + m_pinpai + "/mipmap-xhdpi/ic_launcher.png",
        m_projectPath + "/build-templates/jsb-link/frameworks/runtime-src/proj.android-studio/res/mipmap-xhdpi/ic_launcher.png")
    copyFile(m_projectPath + "/packages/hqq/icon/" + m_pinpai + "/mipmap-xxhdpi/ic_launcher.png",
        m_projectPath + "/build-templates/jsb-link/frameworks/runtime-src/proj.android-studio/res/mipmap-xxhdpi/ic_launcher.png")
    copyFile(m_projectPath + "/packages/hqq/icon/" + m_pinpai + "/Icon.icns",
        m_projectPath + "/build-templates/jsb-link/frameworks/runtime-src/proj.ios_mac/mac/Icon.icns")
    copyFile(m_projectPath + "/packages/hqq/icon/" + m_pinpai + "/game.ico",
        m_projectPath + "/build-templates/jsb-link/frameworks/runtime-src/proj.win32/res/game.ico")
}
/**
 * @Description: 修改保存在java代码中的包信息
 */
function _changePackageInfoInJava() {
    Fs.readFile(m_projectPath + "/project.json", 'utf8', function (err, files0) {
        if (!err) {
            let projectjson = JSON.parse(files0)
            let cccversion = projectjson.version
            Fs.readFile(m_projectPath + "/version.json", "utf8", function (err, files) {
                if (err) {
                    throw err
                }
                let jsonConfig = JSON.parse(files)
                let apkversion = jsonConfig.apkversion
                let proxyid = jsonConfig[m_pinpai][m_huanjin].proxyUserID
                let str = '\"{\\\"pinpai\\\":\\\"' + m_pinpai
                    + '\\\",\\\"huanjin\\\":\\\"' + m_huanjin
                    + '\\\",\\\"system\\\":\\\"android\\\",\\\"version\\\":\\\"' + apkversion
                    + '\\\",\\\"proxyid\\\":\\\"' + proxyid
                    + '\\\",\\\"language\\\":\\\"' + m_language
                    + '\\\",\\\"country\\\":\\\"' + m_country
                    + '\\\",\\\"currency\\\":\\\"' + m_currency
                    + '\\\",\\\"engine_version\\\":\\\"' + cccversion + '\\\"}\"'
                let path = m_projectPath + "/build-templates/jsb-link/frameworks/runtime-src/proj.android-studio/app/src/org/cocos2dx/javascript/AppActivity.java"
                Fs.readFile(path, "utf8", function (err, data) {
                    if (err) {
                        throw err
                    }
                    let i0 = data.indexOf("getHqqPackageInfo")
                    let i1 = data.indexOf("return ", i0) + 7
                    let i2 = data.indexOf(";", i1)
                    let ndata = data.substring(0, i1) + str + data.substring(i2)
                    Fs.writeFile(path, ndata, function (error) {
                        if (err) {
                            throw err;
                        }
                    });
                });
            });
        } else {
            console.log(err);
        }
    })

}
/**
 * @Description: 修改app的名字
 */
function _changeApkName() {
    let path = m_projectPath + "/build-templates/jsb-link/frameworks/runtime-src/proj.android-studio/res/values/strings.xml"
    let end = ""
    if (m_huanjin == "dev" || m_huanjin == "pre") {
        end = m_huanjin
    }
    let name = "特斯特游戏"
    if (m_pinpai == 'test') {
        name = "特斯特游戏"
    } else if (m_pinpai == 'debi') {
        name = "德比游戏"
    } else if (m_pinpai == 'xingba') {
        name = "杏吧娱乐"
    }
    name += end
    let data = '<resources>\n' +
        '<string name="app_name" translatable="false">' + name + '</string>\n' +
        '</resources>'
    Fs.writeFile(path, data, function (error) {
        if (err) {
            throw err;
        }
    });
}
