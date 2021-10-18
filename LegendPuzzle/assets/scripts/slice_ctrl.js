cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.out_parent = cc.find("Canvas/slice_area");
        this.in_parent = this.node.parent;

        this.outside = false;
        //防止只有单击没有移动，造成缩小
        this.move = false;

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
            this.move = true;
            this.node.opacity = 200;
            var w_pos = e.getLocation(); // API, 获取触摸位置;
            var pos = this.node.parent.convertToNodeSpaceAR(w_pos);
            pos.x -= this.node.width/2;
            pos.y += this.node.height/2;
            this.node.setPosition(pos);
            
            if(this.outside==false){
                this.outside = true;
                this.node.parent = this.out_parent;
                //防止第一帧卡顿
                var w_pos = e.getLocation(); // API, 获取触摸位置;
                var pos = this.node.parent.convertToNodeSpaceAR(w_pos);
                pos.x -= this.node.width/2;
                pos.y += this.node.height/2;
                this.node.setPosition(pos);
                //拖出去，碎片放大一倍
                this.node.width += 200;
                this.node.height *= 2;
                this.node.children[0].width *=2;
                this.node.children[0].height *= 2;
                this.node.children[0].x *= 2;
                this.node.children[0].y *= 2;
            }
        }.bind(this), this);

        this.out_pos = new Array([-270,270],[-90,270],[90,270],
                                [-270,120],[-120,90],[60,90],
                                [-270,-60],[-90,-90],[60,-60]);
        //宽，高，y偏移 0不变，1向上，-1向下
        this.pic_size=new Array([7,6,0],[7,6,0],[6,7,0],
            [6,7,1],[7,7,0],[7,6,0],
            [7,7,1],[6,6,0],[7,7,1]);

        this.node.on(cc.Node.EventType.TOUCH_END,function(e){
            if(this.move==false){
                return;
            }
            this.move=false;
            this.node.opacity = 255;
            var index = this.node.pos;
            var w_pos = e.getLocation();
            var pos = this.node.parent.convertToNodeSpaceAR(w_pos);
            pos.x -= this.node.width/2;
            pos.y += this.node.height/2;
            var dis = pos.sub(cc.v2(this.out_pos[index][0],this.out_pos[index][1])).mag()
            
            if(dis<=50){
                //放下位置符合要求
                var tmp = cc.v2(this.out_pos[index][0],this.out_pos[index][1]);
                this.node.setPosition(tmp)
            }
            else{
                //不符合，送回碎片栏中
                this.outside = false;
                this.node.parent = this.in_parent;

                this.node.width /= 2;
                this.node.height /= 2;
                this.node.children[0].width /=2;
                this.node.children[0].height /= 2;
                this.node.children[0].x /= 2;
                this.node.children[0].y /= 2;
                
                this.node.y = 50+this.pic_size[this.node.pos][2]*90/6;

                console.log(this.node.parent)
                //排序节点位置
                for(var i=0;i<this.node.parent.childrenCount;i++){
                    if(this.node.parent.children[i].pos>this.node.pos){
                        this.node.setSiblingIndex(i);
                        break;
                    }
                }
            }
            
        }.bind(this),this);
    },

    // update (dt) {},
});
