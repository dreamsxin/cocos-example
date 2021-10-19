
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
import SceneManager from "./SceneManager";
import Scene from "./Scene";
import { DB } from "./DataBind";

@ccclass
export default class Navigator extends DB.DataBindComponent {

    @property(cc.Button)
    buttonBack: cc.Button = null;
    @property(cc.Button)
    buttonHome: cc.Button = null;
    public static ins:Navigator = null;
    public onBackClick:()=>void = null;
    public onHomeClick:()=>void = null;
    onLoad(){
        Navigator.ins = this;
        this.Bind("curScene",(scene:Scene)=>{
            if(scene){
                this.buttonBack.node.active = scene.showBack;
                this.buttonHome.node.active = scene.showHome;
            }
        })
        this.buttonBack.node.on("click",()=>{
            if(this.onBackClick){
                this.onBackClick();
            }else{
                SceneManager.ins.Back();
            }
            this.onBackClick = null;
            this.onHomeClick = null;
        })
        this.buttonHome.node.on("click",()=>{
            if(this.onHomeClick){
                this.onHomeClick();
            }else{
                SceneManager.ins.goHome();
            }
            this.onBackClick = null;
            this.onHomeClick = null;
        })
    }
}
