import { sys } from "cc";
import { CharacterInfo } from "./characterInfo";
import { GameType } from "./enumerator";
import SystemSetting from "./systemSetting";

let key_systemSetting = "systemSetting"
let key_localUserInfo = "local_userInfo"
let key_gameSetting = "game_setting_"

export default class LocalDataResolver {

    public get systemSetting(): SystemSetting {
        return this.loadItem<SystemSetting>(key_systemSetting)
    }

    public set systemSetting(value: SystemSetting) {
        this.saveItem(key_systemSetting, value)
    }

    public get localUserInfo(): CharacterInfo {
        return this.loadItem<CharacterInfo>(key_localUserInfo)
    }

    public set localUserInfo(value: CharacterInfo) {
        this.saveItem(key_localUserInfo, value)
    }

    public getGameSetting<T>(type: GameType): T {
        return this.loadItem<T>(key_gameSetting + type)
    }

    public setGameSetting<T>(type: GameType, value: T) {
        this.saveItem(key_gameSetting + type, value)
    }

    public clearAllStorage() {
        sys.localStorage.clear()
    }

    private saveItem(key: string, value: any) {
        sys.localStorage.setItem(key, JSON.stringify(value))
    }

    private loadItem<T>(key: string): T {
        let ret: string = sys.localStorage.getItem(key)
        if (ret == null) {
            return null
        }
        return JSON.parse(ret)
    }
}