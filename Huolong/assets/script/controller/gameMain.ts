import { assetManager, AudioClip, AudioSource, error, log, warn } from "cc"
import { GameType, ImageType, PlayerSeatPosition, PlayerSeatRelation, SystemEventType } from "../core/enumerator"
import IUserAccess from "../core/i_userAccess"
import UA_Base from "../core/ua_base"
import { MainScene } from "../view/mainScene"
import CI_Base from "./interface/ci_base"
import Ctrl_Huolong from "./huolong/ctrl_huolong"
import VI_Base from "./interface/vi_base"
import PlayerVector_Huolong from "./huolong/playerVector_huolong"
import PlayerItem_Huolong_AI from "./huolong/playerItem_huolong_ai"
import PII_Base from "./interface/pii_base"
import PII_Huolong from "./interface/pii_huolong"
import { CharacterInfo, CharacterInfoAI } from "../core/characterInfo"
import SystemSetting from "../core/systemSetting"
import LocalDataResolver from "../core/localDataResolver"
import EventManager from "../utility/eventManager"
import HuolongGameSetting from "../core/huolong_gameSetting"
import pokerHelper from "../core/pokerHelper"

class DebugSet {
    debug: boolean
    hideCopyrightElements: boolean
    forceClearStorage: boolean
}

class PlayerState {
    online: boolean
    gameType: GameType
    seat: number
}

class AudioSet {
    id: string
    type: ImageType
    audioUrl: string
    audioId: number
}

module GameMain {
    let scene: MainScene = null
    let localUA: IUserAccess = null
    let localDataResolver: LocalDataResolver = null
    let eventManager: EventManager = null

    let music_audioSource: AudioSource = null
    let sound_audioSource: AudioSource = null
    let playingMusic: string | number = null

    let debugSetting: DebugSet = null

    let initial_systemSetting: SystemSetting
    let initial_localUserInfo: CharacterInfo
    let initial_gameSetting_huolong: HuolongGameSetting

    let systemSetting: SystemSetting
    let localUserInfo: CharacterInfo
    let localUserState: PlayerState

    let lastSavedGameSetting_huolong: HuolongGameSetting

    let view_gametype: VI_Base = null
    let ctrl_gametype: CI_Base = null

    let audio_list: Map<string, AudioSet> = null

    let ai_characterList: number[] = []
    let ai_charactersMap: Map<number, CharacterInfoAI> = new Map
    let ai_characterState: Map<number, PlayerState> = new Map

    export function isDebug() {
        return debugSetting.debug
    }

