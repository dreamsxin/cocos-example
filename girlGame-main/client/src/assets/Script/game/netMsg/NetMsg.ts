
import { utils } from "../../util/Utils";
import { IProtocolHelper, NetData } from "../../base/network/NetInterface";

export class BasicMsg {
    code: number = 0;
    body: Object = null;
}

const CODE_OFFSET = 4;
const BODY_LENGTH_OFFSET = 4;
// 默认字符串协议对象
export class ZhiMengProtocol implements IProtocolHelper {
    getHeadlen(): number {
        return 0;
    }
    getHearbeat() {
        return "";
    }
    getPackageLen(msg): number {
        return utils.bytesToInt(Array.prototype.slice.call(new Int8Array(msg)).slice(4, 8));
    }
    checkPackage(msg): boolean {

        return true;
    }
    getPackageId(msg): number {
        return utils.bytesToInt(Array.prototype.slice.call(new Int8Array(msg)).slice(0, 4));
    }
}

export default class NetMsg {

    public PackMsg(code: number, body: any) {
        let bodystr = JSON.stringify(body);
        let bodyArr = utils.stringToBytes(bodystr);
        const codeBytes = utils.intToByte4(code);
        const bodyLengthBytes = utils.intToByte4(bodyArr.length);
        const pkg = codeBytes.concat(bodyLengthBytes, bodyArr);
        return new Int8Array(pkg).buffer;
    }
    public initHander(netNode) {
        //netNode.setResponeHandler(NetMsgID.NetMsgID_Login, MsgPlayer.PlayerLoginResponse);
        //netNode.setResponeHandler(NetMsgID.NetMsgID_CreateRole, MsgPlayer.PlayerCreateRolenResponse);
        //netNode.setResponeHandler(NetMsgID.NetMsgID_SetBaseCloth, MsgPlayer.PlayerSetBasicClothResponse);
    }


}

export let netMsg: NetMsg = new NetMsg();
