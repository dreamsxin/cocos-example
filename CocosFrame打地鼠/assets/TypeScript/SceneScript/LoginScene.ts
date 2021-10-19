import Scene from "../System/Scene";

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
import SceneManager from "../System/SceneManager"
import { DB } from "../System/DataBind";
@ccclass
export default class LoginScene extends Scene {

    @property(cc.Label)
    label: cc.Label = null;

    onLoad () {
        let count = 0;
        DB.Set("starMap",{

            stars:[
                {x:128, y:4, id:1},
                {x:-83, y:-61, id:2},
                {x:273, y:-78, id:3},
                {x:182, y:-354, id:4},
                {x:-50, y:200, id:5},
                {x:-133, y:463, id:6},
                {x:-128, y:-250, id:7},
                {x:159, y:358, id:8},
                {x:78, y:506, id:9},
                {x:-280, y:147, id:10},
                {x:200, y:200, id:11},
            ],
            links:[
                [6,9],
                [9,8],
                [8,5],
                [6,5],
                [10,5],
                [5,2],
                [2,1],
                [5,1],
                [1,3],
                [1,4],
                [3,4],
                [2,7],
                [7,4],
                [1,11]
            ],
            curStarId:1
        })
        DB.Set("archives",[
            {
                x:238,
                y:11,
                name:"香草星",
                id:1,
            },
            {
                x:141,
                y:161,
                name:"猩红星",
                id:2,
            },
            {
                x:46,
                y:252,
                name:"惨绿怪兽星",
                id:3,
            },
            {
                x:-174,
                y:25,
                name:"孤寂星",
                id:4,
            },
            {
                x:-206,
                y:-201,
                name:"蔚蓝海阳星",
                id:5,
            },
            {
                x:-2,
                y:-404,
                name:"远古星",
                id:6,
            }
        ])
        this.schedule(()=>{
            this.label.string = "loading" + ".".repeat(count%3);
            if(count >= 3){
                SceneManager.ins.Enter("MainMenuScene");
            }
            count++;
         }, 0.2, 3);
    }
}
