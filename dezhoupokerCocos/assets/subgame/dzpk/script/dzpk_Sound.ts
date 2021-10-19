class NewClass {
    // 控制音效
    IsOpenMusic: boolean = true;

    // 播放背景音乐
    PlayBackMusic() {
        // 判断音效是否关闭,关闭状态则不开启音效
        if (!this.IsOpenMusic) {
            return
        }
        let dzpkRes = cc.assetManager.getBundle("dzpkRes");
        dzpkRes.load("sound/background", cc.AudioClip, function (err, clip) { // dzpkRes/
            var audioID = cc.audioEngine.playMusic(clip, false);  
            cc.audioEngine.setLoop(audioID, true);
        });
    }
    
    /**
    * 动态播放音效
    * @param url  资源地址 "路径加资源名"
    */
    
    PlayAudio(url: string) {
        // 判断音效是否关闭,关闭状态则不开启音效
        if (!this.IsOpenMusic) {
            return
        }
        let dzpkRes = cc.assetManager.getBundle("dzpkRes");
        dzpkRes.load(url, cc.AudioClip, (err, audioClip) => {
            if (err) {
                console.log("资源加载失败！");
                return;
            }
            cc.audioEngine.playEffect(audioClip, false);
        });
    }

    // 获取下注音效
    LoadAudio(index: number,image: string) {
        let sex: string = "";
        switch (image) {
            case "0": sex = "girl";break;
            case "1": sex = "girl";break;
            case "2": sex = "girl";break;
            case "3": sex = "girl";break;
            case "4": sex = "girl";break;
            case "5": sex = "boy";break;
            case "6": sex = "boy";break;
            case "7": sex = "boy";break;
            case "8": sex = "boy";break;
            case "9": sex = "boy";break;
            default:  
                break;
        }

        var str: string = "";
        if (index == 0) {
            str = "sound/fapai";          // 发牌声音
        }else if (index == 1) {
            str = "sound/fanpai";         // 翻牌声音
        }else if (index == 2) {
            str = "sound/ring";           // 头像框倒计时声音
        }else if (index == 3) {
            str = "sound/rangpai";        // 让牌声音
        }else if (index == 4) {
            str = "sound/check_"+ sex;    // 过牌声音 
        }else if (index == 5) {
            str = "sound/call_"+ sex;     // 跟注声音
        }else if (index == 6) {
            str = "sound/raise_"+ sex;    // 加注声音
        }else if (index == 7) {
            str = "sound/allin_"+ sex;    // allin声音
        }else if (index == 8) {
            str = "sound/fold_"+ sex;     // 玩家弃牌声音
        }else if (index == 9) {
            str = "sound/foldpai";        // 卡牌弃牌声音
        }else if (index == 10) {
            str = "sound/chip";           // 下注筹码声音
        }else if (index == 11) {
            str = "sound/chou_s";         // 筹码回收声音
        }else if (index == 12) {
            str = "sound/win";            // youWin声音
        }else if (index == 13) {
            str = "sound/sicbo_click1";   // 按钮点击
        }else if (index == 14) {
            str = "sound/leave";          // 离开声音
        }else if (index == 15) {
            str = "sound/click"; 
        }
        return str;
    }

    LoadEmojAduio(num: number) {
        var str: string = "";
        if (num == 21) {
            str = "emoj_aduio/ani1"; 
        }else if (num == 22) {
            str = "emoj_aduio/ani2"; 
        }else if (num == 23) {
            str = "emoj_aduio/ani3"; 
        }else if (num == 24) {
            str = "emoj_aduio/ani4"; 
        }
        return str;
    }
}



export default new NewClass