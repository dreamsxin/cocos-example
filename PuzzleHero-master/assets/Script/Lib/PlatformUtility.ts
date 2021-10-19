import WXApi from "./WXApi";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlatformUtility {

    public static GetPlatform() {
        return cc.sys.os
    }

    public static IsAndroid() {
        if (CC_WECHATGAME) return false
        
        if (PlatformUtility.GetPlatform() == "Android" || PlatformUtility.GetPlatform().indexOf("Android") > -1) {
            return true
        } else {
            return false
        }
    }

    public static GetNativeUDID() {
        if (PlatformUtility.IsAndroid()) {
            let udid = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getUDID", "()Ljava/lang/String;");
            console.log("jsb get the android udid:", udid)
            return udid
        }
    }

    public static GetChannleID(){
        if (PlatformUtility.IsAndroid()) {
            let cid = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getChannle", "()Ljava/lang/String;");
            console.log("jsb get the android cid:", cid)
            return cid
        }else{
            return "0"
        }
    }


    public static CopyToClipboard(str: string) {

        if (CC_WECHATGAME) {
            WXApi.CopyToClipboard(str)
        } else if (cc.sys.isBrowser) {
            var textArea: any = null;
            textArea = document.getElementById("clipBoard");
            if (textArea === null) {
                textArea = document.createElement("textarea");
                textArea.id = "clipBoard";
                textArea.textContent = str;
                document.body.appendChild(textArea);
            }
            textArea.select();
            try {
                const msg = document.execCommand('copy') ? 'successful' : 'unsuccessful';
                cc.log("已经复制到剪贴板");
                document.body.removeChild(textArea);
            } catch (err) {
                cc.log("复制到剪贴板失败");
            }
        } else if (PlatformUtility.IsAndroid()) {
            let b = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "CopyToClipboard", "(Ljava/lang/String;)Z", str)
            if (b) {
                cc.log("copy done")
            }
        }
    }

    //public static Get

    // update (dt) {}
}
