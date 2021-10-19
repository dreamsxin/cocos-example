import { ItemType } from "../game/data/BagProxy";

export enum DebugMode {
    Dev = 0,
    Test = 1,
    Out = 2
}
export default class SysDef {





    public static DebugMode: DebugMode = DebugMode.Dev;
    public static isNeedRemote: boolean = true;
    public static baseUrl: string = "http://localhost:8080/";
    public static baseAsstesUrl: string = "http://localhost:8080/";
    public static loginUrlDev: string = "http://172.18.0.209:8080/login_auth";
    public static loginUrlTest: string = "http://172.18.0.209:8181/login_auth";
    public static loginUrlOut: string = "http://obsidian2020.asuscomm.com:8181/login_auth";

    public static path: string = '';

    public static styleUrl: string = "texture/ui/style/";
    public static sceneUrl: string = "texture/scene/";
    public static characterUrl: string = "texture/character/";
    public static characterSpineUrl: string = "spines/character/";
    public static dress_iconUrl: string = "texture/dress_icon/";
    public static dress_bgUrl: string = "texture/dress_bg/";
    public static baseBoneUrl: string = "spines/dress/main_role/shadow/shadow";
    public static spineUrl: string = "spines/dress/main_role/";

    public static getLoginUrl() {
        if (this.DebugMode == DebugMode.Dev) {
            return this.loginUrlDev;
        } else if (this.DebugMode == DebugMode.Test) {
            return this.loginUrlTest;
        } else if (this.DebugMode == DebugMode.Out) {
            return this.loginUrlOut;
        }
    }
    //音效
    public static getAudioEffectUrl(resName: string): string {
        return SysDef.path + "audio/effect/" + resName;
    }
    //音乐
    public static getAudioMusicUrl(resName: string): string {
        return SysDef.path + "audio/music/" + resName;
    }
    //数据json
    public static getJsonDataUrl(): string {
        return SysDef.path + "JsonData/staticData";
    }

    //item icon
    public static getItemIcon(data: any): string {
        switch (data.type) {
            case ItemType.Soul:
                return SysDef.path + "texture/retinue_soul/" + data.icon;
            default:
                return SysDef.path + "texture/item_icon/" + (data.icon ? data.icon : data.id);

        }
    }

    //item 背景框
    public static getItemBg(resName: string): string {
        return SysDef.path + "texture/item_icon/zbtj_bj" + resName;
    }

    //随从战斗spine
    public static getRetinueBattleSpineUrl(resName: string): string {
        return SysDef.path + "spines/retinue/battle/" + resName + "/" + resName;
    }

    //随从展示spine
    public static getRetinueDisplaySpineUrl(resName: string): string {
        return SysDef.path + "spines/retinue/display/" + resName + "/" + resName;
    }

    //随从头像
    public static getRetinueIconUrl(resName: string): string {
        return SysDef.path + "texture/retinue_icon/" + resName;
    }
    //Npc头像
    public static getNpcIconUrl(resName: string): string {
        return SysDef.path + "texture/npc_icon/" + resName;
    }
    //随从card
    public static getRetinueCardUrl(resName: string): string {
        return SysDef.path + "texture/retinue_card/" + resName;
    }

    //随从类别
    public static getRetinueTypeUrl(type: number): string {
        return SysDef.path + "texture/retinuebg/type_" + type;
    }

    //随从卡牌背景框
    public static getRetinueCardBgUrl(level: number): string {
        let str = 'jsbj_hui';
        switch (level) {
            case 0:
                str = 'jsbj_hui';
                break;
            case 1:
                str = 'jsbj_lan';
                break;
            case 2:
                str = 'jsbj_zi';
                break;
            case 3:
                str = 'jsbj_cheng';
                break;
        }
        return SysDef.path + "texture/retinuebg/" + str;
    }

    //随从名字背景框
    public static getRetinueNameBgUrl(level: number): string {
        let str = 'mz_lan';
        switch (level) {
            case 0:
                str = 'mz_lan';
                break;
            case 1:
                str = 'mz_lan';
                break;
            case 2:
                str = 'mz_zi';
                break;
            case 3:
                str = 'mz_cheng';
                break;
        }
        return SysDef.path + "texture/itembg/" + str;
    }


    //随从名字颜色
    public static getRetinueNameColor(isEnemy, level = 0) {
        if (isEnemy) {
            return new cc.Color(234, 82, 73, 255);
        } else {
            switch (level) {
                case 0:
                    return new cc.Color(120, 220, 255, 255);
                case 1:
                    return new cc.Color(204, 130, 255, 255);
                case 2:
                    return new cc.Color(255, 162, 53, 255);
                case 3:
                    return new cc.Color(255, 230, 70, 255);
                default:
                    return new cc.Color(255, 230, 70, 255);
            }
        }

    }
    //随从立绘
    public static getRetinuePaintingUrl(str: string): string {
        return SysDef.path + "texture/retinue/" + str;
    }

    //随从碎片
    static getRetinueSoulUrl(resName: string): string {
        return SysDef.path + "texture/retinue_soul/" + resName;
    }
    //随从碎片bg
    static getRetinueSoulBgUrl(resName: string): string {
        return SysDef.path + "texture/retinue_soul/" + resName;
    }
    static getBattleSelfBgUrl(): string {
        return SysDef.path + "texture/retinuebg/zd_tx1";
    }
    static getBattleEnemyBgUrl(): string {
        return SysDef.path + "texture/retinuebg/zd_tx0";
    }
    //随从头像背景框
    public static getRetinueBgUrl(resName: string): string {
        switch (parseInt(resName)) {
            case 1:
                resName = 'txzz_lan';
                break;
            case 2:
                resName = 'txzz_zi';;
                break;
            case 3:
                resName = 'txzz_cs';
                break;
            default:
                resName = 'txzz_ws';
        }
        return SysDef.path + "texture/retinuebg/" + resName;
    }

    //技能icon
    public static getSkillIconUrl(resName: string): string {
        return SysDef.path + "texture/skill_icon/" + resName;
    }

    //技能spine
    public static getSkillEffectUrl(resName: string): string {
        return SysDef.path + "spines/battle_effect/" + resName + '/' + resName;
    }


    //衣服标签icon
    public static getClotheTagIcon(resName: string): string {
        return SysDef.path + "texture/ui/style/" + resName;
    }

    //子弹和特效spine
    public static getEffectUrl(resName: string): string {
        return SysDef.path + "spines/battle_effect/" + resName + '/' + resName;
    }

    public static getCreateRoleUrl(resName: string): string {
        return SysDef.path + "texture/create_role/" + resName;
    }

}

