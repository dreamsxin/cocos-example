// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventManager, EventMgr } from "../../base/common/EventManager";
import { netManager, NetManager } from "../../base/network/NetManager";
import { NetNode } from "../../base/network/NetNode";
import { uiManager } from "../../base/ui/UIManager";
import { utils } from "../../util/Utils";
import { Account } from "../netMsg/Account";
import { ErrorCode } from "../netMsg/ErrorCode";
import NetMsgID from "../netMsg/NetMsgID";
import { UIID } from "../ui/UIConfig";
import CreateRoleView from "../ui/uiView/CreateRoleView";
import LoginView from "../ui/uiView/LoginView";
import { dataManager } from "./DataManager";

const { ccclass, property } = cc._decorator;

export class ClothData {
    clothId: number = 0;
    isChecked: boolean = false;
}
export class PlotData {
    chapterId: number = 1;
    sectionId: number = 1;
}
/**
 * 发型hair
妆容makeup
上装topClothe
下装bottomClothe
上下套fullClothe
头饰headwear
颈饰neckwear
耳饰ear
挂饰hang
手饰handwear
手持handheld
袜子sock
鞋子shoe
 */
export class ClotheData {

    hair: number = 0;
    makeup: number = 0;
    topClothe: number = 0;
    bottomClothe: number = 0;
    fullClothe: number = 0;
    headwear: number = 0;
    neckwear: number = 0;
    ear: number = 0;
    hang: number = 0;
    handwear: number = 0;
    handheld: number = 0;
    sock: number = 0;
    shoe: number = 0;

    /**
     * 转换number[]
     */
    update(curClothe: number[]) {
        if (curClothe && curClothe.length > 0) {
            for (let num of curClothe) {
                if (num != 0) {
                    let data = dataManager.getAccessorieData()[num];
                    switch (data.first_type) {
                        case 1:
                            this.hair = data.id;
                            break;
                        case 2:
                            this.makeup = data.id;
                            break;
                        case 3:
                            switch (data.second_type) {
                                case 1:
                                    this.topClothe = data.id;
                                    break;
                                case 2:
                                    this.bottomClothe = data.id;
                                    break;
                                case 3:
                                    this.fullClothe = data.id;
                                    break;
                            }
                            break;
                        case 4:
                            switch (data.second_type) {
                                case 4:
                                    this.headwear = data.id;
                                    break;
                                case 5:
                                    this.neckwear = data.id;
                                    break;
                                case 6:
                                    this.ear = data.id;
                                    break;
                                case 7:
                                    this.hang = data.id;
                                    break;
                                case 8:
                                    this.handwear = data.id;
                                    break;
                                case 9:
                                    this.handheld = data.id;
                                    break;
                            }
                            break;

                        case 5:
                            this.sock = data.id;
                            break;
                        case 6:
                            this.shoe = data.id;
                            break;
                    }
                }
            }
        }
    }

    /**
     * 检测是否可以保存
     */
    checkTip() {
        if (this.makeup === 0) {
            utils.showTips(dataManager.GetTextById(20010000));
            return false;
        }

        else if (this.topClothe === 0 && this.bottomClothe === 0 && this.fullClothe === 0) {
            utils.showTips(dataManager.GetTextById(20011000));
            return false;
        }

        else if (this.topClothe !== 0 && this.bottomClothe === 0 && this.fullClothe === 0) {
            utils.showTips(dataManager.GetTextById(20011000));
            return false;
        }

        else if (this.topClothe === 0 && this.bottomClothe !== 0 && this.fullClothe === 0) {
            utils.showTips(dataManager.GetTextById(20011000));
            return false;
        }

        return true;
    }
}


@ccclass
export default class ClotheProxy {

    public static wardrobes: string = "ClotheProxy_wardrobes";
    public static clothesWear: string = "ClotheProxy_clothesWear";
    public static clothesPKresult: string = "ClotheProxy_clothesPKresult";

    /**穿着的衣服*/
    private _clothesWear: number[] = [];
    /**拥有的衣服*/
    private _clotheMap = new Map();
    /**所有配置衣服*/
    public cfgClothes: any[] = [];

    /**
   * 酷装评分结果
   */
    clothePKResult: any;
    /**
   * 衣架数据
   */
    bagData: any[];


    ctor() {
        NetNode.subscribe('clothes.info', this.PlayerSetBasicClothResponse, this);
        NetNode.subscribe('wardrobes.info', this.initData, this);
        NetNode.subscribe('quest.result', this.resultBack, this);

        this.cfgClothes = dataManager.allDatas.accessorie;
    }

    clearData() {
        this.cfgClothes = null;
    }

    set clothesWear(data) {
        if (data) {
            this._clothesWear = [];
            for (let index in data) {
                this._clothesWear.push(data[index]);
            }
        }

    }

    get clothesWear() {
        return this._clothesWear;
    }

    get clotheMap() {
        return this._clotheMap;
    }

    private resultBack(serverData) {
        this.clothePKResult = serverData;
        EventMgr.raiseEvent(ClotheProxy.clothesPKresult);
    }

    changeSectionClothCmd(questid, clothes) {
        let req = {
            questId: questid,
            clothes: clothes
        }
        netManager.sendCmd(NetMsgID.NetMsgID_Clothe_Section, req);
    }

    changeClothCmd(req) {
        netManager.sendCmd(NetMsgID.NetMsgID_SetBaseCloth, req);
    }

