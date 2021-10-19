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
import { NetNode } from "../../base/network/NetNode";
import SysDef from "../../util/SysDef";
import { utils } from "../../util/Utils";
import { dataManager } from "./DataManager";
import { ResourceType } from "./PlayerProxy";

const { ccclass, property } = cc._decorator;
/**
 * 1.资源类
2.道具类
3.装备类
4.锦魂碎片类
5.宝石类
6.素材类
7.锦魂类
8.模拟经营类
 */
export enum ItemType {
    Resource = 1,
    Item,
    Equipment,
    Soul,
    Jewel,
    RetinueStuff,
    Retinue,
    Workshop
}



@ccclass
export default class BagProxy {

    public static infoUpdate = 'BagProxy_infoUpdate';

    private cfgData = null;
    private itemMap = new Map();

    public ctor() {

        this.cfgData = dataManager.allDatas.item;

        NetNode.subscribe('item.info', this.onItemList, this);

        for (let index in this.cfgData) {

            let data = this.cfgData[index];
            /**
             * count 数量
             */
            data.count = 0;
            this.itemMap.set(data.id, data);

        }
    }

    public clearData() {

        this.cfgData = null;
        this.itemMap = null;
    }

    onItemList(serverInfo) {

        if (!serverInfo) {
            return;
        }
        for (let data of serverInfo) {
            let cfgData = this.itemMap.get(data.id);
            if (cfgData) {
                cfgData.count = data.count;
            }
        }

        EventMgr.raiseEvent(BagProxy.infoUpdate);
    }

    public getAllItems() {
        return this.itemMap;
    }

    public getAllItemsByType(type: ItemType, type_detail: number = undefined, showZero = false) {
        let k = [];
        this.itemMap.forEach((data, index) => {
            if (data.type === type) {
                if (type_detail != undefined) {
                    if (data.type_detail === type_detail) {
                        if (!showZero && data.count === 0) {

                        } else {
                            k.push(data);
                        }

                    }

                } else {
                    if (!showZero && data.count === 0) {

                    } else {
                        k.push(data);
                    }
                }
            }
        })
        return k;
    }

    public getItem(itemId: number) {
        return this.itemMap.get(itemId);
    }

    public getItemName(itemId: number) {
        return dataManager.GetTextById(this.itemMap.get(itemId).name_id);
    }


    getItemIcon(item: any): string {
        if (!item) {
            return '';
        }

        return SysDef.getItemIcon(item);
    }

    getAllExp() {
        let items = this.getAllItemsByType(ItemType.Item, 1);
        let exp = 0;
        if (items) {
            items.forEach(element => {
                exp += element.count * element.num;
            })
        }

        return exp;
    }
}

export let bagProxy: BagProxy = new BagProxy();
