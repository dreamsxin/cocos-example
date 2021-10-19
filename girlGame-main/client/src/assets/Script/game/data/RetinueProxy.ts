// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import { EventMgr } from "../../base/common/EventManager";
import { netManager, NetManager } from "../../base/network/NetManager";
import { NetNode } from "../../base/network/NetNode";
import SysDef from "../../util/SysDef";
import { utils } from "../../util/Utils";
import NetMsgID from "../netMsg/NetMsgID";
import { dataManager } from "./DataManager";
import { ResourceType } from "./PlayerProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueProxy {


    public static infoUpdate = 'RetinueProxy_infoUpdate';
    private retinueData = null;

    private ownData = [];
    private shopData = [];
    private battleData = [];
    private unBattleData = [];
    npcData: any;


    public ctor() {
        //初始化
        NetNode.subscribe('hero.info', this.updateAllInfos, this);

        this.retinueData = dataManager.allDatas.hero_info;
        this.npcData = dataManager.allDatas.npc_info;

        this.unBattleData = [];
        this.battleData = [];
        this.shopData = [];
        this.ownData = [];

        for (let index in this.retinueData) {
            let data = this.retinueData[index];

            data.star = data.initial_star;
            data.occupation_lv = 1;
            data.own = false;
            data.pos = 0;
            data.power = 0;
            data.step = 0;
            data.exp = 0;

            data.starLevel = this.getColorLevel(data.star);

            data.status = [];

            let propertieData = this.getStatus(data.id, 1);

            for (let index = 0; index < 8; index++) {
                data.status.push(propertieData.properties[index]);
            }

            this.unBattleData.push(data);
            this.shopData.push(this.retinueData[index]);
        }
    }

    public clearData() {

        this.retinueData = null;

        this.unBattleData = [];
        this.battleData = [];
        this.shopData = [];
        this.ownData = [];
    }

    public updateAllInfos(serverData) {
        if (!serverData) {
            return;
        }

        for (let serverInfo of serverData) {
            let data = this.retinueData[serverInfo.hero_id];
            data.level = serverInfo.level;
            data.star = serverInfo.star;
            data.step = serverInfo.step;
            data.occupation_lv = serverInfo.occupation_lv;
            data.pos = serverInfo.pos;
            data.exp = serverInfo.exp;
            data.own = true;
            data.power = serverInfo.power ? serverInfo.power : 0;
            data.skill = serverInfo.skills;

            data.status[0] = serverInfo.attr_base_atk + serverInfo.attr_step_atk + serverInfo.attr_evolution_atk;
            data.status[1] = serverInfo.attr_base_def + serverInfo.attr_step_def + serverInfo.attr_evolution_def;
            data.status[2] = serverInfo.attr_base_hp + serverInfo.attr_step_hp + serverInfo.attr_evolution_hp;
            data.status[3] = serverInfo.attr_base_dex + serverInfo.attr_step_dex + serverInfo.attr_evolution_dex;
            data.status[4] = serverInfo.attr_base_critical + serverInfo.attr_step_critical + serverInfo.attr_evolution_critical;
            data.status[5] = serverInfo.attr_base_sta + serverInfo.attr_step_sta + serverInfo.attr_evolution_sta;
            data.status[6] = serverInfo.attr_base_acc + serverInfo.attr_step_acc + serverInfo.attr_evolution_acc;
            data.status[7] = serverInfo.attr_base_eva + serverInfo.attr_step_eva + serverInfo.attr_evolution_eva;

        }

        this.unBattleData = [];
        this.battleData = [];
        this.shopData = [];
        this.ownData = [];

        for (let index in this.retinueData) {
            let data = this.retinueData[index];
            if (data.own) {
                data.starLevel = this.getColorLevel(data.star);
            }

            if (!this.retinueData[index].own) {
                this.shopData.push(this.retinueData[index]);
            } else {
                this.ownData.push(this.retinueData[index]);

                if (data.pos === 0) {
                    this.unBattleData.push(data);
                } else {
                    this.battleData[data.pos] = data;
                }
            }
        }

        this.battleData.sort((a, b) => a.pos - b.pos);
        this.ownData.sort((a, b) => {
            if (a.pos > 0 && b.pos > 0) {
                return a.pos - b.pos;
            }
            else if (a.pos == 0 && b.pos > 0) {
                return b.pos;
            }
            else if (b.pos == 0 && a.pos > 0) {
                return -a.pos;
            } else {
                if (b.starLevel != a.starLevel) {
                    return b.starLevel - a.starLevel;
                } else {
                    return b.power - a.power;
                }
            }
        });

        this.shopData.sort((a, b) => {
            if (b.starLevel != a.starLevel) {
                return b.starLevel - a.starLevel;
            } else {
                return b.power - a.power;
            }
        });

        EventMgr.raiseEvent(RetinueProxy.infoUpdate);
    }


    private getColorLevel(star: number) {
        if (star % 5 == 0) {
            return Math.floor(star / 5);
        }
        return Math.floor(star / 5) + 1;
    }

    public getShowStarNum(num: number) {

        let level = this.getColorLevel(num);
        return num - (level - 1) * 5;
    }

    public getStatusText(propertiesid: number) {
        return dataManager.GetTextById(propertiesid + 251);
    }

    public getTypeText(type: number) {
        return dataManager.GetTextById(type + 184);
    }

    public getLiveNameText(occupation: number) {
        return dataManager.GetTextById(occupation + 191);
    }

    public getLiveDecText(occupation: number) {
        return dataManager.GetTextById(occupation + 15079);
    }

    public getAllData() {
        return this.retinueData;
    }

    public getUnLockData() {
        return this.ownData;
    }

    public getShopData() {
        return this.shopData;
    }

    public getUnBattleData() {
        return this.unBattleData;
    }

    public getBattleData() {
        return this.battleData;
    }

    public getDataByID(id: number) {
        return this.retinueData[id];
    }

    public getEnemyDataByID(id: number) {
        return this.npcData[id];
    }

    public getDataByPos(pos: number) {
        for (let data of this.battleData) {
            if (data && data.pos === pos) {
                return data;
            }
        }
        return null;
    }

    public bInBattle(id: number) {
        for (let data of this.battleData) {
            if (data && data.id === id) {
                return true;
            }
        }

        return false;
    }


    public getStatus(id: number, lv: number) {
        let hero_properties = dataManager.allDatas.hero_properties;
        for (let index in hero_properties) {

            let data = hero_properties[index];
            if (data.name_id === id && data.level === lv) {
                return data;
            }

        }

        return null;
    }

    public getAllBreakStatus(id: number) {
        let dates = [];
        let hero_step = dataManager.allDatas.hero_step;
        for (let index in hero_step) {

            let data = hero_step[index];
            if (data.role_id === id) {
                dates.push(data);
            }
        }
        return dates;
    }

    public getBreakStatus(id: number, step: number) {
        let hero_step = dataManager.allDatas.hero_step;

        for (let index in hero_step) {

            let data = hero_step[index];
            if (data.role_id === id) {

                if (data.stepnum === step + 1) {

                    return data;
                }
            }
        }

        return null;
    }

    public getStarStatus(id: number, star: number) {
        let hero_evolution = dataManager.allDatas.hero_evolution;
        for (let index in hero_evolution) {

            let data = hero_evolution[index];
            if (data.hero_id === id && data.star_level === star) {
                return data;
            }

        }

        return null;
    }

    /**
     * 
     * @param heroId 随从ID
     * @param state 升级（一键升级）状态：0 升级，1 一键升级
     */
    sendUpCmd(heroId, state) {
        let req = {
            heroId: heroId,
            state: state
        };

        netManager.sendCmd(NetMsgID.NetMsgID_Retinue_Up, req);
    }

    sendBreakCmd(heroId) {
        let req = {
            heroId: heroId
        };

        netManager.sendCmd(NetMsgID.NetMsgID_Retinue_Break, req);
    }

    sendStarCmd(heroId) {
        let req = {
            heroId: heroId
        };

        netManager.sendCmd(NetMsgID.NetMsgID_Retinue_Star, req);
    }

    sendOnBattle(id, pos) {
        let req = {
            heroId: id,
            pos: pos
        };

        netManager.sendCmd(NetMsgID.NetMsgID_Retinue_OnBattle, req);
    }

    sendUpdateBattlePos(req) {
        netManager.sendCmd(NetMsgID.NetMsgID_Retinue_UpdateBattlePos, req);
    }

    /**
     * 是否可以升级
     */
    ableToLevelUp(retinueData) {

        if (retinueData.level < dataManager.playerProxy.data.level && dataManager.allDatas.hero_levelexp[retinueData.level + 1]) {
            return dataManager.bagProxy.getAllExp() > dataManager.allDatas.hero_levelexp[retinueData.level + 1].exp;
        }

        return false;
    }
    /**
     * 是否可以突破
     */
    ableToBreak(retinueData) {
        //等级够不够
        let dataCur = dataManager.retinueProxy.getBreakStatus(retinueData.id, retinueData.step);
        if (retinueData.level < dataCur.need_level) {
            return false;
        }
        //钱够不够
        let index = dataCur.costitemid.indexOf(ResourceType.Silver);
        let silverData = dataManager.bagProxy.getItem(ResourceType.Silver);

        if (dataCur.costitemnum[index] > silverData.num) {
            return false;
        }
        //道具够不够
        for (let i = 0; i < dataCur.costitemid.length; i++) {
            let itemId = dataCur.costitemid[i];
            let itemNum = dataCur.costitemnum[i];
            if (itemId <= ResourceType.Exp) {
                continue;
            }
            let itemData = dataManager.bagProxy.getItem(itemId);
            if (itemNum > itemData.count) {
                return false;
            }
        }

        return true;
    }
    /**
     * 是否可以升星
     */
    ableToStarAdd(retinueData) {

        //道具够不够
        let dataCur = dataManager.retinueProxy.getStarStatus(retinueData.id, retinueData.star);
        let itemData = dataManager.bagProxy.getItem(retinueData.hero_debris_id);

        if (dataCur.debris_num > itemData.count) {
            return false;
        }
        //等级够不够
        if (retinueData.step < dataCur.need_step) {
            return false;
        }
        return true;
    }
}


