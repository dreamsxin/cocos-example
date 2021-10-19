import Utility from "../Lib/Utility";
import SoundMgr from "../Lib/SoundMgr";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockCrl extends cc.Component {


    mxtPos: cc.Vec2 = cc.Vec2.ZERO

    atype: boolean = false

    type: number = 0

    heroSkills: number[] = []

    blockSkill: number = -1

    hid: number = -1

    hp: number = 0

    maxHp: number = 0

    sounds: any[] = []

    shield: number = 0

    //反伤
    antiInjury: boolean = false
    //减伤
    deciInjury: boolean = false
    //一击必杀
    oneKill: boolean = false

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    selectNode: cc.Node = null

    roleNode: cc.Node = null

    blockNode: cc.Node = null

    animCrl: cc.Animation = null

    animClips: cc.AnimationClip[] = []

    mxpLabel: cc.Label = null

    onLoad() {
        this.selectNode = this.node.getChildByName("select")
        if (this.selectNode != null) {
            this.selectNode.active = false
        }
        this.blockNode = this.node.getChildByName("block")
    }

    start() {

    }

    showDark(b: boolean = true) {
        let color = b ? cc.color(100, 100, 100, 255) : cc.color(255, 255, 255, 255)
        if (this.blockNode != null) {
            this.blockNode.color = color
            if (this.node.getChildByName("f") != null) {
                this.node.getChildByName("f").color = color
                this.node.getChildByName("f").children.forEach(n => {
                    n.color = color
                })
            }
        } else if (this.roleNode != null) {
            this.roleNode.color = color
        }
    }

    showSelect(b: boolean = true) {
        if (b) {
            cc.log("play select sound")
            SoundMgr.Share.PlaySound("select")
        }
        this.selectNode.active = b

    }

    updateMpPos() {
        return
        if (this.mxpLabel == null) {
            let toplabel = new cc.Node()
            toplabel.color = cc.Color.BLACK
            this.mxpLabel = toplabel.addComponent(cc.Label)
            this.node.addChild(toplabel)
            // this.mxpLabel.node.color = cc.Color.BLACK
        }
        this.mxpLabel.string = this.mxtPos.x + ":" + this.mxtPos.y
    }

    updateImage() {
        let node1 = this.node.getChildByName("F")
        let node2 = this.node.getChildByName("B")
        if (this.hid > -1) {
            if (this.mxtPos.y > 4) {
                node1.active = true
                node2.active = false
                this.roleNode = node1
            } else {
                node1.active = false
                node2.active = true
                this.roleNode = node2

            }
            this.node.zIndex = 9999 - this.mxtPos.y
            this.animCrl = this.roleNode.getComponent(cc.Animation)
            this.animClips = this.animCrl.getClips()
        }
    }

    flipImage() {
        let node1 = this.node.getChildByName("F")
        let node2 = this.node.getChildByName("B")
        if (this.hid > -1) {
            node1.active = !node1.active
            node2.active = !node2.active
            this.roleNode = node1.active ? node1 : node2
            this.animCrl = this.roleNode.getComponent(cc.Animation)
            this.animClips = this.animCrl.getClips()
        }
    }

    updateHp() {
        let hplabel = this.node.getChildByName("HP").getComponent(cc.Label)
        if (hplabel != null) {
            hplabel.string = this.hp.toString()
        }
    }

    //dir  :   3---中间方向  2---向右  1---向左
    showAttack(dir: number = 3) {
        this.animCrl.play(this.animClips[dir].name)
        this.scheduleOnce(() => {
            this.animCrl.play(this.animClips[0].name)
        }, 1)
    }

    showAckSkill(tp: cc.Vec2, pnode: cc.Node, sp: cc.Vec2 = null) {
        return new Promise((resolve, err) => {
            cc.loader.loadRes("bullet/bu" + this.hid, (err, res) => {
                if (err != null) {
                    cc.log(err)
                }

                SoundMgr.Share.PlaySound(this.sounds[0])
                let bullet: cc.Node = cc.instantiate(res)
                bullet.position = sp != null ? sp : this.node.position
                let dis = Utility.GetDistance(bullet.position, tp)
                bullet.angle = Utility.Get2PToDeg(bullet.position, tp) * -1 + 180
                pnode.addChild(bullet)

                console.log('pos:', bullet.x, tp.x)
                if (sp == null) {
                    if (tp.x < bullet.x) {
                        this.showAttack(1)
                    } else if (tp.x == bullet.x) {
                        this.showAttack(3)
                    } else if (tp.x > bullet.x) {
                        this.showAttack(2)
                    }
                }

                let act11 = cc.delayTime(0.42)
                let act22 = cc.show()
                let act1 = cc.moveTo(dis / 1800, tp)
                let act2 = cc.callFunc(() => {
                    bullet.removeFromParent()
                    resolve()
                })
                bullet.runAction(cc.sequence(cc.hide(), act11, act22, act1, act2))
                bullet.zIndex = cc.macro.MAX_ZINDEX
            })
        })
    }


    showHurt(costhp: number = 0) {
        return new Promise((resolve, err) => {
            let obj: cc.Node = null
            cc.loader.loadRes("fx/Damage", (err, res) => {
                obj = cc.instantiate(res)
                obj.getComponentInChildren(cc.Label).string = costhp.toString()
                this.node.addChild(obj)
                SoundMgr.Share.PlaySound(this.sounds[2])
            })
            this.animCrl.play(this.animClips[4].name)
            this.scheduleOnce(() => {
                this.animCrl.play(this.animClips[0].name)
                if (obj != null) {
                    obj.removeFromParent()
                }
                resolve()
            }, 1)
        })

    }

    showDie(costhp: number = 0) {
        return new Promise((resolve, err) => {
            this.antiInjury = false
            this.deciInjury = false
            this.oneKill = false
            let obj: cc.Node = null
            cc.loader.loadRes("fx/Damage", (err, res) => {
                obj = cc.instantiate(res)
                obj.getComponentInChildren(cc.Label).string = costhp.toString()
                this.node.addChild(obj)
                if (this.oneKill) {
                    obj.active = false
                }
                SoundMgr.Share.PlaySound(this.sounds[3][Utility.GetRandom(0, 1)])
            })
            this.animCrl.play(this.animClips[5].name)
            this.scheduleOnce(() => {
                if (obj != null) {
                    obj.removeFromParent()
                }
                resolve()
            }, 1)
        })
    }

    showHeal(addhp: number = 0) {
        return new Promise((resole, reerr) => {
            let healobj: cc.Node = null
            cc.loader.loadRes("fx/Heal", (err, res) => {
                healobj = cc.instantiate(res)
                healobj.getComponentInChildren(cc.Label).string = addhp.toString()
                this.hp += addhp
                this.updateHp()
                this.node.addChild(healobj)
            })
            this.scheduleOnce(() => {
                if (healobj != null) {
                    healobj.removeFromParent()
                }
                resole()
            }, 1)
        })
    }

    showSkillBlock(stype: number, eff: boolean = true) {
        this.blockSkill = stype
        this.node.getChildByName("f").active = true
        this.node.getChildByName("ffx").active = true
        this.node.getChildByName("f").children.forEach(n => {
            n.active = false
        })
        this.node.getChildByName("f").children[this.blockSkill].active = true
        if (eff) {
            let act1 = cc.scaleTo(0.1, 0)
            let act2 = cc.scaleTo(0.1, 0.9)
            this.node.getChildByName("f").runAction(cc.sequence(act1, act2))
        }
        //this.blockNode.active = false
        this.node.getChildByName("block").active = false
    }


    // update (dt) {}
}
