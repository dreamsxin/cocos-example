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
export default class GameManager extends cc.Component {

    public onLoad(){
        this.setupTimeScale();
    }
    setupTimeScale(){
        let scheduler: cc.Scheduler = cc.director["_scheduler"];
        let schedulerUpdateFunc = scheduler.update;
        scheduler.update = function (dt: number) {
            schedulerUpdateFunc.call(scheduler, this._timeScale === 0 ? 0 : dt / this._timeScale);
        }
        let _deltaTime: number = 0;
        Object.defineProperty(cc.director, "_deltaTime", {
            get: () => {
                let r = _deltaTime * cc.director.getScheduler().getTimeScale();
                    return r; 
                },
            set: (value) => { 
                _deltaTime = value;
            },
            enumerable: true,
            configurable: true
        });
    }
}
