import WXApi from "../Lib/WXApi";
import Utility from "../Lib/Utility";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameDrawerUI extends cc.Component {

    @property(cc.Node)
    staticIcon: cc.Node = null
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null
    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Node)
    gameB: cc.Node = null
    @property(cc.Node)
    gameS: cc.Node = null

    isLeft: boolean = false

    // onLoad () {}

    onEnable() {
        //this.initScrollView()
        this.initStaticIcon()

        //this.schedule(this.autoScrollView, 3)
    }

    start() {
        //this.initScrollViewEffect()
    }

    initScrollViewEffect() {
        this.scrollView.node.on('touchend', () => {
            this.scrollView.stopAutoScroll()
            this.unschedule(this.autoScrollView)
            this.scheduleOnce(this.autoScrollView, 3)
        })
        this.scrollView.node.on('touchcancel', () => {
            this.scrollView.stopAutoScroll()
            this.unschedule(this.autoScrollView)
            this.scheduleOnce(this.autoScrollView, 3)
        })

        this.scheduleOnce(this.autoScrollView, 2)
    }

    initStaticIcon() {
        this.staticIcon.removeAllChildren()
        let siData: any[] = WXApi.drawerData
        if (siData.length <= 0) return
        for (let i = 0; i < 10; i++) {
            if (i >= siData.length) break

            let gb: cc.Node = cc.instantiate(this.gameB)
            gb.active = true
            gb.getComponentInChildren(cc.Label).string = siData[i].name
            Utility.LoadImgAyns(siData[i].source, gb.getComponentInChildren(cc.Sprite))
            gb.on('touchend', () => { this.clickAd(i) })
            this.staticIcon.addChild(gb)
        }
    }

    initScrollView() {
        this.content.removeAllChildren()
        let svData: any[] = WXApi.drawerData
        if (svData.length <= 0) return
        for (let i = 0; i < svData.length; i++) {
            let gs: cc.Node = cc.instantiate(this.gameS)

            gs.active = true
            gs.y = 0
            gs.getComponentInChildren(cc.Label).string = svData[i].name
            Utility.LoadImgAyns(svData[i].source, gs.getComponentInChildren(cc.Sprite))
            gs.on('touchend', () => { this.clickAd(i) })
            this.content.addChild(gs)
        }

        this.autoScrollView()

    }

    clickAd(id: number) {
        console.log('click ad :', id)
        if (id + 1 > WXApi.drawerData.length)
            return
        let navData: any = WXApi.drawerData[id]
        WXApi.navigateApp(navData.app_id, navData.path, navData.advertiser_id, 'drawer')
    }

    touchSV() {
        // if (this.scrollView.isAutoScrolling) {
        //     this.scrollView.stopAutoScroll()
        //     this.unschedule(this.autoScrollView)
        //     this.scheduleOnce(this.autoScrollView, 3)
        //     console.log('player touch!')
        // }
    }

    autoScrollView() {
        let os: number = Math.abs(this.scrollView.getScrollOffset().x)
        let maxOs: number = Math.abs(this.scrollView.getMaxScrollOffset().x)
        let time: number = 0
        this.isLeft = os < maxOs / 2
        if (this.isLeft) {
            time = (this.content.childrenCount / 2) * ((maxOs - os) / maxOs)
            this.scrollView.scrollToRight(time, false)
        } else {
            time = (this.content.childrenCount / 2) * (os / maxOs)
            this.scrollView.scrollToLeft(time, false)
        }
        this.scheduleOnce(() => { this.autoScrollView() }, time)
    }


    update(dt) {
    }
}
