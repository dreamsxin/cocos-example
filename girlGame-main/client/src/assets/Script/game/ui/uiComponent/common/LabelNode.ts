// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import { utils } from "../../../../util/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LabelNode extends cc.Component {

    @property(cc.Node)
    node_damage: cc.Node = null;

    @property(cc.Node)
    node_copy: cc.Node = null;

    @property(cc.SpriteFrame)
    sf_minus: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    sf_plus: cc.SpriteFrame = null;


    @property(cc.Node)
    node_minus: cc.Node = null;

    @property(cc.Node)
    node_plus: cc.Node = null;

    @property(cc.Node)
    sf_miss: cc.Node = null;

    @property(cc.Node)
    sf_double: cc.Node = null;

    private nums = [];
    private num_nodes = [];
    showData(type,num) {
        this.destroyNumbers();
        this.nums=[];
        switch (type) {
            case 0:
                this.node_minus.active = true;
                this.genrateNumbers(num);
                this.createNumbers(type);
                break;
            case 1:
                this.node_plus.active = true;
                this.genrateNumbers(num);
                this.createNumbers(type);
                break;
            case 2:
                this.sf_double.active = true;
                this.node_damage.x = 100;
                this.genrateNumbers(num);
                this.createNumbers(type);
                break;
            case 3:
                this.sf_miss.active = true;
                break;
        }

        utils.showNodeEffect(this.node, 0);

    }
    genrateNumbers(num)
    {
        console.log(num);
        if(num/10 > 0)
        {
            var left =parseInt(num/10+"");
            this.nums.push(num%10);
            this.genrateNumbers(left);

        }
    }
    getSfOfNum(type,num)
    {
        var sf = null;
        if(type == 0){

            sf = this.sf_minus.clone();
        }else if(type == 1) {

            sf = this.sf_plus.clone();
        }
        var width = sf.getRect().width/10;
        var height = sf.getRect().height;
        var x = sf.getRect().x + num * width;
        var y = sf.getRect().y;

        let rect = new cc.Rect(x,y,width, height);
        sf.setRect(rect);
        return sf;
    }
    createNumbers(type)
    {
        for(var i=0;i<this.nums.length;i++){
            var node = cc.instantiate(this.node_copy);
            node.parent = this.node_copy.parent;
            node.getComponent(cc.Sprite).spriteFrame = this.getSfOfNum(type,this.nums[i]);
            node.width = 31;
            node.height = 38;
            node.x = (this.nums.length - i)*31;
            node.y = 0;
            node.active = true;
            this.num_nodes.push(node);

        }
    }
    destroyNumbers(){
        for(var i=0;i<this.num_nodes.length;i++){
            this.num_nodes[i].destroy();

        }
        this.num_nodes.splice(0);

    }
    onDestroy(){
        this.destroyNumbers();
    }
}
