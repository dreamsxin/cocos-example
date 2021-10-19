// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SYS extends cc.Component {

    static GAMEID  :string ="BigBug";
    static Instance:SYS;
    static LOADED():boolean {return SYS.Instance!=null;}
    static NOWACC:string;

    @property
    ClearLocalSave:boolean=false;

    @property(cc.Prefab)
    MOD_Success:cc.Node=null;
    
    onLoad ()
    {
        
        cc.game.addPersistRootNode(this.node);
        SYS.Instance =this;

        if(this.ClearLocalSave)
           SYS.NOWACC= cc.sys.localStorage.setItem(SYS.GAMEID+"_ACC","");

        SYS.NOWACC= cc.sys.localStorage.getItem(SYS.GAMEID+"_ACC");

    }

    static  SAVE(acc:string)
    {
        SYS.NOWACC=acc;
        cc.sys.localStorage.setItem(SYS.GAMEID+"_ACC",acc);
    }

    static PLAYSuccess()
    {
        if(SYS.Instance!=null&&SYS.Instance.MOD_Success!=null)
            cc.instantiate(SYS.Instance.MOD_Success).setParent(cc.director.getScene());

    }


}
