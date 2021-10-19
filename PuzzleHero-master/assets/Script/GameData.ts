import HeroData from "./Mod/HeroData";
import DataBase from "./Lib/DataBase";
import Utility from "./Lib/Utility";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameData extends DataBase {

    CharacterConfig: HeroData[] = []

    UrlConfig: any

    BoxConfig: any

    TeachConfig: any

    TaskConfig: any[] = []

    LevelExpConfig: any[] = []

    ADConfig: any[] = []

    MineConfig: any[] = []

    BaseShopConfig: any[] = []

    RankConfig: any[] = []

    AchieveConfig: any[] = []

    NameConfig: any[] = []

    BasementConfig: any[] = []

    BattlegroundConfig: any[] = []

    TipsConfig: any[] = []

    TeachConfig2: any[] = []



    public static Share: GameData = null



    start() {
        GameData.Share = this
    }

    getRandomTips() {
        return this.TipsConfig[0].tips[Utility.GetRandom(0, this.TipsConfig[0].tips.length - 1)]
    }

    getHeroDataById(id: number) {
        for (let i = 0; i < this.CharacterConfig.length; i++) {
            if (this.CharacterConfig[i].id == id) {
                return this.CharacterConfig[i]
            }
        }
    }

    getHeroRDataByType(type: number, qa?: number) {
        let herodata: HeroData[] = []
        for (let i = 0; i < this.CharacterConfig.length; i++) {
            if (qa != null && qa < this.CharacterConfig[i].quality) {
                continue
            }
            if (this.CharacterConfig[i].type == type) {
                herodata.push(this.CharacterConfig[i])
            }
        }
        return herodata[Utility.GetRandom(0, herodata.length - 1)]
    }

    getHeroDataByTypeSB(type: number, sb: number) {
        let herodata: HeroData = new HeroData()
        for (let i = 0; i < this.CharacterConfig.length; i++) {
            if (this.CharacterConfig[i].sb == sb && this.CharacterConfig[i].type == type) {
                herodata = this.CharacterConfig[i]
                break
            }
        }
        return herodata
    }

    getHDataByTQ(type: number, qa: number) {
        let herodata: HeroData = new HeroData()

        let hArr: HeroData[] = []
        for (let i = 0; i < this.CharacterConfig.length; i++) {
            if (this.CharacterConfig[i].quality == qa && this.CharacterConfig[i].type == type) {
                hArr.push(this.CharacterConfig[i])
            }
        }
        return hArr[Math.floor(Math.random() * hArr.length)]
    }

    getBattleGroundByGrade(g: number) {
        g = g < 0 ? 0 : g
        for (let i = 1; i < this.BattlegroundConfig.length; i++) {
            if (this.BattlegroundConfig[i].gid == g - 1) {
                return this.BattlegroundConfig[i]
            }
        }
    }
    getChestDrop(g: number) {
        let randNum: number = Utility.GetRandom(1, 100)
        let bg: any = this.getBattleGroundByGrade(g)
        let cd: any[] = bg.chestDrop
        for (let i = 0; i < cd.length; i++) {
            if (randNum <= cd[i].max) {
                return cd[i].id
            }
        }
    }

    getBasementConfig(lv: number) {
        for (let i = 0; i < this.BasementConfig.length; i++) {
            if (parseInt(this.BasementConfig[i].lv) == lv) {
                return this.BasementConfig[i]
            }
        }

        return this.BasementConfig[this.BasementConfig.length - 1]
    }

    getRandomName() {
        let name: string = ''
        let first: any[] = this.NameConfig[0].first
        let last: any[] = this.NameConfig[0].last
        name = first[Utility.GetRandom(0, first.length - 1, true)]
        name += last[Utility.GetRandom(0, last.length - 1, true)]
        return name
    }

    getSkillByTypeAndST(type: number, st: number) {
        for (let i = 0; i < this.CharacterConfig.length; i++) {
            if (this.CharacterConfig[i].type == type && this.CharacterConfig[i].sb == st) {
                return this.CharacterConfig[i]
            }
        }
    }

    getAchieveConfigById(id: number) {
        if (id >= this.AchieveConfig.length) {
            id = this.AchieveConfig.length - 1
        }
        return this.AchieveConfig[id]
    }

    getRankConfigByScore(s: number) {
        for (let i = 0; i < this.RankConfig.length; i++) {
            if (s < this.RankConfig[i].max) {
                return this.RankConfig[i]
            }
        }
    }

    getBaseShopById(id: number) {
        if (id >= this.BaseShopConfig.length) id = this.BaseShopConfig.length - 1
        return this.BaseShopConfig[id]
    }

    getMineConfigByLv(lv: number) {
        if (lv >= this.MineConfig.length) lv = this.MineConfig.length - 1
        return this.MineConfig[lv]
    }

    getAdUnitIdByChannel(channel) {
        return this.ADConfig[channel];
    }

    getLvlExpData(lvl: number, quality: number) {
        for (let i = 0; i < this.LevelExpConfig.length; i++) {
            if (lvl == this.LevelExpConfig[i].level && quality == this.LevelExpConfig[i].quality) {
                return this.LevelExpConfig[i];
            }
        }
        return this.LevelExpConfig[this.LevelExpConfig.length - 1]
    }

    getTaskById(id: number) {
        for (let i = 0; i < this.TaskConfig.length; i++) {
            if (this.TaskConfig[i].id == id) {
                return this.TaskConfig[i]
            }
        }
    }

    getThreeTask() {
        let arr: number[] = [];
        for (var i = 0; i < this.TaskConfig.length; i++) {
            arr.push(i);
        }
        arr = Utility.shuffleArr(arr);
        let taskArr: any[] = [];
        for (var i = 0; i < 3; i++) {
            let index: number = arr[i];
            let data = {
                id: this.TaskConfig[index].id,
                count: 0,
                upCount: Utility.GetRandom(this.TaskConfig[index].min, this.TaskConfig[index].max),
                get: false
            };
            taskArr.push(data);
        }
        return taskArr;
    }

    getOneTask(curArr: number[]) {
        let arr: number[] = [];
        for (var i = 0; i < this.TaskConfig.length; i++) {
            arr.push(i);
        }
        arr = Utility.shuffleArr(arr);

        for (var i = 0; i < arr.length; i++) {
            let e: boolean = false;
            for (var j = 0; j < curArr.length; j++) {
                if (arr[i] == curArr[j]) {
                    e = true;
                    break;
                }
            }
            if (!e) {
                return this.getTaskById(arr[i]);
            }
        }
    }
}