    export function init(s: MainScene, music_as: AudioSource, sound_as: AudioSource, config_debug: object, config_initial: object, config_audioList: object, config_ai: object): void {
        // ??????????????????
        scene = s
        localUA = new UA_Base()
        scene.setUserAccess(localUA)
        localDataResolver = new LocalDataResolver()
        eventManager = new EventManager()
        music_audioSource = music_as
        sound_audioSource = sound_as

        /// debug ????????????

        // ??????debug??????
        debugSetting = new DebugSet()
        for (let k in config_debug) {
            debugSetting[k] = config_debug[k]
        }

        // ??????debug??????
        if (debugSetting.forceClearStorage) {
            localDataResolver.clearAllStorage()
        }

        /// ??????????????????

        // ??????????????????
        if (config_initial == null) {
            error("???????????????")
        } else {
            // ????????????
            let _systemSetting = config_initial["systemSetting"]
            initial_systemSetting = new SystemSetting()
            for (let k in _systemSetting) {
                initial_systemSetting[k] = _systemSetting[k]
            }
            // ??????????????????
            let _localUserInfo = config_initial["localUserInfo"]
            initial_localUserInfo = new CharacterInfo(_localUserInfo)
            localUserState = new PlayerState()
            localUserState.online = true
            // ????????????-??????
            let _huolongSetting = config_initial["huolongSetting"]
            initial_gameSetting_huolong = new HuolongGameSetting()
            for (let k in _huolongSetting) {
                initial_gameSetting_huolong[k] = _huolongSetting[k]
            }
        }
        // ??????????????????
        let r_config_audioList = config_audioList as any[]
        audio_list = new Map<string, AudioSet>()
        for (let v of r_config_audioList) {
            if (v != null && (!debugSetting.hideCopyrightElements || !v.copyright)) {
                let audio = new AudioSet()
                audio.id = v.id
                audio.type = v.type
                audio.audioUrl = v.audioUrl
                audio.audioId = v.audioId
                audio_list.set(audio.id, audio)
            }
        }
        // ??????AI??????
        let r_config_ai = config_ai as any[]
        for (let v of r_config_ai) {
            if (!debugSetting.hideCopyrightElements || !v.copyright) {
                let ai = new CharacterInfoAI(v)
                ai_characterList.push(ai.id)
                ai_charactersMap.set(ai.id, ai)
                let state = new PlayerState()
                state.online = false
                ai_characterState.set(ai.id, state)
            }
        }

        /// ??????????????????

        // ????????????
        let _systemSetting = localDataResolver.systemSetting
        systemSetting = new SystemSetting
        for (let k in initial_systemSetting) {
            systemSetting[k] = initial_systemSetting[k]
        }
        if (_systemSetting != null) {
            for (let k in _systemSetting) {
                systemSetting[k] = _systemSetting[k]
            }
        }
        localDataResolver.systemSetting = _systemSetting

        // ??????????????????
        let _localUserInfo = localDataResolver.localUserInfo
        localUserInfo = new CharacterInfo(initial_localUserInfo)
        if (_localUserInfo != null) {
            for (let k in _localUserInfo) {
                localUserInfo[k] = _localUserInfo[k]
            }
        }
        localDataResolver.localUserInfo = _localUserInfo

        // ?????????????????????????????????
        let _huolongSetting = localDataResolver.getGameSetting<HuolongGameSetting>(GameType.huolong)
        lastSavedGameSetting_huolong = new HuolongGameSetting
        for (let k in initial_gameSetting_huolong) {
            lastSavedGameSetting_huolong[k] = initial_gameSetting_huolong[k]
        }
        if (_huolongSetting != null) {
            for (let k in _huolongSetting) {
                lastSavedGameSetting_huolong[k] = _huolongSetting[k]
            }
        }
        localDataResolver.setGameSetting(GameType.huolong, lastSavedGameSetting_huolong)

        // ????????????
        listenEvent(SystemEventType.onPlayerExitGame, onPlayerExitGame)
        listenEvent(SystemEventType.onPlayerOffline, onPlayerOffline)
    }

    export function listenEvent(event: SystemEventType, callback: Function, listenerData: any = null): number {
        return eventManager.listen(event, callback, listenerData)
    }

    export function unlistenEvent(event: SystemEventType, id: number): boolean {
        return eventManager.unlisten(event, id)
    }

    export function notifyEvent(event: SystemEventType, ...data: any[]): void {
        eventManager.notify(event, ...data)
    }

    export function playMusic(musicId: number | string = null) {
        if (typeof (musicId) == "number") {
            let numberId = <number>musicId
            if (playingMusic != numberId) {
                playingMusic = numberId
                music_audioSource.stop()
                music_audioSource.clip = MainScene.getInstance().getAudioClip(numberId)
                music_audioSource.play()
            } else if (!music_audioSource.playing) {
                music_audioSource.play()
            }
        } else if (typeof (musicId) == "string") {
            let stringId = <string>musicId
            let set = audio_list.get(stringId)
            switch (set.type) {
                case ImageType.innerId:
                    if (playingMusic != set.audioId) {
                        playingMusic = set.audioId
                        music_audioSource.stop()
                        music_audioSource.clip = MainScene.getInstance().getAudioClip(set.audioId)
                        music_audioSource.play()
                    } else if (!music_audioSource.playing) {
                        music_audioSource.play()
                    }
                    break
                default:
                    assetManager.loadAny(set.audioUrl, (err: Error, clip: AudioClip) => {
                        if (err) {
                            error(err)
                        } else {
                            if (playingMusic != set.audioUrl) {
                                playingMusic = set.audioUrl
                                music_audioSource.stop()
                                music_audioSource.clip = clip
                                music_audioSource.play()
                            } else if (!music_audioSource.playing) {
                                music_audioSource.play()
                            }
                        }
                    })
            }
        } else {
            if (!music_audioSource.playing) {
                music_audioSource.play()
            }
        }
    }