    getStyleText(type) {
        return dataManager.GetTextById(dataManager.getAccessorieStyleData()[type].name_id);
    }

    private PlayerSetBasicClothResponse(serverData) {
        this.clothesWear = serverData;
        EventMgr.raiseEvent(ClotheProxy.clothesWear);
    }

    private initData(serverData) {
        serverData.forEach(element => {
            this._clotheMap.set(element.id, element.count);
        });

        this.bagData = this.getClothTypeData();

        EventMgr.raiseEvent(ClotheProxy.wardrobes);
    }


    public getClothTypeData() {
        let playerCloth = this.clotheMap;
        let arr = new Array();
        let cfg = dataManager.getAccessorieData();
        let firstCfg = dataManager.getAccessorieFirstTypeData();

        for (let bigType in firstCfg) {

            let arr1 = new Array();

            let fdata = firstCfg[bigType];

            if (fdata.second_type_ids) {
                for (let j = 0; j < fdata.second_type_ids.length; j++) {
                    let arr2 = new Array();
                    playerCloth.forEach((index, id, count) => {
                        let clothData = cfg[id];
                        if (clothData && clothData.second_type == fdata.second_type_ids[j]) {
                            arr2.push(id);
                        } else if (!clothData) {
                            console.error('server wrong clothe id = ' + id);
                        }
                    });
                    arr1.push(arr2);
                }

            } else {
                let arr2 = new Array();
                playerCloth.forEach((index, id, count) => {
                    let clothData = cfg[id];
                    if (clothData && clothData.first_type == fdata.id) {
                        arr2.push(id);
                    } else if (!clothData) {
                        console.error('server wrong clothe id = ' + id);
                    }
                });

                arr1.push(arr2);
            }
            arr.push(arr1);
        }

        return arr;

    }

    getClothStyleLvStr(num) {
        let cfg = dataManager.allDatas.config;

        let str = ['a_level_fashion', 'b_level_fashion', 's_level_fashion', 'ss_level_fashion', 'sss_level_fashion'];

        for (let k = 0; k <= 5; k++) {
            if (cfg[str[k]] && num >= cfg[str[k]][0] && num <= cfg[str[k]][1]) {
                switch (k) {
                    case 0:
                        return dataManager.GetTextById(160);
                    case 1:
                        return dataManager.GetTextById(159);
                    case 2:
                        return dataManager.GetTextById(387);
                    case 3:
                        return dataManager.GetTextById(158);
                    case 4:
                        return dataManager.GetTextById(388);
                }
            }
        }

        return '';
    }


    getClothData(id) {
        return dataManager.getAccessorieData()[id];
    }

    getClotheNum(id) {
        if (this._clotheMap.has(id)) {
            return this._clotheMap.get(id);
        }
        return 0;
    }

    /**
     *  是否已拥有
     * @param id
     */
    bOwn(id) {
        return this.getClotheNum(id) > 0;
    }

    /**
     *  是否已穿戴
     * @param id
     * @param arr  默认为玩家身上已保存的数据
     */
    bWearing(id, arr = null) {
        if (!arr) {
            arr = this._clothesWear;
        }
        if (arr.length > 0) {
            for (let num of arr) {
                if (id === num) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 
     * @param clothId 单个衣服id
     * @param clothArr 要改变的衣服数组
     * @param bTurnOff 是否允许脱下
     */
    updateClotheData(clothId: number, clothArr: number[], bTurnOff = true) {
        if (!clothArr) {
            return;
        }
        if (clothArr.length == 0) {
            clothArr.push(clothId);
            return;
        }


        let acceData = dataManager.getAccessorieData();

        //是否已穿，如果是就脱下
        for (let i = 0; i < clothArr.length; i++) {
            if (clothId == clothArr[i]) {

                let clothData = acceData[clothId];
                if (clothData.first_type === 2) {
                    utils.showTips(dataManager.GetTextById(20010000));
                    return;
                }
                //脱下
                if (bTurnOff) {
                    clothArr.splice(i, 1);
                }
                return;
            }
        }
        //新衣服，先脱下应该脱下的衣服
        let clothData = acceData[clothId];

        for (let i = 0; i < clothArr.length;) {


            let tempData = acceData[clothArr[i]];
            if (tempData && tempData.first_type == clothData.first_type /*&& tempData.second_type == clothData.second_type*/) {
                //对衣服特殊处理
                if (tempData.first_type === 3) {
                    if (tempData.second_type === 3) {
                        //新衣服是上下套，脱掉所有衣服
                        clothArr.splice(i, 1);
                        i--;
                    } else {
                        //新衣服不是上下套，脱掉上下套
                        if (clothData.second_type === 3) {
                            clothArr.splice(i, 1);
                            i--;
                        }
                        //新衣服不是上下套，脱掉同部位的
                        else if (clothData.second_type === tempData.second_type) {
                            clothArr.splice(i, 1);
                            i--;
                        }
                    }
                } else if (tempData.second_type == clothData.second_type) {
                    //非衣服最多脱下一件即可
                    clothArr.splice(i, 1);
                    break;
                }
            }
            i++;
        }
        //插入新衣服
        clothArr.push(clothId);
    }



    getClotheFirstType() {
        let cfg = dataManager.getAccessorieFirstTypeData();
        let k = [];
        for (let bigType in cfg) {
            let data = cfg[bigType];
            if (bigType != '7') {
                k.push(data);
            }
        }

        return k;
    }
}
