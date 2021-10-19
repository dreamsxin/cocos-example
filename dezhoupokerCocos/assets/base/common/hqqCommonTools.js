
let commonTools = {
    versionCompare(loaclV, remoteV) {
        if (!loaclV || !remoteV) {
            return true;
        } else {
            let vA = remoteV.split('.');
            let vB = loaclV.split('.');
            for (let i = 0; i < vA.length; ++i) {
                let a = parseInt(vA[i]);
                let b = parseInt(vB[i] || 0);
                if (a != b) {
                    return true;
                }
            }
            if (vB.length != vA.length) {
                return true;
            }
        }
        return false
    },
    headRes: null, // 头像资源缓存
    loadHeadRes(headid, headsprite) {
        if (typeof headid == "string" && headid.includes(".")) {
            headid = headid.substring(0, headid.indexOf("."))
        }
        headid = parseInt(headid) % 10
        if (this.headRes) {
            var spriteFrame = this.headRes.getSpriteFrame(`Avatar` + headid)
            if (spriteFrame) {
                headsprite.spriteFrame = spriteFrame;
            } else {
                headsprite.spriteFrame = t.getSpriteFrame(`Avatar0`);
            }
        } else {
            cc.resources.load(`/head/im_head`, cc.SpriteAtlas, (err, t) => {
                this.headRes = t
                var spriteFrame = t.getSpriteFrame(`Avatar` + headid)
                if (spriteFrame) {
                    headsprite.spriteFrame = spriteFrame;
                } else {
                    headsprite.spriteFrame = t.getSpriteFrame(`Avatar0`);
                }
            })
        }
    },
    loadIconRes(icontarget, name, path) {
        cc.resources.loadDir(path, sp.SkeletonData, function (err, Data) {
            if (err) {
                console.log("加载骨骼动画失败", err)
                return;
            }
            for (let i = 0; i < Data.length; i++) {
                if (Data[i].__classname__ == "sp.SkeletonData") {
                    icontarget.skeletonData = Data[i];
                    icontarget.animation = 'animation';
                    icontarget._updateSkeletonData();
                }
            }
        });
        cc.resources.load(path + "/name", cc.SpriteFrame, (err, frame) => {
            if (err) {
                console.log("加载图片失败", err)
                return;
            }
            name.spriteFrame = frame;
        })
    },
    /** 判断是否为数字 */
    isNumber(obj) {
        if (typeof obj === 'number' && !isNaN(obj)) {
            return true;
        }
        return false;
    },
    /** 截屏  注意：web端下载图片到本地待解决
     * @param {object} target 截图组件本身
     * @param {string} fileName 图片名字.jpg（可选）
     * @example
     * hqq.commonTools.screenShot(this); 
     * or hqq.commonTools.screenShot(this，"文件名.jpg");
     */
    screenShot(target, fileName) {
        // let date = new Date();
        // let time = "" + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
        let gl = cc.game._renderContext; // gl.STENCIL_INDEX8 质量较高  gl.DEPTH_STENCIL 质量较低
        let render = new cc.RenderTexture();
        render.initWithSize(Math.floor(cc.visibleRect.width), Math.floor(cc.visibleRect.height), gl.DEPTH_STENCIL);
        cc.Camera.main.targetTexture = render;
        let scaleAction = cc.scaleTo(0.5, 0.3);
        let targetPos = cc.v2(cc.visibleRect.width - cc.visibleRect.width / 6, cc.visibleRect.height / 4);
        let moveAction = cc.moveTo(0.5, targetPos);
        let spawn = cc.spawn(scaleAction, moveAction);
        let node = new cc.Node();
        node.setPosition(cc.v2(cc.visibleRect.width / 2, cc.visibleRect.height / 2));
        node.zIndex = cc.macro.MAX_ZINDEX;
        node.on(cc.Node.EventType.TOUCH_START, () => {
            node.parent = null;
            node.destroy();
        });
        var fileName = fileName || "cocosScreenShot.jpg";
        if (CC_JSB) {
            var fullPath = jsb.fileUtils.getWritablePath() + fileName;
            if (jsb.fileUtils.isFileExist(fullPath)) {
                jsb.fileUtils.removeFile(fullPath);
            }
            target.scheduleOnce(() => {
                cc.Camera.main.targetTexture = null;
                let data = render.readPixels();
                let width = render.width;
                let height = render.height;
                let picData = new Uint8Array(width * height * 4);
                let rowBytes = width * 4;
                for (let row = 0; row < height; row++) {
                    let srow = height - 1 - row;
                    let start = srow * width * 4;
                    let reStart = row * width * 4;
                    for (let i = 0; i < rowBytes; i++) {
                        picData[reStart + i] = data[start + i];
                    }
                }
                jsb.saveImageData(picData, width, height, fullPath);
                let texture = new cc.Texture2D();
                cc.log(width, height)
                texture.initWithData(picData, texture._format, width, height);
                let spriteFrame = new cc.SpriteFrame();
                spriteFrame.setTexture(texture);
                let sprite = node.addComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
                node.parent = cc.director.getScene();
                node.runAction(spawn);
            }, 0, 0)
        } else {
            target.scheduleOnce(() => {
                cc.Camera.main.targetTexture = null;
                if (!this._canvas) {
                    this._canvas = document.createElement('canvas');
                    this._canvas.width = render.width;
                    this._canvas.height = render.height;
                } else {
                    let ctx = this._canvas.getContext('2d');
                    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                }
                let ctx = this._canvas.getContext('2d');
                let data = render.readPixels();
                let rowBytes = render.width * 4;
                for (let row = 0; row < render.height; row++) {
                    let srow = render.height - 1 - row;
                    let imageData = ctx.createImageData(render.width, 1);
                    let start = srow * render.width * 4;
                    for (let i = 0; i < rowBytes; i++) {
                        imageData.data[i] = data[start + i];
                    }
                    ctx.putImageData(imageData, 0, row);
                }
                var dataURL = this._canvas.toDataURL("image/png");
                var img = document.createElement("img");
                img.src = dataURL;
                let texture = new cc.Texture2D();
                texture.initWithElement(img);
                let spriteFrame = new cc.SpriteFrame();
                spriteFrame.setTexture(texture);
                let sprite = node.addComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
                node.parent = cc.director.getScene();
                node.runAction(spawn);

                var iframe = "<iframe width='100%' height='100%' src='" + dataURL + "'></iframe>"
                var x = window.open();
                x.document.open();
                x.document.write(iframe);
                x.document.close();
            }, 0, 0)
        }
    },
    /**
     * 简单的复制对象
     * 正确处理的对象只有Number、String、Array等能够被json表示的数据结构，因此函数这种不能被json表示的类型将不能被正确处理
     * @param {mobject}  复制的对象原型
     */
    jsonCopy(mobject) {
        if (mobject) {
            return JSON.parse(JSON.stringify(mobject))
        }
    },
    /**
     * 设置默认头像
     * @param {head}  头像精灵
     */
    setDefaultHead(head) {
        let rand = Math.floor(Math.random() * 20)
        if (rand < 10) {
            rand = "0" + rand;
        }
        cc.resources.load("head/im_head" + rand, cc.SpriteFrame, function (err, res) {
            if (err) {
                return
            }
            head.spriteFrame = res;
        })
    },
    /**
    *  字符串超长作固定长度加省略号（...）处理
    * @param str 需要进行处理的字符串，可含汉字
    * @param len 需要显示多少个汉字，两个英文字母相当于一个汉字
    * @returns {string}
    */
    formatStringLength(str, len = 12) {
        let strlen = 0;
        let needstr = str;
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) >= 19968 && str.charCodeAt(i) <= 40869) {
                strlen += 2;
            } else {
                strlen++;
            }
            if (strlen > len) {
                needstr = str.substr(0, i - 1) + "...";
                break;
            }
        }
        return needstr;
    },
    /**
     * 计算浮点型数值相减的结果
     * 精度最高为小数点后6位
     * @param value1
     * @param value2
     * @param precision 要求的小数点后精度,默认为小数点后4位
     */
    floatSub(value1, value2, precision = 4) {
        //精度值不能小于1
        precision = precision < 1 ? 4 : precision;
        //精度值不能大于6
        precision = precision >= 6 ? 6 : precision;
        //计算放大倍数
        let multiple = 10 ** precision;
        let buff1 = Math.floor(value1 * multiple);
        let buff2 = Math.floor(value2 * multiple);
        let result = (buff1 - buff2) + '';
        //还原精度
        let strHead = result.slice(0, -precision);
        let strEnd = result.slice(-precision);
        return +`${strHead}.${strEnd}`;
    },
    /**
     * 获取对应的本地日期
     * @param timestamp 本地时间戳
     * @returns 日期格式 2018年12月31日
     */
    toLocalDate(timestamp) {
        const date = new Date(1e3 * timestamp);
        const month = date.getMonth();
        const strMonth = (9 > month ? "0" + (month + 1) : month + 1).toString();
        const day = date.getDate();
        const strDay = (10 > day ? "0" + day : day).toString();
        return `${date.getFullYear()}年${strMonth}月${strDay}日`;
    },
    /**
     * 时间戳转化为时分秒的格式
     * @param timestamp 时间戳
     * @returns  日期格式 09:59:01
     */
    timestampHMS(timestamp) {
        const h = Math.floor(timestamp / 3600);
        const m = Math.floor(timestamp / 60 % 60);
        const s = Math.floor(timestamp % 60);
        return {
            hour: h < 10 ? "0" + h : "" + h,
            minute: m < 10 ? "0" + m : "" + m,
            second: s < 10 ? "0" + s : "" + s,
        };
    },
    /**
     * 年月日格式化为字符串
     * @returns `${y}年${i}月${o}日`
     */
    formatDateToString(y, m, d) {
        const strMonth = padMonth(m);
        const strDay = padDay(d);
        return `${y}年${strMonth}月${strDay}日`;
    },
    /**
     * 年月日格式化为数字
     */
    formatDateToNumber(y, m, d) {
        const i = padMonth(m);
        const o = padDay(d);
        return parseInt(`${y}${i}${o}`, 10);
    },
    formatDateToStr(timestamp) {
        let date = new Date(1e3 * timestamp)  // *1e3 转换时间
        let strYear = date.getFullYear();
        let month = date.getMonth();
        let strMonth = (9 > month ? "0" + (month + 1) : month + 1).toString();
        let day = date.getDate();
        let strDay = (10 > day ? "0" + day : day).toString();
        let hour = date.getHours();
        let strHour = (hour < 10 ? "0" + hour : hour).toString();
        let minute = date.getMinutes();
        let strMinute = (minute < 10 ? "0" + minute : minute).toString();
        let second = date.getMinutes();
        let strSecond = (second < 10 ? "0" + second : second).toString();
        let str = strYear + "-" + strMonth + "-" + strDay + " " + strHour + ":" + strMinute + ":" + strSecond
        return str
    },
    /**
     * 字符串数组转化为数字数组
     * @param strArray 需要转化的字符串数组
     */
    toNumberArray(strArray) {
        const intValues = [];
        const length = strArray.length;
        for (let index = 0; index < length; index++) {
            let val = parseInt(strArray[index], 10);
            if (!isNaN(val)) {
                intValues.push(val);
            }
        }
        return intValues;
    },
    moneyLevel: {
        Bai: 100,
        Qian: 1e3,
        Wan: 1e4,
        ShiWan: 1e5,
        BaiWan: 1e6,
        QianWan: 1e7,
        Yi: 1e8,
    },
    /**
     * 格式化金额为对应的字符串
     * @param money 需要格式化的金额
     */
    formatMoney(money) {
        if (money >= moneyLevel.Yi) {
            return Math.floor(money / moneyLevel.Yi) + "亿";
        }
        if (money >= moneyLevel.BaiWan) {
            return Math.floor(money / moneyLevel.Wan) + "万";
        }
        return fixedFloat(money, 2);
    },
    /**
     * 保留小数点后的指定位数，采用的方法是截断指定位数后的数字
     * @param num 需要操作的数字
     * @param len 需要保留的小数点后位数
     */
    fixedFloat(num, len = 2) {
        // return ~~(num * 100) / 100;
        return num.toFixed(len);
    },
    formatGold(num) {
        // num = num.toFixed(6)
        // return ~~(num * 100) / 100;
        num = num.toFixed(6)
        let str = num.toString()
        if (str.includes(".")) {
            return str.substring(0, str.indexOf(".") + 3)
        } else {
            return str
        }
    },
    /**
     * 填充数字，对于长度不足的，自动补零
     * @param num 需要填充的数字
     * @param len 指定的长度
     */
    padNumber(num, len) {
        const n = ("" + num).length;
        return Array(len > n ? len - n + 1 || 0 : 0).join("0") + num;
    },
    /**
     * @Description: 互换数组中的两个元素
     */
    swapItem(arr, fromIndex, toIndex) {
        arr[toIndex] = arr.splice(fromIndex, 1, arr[toIndex])[0];
        return arr;
    },
    // 将int转换为uint8数组
    IntToUint8Array(num, Bits) {
        let resArry = [];
        let xresArry = [];
        let binaryStr = num.toString(2);
        for (let i = 0; i < binaryStr.length; i++)
            resArry.push(parseInt(binaryStr[i]));

        if (Bits) {
            for (let r = resArry.length; r < Bits; r++) {
                resArry.unshift(0);
            }
        }

        let resArryStr = resArry.join("");
        for (let j = 0; j < Bits; j += 8)
            xresArry.push(parseInt(resArryStr.slice(j, j + 8), 2));

        return xresArry;
    },
    // 将unit8数组转换为int..
    Uint8ArrayToInt(uint8Ary) {
        let retInt = 0;
        for (let i = 0; i < uint8Ary.length; i++)
            retInt |= (uint8Ary[i] << (8 * (uint8Ary.length - i - 1)));

        return retInt;
    },
    // 全局设置所有按钮点击后延时
    setButtonDelay(b, t) {
        if (b) {
            if (!cc.Button.prototype.tocheEndClose) {
                cc.Button.prototype.tocheEndClose = cc.Button.prototype._onTouchEnded
            }
            cc.Button.prototype._hqqDelay = true;
            cc.Button.prototype._hqqDelayTime = t || 500;
            cc.Button.prototype.hqqsetDelay = function (on) {
                if (typeof on == 'undefined') {
                    this._hqqDelay = true
                } else {
                    this._hqqDelay = on
                }
            }
            cc.Button.prototype.hqqDelay = function (event) {
                if (this.interactable && this.enabledInHierarchy && this._hqqDelay) {
                    this.enabledInHierarchy = false // enabledInHierarchy 表示该组件是否被启用并且所在的节点也处于激活状态。
                    setTimeout(() => {
                        this.enabledInHierarchy = true
                    }, this._hqqDelayTime);
                }
            }
            cc.Button.prototype._onTouchEnded = function (event) {
                if (this._hqqSoundon) {
                    this.hqqEffect()
                }
                this.tocheEndClose(event);
                if (this._hqqDelay) {
                    this.hqqDelay(event)
                }
            }
        } else {
            cc.Button.prototype._hqqDelay = false
        }
    },
}

module.exports = commonTools;
