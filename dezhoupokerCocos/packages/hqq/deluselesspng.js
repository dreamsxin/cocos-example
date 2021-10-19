// 专门用来检测游戏项目是否有没有使用的png资源

const fs = require('fs');
const path = require('path');

const checkDirList = [ // 需要检测的文件夹目录
    {
        name: "hall",
        file: [
            "../../assets/common/hall",
            "../../assets/resources/hall",
        ]
    },
    {
        name: "qznn",
        file: [
            "../../assets/resources/qznnPublic",
            "../../assets/subgame/qznn",
        ]
    },
    {
        name: "zjh",
        file: [
            "../../assets/resources/ZJHAudio",
            "../../assets/subgame/zjh",
        ]
    },
    {
        name: "zrsx",
        file: [
            "../../assets/subgame/zrsx",
        ]
    },
    {
        name: "sgj",
        file: [
            "../../assets/subgame/sgj",
        ]
    },
    {
        name: "bcbm",
        file: [
            "../../assets/resources/bcbmimg",
            "../../assets/subgame/bcbm",
        ]
    },
    {
        name: "hh",
        file: [
            "../../assets/resources/hh",
            "../../assets/subgame/hh",
        ]
    },
    {
        name: "hwby",
        file: [
            "../../assets/resources/hwby",
            "../../assets/subgame/hwby",
        ]
    },
    {
        name: "brnn",
        file: [
            "../../assets/resources/brnn",
            "../../assets/subgame/brnn",
        ]
    },
    {
        name: "ebg",
        file: [
            "../../assets/subgame/ebg",
            "../../assets/resources/ebg",
        ]
    },
    {
        name: "lp",
        file: [
            "../../assets/resources/lp",
            "../../assets/subgame/lp",
        ]
    },
    {
        name: "bjl",
        file: [
            "../../assets/resources/bjl",
            "../../assets/subgame/bjl",
        ]
    },
    {
        name: "lhd",
        file: [
            "../../assets/resources/lhd",
            "../../assets/subgame/lhd",
        ]
    },
    {
        name: "ddz",
        file: [
            "../../assets/resources/ddzimg",
            "../../assets/subgame/ddz",
        ]
    },
    {
        name: "sss",
        file: [
            "../../assets/resources/SSSAudio",
            "../../assets/subgame/sss",
        ]
    },
    {
        name: "hbsl",
        file: [
            "../../assets/subgame/hbsl",
        ]
    },
    {
        name: "ermj",
        file: [
            "../../assets/resources/ermj",
            "../../assets/subgame/ermj",
        ]
    },
    {
        name: "pdk",
        file: [
            "../../assets/resources/pdkimg",
            "../../assets/subgame/pdk",
        ]
    },
    {
        name: "jbpby",
        file: [
            "../../assets/resources/jbpby",
            "../../assets/subgame/jbpby",
        ]
    },
    {
        name: "hbld",
        file: [
            "../../assets/subgame/hbld",
        ]
    },
    {
        name: "pccp",
        file: [
            "../../assets/subgame/pccp",
        ]
    },
    {
        name: "21d",
        file: [
            "../../assets/resources/21d",
            "../../assets/subgame/21d",
        ]
    },
    {
        name: "dzpk",
        file: [
            "../../assets/resources/dzpk",
            "../../assets/subgame/dzpk",
        ]
    },
    {
        name: "pay",
        file: [
            "../../assets/resources/pay",
            "../../assets/subgame/pay",
        ]
    },
    {
        name: "IM",
        file: [
            "../../assets/resources/IM",
            "../../assets/subgame/IM",
        ]
    },
    {
        name: "proxy",
        file: [
            "../../assets/resources/proxy",
            "../../assets/subgame/proxy",
        ]
    },
]
let checknum = 0
let checkUIFileList = []
let checkFileList = []
let pngFileList = []
let jsonResult = {}

let timer = setTimeout(() => {
    next()
}, 1000)

