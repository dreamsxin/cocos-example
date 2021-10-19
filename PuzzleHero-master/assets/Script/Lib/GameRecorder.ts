import WXApi from "./WXApi";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameRecorder extends cc.Component {
    public static Share: GameRecorder = null
    isRecording: boolean = false
    recorder: any = null
    videoPath: string = ''

    onLoad() {
        GameRecorder.Share = this
        cc.game.addPersistRootNode(this.node)
    }

    start() {
        if (WXApi.channelID == 2 && CC_WECHATGAME) {
            this.recorder = tt.getGameRecorderManager();
            this.stopListener()
            this.onInterrupBegin()
            this.onInterrupEnd()
        }
    }

    //开始录屏
    recordStart() {
        console.log('录屏开始');
        this.recorder.start({
            duration: 300,
        })
        this.isRecording = true;
    }
    //暂停录屏
    recordPause() {
        console.log('录屏暂停');
        this.recorder.pause();
    }
    //继续录屏
    recordResume() {
        console.log('录屏继续');
        this.recorder.resume();
    }

    //停止录屏
    recordStop() {
        if (!this.isRecording) {
            return;
        }
        console.log('录屏停止');
        this.recorder.stop();
    }

    //监听录屏结束
    stopListener() {
        this.recorder.onStop(res => {
            console.log('录屏结束：', res.videoPath);
            this.videoPath = res.videoPath
            this.isRecording = false
        })
    }

    //分享视频
    shareVideo() {
        if (this.videoPath == '') {
            WXApi.OpenAlert('没有录制视频！');
            return;
        }

        tt.shareVideo({
            videoPath: this.videoPath,
            extra: {
                createChallenge: true
            },
            success() {
                console.log('分享成功！')
            },
            fail(e) {
                console.log('分享失败！')
                WXApi.OpenAlert('分享失败！');
            }
        });
    }

    //监听中断开始
    onInterrupBegin() {
        this.recorder.onInterruptionBegin(() => {
            console.log('录屏被打断开始');
            this.recordPause();
        });
    }
    //监听中断结束
    onInterrupEnd() {
        this.recorder.onInterruptionEnd(() => {
            console.log('录屏被打断结束');
            this.recordResume();
        });
    }

    // update (dt) {}
}
