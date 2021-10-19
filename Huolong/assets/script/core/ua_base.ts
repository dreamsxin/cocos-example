import { RenderTexture } from "cc";
import IUserAccess from "./i_userAccess";

export default class UA_Base implements IUserAccess {
    getWechatSharedCanvasRenderedTexture(): RenderTexture {
        return null
    }
    isConnection(): boolean {
        return true
    }
    connect(successCallback: Function, failureCallback: Function): void {

    }
    sendLogin() {

    }
    getNickName(): string {
        return "本大爷"
    }
    getAvatar(): string {
        return ""
    }
}