    export function stopMusic() {
        music_audioSource.stop()
    }

    export function playSound(soundId: number | string | AudioClip) {
        if (typeof (soundId) == "number") {
            let numberId = <number>soundId
            sound_audioSource.playOneShot(MainScene.getInstance().getAudioClip(numberId))
        } else if (typeof (soundId) == "string") {
            let stringId = <string>soundId
            let set = audio_list.get(stringId)
            switch (set.type) {
                case ImageType.innerId:
                    sound_audioSource.playOneShot(MainScene.getInstance().getAudioClip(set.audioId))
                    break
                default:
                    assetManager.loadAny(set.audioUrl, (err: Error, clip: AudioClip) => {
                        if (err) {
                            error(err)
                        } else {
                            sound_audioSource.playOneShot(clip)
                        }
                    })
            }
        } else if (soundId != null) {
            sound_audioSource.playOneShot(soundId as AudioClip)
        }
    }

    export function setGameStart(view: VI_Base & PII_Base) {
        switch (view.getGameType()) {
            case GameType.huolong:
                view_gametype = view
                let huolong_gametype = new Ctrl_Huolong(lastSavedGameSetting_huolong)
                ctrl_gametype = huolong_gametype

                // ??????????????????
                let playerSouth = new PlayerVector_Huolong()
                let huolong_view = view as PII_Huolong
                playerSouth.setItem(huolong_view)
                let aiSouth = localUserInfo
                setLocalUserState(view.getGameType(), PlayerSeatPosition.south)
                playerSouth.setInfo(aiSouth)
                huolong_gametype.setPlayer(PlayerSeatPosition.south, playerSouth)

                // AI????????????
                let playerNorth = new PlayerVector_Huolong()
                playerNorth.setItem(new PlayerItem_Huolong_AI())
                let aiNorth = getRandomAIInfo(view.getGameType(), huolong_gametype.getAllPlayersId(), PlayerSeatPosition.north)
                setAIOnline(aiNorth.id, true, view.getGameType(), PlayerSeatPosition.north)
                playerNorth.setInfo(aiNorth)
                huolong_gametype.setPlayer(PlayerSeatPosition.north, playerNorth)

                // AI????????????
                let playerEast = new PlayerVector_Huolong()
                playerEast.setItem(new PlayerItem_Huolong_AI())
                let aiEast = getRandomAIInfo(view.getGameType(), huolong_gametype.getAllPlayersId(), PlayerSeatPosition.east)
                setAIOnline(aiEast.id, true, view.getGameType(), PlayerSeatPosition.east)
                playerEast.setInfo(aiEast)
                huolong_gametype.setPlayer(PlayerSeatPosition.east, playerEast)

                // AI????????????
                let playerWest = new PlayerVector_Huolong()
                playerWest.setItem(new PlayerItem_Huolong_AI())
                let aiWest = getRandomAIInfo(view.getGameType(), huolong_gametype.getAllPlayersId(), PlayerSeatPosition.west)
                setAIOnline(aiWest.id, true, view.getGameType(), PlayerSeatPosition.west)
                playerWest.setInfo(aiWest)
                huolong_gametype.setPlayer(PlayerSeatPosition.west, playerWest)

                break
            default:
                error("???????????????????????????, ??????:" + view.getGameType())
        }
    }

    export function setGameRestart() {
        if (ctrl_gametype != null) {
            ctrl_gametype.startGame()
        }
    }

