// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Galaxy extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let graphics = this.node.getComponent(cc.Graphics);
        let arm = 8;
        if(graphics){
            graphics.fillColor = cc.color(255, 255, 255, 200);
            for(let i=0; i<arm;i++){        //旋臂
                let b = i*Math.PI*2/arm;    ///相位
                for(let j=0; j<500; j++){   //数量
                    let r = 40/Math.random();  //反比例函数 r=k/x, x为[0,10]内随机数 
                    let angle = r * Math.PI/180 + b;  //角度
                    let randomRange = 50 - r/5;
                    let x = r*Math.cos(angle)+ Math.random()*randomRange;
                    let y = r*Math.sin(angle)+ Math.random()*randomRange;
                    graphics.fillColor = cc.color(255, 255, 255, 100*Math.random());
                    graphics.circle(x, y, Math.random()*3);
                    graphics.fill();
                }
            }
        }
        this.node.skewX = 10;
        this.node.skewY = 10;
        
    }

    start () {

    }

    // update (dt) {}
}
