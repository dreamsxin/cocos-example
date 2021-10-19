
import GameFlow from "./GameFlow";
import LoginAccountServerFlow from "./LoginAccountServerFlow";
import ResLoadingFlow from "./ResLoadingFlow";
import EnterGameFlow from "./EnterGameFlow";

export default class GameFlowManager{
    private gameFlows:Array<GameFlow> = new Array<GameFlow>();
    public loginAccountServerFlow:LoginAccountServerFlow = null;
    public resLoadingFlow:ResLoadingFlow = null;
    public enterGameFlow:EnterGameFlow = null;
    public onload(){
        this.loginAccountServerFlow = new LoginAccountServerFlow();
        this.resLoadingFlow = new ResLoadingFlow();
        this.enterGameFlow = new EnterGameFlow();
        this.resetFlow()
    }
    public resetFlow(){
        this.gameFlows.splice(0);
        this.gameFlows.push(this.resLoadingFlow);
        this.gameFlows.push(this.loginAccountServerFlow);
        this.gameFlows.push(this.enterGameFlow);

        if (this.gameFlows.length > 0) {
            this.gameFlows[0].EnterFlow();
        }
    }
    public update(dt){
        if (this.gameFlows.length <= 0) {
            return;
        }

        var isFlowEnd = this.gameFlows[0].WaitFlow();

        if (isFlowEnd == true) {
            this.gameFlows.splice(0,1);

            if (this.gameFlows.length > 0) {
                this.gameFlows[0].EnterFlow();
            }
        }
    }

}
export let gameFlowManager:GameFlowManager=new GameFlowManager();

