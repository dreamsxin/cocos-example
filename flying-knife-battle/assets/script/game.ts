const { ccclass, property } = cc._decorator;

@ccclass
export default class game extends cc.Component {

    @property(cc.Node)
    targetNode: cc.Node = null;//目标，木盘


    @property(cc.Node)
    knifeNode: cc.Node = null;//多次运动的刀

    @property(cc.Prefab)
    knifePrefab: cc.Prefab = null;//刀的预制体

    canThrow: boolean = false;//是否可以扔飞刀
    targetRotation: number = 3;//目标每帧转的度数
    knifeArr = [];//在目标上的的刀的数组
    knifeSpeed: number = 0.15;//飞刀飞的速度
    knifeHitSpeed: number = 0.25;//飞刀被弹走的速度
    knifeHitAngle: number = 30;//飞刀被弹走的转角

    public throwKnife() {


        if (this.canThrow) {//可以扔飞刀
            this.canThrow = false;//刀在飞的过程中，不能同时扔

            this.knifeNode.runAction(cc.sequence(//动作，回调函数
                //刀起点，终点

                cc.moveTo(this.knifeSpeed, cc.v2(this.knifeNode.x, this.targetNode.y - this.targetNode.height / 2)),
                cc.callFunc(() => {//回调函数
                    //1、撞击用到的变量
                    let isHit = false;//是否撞到
                    let gap = 15;//碰撞的角度范围，方圆


                    //1、撞击的条件
                    for (let knifeNode of this.knifeArr) {//从预制体生成刀数组里面不断取刀
                        //新刀的角度在左右15度范围内
                        if (Math.abs(knifeNode.angle) < gap || Math.abs(360 - knifeNode.angle) < gap) {
                            isHit = true;//弹走
                            break;
                        }
                    }
                    //3、撞击的行为
                    if (isHit) {//飞刀被弹走
                        console.log("isHit")
                        this.knifeNode.runAction(cc.sequence(
                            cc.spawn(
                                //飞刀被弹走的位移
                                //cc.winSize.height屏幕的高
                                cc.moveTo(this.knifeHitSpeed, cc.v2(this.knifeNode.x, -cc.winSize.height)),
                                cc.rotateTo(this.knifeHitSpeed, this.knifeHitAngle)//飞刀被弹走的转角

                            ),
                            cc.callFunc(() => { //回调函数
                                console.log("Game over!")
                            })
                        ))


                    } else {//飞刀没有被弹走


                        console.log("isNotHit")
                        let knifeNodeTmp = cc.instantiate(this.knifePrefab);//预制体生成新刀
                        knifeNodeTmp.setPosition(this.knifeNode.position);//新刀的位置===旧刀的位置
                        this.node.addChild(knifeNodeTmp);//添加到当前的节点树，在编辑器中
                        this.knifeArr.push(knifeNodeTmp);//压入数组

                        //一开始那把刀的位置
                        //y的位置是当前（在目标上的位置）的147，不是想要的原先的-300。所以不用刀，用目标的位置数据
                        this.knifeNode.setPosition(cc.v2(this.targetNode.x, -this.targetNode.y))
                        console.log(this.knifeNode.x, this.knifeNode.y)//Y=147
                        this.canThrow = true;//又可以扔飞刀
                        console.log("扔飞刀!")
                    }

                    //
                })
            ))
        }
    }

    onLoad() {
        console.log("Load")
        this.canThrow = true;//是否可以扔飞刀
        this.targetNode.zIndex = 1;//目标在最上面

        this.node.on('touchstart', this.throwKnife, this);

        setInterval(() => {//定时器，每两秒调用函数
            this.changetargetSpeed();
        }, 2000);

    }

    onDestroy() {
        this.node.off("touchstart", this.throwKnife, this);

    }
    changetargetSpeed() {
        let dir = Math.random() > 0.5 ? 1 : -1;//改变目标方向
        let speed = 1 + Math.random() * 4;//目标的标量速度
        this.targetRotation = dir * speed;//目标的矢量速度

    }
    update(dt) {
        //目标每帧旋转targetRotation度
        this.targetNode.angle = (this.targetNode.angle + this.targetRotation) % 360;

        for (let knifeNode of this.knifeArr) {//从预制体生成刀数组里面不断取刀
            knifeNode.angle = (knifeNode.angle + this.targetRotation) % 360;//新刀每帧转转
            /*
                x正方向为0度，逆时针旋转，飞刀一开始270度，
                2 * PI / 360=rad / 角度
                rad = 2 * PI / 360 * 角度
            */
            let rad = Math.PI * (knifeNode.angle - 90) / 180;
            let r = this.targetNode.height / 2;
            knifeNode.x = this.targetNode.x + r * Math.cos(rad);
            knifeNode.y = this.targetNode.y + r * Math.sin(rad);
        }

    }

}
