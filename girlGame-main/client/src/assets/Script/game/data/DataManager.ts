import { resLoader } from "../../base/res/ResLoader";
import SysDef from "../../util/SysDef";
import { gameFlowManager } from "../flow/GameFlowManager";
import BagProxy from "./BagProxy";
import PlayerProxy from "./PlayerProxy";
import SkillProxy from "./SkillProxy";
import RetinueProxy from "./RetinueProxy";
import BattleRetinueProxy from "./BattleRetinueProxy";
import { utils } from "../../util/Utils";
import StoryProxy from "./StoryProxy";
import ClotheProxy from "./ClotheProxy";
import SystemProxy from "./SystemProxy";
import BuyCardProxy from "./BuyCardProxy";
import WorkshopProxy from "./WorkshopProxy";


export default class DataManager {
    public allDatas = null;
    public playerProxy: PlayerProxy = null;
    public skillProxy: SkillProxy = null;
    public bagProxy: BagProxy = null;
    public retinueProxy: RetinueProxy = null;
    public battleRetinueProxy: BattleRetinueProxy = null;
    public storyProxy: StoryProxy = null;
    public clotheProxy: ClotheProxy = null;
    public systemProxy: SystemProxy = null;
    public buyCardProxy: BuyCardProxy = null;
    public workshopProxy: WorkshopProxy = null;



    private allProxy = [];


    private static instance: DataManager = null;
    public static getInstance(): DataManager {
        if (!this.instance) {
            this.instance = new DataManager();
        }
        return this.instance;
    }

    public onload() {

        this.initProxy();

        let self = this;
        resLoader.loadRes(SysDef.getJsonDataUrl(), cc.JsonAsset, (error, res) => {
            if (error != null) {
                return;
            }
            self.allDatas = res.json;
            utils.eachBean(this.allProxy, 'ctor', null);
            gameFlowManager.resLoadingFlow.waitStaus = true;
        });

    }

    initProxy() {
        this.playerProxy = new PlayerProxy();
        this.skillProxy = new SkillProxy();
        this.bagProxy = new BagProxy();
        this.retinueProxy = new RetinueProxy();
        this.battleRetinueProxy = new BattleRetinueProxy();
        this.storyProxy = new StoryProxy();
        this.clotheProxy = new ClotheProxy();
        this.systemProxy = new SystemProxy();
        this.buyCardProxy = new BuyCardProxy();
        this.workshopProxy = new WorkshopProxy();




        this.allProxy.push(this.playerProxy);
        this.allProxy.push(this.skillProxy);
        this.allProxy.push(this.bagProxy);
        this.allProxy.push(this.retinueProxy);
        this.allProxy.push(this.battleRetinueProxy);
        this.allProxy.push(this.storyProxy);
        this.allProxy.push(this.clotheProxy);
        this.allProxy.push(this.systemProxy);
        this.allProxy.push(this.buyCardProxy);
        this.allProxy.push(this.workshopProxy);


    }

    clearData() {
        //释放
        utils.eachBean(this.allProxy, 'clearData', null);

        this.allDatas = null;
        this.allProxy = [];
    }

    public GetTextById(id: number, ...arg: {}[]) {
        if (!this.allDatas)
            return id + '';
        if (this.allDatas.text[id]) {

            if (arg.length > 0 && (typeof arg[0] != 'object')) {
                return utils.stringFormat(this.allDatas.text[id].text_cn, ...arg);
            } else if (arg.length === 1) {
                return utils.stringFormatObject(this.allDatas.text[id].text_cn, arg[0]);
            }
            return this.allDatas.text[id].text_cn;
        } else {
            return id + '';
        }
    }

    GetChineseTextByNum(num: number) {
        if (num === 0) {
            return this.GetTextById(375);
        }
        else if (num > 0 && num <= 10) {
            return this.GetTextById(360 + num);
        }
        else if (num > 10 && num < 100) {
            return this.GetTextById(370) + this.GetChineseTextByNum(num % 10);
        }
        else if (num >= 100 && num < 1000) {
            return this.GetChineseTextByNum(Math.floor(num / 100)) + this.GetTextById(371) + this.GetChineseTextByNum(num % 100);
        }
        else if (num >= 1000 && num < 10000) {
            return this.GetChineseTextByNum(Math.floor(num / 1000)) + this.GetTextById(372) + this.GetChineseTextByNum(num % 1000);
        }
        else if (num >= 10000 && num < 100000000) {
            return this.GetChineseTextByNum(Math.floor(num / 10000)) + this.GetTextById(373) + this.GetChineseTextByNum(num % 10000);
        }
        else if (num >= 100000000) {
            return this.GetChineseTextByNum(Math.floor(num / 100000000)) + this.GetTextById(374) + this.GetChineseTextByNum(num % 100000000);
        }
    }


    public getRetinueStatus(type) {
        return this.GetTextById(252 + type);
    }


    public getEffectSpineUrlByBuffId(id: number) {
        let data = this.allDatas.skill_effect[id];
        if (data) {
            return this.getEffectSpineUrl(data.effectId);
        } else {
            return null;
        }

    }

    public getEffectSpineUrl(id: number) {
        if (this.allDatas.effect[id]) {
            return this.allDatas.effect[id].pic_name;
        } else {
            return null;
        }

    }

    public getHeroData() {
        return this.allDatas.hero_info;
    }
    public getNpcData() {
        return this.allDatas.npc_info;
    }
    public getNameData() {
        return this.allDatas.name;
    }
    public getCreateRoleData() {
        return this.allDatas.create_role;
    }
    public getRetinueSpineData() {
        return this.allDatas.retinue_spine;
    }
    public getSpineData() {
        return this.allDatas.spine;
    }
    public getAccessorieFirstTypeData() {
        return this.allDatas.accessorie_first_type;
    }
    public getAccessorieSecondTypeData() {
        return this.allDatas.accessorie_second_type;
    }
    public getAccessorieData() {
        return this.allDatas.accessorie;
    }
    public getAccessorieBgData() {
        return this.allDatas.accessorie_bg;
    }
    public getAccessorieStyleData() {
        return this.allDatas.accessorie_style;
    }
    public getAccessorieTagData() {
        return this.allDatas.accessorie_tag;
    }
    public getConfigData() {
        return this.allDatas.config;
    }
    public getAudioData() {
        return this.allDatas.audio;
    }
    public getSceneData() {
        return this.allDatas.scene;
    }
    public getSpeakerData() {
        return this.allDatas.speaker;
    }
    public getCounterData() {
        return this.allDatas.counter;
    }
    public getOrderTaskData() {
        return this.allDatas.order_task;
    }
    public getMainRoleLevelData() {
        return this.allDatas.mainrole_level;
    }
    public getDropPkgData() {
        return this.allDatas.drop_packet;
    }
}
export let dataManager: DataManager = DataManager.getInstance();

