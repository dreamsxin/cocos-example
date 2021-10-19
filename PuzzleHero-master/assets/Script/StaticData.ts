import Utility from "./Lib/Utility";
import PlayerData from "./Mod/PlayerData";
import GameData from "./GameData";
import HeroData from "./Mod/HeroData";

let p = cc.v2

export default class StaticData {
    public static MaxRow: number = 5

    public static GameOver: boolean = false

    public static MatsSize: number = StaticData.MaxRow * StaticData.MaxRow

    public static BaseShape: Array<Array<cc.Vec2>> = [
        [p(0, 0), p(1, 0), p(2, 0)],//-
        [p(0, 0), p(0, 1), p(0, 2)],//|
        [p(0, 0), p(1, 1), p(2, 2)],//\
        [p(0, 0), p(0, 1), p(0, 2)],//L
        [p(0, 0), p(1, 0), p(1, 1)],//T
    ]

    public static Invited: boolean = false

    public static BaseTypes: number[] = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 1]

    public static Dirs: cc.Vec2[] = [cc.v2(-1, -1), cc.v2(0, -1), cc.v2(1, -1), cc.v2(1, 0), cc.v2(1, 1), cc.v2(0, 1), cc.v2(-1, 1), cc.v2(-1, 0)]

    public static BlockSpacing: number = 25

    // public static testMats = [4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4]

    public static testMats = [1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1]
    // public static testMats = [2, 2, 2, 2, 2,
    //     2, 2, 2, 2, 2,
    //     2, 2, 2, 2, 2,
    //     2, 2, 2, 2, 2,
    //     2, 2, 2, 2, 2]
    // public static testMats = [3, 3, 3, 3, 3,
    //         3, 3, 3, 3, 3,
    //         3, 3, 3, 3, 3,
    //         3, 3, 3, 3, 3,
    //         3, 3, 3, 3, 3]

    // public static testMats = [2, 4, 1, 2, 2,
    //     3, 3, 3, 3, 3,
    //     3, 3, 3, 2, 1,
    //     3, 2, 3, 1, 3,
    //     3, 3, 2, 3, 3]


    // public static testMats =
    //     [1, 2, 1, 2, 1,
    //         3, 4, 3, 4, 3,
    //         1, 2, 1, 2, 1,
    //         3, 4, 3, 4, 3,
    //         1, 2, 1, 2, 1]

    public static PlayerInfo: PlayerData = null

    public static Teaching: boolean = true

    public static Teached: boolean = false

    public static StageLevel: number = 1

    public static GameStart: boolean = false

    public static LevelProtected: boolean = false

    public static HadShowBoard: boolean = false

    public static IsGiveUp: boolean = false

    public static FMShowCount: number = 0

    public static FMHadCancel: boolean = false

    public static AIHeroData: HeroData[] = []

    public static isWin: boolean = true

    public static startFromArena: boolean = false

    public static AILimit: boolean = false

    public static startWithFavorite: boolean = false

    public static otherUserInfo: any = null

    public static startFromShareGame: any = false

    public static tempRoomid: string = ''

    public static getAIData(pvpData?: any) {
        let herodata: HeroData[] = StaticData.PlayerInfo.heros.filter(hero => {
            return hero.use == true
        })
        herodata = herodata.sort((n1, n2) => {
            return n1.type - n2.type
        })

        let hdata: HeroData[] = []

        herodata.forEach((hd) => {
            hdata.push(JSON.parse(JSON.stringify(hd)))
        })

        let pInfo: any = StaticData.PlayerInfo
        let arenaData: any = pInfo.arenaData
        let heroAtkArr: any[] = [].concat(arenaData.heroAtkArr)
        heroAtkArr = Utility.shuffleArr(heroAtkArr)

        hdata.forEach(hd => {
            let pInfo: any = StaticData.PlayerInfo
            let sLv: number = pInfo.baseField.level
            let bgConfig: any = GameData.Share.getBattleGroundByGrade(StaticData.StageLevel)//GameData.Share.getBasementConfig(sLv)
            let qArr: any[] = bgConfig.enmeyQ

            let q = hd.quality
            q = qArr[Utility.GetRandom(0, qArr.length - 1)]

            let t = hd.type
            let selflevel = hd.level

            let nherodata: HeroData = null
            if (pvpData) {
                if (StaticData.startFromArena) {
                    nherodata = GameData.Share.getHeroDataById(pvpData.arenaData.currentArr[hdata.indexOf(hd)])
                } else {
                    nherodata = GameData.Share.getHeroDataById(pvpData.heros[hdata.indexOf(hd)].id)
                }

            } else {
                nherodata = GameData.Share.getHDataByTQ(t, q)
            }
            //  else {
            //     q = Utility.GetRandom(0, 3)
            // }

            //nherodata = GameData.Share.getHDataByTQ(t, q)

            hd.id = nherodata.id
            hd.name = nherodata.name
            hd.quality = nherodata.quality
            hd.sb = nherodata.sb

            let aArr: any[] = bgConfig.enemyAtk
            hd.atk += aArr[Utility.GetRandom(0, aArr.length - 1)]
            hd.atk = hd.atk < 1 ? 1 : hd.atk
            if (StaticData.startFromArena) {
                hd.atk = heroAtkArr[hdata.indexOf(hd)]
            }
        })
        //return hdata
        this.AIHeroData = hdata
    }
}