import { Log } from "./util/Log";
import { gameFlowManager } from "./game/flow/GameFlowManager";
import { dataManager } from "./game/data/DataManager";
import { uiManager } from "./base/ui/UIManager";
import { UIConfig } from "./game/ui/UIConfig";
import { NetNode } from "./base/network/NetNode";
import { WebSock } from "./base/network/WebSock";
import { netManager, NetManager } from "./base/network/NetManager";
import SysDef from "./util/SysDef";
import { netMsg, ZhiMengProtocol } from "./game/netMsg/NetMsg";

export default class App {

    public onLoad() {
        uiManager.initUIConf(UIConfig);
        gameFlowManager.onload();
        let Node = new NetNode();
        Node.init(new WebSock(), new ZhiMengProtocol());
        netMsg.initHander(Node);
        netManager.setNetNode(Node);

    }

    public onEnable() {

    }
    public start() {

    }

    public update(dt) {
        gameFlowManager.update(dt);
    }
    public onDisable() {

    }
    public onDestroy() {

        netManager.close();
    }
}

export let app: App = new App();