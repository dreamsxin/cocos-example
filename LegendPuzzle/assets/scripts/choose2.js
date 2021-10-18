var UI_ctrl = require("UI_ctrl");
var playerData = require("playerData");
cc.Class({
    extends: UI_ctrl,

    properties: {
        loading:{
            type:cc.Prefab,
            default:null
        },
        level_item:{
            type:cc.Prefab,
            default:null
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad(){
        UI_ctrl.prototype.onLoad.call(this);
        console.log("window.partIndex",window.partIndex)
        if(window.partIndex==null){
            window.partIndex = 0;
        }
        //上方图片
        var img_path = [];
        for(var i=0;i<playerData.GameData[window.partIndex].levelData.length;i++){
            img_path.push(playerData.GameData[window.partIndex].levelData[i].pic);
        }
        cc.loader.loadResArray(img_path,cc.SpriteFrame,function(err,res){
            this.imgs = res;
            this.defaultConfig();
        }.bind(this))
    },

    start () {
        this.view['dialog'].active = false;
        this.level_index = 0;
        this.dialog_index = 0;
        
        for(var i=0;i<playerData.GameData[window.partIndex].levelData.length;i++){
            var item = cc.instantiate(this.level_item);
            this.view['scroll_level/view/content'].addChild(item);
            item.index = i;
            //根据数据修改信息
            item.getChildByName("level_name").getComponent(cc.Label).string =  playerData.GameData[window.partIndex].levelData[i].title;
            //添加点击事件，根据点击位置切换上分视图
            item.on(cc.Node.EventType.TOUCH_END,function(e){
                var index = e.target.index;
                this.view['desc_level/desc'].getComponent(cc.Label).string = playerData.GameData[window.partIndex].levelData[index].desc;
                //设置图片
                this.view['desc_level/mask/img'].getComponent(cc.Sprite).spriteFrame = this.imgs[index];
                //关卡选中动画
                this.view['scroll_level/view/content'].children[this.level_index].runAction(cc.moveBy(0.2,cc.v2(0,-20)))
                this.view['scroll_level/view/content'].children[index].runAction(cc.moveBy(0.2,cc.v2(0,20)))
                this.level_index = index;
            }.bind(this),this);
        }

        this.view['dialog'].on(cc.Node.EventType.TOUCH_END,function(e){
            this.updateDialog();
        }.bind(this),this);
    },
    defaultConfig(){
        this.view['desc_level/desc'].getComponent(cc.Label).string = playerData.GameData[window.partIndex].levelData[0].desc;
        //设置图片
        this.view['desc_level/mask/img'].getComponent(cc.Sprite).spriteFrame = this.imgs[0];
        //第一关向上移动，表示选中
        this.view['scroll_level/view/content'].children[0].runAction(cc.moveBy(0.2,cc.v2(0,20)))
    },
    showDialog(){
        this.view['dialog'].active = true;
        this.updateDialog();
    },
    updateDialog(){
        console.log("this.level_index",this.level_index)
        var dialog = playerData.GameData[window.partIndex].levelData[this.level_index].dialog;
        console.log(dialog)
        if(this.dialog_index>=dialog.length){
            this.enterGame();
            return;
        }
        this.view['dialog/text'].getComponent(cc.Label).string = dialog[this.dialog_index].name +':\n'+ dialog[this.dialog_index].text;
        cc.loader.loadRes(dialog[this.dialog_index].pic,cc.SpriteFrame,function(err,res){
            this.view['dialog/people'].getComponent(cc.Sprite).spriteFrame = res
        }.bind(this))
                
        this.dialog_index++;
    },
    enterGame(){
        //展示加载界面
        var loadingBar = cc.instantiate(this.loading);
        this.node.addChild(loadingBar);
        //加载场景
        loadingBar.getComponent("loading_ctrl").loadScene("game")
    },
    // update (dt) {},
});
