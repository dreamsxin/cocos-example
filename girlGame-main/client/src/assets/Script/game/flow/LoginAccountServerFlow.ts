import GameFlow from "./GameFlow";
import {uiManager} from "../../base/ui/UIManager";
import {UIID, UILEVEL} from "../ui/UIConfig";

export default class LoginAccountServerFlow extends GameFlow{
    public EnterFlow()
    {
        uiManager.open(UIID.UITips);
        uiManager.open(UIID.UILogin);
    }

    public WaitFlow()
    {
        return this.waitStaus;
    }

}