import { RenderTexture } from "cc";

export default interface IUserAccess {
    getWechatSharedCanvasRenderedTexture(): RenderTexture
    isConnection(): boolean
    connect(successCallback: Function, failureCallback: Function): void
    sendLogin(): any
    getNickName(): string
    getAvatar(): string
}