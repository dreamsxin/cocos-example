import { msg } from "../proto/proto_dzpk_msg";


export interface ISendDelegate {
    sendMessage(msgId: msg.MessageID, msgData: any);
}

export interface IReceiveDelegate {
    registerCallBack(msgId: msg.MessageID, func: (msgData: any) => {});
}