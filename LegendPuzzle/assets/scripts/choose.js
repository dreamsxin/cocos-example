var UI_ctrl = require("UI_ctrl");
var playerData = require("playerData");
cc.Class({
    extends: UI_ctrl,

    properties: {
        loading:{
            type:cc.Prefab,
            default:null
        },
        part:{
            type:cc.Prefab,
            default:null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        UI_ctrl.prototype.onLoad.call(this);
        var img_path = [];
        for(var i=0;i<playerData.GameData.length;i++){
            img_path.push(playerData.GameData[i].pic);
        }
        cc.loader.loadResArray(img_path,cc.SpriteFrame,function(err,res){
            this.imgs = res;
            this.defaultConfig();
        }.bind(this))
    },

    start () {
        this.cur_index = 0;

        var pageView = this.view['page_level'].getComponent(cc.PageView);
        //滚动监听事件
        var scrollViewEventHandler = new cc.Component.EventHandler();
        scrollViewEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        scrollViewEventHandler.component = "choose";//这个是代码文件名
        scrollViewEventHandler.handler = "changePage";
        scrollViewEventHandler.customEventData = "foobar";
        pageView.pageEvents.push(scrollViewEventHandler);

        
        console.log(this.view)
    },
    defaultConfig(){
        for(var i=0;i<playerData.GameData.length;i++){
            var part = cc.instantiate(this.part);
            part.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = this.imgs[i];
            part.getChildByName("label").getChildByName("nickname").getComponent(cc.Label).string = playerData.GameData[i].partName;
            this.view['page_level'].getComponent(cc.PageView).addPage(part);
        }
    },
    enterLevel(){
        window.partIndex = this.cur_index;
        console.log(this.cur_index)

        //展示加载界面
        var loadingBar = cc.instantiate(this.loading);
        this.node.addChild(loadingBar);
        //加载场景
        loadingBar.getComponent("loading_ctrl").loadScene("choose2")
    },
    changePage(){
        this.cur_index = this.view['page_level'].getComponent(cc.PageView).getCurrentPageIndex()
        console.log(this.cur_index)
    }
    // update (dt) {},
});
