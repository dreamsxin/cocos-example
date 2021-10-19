
let crypto = require('crypto');
let nodeJsBufferTool = require('buffer').Buffer;
let hotUpdateMgr = {
    manifestPre: "",
    _failCount: 0,
    _data: {
        subname: "",
        version: "1.0.0",
        remotev: '',
    },
    _downV: "",
    updataList: [],
    data: {},
    _progress: 0,
    _log: "",
    _tag: "\r\n",
    _getVersionTry: 0,
    _getVersionMaxTry: 3,
    _getProjectTry: 0,
    _getProjectMaxTry: 5,
    _packageUrl: '',
    _upFailNum: 100,
    _upFailNumTemp: 0,

    init(data) {
        if (!cc.sys.isBrowser) {
            this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'subGame/');
            this._tempStoragePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'subGame_temp/');
            this._subStoragePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'subGame/assets/');
            this._subTepStoragePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'subGame_temp/assets/');
        } else {
            this._storagePath = 'subGame/';
            this._tempStoragePath = 'subGame_temp/';
            this._subStoragePath = 'subGame/assets/';
            this._subTepStoragePath = 'subGame_temp/assets/';
        }
        this.manifestData = data
    },

    _checkCb: function (event) {
        let failed = false
        let retry = false
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:  // 0
                this.log("没有本地manifest文件," + event.getAssetId() + "," + event.getMessage())
                hqq.eventMgr.dispatch(hqq.eventMgr.hotFail, this.data.subname)
                failed = true
                retry = true
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:  // 1
                this.log("下载manifest文件错误," + event.getAssetId() + "," + event.getMessage())
                this.log(this._am.getLocalManifest().getManifestFileUrl())
                hqq.eventMgr.dispatch(hqq.eventMgr.hotCheckup, false, this.data.subname)
                failed = true
                retry = true
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:  // 2
                this.log("解析manifest文件错误," + event.getAssetId() + "," + event.getMessage())
                hqq.eventMgr.dispatch(hqq.eventMgr.hotCheckup, false, this.data.subname)
                failed = true
                retry = true
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:  // 3
                this.log("发现新的更新")
                hqq.eventMgr.dispatch(hqq.eventMgr.hotCheckup, true, this.data.subname)
                this.hotUpdate(this.data.subname)
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:  // 4
                this.log("已经是最新的版本")
                hqq.eventMgr.dispatch(hqq.eventMgr.hotCheckup, false, this.data.subname)
                failed = true
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:  // 5
                // this.log("更新进展")
                break;
            case jsb.EventAssetsManager.ASSET_UPDATED:  // 6
                this.log("需要更新cb")
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:  // 7
                this.log("更新错误")
                failed = true
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:  // 8
                this.log("更新完成")
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:  // 9
                this.log("更新失败")
                failed = true
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:  // 10
                this.log("解压失败")
                break;
            default:
                return;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this.sendlog()
            this._am = null;
            if (retry) {
                this.checkUpdate(this.data);
            } else if (this.updataList.length > 0) {
                let data = this.updataList.shift();
                this.checkUpdate(data);
            }
        }
    },

    _updateCb: function (event) {
        var failed = false;
        let retry = false
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:  // 0
                this.log("up没有本地manifest文件")
                failed = true;
                retry = true
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:  // 1
                this.log("up下载manifest文件错误," + event.getAssetId() + "," + event.getMessage())
                failed = true;
                retry = true
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:  // 2
                this.log("up解析manifest文件错误," + event.getAssetId() + "," + event.getMessage())
                hqq.eventMgr.dispatch(hqq.eventMgr.hotCheckup, false, this.data.subname)
                failed = true;
                retry = true
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:  // 3
                this.log("up发现新的更新")
                hqq.eventMgr.dispatch(hqq.eventMgr.hotCheckup, true, this.data.subname)
                this._am.update();
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:  // 4
                this.log("up已经是最新的版本")
                hqq.eventMgr.dispatch(hqq.eventMgr.hotCheckup, false, this.data.subname)
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:  // 5
                // let tempprogress = event.getDownloadedBytes() / event.getTotalBytes()
                let tempprogress = event.getPercentByFile() //event.getDownloadedFiles() / event.getTotalFiles()
                tempprogress = hqq.commonTools.fixedFloat(tempprogress)
                if (this._progress != tempprogress) {
                    // this.log("up更新进展 文件数", event.getDownloadedFiles(), event.getTotalFiles(), event.getDownloadedBytes(), event.getTotalBytes())
                    this._progress = tempprogress
                    hqq.eventMgr.dispatch(hqq.eventMgr.hotProgress, this._progress, this.data.subname)
                }
                break;
            case jsb.EventAssetsManager.ASSET_UPDATED:  // 6
                // this.log("up需要更新ub")
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:  // 7
                this._upFailNumTemp++
                if (this._upFailNumTemp >= this._upFailNum) {
                    this._upFailNumTemp = 0
                    hqq.eventMgr.dispatch(hqq.eventMgr.hotFail, this.data.subname)
                    failed = true
                } else {
                    this.log("up更新错误," + this._failCount + "次,", event.getAssetId(), event.getMessage(),
                        "curleCode", event.getCURLECode(), "curlmCode", event.getCURLMCode())
                }
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:  // 8
                this.log("up更新完成")
                this._progress = 0
                this._am.setEventCallback(null);
                this.m_updataAfter();
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:  // 9
                this.log("up更新失败," + this._failCount + "次")
                this._progress = 0
                this._failCount++;
                this.sendlog()
                this._canRetry = true;
                setTimeout(() => { // 失败后，延时一秒再开始下载更新失败的文件，防止被高防阻挡
                    this._retry();
                }, 1000)
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:  // 10
                this.log("up解压失败," + event.getAssetId() + "," + event.getMessage())
                break;
            default:
                return;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this.data = this._data;
            this.sendlog()
            this._am = null;
            if (retry) {
                this.checkUpdate(this.data);
            } else if (this.updataList.length > 0) {
                let data = this.updataList.shift();
                this.checkUpdate(data);
            }
        }
    },
    // 更新前移除本地 *_temp  project.manifest  更新文件
    m_updataBefore() {
        let path = jsb.fileUtils.getWritablePath() + 'subGame_temp'
        let file = path + '/project.manifest.temp'
        if (jsb.fileUtils.isFileExist(file)) {
            this.log('remove preupdata temp file:' + jsb.fileUtils.removeFile(file))
        }
        let remoteManifest = this._storagePath + '/project.manifest'
        if (this.data.subname != "hall") {
            remoteManifest = this._subStoragePath + '/project.manifest'
        }
        if (jsb.fileUtils.isFileExist(remoteManifest)) {
            this.log("本地project.manifest文件未删除")
            this.log('remove project file:' + jsb.fileUtils.removeFile(remoteManifest))
        }
    },
    /**
     * @Description: 子游戏进入验证
     */
    checkSubGame(checkManifest, callback, data) {
        let check = this.checkFile(checkManifest, callback, data)
        if (check.bool) {
            let remotestr = jsb.fileUtils.getStringFromFile(checkManifest)
            remotestr = JSON.parse(remotestr)
            remotestr.version = '0.0.0'
            remotestr.assets = check.manifest.asserts
            jsb.fileUtils.writeStringToFile(JSON.stringify(remotestr), checkManifest)
            if (this._am) {
                this.updataList.unshift(data);
                hqq.eventMgr.dispatch(hqq.eventMgr.hotWait, data.subname)
            } else {
                this.checkUpdate({
                    subname: data.subname,
                    version: "0.0.0",
                })
            }
        } else {
            callback && callback()
        }
    },
    /**
     * @Description: 遍历文件验证 文件是否存在
     */
    checkFile(checkManifest) {
        if (this.data.subname == "hall") {
            return { bool: false, manifest: null };
        }
        if (jsb.fileUtils.isFileExist(checkManifest)) {
            let remotestr = jsb.fileUtils.getStringFromFile(checkManifest)
            remotestr = JSON.parse(remotestr)
            let assets = remotestr.assets
            let needRetry = false
            let retryassets = {}
            for (let k in assets) {
                let assetpath = this._subStoragePath + k
                if (!jsb.fileUtils.isFileExist(assetpath)) {
                    this.log("本地丢失文件", assetpath)
                    needRetry = true
                    retryassets[k] = {
                        'size': assets[k].size,
                        'md5': "0"
                    }
                    this.downloadFile(k, assetpath)
                } else {
                    retryassets[k] = {
                        'size': assets[k].size,
                        'md5': assets[k].md5
                    }
                }
            }
            this.log("是否有缺失", needRetry)
            if (needRetry) {
                remotestr.version = '0.0.0'
                remotestr.assets = retryassets
            }
            return { bool: needRetry, manifest: remotestr };
        }
        return { bool: false, manifest: null };
    },
    downloadFile(path, assetpath) {
        let url = this._packageUrl + path
        let xhr = new XMLHttpRequest()
        xhr.timeout = 5000
        xhr.ontimeout = () => {
            this.log("downloadFile下载文件超时")
            this.sendlog()
            xhr.abort()
        }
        xhr.onerror = () => {
            this.log("downloadFile下载文件报错")
            this.sendlog()
            xhr.abort()
        }
        xhr.onload = () => {
            if (jsb.fileUtils.writeDataToFile(new Uint8Array(xhr.response), assetpath)) {
                this.log("write file success!", assetpath)
                this.log("本地是否已经存在此文件", jsb.fileUtils.isFileExist(assetpath))
            } else {
                this.log('write file failed.');
            }
            this.sendlog()
            xhr.abort()
        }
        xhr.open("GET", url, true);
        xhr.send();
    },
    /**
     * @Description: 热更结束，文件比对 失败重新更新
     */
    m_updataAfter() {
        this._am = null;
        this._getProjectTry = 0;
        this._getVersionTry = 0;
        hqq.eventMgr.dispatch(hqq.eventMgr.hotCheck, this.data.subname)
        let storagePath = this._storagePath
        if (this.data.subname != "hall") {
            storagePath = this._subStoragePath
        }
        let checkManifest = storagePath + '/project.manifest'
        let check = this.checkFile(checkManifest)
        this.log("check.bool", check.bool)
        if (check.bool) {
            this.log("比对后存在没有下载成功的文件")
            let rmanifest = new jsb.Manifest(JSON.stringify(check.manifest), storagePath);
            this._newAssetManeger();
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest(rmanifest, storagePath);
            }
            if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
                this.log('加载重新尝试的manifest文件失败 ...');
                hqq.eventMgr.dispatch(hqq.eventMgr.hotUp, this.data.subname)
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "更新文件出错，重新下载失败")
                return
            }
            this._am.setEventCallback(this._checkCb.bind(this));
            this.log("开始重新更新")
            this._am.checkUpdate();
        } else {
            this.m_renameManifest()
        }
    },
    /**
     * @Description: 修改下载的manifest文件
     */
    m_renameManifest() {
        this._log = ""
        let storagePath = this._storagePath
        if (this.data.subname != "hall") {
            storagePath = this._subStoragePath
        }
        let file = storagePath + '/version.manifest'
        let newfile = storagePath + '/' + this.manifestPre + 'version.manifest'
        if (jsb.fileUtils.isFileExist(file)) {
            this.log('version file exist')
            let str = jsb.fileUtils.getStringFromFile(file)
            let mod = JSON.parse(str).module
            if (mod) {
                if (file == newfile) {
                    this.log('rename same,so dont need to do')
                } else {
                    let re = jsb.fileUtils.renameFile(file, newfile)
                    this.log('rename project:' + re)
                    if (!re) {
                        if (hqq.reflect && hqq.reflect.renameTo) {
                            let isok = hqq.reflect.renameTo(file, newfile)
                            if (!isok) {
                                this.log('remove project file:' + jsb.fileUtils.removeFile(file))
                            }
                        } else {
                            this.log('remove project file:' + jsb.fileUtils.removeFile(file))
                        }
                    }
                }
            } else {
                this.log('remove project file:' + jsb.fileUtils.removeFile(file))
            }
        }
        file = storagePath + '/project.manifest'
        newfile = storagePath + '/' + this.manifestPre + 'project.manifest'
        if (jsb.fileUtils.isFileExist(file)) {
            let str = jsb.fileUtils.getStringFromFile(file)
            let mstr = JSON.parse(str)
            let mod = mstr.module
            if (mod == "hall" || mod == "") {
                hqq.localStorage.globalSet(hqq.app.versionKey, mstr.version)
                hqq.app.version = mstr.version
            } else {
                hqq.localStorage.set(mod, "versionKey", mstr.version)
            }
            if (mod) {
                if (file == newfile) {
                    this.log('rename same,so dont need to do')
                } else {
                    if (!jsb.fileUtils.renameFile(file, newfile)) {
                        if (!hqq.reflect.renameTo(file, newfile)) {
                            this.log('remove project file:' + jsb.fileUtils.removeFile(file))
                        }
                    }
                }
            } else {
                this.log('remove project file:' + jsb.fileUtils.removeFile(file))
            }
        } else {
            if (this.data.subname == "hall" || this.data.subname == "") {
                hqq.localStorage.globalSet(hqq.app.versionKey, this._downV)
                hqq.app.version = this._downV
            } else {
                hqq.localStorage.set(this.data.subname, "versionKey", this._downV)
            }
        }

        hqq.eventMgr.dispatch(hqq.eventMgr.hotFinish, this.data.subname)
        if (this.updataList.length > 0) {
            let data = this.updataList.shift();
            this.checkUpdate(data);
        }
        if (this.data.subname == 'hall') {
            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    },
    /**
     * @Description: 尝试重新更新 更新失败 的文件
     */
    _retry: function () {
        if (this._canRetry) {
            this._canRetry = false;
            this.log('Retry failed Assets...');
            this._am.downloadFailedAssets();
        }
    },
    /**
     * @Description: 获取本地 project.manifest 路径
     */
    getLocalManifestPath: function (subname) {
        let storagePath = this._storagePath
        if (this.data.subname != "hall") {
            storagePath = this._subStoragePath
        }
        return storagePath + subname + "_project.manifest"
    },

    _loadCustomManifest: function (subname, verstr) {
        this.manifestPre = (subname ? subname + "_" : "")
        // this.log("pre", this.manifestPre)
        let localpath = this.getLocalManifestPath(subname);  //本地project.manifest文件路径
        this.log("本地manifest路径：", localpath)
        // if (cc.loader.md5Pipe) {
        //     localpath = cc.loader.md5Pipe.transformURL(localpath)
        // }
        if (jsb.fileUtils.isFileExist(localpath)) {
            this._am.loadLocalManifest(localpath)
            this.log("使用本地存在的manifest文件")
        } else {
            if (subname == 'hall' && this.manifestData.hallmanifest) {
                var nurl = this.manifestData.hallmanifest.nativeUrl;
                this.log("native url", nurl)
                // if (cc.loader.md5Pipe) {
                //     nurl = cc.loader.md5Pipe.transformURL(nurl);
                // }
                this._am.loadLocalManifest(nurl);
            } else {
                let url = hqq.app.canHotServer + "/" + hqq.app.hotupdatePath + "/" + verstr;
                this.log("url", url + this.manifestPre + "project.manifest")
                var customManifestStr = JSON.stringify({
                    "packageUrl": url,
                    "remoteManifestUrl": url + this.manifestPre + "project.manifest",
                    "remoteVersionUrl": url + this.manifestPre + "version.manifest",
                    "version": this.data.version,
                    "assets": {},
                    "searchPaths": []
                });
                let storagePath = this._storagePath
                if (this.data.subname != "hall") {
                    storagePath = this._subStoragePath
                }
                var manifest = new jsb.Manifest(customManifestStr, storagePath);
                this._am.loadLocalManifest(manifest, storagePath);
                this.log('使用构建的manifest文件：', manifest);
            }
        }
    },
    /**
     * @Description: 本地资源md5码计算
     */
    calculateMD5(assetpath) {
        let dataBinary = jsb.fileUtils.getDataFromFile(assetpath);
        let sirData = nodeJsBufferTool.from(dataBinary)
        let localmd5 = crypto.createHash('md5').update(sirData).digest('hex'); // 与打包时的MD5码计算一致 CRLF LF 变化需要注意，会造成MD5不同
        return localmd5
    },
    /**
     * @Description: 构建一个新的热更管理器
     */
    _newAssetManeger() {
        this.versionCompareHandle = (versionA, versionB) => {
            this.log("版本对比: local version A is " + versionA + ', remote version B is ' + versionB);
            this._downV = versionB
            let m_remoteManifest = this._am.getRemoteManifest()
            if (m_remoteManifest) {
                this.log("热更地址", m_remoteManifest.getPackageUrl())
            }
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                } else {
                    // return a - b;
                    return -1; // 只要版本不同即更新，保证可以版本回退
                }
            }
            if (vB.length > vA.length) {
                return -1;
            } else {
                return 0;
            }
        };
        let storagePath = this._storagePath
        if (this.data.subname != "hall") {
            storagePath = this._subStoragePath
        }
        this._am = new jsb.AssetsManager('', storagePath, this.versionCompareHandle);
        this._am.setVerifyCallback((storagePath, asset) => { // 资源检查
            let localmd5 = this.calculateMD5(storagePath)
            // var compressed = asset.compressed; // 是否为压缩文件
            // var relativePath = asset.path; // 服务器端相对路径
            if (localmd5 == asset.md5) {
                return true;
            }
            // console.log("localmd5, asset.md5,", localmd5, asset.md5)
            // console.log("storagePath", storagePath)
            return false
        });
        this._am.setMaxConcurrentTask(2); // 并发
        this._canRetry = false;
        this._failCount = 0;
        this._progress = 0
        this.m_updataBefore();
    },
    /**
     * @Description: 获取子游戏是否在更新列表中
     */
    getSubGameIsOnUp(subGameName) {
        for (let i = 0; i < this.updataList.length; i++) {
            if (subGameName == this.updataList[i].subname) {
                return true
            }
        }
        return false
    },
    /**
     * @Description: 热更失败或者不需要更新
     */
    vfailcallback(status, forcejump, url, err) {
        this.log("更新失败", status, forcejump, url, err, this._getVersionTry, this._getVersionMaxTry)
        if (this._getVersionTry < this._getVersionMaxTry) {
            this.log("重新尝试下载version.manifest")
            this._getVersionTry++
            hqq.http.sendXMLHttpRequest({
                method: 'GET',
                urlto: this._packageUrl + this.manifestPre + 'version.manifest',
                callback: this.vcallback.bind(this),
                needJsonParse: true,
                failcallback: this.vfailcallback.bind(this),
                timeout: 5000,
                failtimeout: 7000,
            })
            return
        }
        hqq.eventMgr.dispatch(hqq.eventMgr.hotCheckup, false, this.data.subname)
        this._am.setEventCallback(null);
        this._am = null;
        this._getProjectTry = 0;
        this._getVersionTry = 0;
        if (this.updataList.length > 0) {
            let data = this.updataList.shift();
            this.checkUpdate(data);
        }
    },
    /**
     * @Description: 获取version成功
     */
    vcallback(responseText) {
        // hqq.localStorage.globalSet(hqq.app.versionKey, "1.0.0")
        if (this.versionCompareHandle(this.data.version, responseText.version) == -1) { // 需要更新
            this.startUpdate(this._packageUrl)
        } else { // 已经是最新的版本，不需要更新
            hqq.eventMgr.dispatch(hqq.eventMgr.hotCheckup, false, this.data.subname)
            this._am.setEventCallback(null);
            this._am = null;
            this._getProjectTry = 0;
            this._getVersionTry = 0;
            if (this.updataList.length > 0) {
                let data = this.updataList.shift();
                this.checkUpdate(data);
            }
        }
    },
    /**
     * @Description: 开始更新
     */
    checkUpdate: function (data) {
        if (this._am) {
            let insert = true;
            if (data.subname == this.data.subname) {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "正在下载中")
                return false
            }
            for (let i = 0; i < this.updataList.length; i++) {
                if (this.updataList[i].subname == data.subname) {
                    insert = false;
                    this.updataList.splice(i, 1);
                    this.log('取消更新 ...', data.subname);
                    break;
                }
            }
            insert && this.updataList.push(data);
            this.log('正在检查更新 或 正在更新中 ...', insert ? '插入' + data.subname : "");
            return insert;
        }
        for (let k in this._data) {
            this.data[k] = data[k] || this._data[k]
        }
        let mainversion = hqq.localStorage.globalGet(hqq.app.versionKey)
        mainversion = mainversion ? mainversion : ''
        this.log('开始更新 version', data.subname, this.data.version, 'mainversion', mainversion)
        let verstr = ''
        if (this.data.subname == 'hall' && this.data.remotev) {
            verstr = this.data.remotev + '/'
        } else if (mainversion) {
            verstr = mainversion + '/'
        }

        this._newAssetManeger()
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            this._loadCustomManifest(this.data.subname, verstr);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            this.log('加载本地manifest文件失败 ...');
            return false;
        }
        this._am.setEventCallback(this._updateCb.bind(this));

        this._packageUrl = hqq.app.canHotServer + "/" + hqq.app.hotupdatePath + "/" + verstr
        if (this.data.subname != "hall") {
            this._packageUrl = hqq.app.canHotServer + "/" + hqq.app.hotupdatePath + "/" + verstr + "assets/"
        }
        this.log('热更请求地址', this._packageUrl)
        hqq.http.sendXMLHttpRequest({
            method: 'GET',
            urlto: this._packageUrl + this.manifestPre + 'version.manifest',
            callback: this.vcallback.bind(this),
            needJsonParse: true,
            failcallback: this.vfailcallback.bind(this),
            timeout: 5000,
            failtimeout: 7000,
        })
        return true;
    },
    /**
     * @Description: 开始更新对比project
     */
    startUpdate(packageUrl) {
        let callback = (responseText) => {
            this.log('responseText.packageUrl', responseText.packageUrl)
            responseText.packageUrl = packageUrl
            this.log("修改热更地址", packageUrl)
            var customManifestStr = JSON.stringify(responseText);
            var manifest = new jsb.Manifest(customManifestStr, this._tempStoragePath);
            this.log('loadRemoteManifest', this._am.loadRemoteManifest(manifest))
        }
        let falicallback = (status, forcejump, url, err) => {
            this.log('热更project失败', status, forcejump, url, err, this._getProjectTry, this._getProjectMaxTry)
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "热更project第" + ++this._getProjectTry + "次失败,错误:" + err + ",状态:" + status)
            if (this._getProjectTry < this._getProjectMaxTry) {
                this.startUpdate(packageUrl)
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.hotCheckup, false, this.data.subname)
                this._am.setEventCallback(null);
                this._am = null;
                this._getProjectTry = 0;
                this._getVersionTry = 0;
                if (this.updataList.length > 0) {
                    let data = this.updataList.shift();
                    this.checkUpdate(data);
                }
            }
        }
        hqq.http.sendXMLHttpRequest({
            method: 'GET',
            urlto: packageUrl + this.manifestPre + 'project.manifest',
            callback: callback,
            needJsonParse: true,
            failcallback: falicallback,
            timeout: 5000,
            failtimeout: 7000,
        })
    },
    // 正式进行热更
    hotUpdate: function (subname) {
        if (this._am) {
            this._am.setEventCallback(this._updateCb.bind(this));
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._loadCustomManifest(subname);
            }
            this._failCount = 0;
            this._am.update();
        }
    },
    /**
     * @Description: apk下载失败
     */
    downfail(task, errorCode, errorCodeInternal, errorStr) {
        this.log(task, errorCode, errorCodeInternal, errorStr)
        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "apk更新错误 errorCode" + errorCode + "," + errorStr)
        hqq.eventMgr.dispatch(hqq.eventMgr.hotFail, "apk")
    },
    /**
     * @Description: apk下载过程
     */
    downprogress(task, bytesReceived, totalBytesReceived, totalBytesExpected) {
        // this.log("downprogress", totalBytesReceived / totalBytesExpected)
        let tempprogress = totalBytesReceived / totalBytesExpected
        tempprogress = hqq.commonTools.fixedFloat(tempprogress)
        hqq.eventMgr.dispatch(hqq.eventMgr.hotProgress, tempprogress, 'apk')
    },
    /**
     * @Description: apk下载成功
     */
    dwonsuccess(task) {
        let dirpath = jsb.fileUtils.getWritablePath() + "data/";
        let filepath = dirpath + "app-release.apk";
        hqq.eventMgr.dispatch(hqq.eventMgr.hotFinish, "apk")
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
            "installApkAction",
            "(Ljava/lang/String;)V", filepath);
        this.log("down success!!!!");
        cc.game.end();
    },

    /**
     * @Description: 下载apk安装包
     */
    downloadApk(url) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            // this.log("开始下载apk")
            hqq.eventMgr.dispatch(hqq.eventMgr.hotCheckup, true, "安装包")
            // let downloadUrl = "http://upgrade.539316.com/apk/allgame-debug.apk";
            let downloadUrl = url;
            let dirpath = jsb.fileUtils.getWritablePath() + "data/";
            let filepath = dirpath + "app-release.apk";
            let downloader = new jsb.Downloader();
            downloader.createDownloadFileTask(downloadUrl, filepath, "down_test");
            downloader.setOnTaskError(this.downfail.bind(this));
            downloader.setOnTaskProgress(this.downprogress.bind(this));
            downloader.setOnFileTaskSuccess(this.dwonsuccess.bind(this))
        }
    },
    log() {
        let data = ""
        for (let i = 0; i < arguments.length; i++) {
            data += arguments[i] + " "
        }
        console.log("_HotLog_", data);
        this._log += data + this._tag;
    },
    sendlog() {
        if (hqq.logMgr) {
            hqq.logMgr.sendMLog(this._log)
            this._log = ""
        }
    },

}

module.exports = hotUpdateMgr