    export function onGameEnd(view: VI_Base) {
        switch (view.getGameType()) {
            case GameType.huolong:
                view_gametype = null
                ctrl_gametype.onDispose()
                ctrl_gametype = null
                break
            default:
                error("???????????????????????????, ??????:" + view.getGameType())
        }
    }

    export function getSystemSetting(): SystemSetting {
        return systemSetting
    }

    export function updateSystemSetting(target: SystemSetting): boolean {
        if (target == null) {
            return false
        }
        for (let k in target) {
            systemSetting[k] = target[k]
        }
        localDataResolver.systemSetting = systemSetting
        notifyEvent(SystemEventType.onSystemSettingChanged, systemSetting)
        return true
    }

    export function getMyInfo(): CharacterInfo {
        return localUserInfo
    }

    export function updateMyInfo(target: CharacterInfo): boolean {
        if (target == null) {
            return false
        }
        let oldInfo = new CharacterInfo(localUserInfo)
        for (let k in target) {
            localUserInfo[k] = target[k]
        }
        localDataResolver.localUserInfo = localUserInfo
        notifyEvent(SystemEventType.onMyInfoChanged, localUserInfo)
        notifyEvent(SystemEventType.onPlayerInfoChanged, localUserState.gameType, localUserState.seat, oldInfo, localUserInfo)
        return true
    }

    export function getGameSetting(type: GameType): any {
        switch (type) {
            case GameType.huolong:
                return lastSavedGameSetting_huolong
            default:
                error("???????????????????????????, ??????:" + type)
        }
    }

    export function updateGameSetting(type: GameType, target: any): boolean {
        if (target == null) {
            return false
        }
        let src = null
        switch (type) {
            case GameType.huolong:
                src = lastSavedGameSetting_huolong
                break
            default:
                error("???????????????????????????, ??????:" + type)
        }
        if (src != null) {
            for (let k in target) {
                src[k] = target[k]
            }
            localDataResolver.setGameSetting(type, src)
            return true
        } else {
            return false
        }
    }

