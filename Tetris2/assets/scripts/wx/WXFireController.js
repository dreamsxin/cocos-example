// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    handleUserInfo(res){
        wx.showToast({
            title: "登陆成功", 
            icon: "success"
        }) ;

       
        var avatarNode =   cc.find("WXAvatarMask/WXAvatar", this.node);//this.node.getChildByName("WXAvatar");
        var nikeNameNode = this.node.getChildByName("WXNickName");

        var sprite  = avatarNode.getComponent(cc.Sprite);
        var label = nikeNameNode.getComponent(cc.Label);

        label.string = res.userInfo.nickName;
        var avatarUrl = res.userInfo.avatarUrl;

        console.log("nickName: " + res.userInfo.nickName + ",  avatar: " + res.userInfo.avatarUrl);
        cc.loader.load({url: avatarUrl + "?a.jpg"}, function (err, texture) {
            if(err){
                console.log(err);
                return ;
            }
            // Use texture to create sprite frame
            console.log("Get a texture: " + (texture instanceof cc.Texture2D));
            var spriteFrame = new cc.SpriteFrame(texture);
            sprite.spriteFrame = spriteFrame;

            
        }.bind(this));

        // cc.loader.loadRes("gray", cc.Texture2D, function(err, texture){
        //     console.log("Get a texture: " + (texture instanceof cc.Texture2D));
        //     var sprteFrame = new cc.SpriteFrame(texture);
        //     sprite.spriteFrame = sprteFrame;
        // })
    }, 

    createUserInfoButton: function () {
        var btnWidth = 150;
        var btnHeight = 40;
        var left = (cc.visibleRect.width - btnWidth) / 2;
        var top = (cc.visibleRect.height - btnHeight) / 2;
        
         
        var button = wx.createUserInfoButton({
            type: 'text',
            text: '获取用户信息',
            style: {
                left: left,
                top: top,
                width: btnWidth,
                height: btnHeight,
                lineHeight: 40,
                backgroundColor: '#ff0000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        });

        button.onTap((res) => {
            if (res.errMsg.indexOf('auth deny') > -1 || 	res.errMsg.indexOf('auth denied') > -1 ) {
                 return;
              }  
            
             
            this.handleUserInfo(res);
        });


        button.show();
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       

      
        
    },

    start () {

    },

    // update (dt) {},
});
