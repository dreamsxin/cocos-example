import GameFlow from "./GameFlow";
import {dataManager} from "../data/DataManager";

export default class ResLoadingFlow extends GameFlow{
    public EnterFlow()
    {
        var self = this;
        dataManager.onload();
    }

    public WaitFlow()
    {
        return this.waitStaus;
    }

}