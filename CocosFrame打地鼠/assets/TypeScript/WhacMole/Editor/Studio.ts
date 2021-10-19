import AudioWarp from "../../Game/Audio";
import EditorMole from "./EditorMole";

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
export default class Studio extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Button)
    buttonPlay: cc.Button = null;

    @property(cc.Button)
    buttonPause: cc.Button = null;

    @property(cc.Button)
    buttonStop: cc.Button = null;

    @property(cc.Button)
    buttonReset: cc.Button = null;

    @property(cc.Button)
    buttonExport: cc.Button = null;

    @property(cc.Node)
    group: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    point: cc.Node = null;

    @property(cc.Node)
    redLine: cc.Node = null;
    
    private moles:EditorMole[] = [];
    private audioWarp:AudioWarp = null;
    private  scrollView:cc.ScrollView = null;
    private curPoint = null;
    private startTime = 0;
    private _running = false;
    private set running(b:boolean){
        this._running = b;
        this.buttonPause.getComponentInChildren(cc.Label).string = (b?"暂停":"继续");
    }
    private get running(){
        return this._running;
    }

    onLoad () {
        this.audioWarp = this.node.getComponent(AudioWarp);
        this.scrollView = this.node.getComponentInChildren(cc.ScrollView);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.buttonPlay.node.on("click", this.play, this);
        this.buttonPause.node.on("click", this.onPause, this);
        this.buttonStop.node.on("click", this.stop, this);
        this.buttonExport.node.on("click", this.export, this);
        this.moles = this.getComponentsInChildren(EditorMole);
        for(let i=0; i<this.moles.length; i++){
            let mole = this.moles[i];
            mole.Hide();
            mole.showFlag(false);
            mole.onKnocked = ()=>{
                this.onMoleTap(i);
            };
        }
    }
    update(dt) {
        if(this.running){
            this.redLine.x = (Date.now()-this.startTime)/10;
            if(this.redLine.x > this.scrollView.node.width*0.8){
                this.scrollView.setContentPosition(cc.v2(this.scrollView.node.width*0.8-this.redLine.x, 0));
            }
            let t = (Date.now()-this.startTime)/1000;
            for(let i=0; i<this.moles.length; i++){
                let mole = this.moles[i];
                let show = false;
                for(let j=0; j<this.content.childrenCount; j++){
                    let point:any = this.content.children[j];
                    if(point.i == i && point.t<t  && t<point.t+1){
                        show = true;
                        break;
                    }
                }
                if(show){
                    mole.Jump(0,100);
                }else{
                    mole.Hide(0);
                }
            }
        }
    }
    onKeyDown(event){
        switch(event.keyCode) {
            case cc.macro.KEY.q:this.onPause(); return;
            case cc.macro.KEY.space:this.dotPoint(); return;
        }
    }

    public play(){
        this.redLine.x = 0;
        this.group.x = 0;
        this.content.removeAllChildren();
        this.startTime = Date.now();
        this.running = true;
        this.audioWarp.play();
        this.audioWarp.setFinishCallback(()=>{
            this.running = false;
        });
        this.nameLabel.string = this.audioWarp.getDuration().toString();
        this.group.width = this.audioWarp.getDuration()*100;
    }
    public stop(){
        this.running = false;
        this.audioWarp.stop();
    }
    public onPause(){
        if(this.running){
            this.pause();
        }else{
            this.resume();
        }
    }
    public pause(){
        this.running = false;
        this.audioWarp.pause();
    }  
    public resume(){
        let t = this.redLine.x/100;
        this.audioWarp.setCurrentTime(t);
        this.startTime = Date.now() - t*1000;
        this.running = true;
        this.audioWarp.resume();
    }   

    private dotPoint() {
        if(this.running){
            let point:any = cc.instantiate(this.point);
            this.content.addChild(point);
            point.t = (Date.now()-this.startTime)/1000;
            point.i = 0;
            point.x = point.t*100;
            point.getComponentInChildren(cc.Label).string = point.t.toString();
            point.on(cc.Node.EventType.TOUCH_START, this.onPointTap, this)
        }
    }
    public onMoleTap(i){
        if(this.curPoint){
            this.moles[this.curPoint.i].Hide();
            this.moles[this.curPoint.i].showFlag(false);
            this.curPoint.i = i;
            this.moles[i].Jump();
            this.moles[i].showFlag(true);
        }        
    }
    public onPointTap(evt:cc.Event.EventTouch){
        if(this.curPoint){
            this.curPoint.color = cc.color(0,0,0);
            this.moles[this.curPoint.i].Hide();
            this.moles[this.curPoint.i].showFlag(false);
        }
        this.curPoint = evt.target;
        this.curPoint.color = cc.color(98,170,255);
        this.redLine.x = this.curPoint.x;
        this.pause();
        this.startTime = Date.now() - this.curPoint.t*1000;
        this.moles[this.curPoint.i].showFlag(true);
        this.moles[this.curPoint.i].Jump();
    }
    public export(){
        let list = [];
        for(let i=0; i<this.content.childrenCount; i++){
            let child:any = this.content.children[i];
            list.push({t:child.t, i:child.i});
        }
        this.saveForBrowser(JSON.stringify(list), "level.txt");
    }

    saveForBrowser(textToWrite, fileNameToSaveAs) {
        if (cc.sys.isBrowser) {
            let textFileAsBlob = new Blob([textToWrite], {type:'application/json'});
            let downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            downloadLink.click();
        }
    }
}