    function getRandomAIInfo(type: GameType, currentPlayers: number[], seat: number) {
        class TmpData {
            id: number
            minWeight: number
            maxWeight: number
        }
        // ???????????????AI
        let offLineList: TmpData[] = []
        let weightTotal = 0
        for (let ch of ai_characterList) {
            if (!ai_characterState.get(ch).online) {
                let info = ai_charactersMap.get(ch)
                let tmpData = new TmpData
                tmpData.id = ch
                tmpData.minWeight = weightTotal
                tmpData.maxWeight = weightTotal + info.baseWeight
                weightTotal += info.baseWeight
                offLineList.push(tmpData)
            }
        }
        let resultCharacter: CharacterInfoAI = null
        while (resultCharacter == null) {
            // ?????????????????????AI
            let randomResult = Math.random()
            let weightResult = weightTotal * randomResult
            let currentResultId = 0
            let tmpDataResult: TmpData = null
            for (let i = 0; i < offLineList.length; ++i) {
                if (offLineList[i].minWeight <= weightResult && offLineList[i].maxWeight > weightResult) {
                    currentResultId = offLineList[i].id
                    tmpDataResult = offLineList[i]
                    break
                }
            }
            // AI???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????0???
            let currentResultInfo = ai_charactersMap.get(currentResultId)
            switch (type) {
                case GameType.huolong:
                    {
                        let friends: number[] = []
                        let enemies: number[] = []
                        // ??????????????????
                        for (let s in currentPlayers) {
                            let hisSeat = parseInt(s)
                            if (seat != hisSeat && currentPlayers[s] != 0) {
                                if (pokerHelper.getRelation(seat, hisSeat) == PlayerSeatRelation.across) {
                                    friends.push(currentPlayers[s])
                                } else {
                                    enemies.push(currentPlayers[s])
                                }
                            }
                        }
                        // ????????????????????????????????????
                        let finalRate = 1
                        if (friends.length == 0) {
                            finalRate *= currentResultInfo.friendOthersRate.get(0)
                        } else {
                            for (let id of friends) {
                                if (currentResultInfo.friendOthersRate.has(id)) {
                                    finalRate *= currentResultInfo.friendOthersRate.get(id)
                                } else {
                                    finalRate *= currentResultInfo.friendOthersRate.get(0)
                                }
                                let hisInfo = ai_charactersMap.get(id)
                                if (hisInfo != null && hisInfo.friendOthersRate != null) {
                                    if (currentResultInfo.friendOthersRate.has(currentResultId) && currentResultInfo.friendOthersRate.get(currentResultId) == 0) {
                                        finalRate *= 0
                                    } else if (currentResultInfo.friendOthersRate.get(0) == 0) {
                                        finalRate *= 0
                                    }
                                }
                            }
                        }
                        if (enemies.length == 0) {
                            finalRate *= currentResultInfo.enemyOthersRate.get(0)
                        } else {
                            for (let id of enemies) {
                                if (currentResultInfo.enemyOthersRate.has(id)) {
                                    finalRate *= currentResultInfo.enemyOthersRate.get(id)
                                } else {
                                    finalRate *= currentResultInfo.enemyOthersRate.get(0)
                                }
                                let hisInfo = ai_charactersMap.get(id)
                                if (hisInfo != null && hisInfo.enemyOthersRate != null) {
                                    if (currentResultInfo.enemyOthersRate.has(currentResultId) && currentResultInfo.enemyOthersRate.get(currentResultId) == 0) {
                                        finalRate *= 0
                                    } else if (currentResultInfo.enemyOthersRate.get(0) == 0) {
                                        finalRate *= 0
                                    }
                                }
                            }
                        }
                        // ???????????????????????????????????????
                        let agree = Math.random() < finalRate
                        if (agree) {
                            resultCharacter = currentResultInfo
                            log("AI?????????" + currentResultInfo.name + "???,???????????????")
                        } else {
                            log("????????????" + currentResultInfo.name + "???,???" + (currentResultInfo.gender == 2 ? "???" : "???") + "????????????????????????????????????")
                            // ????????????????????????????????????
                            for (let i = 0; i < offLineList.length;) {
                                if (offLineList[i].id == currentResultId) {
                                    offLineList.splice(i, 1)
                                } else {
                                    if (offLineList[i].minWeight > weightResult) {
                                        offLineList[i].minWeight -= tmpDataResult.maxWeight - tmpDataResult.minWeight
                                        offLineList[i].maxWeight -= tmpDataResult.maxWeight - tmpDataResult.minWeight
                                    }
                                    ++i
                                }
                            }
                            weightTotal -= tmpDataResult.maxWeight - tmpDataResult.minWeight
                        }
                    }
                    break;
                default:
                    error("???????????????????????????, ??????:" + type)
            }
        }
        return resultCharacter
    }

    function setAIOnline(id: number, online: boolean, gameType: GameType, seat: number) {
        let state = ai_characterState.get(id)
        state.online = online
        state.gameType = gameType
        state.seat = seat
    }

    function setLocalUserState(gameType: GameType, seat: number) {
        localUserState.gameType = gameType
        localUserState.seat = seat
    }

    function onPlayerExitGame(event: SystemEventType, data: any, game: GameType, seat: number, info: CharacterInfo) {
        let ai_state = ai_characterState.get(info.id)
        if (ai_state != null) {
            ai_state.gameType = GameType.none
            notifyEvent(SystemEventType.onPlayerOffline, info)
        } else if (localUserInfo.id == info.id) {
            localUserState.gameType = GameType.none
        }
    }

    function onPlayerOffline(event: SystemEventType, data: any, info: CharacterInfo) {
        let ai_state = ai_characterState.get(info.id)
        if (ai_state != null) {
            ai_state.online = false
        } else if (localUserInfo.id == info.id) {
            warn("????????????????????????????????????????????????")
            localUserState.online = false
        }
    }
}

export default GameMain