function refresgTimer() {
    clearTimeout(timer)
    timer = setTimeout(() => {
        next()
    }, 1000)
}
function readCheckDirList(checkDirList) {
    if (checkDirList.length == 0) {
        console.log("没有检测的文件路径")
        return
    }
    for (let i = 0; i < checkDirList.length; i++) {
        readCheckDir(checkDirList[i], 0)
    }
}
function readCheckDir(dir, deep) {
    // deep++
    // console.log("deep", deep, dir)
    fs.readdir(dir, function (err, paths) {
        if (err) {
            console.log(err)
        } else {
            paths.forEach(function (path) {
                var _src = dir + '/' + path;
                fs.stat(_src, function (err, stat) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (stat.isFile()) {
                            if (_src.match('.meta')) {
                                if (_src.match('.labelatlas.meta')) {
                                    // console.log("_src isFile", _src)
                                    fs.readFile(_src, 'utf8', function (err, files) {
                                        if (!err) {
                                            let obj = JSON.parse(files)
                                            let rawTextureUuid = obj.rawTextureUuid
                                            checkFileList.push(rawTextureUuid)
                                            refresgTimer()
                                        } else {
                                            console.log("读取" + _src + "文件报错", err)
                                        }
                                    })
                                } else if (_src.match('.png.meta')) {
                                    fs.readFile(_src, 'utf8', function (err, files) {
                                        if (!err) {
                                            let obj = JSON.parse(files)
                                            let name = Object.keys(obj.subMetas)[0]
                                            if (name) {
                                                let uuid = obj.subMetas[name].uuid
                                                let rawTextureUuid = obj.subMetas[name].rawTextureUuid
                                                pngFileList.push({ name: name, uuid: uuid, rawTextureUuid: rawTextureUuid, isuse: false, src: _src })
                                                // console.log("pngFileList name", name, _src, pngFileList.length)
                                                refresgTimer()
                                            }
                                        } else {
                                            console.log("读取" + _src + "文件报错", err)
                                        }
                                    })
                                } else if (_src.match('.json.meta')) {
                                    fs.readFile(_src, 'utf8', function (err, files) {
                                        if (!err) {
                                            let obj = JSON.parse(files)
                                            let textures = obj.textures
                                            if (Array.isArray(textures)) {
                                                for (let i = 0; i < textures.length; i++) {
                                                    checkFileList.push(textures[i])
                                                }
                                            } else {
                                                checkFileList.push(textures)
                                            }
                                            refresgTimer()
                                        } else {
                                            console.log("读取" + _src + "文件报错", err)
                                        }
                                    })
                                }
                            } else if (_src.match('.fire') || _src.match('.prefab')) {
                                // console.log("_src isFile", _src)
                                fs.readFile(_src, 'utf8', function (err, files) {
                                    if (!err) {
                                        let list = JSON.parse(files)
                                        for (let i = 0; i < list.length; i++) {
                                            let obj = list[i]
                                            fireUuidDeal(obj, 0)
                                        }
                                        refresgTimer()
                                    } else {
                                        console.log("读取" + _src + "文件报错", err)
                                    }
                                })
                            }
                        } else if (stat.isDirectory()) {
                            readCheckDir(_src, deep)
                        }
                    }
                })
            })
        }
    })
}

function fireUuidDeal(obj, deep) {
    // deep++
    // console.log("fireUuidDeal deep", deep)
    for (let k in obj) {
        if (Array.isArray(obj[k])) {
            for (let i = 0; i < obj[k].length; i++) {
                if (typeof obj[k][i] == "object") {
                    fireUuidDeal(obj[k][i], deep)
                }
            }
        } else if (typeof obj[k] == "object") {
            fireUuidDeal(obj[k], deep)
        } else if (k == "__uuid__") {
            checkUIFileList.push(obj[k])
        }
    }
}
function next() {
    let name = checkDirList[checknum].name
    jsonResult[name] = []
    for (let i = 0; i < pngFileList.length; i++) {
        let jump = false
        for (let a = 0; a < checkFileList.length; a++) {
            if (checkFileList[a] == pngFileList[i].rawTextureUuid) {
                jump = true
                pngFileList[i].isuse = true
                break;
            }
        }
        if (!jump) {
            for (let b = 0; b < checkUIFileList.length; b++) {
                if (checkUIFileList[b] == pngFileList[i].uuid) {
                    pngFileList[i].isuse = true
                    break;
                }
            }
        }
    }
    let has = false
    for (let i = 0; i < pngFileList.length; i++) {
        if (!pngFileList[i].isuse) {
            has = true
            console.log(pngFileList[i].name, pngFileList[i].src)
            jsonResult[name].push({
                name: pngFileList[i].name,
                src: pngFileList[i].src
            })
        }
    }
    if (!has) {
        console.log(name + "没有找到无用的png资源")
    }
    checknum++
    if (checknum < checkDirList.length) {
        readCheckDirList(checkDirList[checknum])
    } else {
        var curpath = path.resolve('./');
        curpath = curpath + "/uselessresult.json"
        fs.writeFile(curpath, jsonResult, function (error) {
            if (err) {
                throw err;
            }
        });
    }
}

readCheckDirList(checkDirList[checknum])

