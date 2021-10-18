cc.Class({
    extends: cc.Component,

    properties: {
        slice_content:{
            type:cc.Node,
            default:null
        },
        slice:{
            type:cc.Prefab,
            default:null
        },
        animation:{
            type:cc.Node,
            default:null
        }
    },

    start () {
        //宽，高，y偏移 0不变，1向上，-1向下
        this.pic_size=new Array([7,6,0],[7,6,0],[6,7,0],
                                [6,7,1],[7,7,0],[7,6,0],
                                [7,7,1],[6,6,0],[7,7,1]);
        
        this.get_slice();
        
        this.ok = false;
        this.animation.active = false;
        this.out_parent = cc.find("Canvas/slice_area");
        var anim = this.animation.getComponent(cc.Animation)
        console.log(anim);
    },

    update (dt) {
        if(this.ok==false&&this.out_parent.children.length==10){
            this.ok=true;
            this.scheduleOnce(function(){
                var anim = this.animation.getComponent(cc.Animation)
                anim.node.width=540;
                anim.node.height=540;
                anim.defaultClip.speed = 0.2
                anim.defaultClip.wrapMode = 1;
                this.animation.active = true;
                
            }, 2.5);
        }
    },

    get_slice(){
		let silces=[]
		for(var i=1;i<=9;i++){
			silces.push("pic/位置"+i);
		}
		cc.loader.loadResArray(silces,function(err,imgs){
            for(var i=0;i<9;i++){
                var slice = cc.instantiate(this.slice);
                this.slice_content.addChild(slice);
                
                slice.width = 90*this.pic_size[i][0]/6;
                slice.height = 90*this.pic_size[i][1]/6;
                slice.children[0].width = 270//*this.pic_size[i][0]/6;
                slice.children[0].height = 270//*this.pic_size[i][1]/6;
                slice.pos = i;

                slice.y = 50+this.pic_size[i][2]*90/6;
                //slice.children[0].x=(-90)*(i%3);
                //slice.children[0].y=(90)*Math.floor(i/3);
                switch(i){
                    case 0:
                        slice.children[0].x=0;
                        slice.children[0].y=0;
                        break;
                    case 1:
                        slice.children[0].x=-90;
                        slice.children[0].y=0;
                        break;
                    case 2:
                        slice.children[0].x=-180;
                        slice.children[0].y=0;
                        break;
                    case 3:
                        slice.children[0].x=0;
                        slice.children[0].y=75;
                        break;
                    case 4:
                        slice.children[0].x=-75;
                        slice.children[0].y=90;
                        break;
                    case 5:
                        slice.children[0].x=-165;
                        slice.children[0].y=90;
                        break;
                    case 6:
                        slice.children[0].x=0;
                        slice.children[0].y=165;
                        break;
                    case 7:
                        slice.children[0].x=-90;
                        slice.children[0].y=180;
                        break;
                    case 8:
                        slice.children[0].x=-165;
                        slice.children[0].y=165;
                        break;
                }
                
                slice.getComponent(cc.Mask).spriteFrame = new cc.SpriteFrame(imgs[i]);
            }
        }.bind(this))
	}
});
