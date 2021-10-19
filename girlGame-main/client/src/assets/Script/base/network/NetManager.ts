import { NetNode, NetConnectOptions } from "./NetNode";
import { NetData, CallbackObject } from "./NetInterface";
import { utils } from "../../util/Utils";
import NetMsg, { netMsg } from "../../game/netMsg/NetMsg";
import NetMsgID from "../../game/netMsg/NetMsgID";

/*
*   网络节点管理类
*
*   2019-10-8
*/

export class NetManager {
    private static _instance: NetManager = null;
    public wsIP: string = "";
    public wsPort: string = "";
    public wstoken: string = "";
    protected _channels: { [key: number]: NetNode } = {};



    public static getInstance(): NetManager {
        if (this._instance == null) {
            this._instance = new NetManager();
        }
        return this._instance;
    }

    public static subscribe(str: string, call: any, target: any) {
        NetNode.subscribe(str, call, target);
    }

    // 添加Node，返回ChannelID
    public setNetNode(newNode: NetNode, channelId: number = 0) {
        this._channels[channelId] = newNode;
    }

    // 移除Node
    public removeNetNode(channelId: number) {
        delete this._channels[channelId];
    }

    // 调用Node连接
    public connect(options: NetConnectOptions, callBack = null, channelId: number = 0): boolean {
        if (this._channels[channelId]) {
            return this._channels[channelId].connect(options, callBack);
        }
        return false;
    }

    // 调用Node发送
    public send(buf: NetData, force: boolean = false, channelId: number = 0): boolean {
        let node = this._channels[channelId];
        if (node) {
            return node.send(buf, force);
        }
        return false;
    }

    public sendCmd(cmdId: number, buf: any, rspObject: CallbackObject = null, force: boolean = false, channelId: number = 0): boolean {
        let node = this._channels[channelId];
        if (node) {
            return node.send(netMsg.PackMsg(cmdId, buf), force, cmdId, rspObject);
        }
        return false;
    }

    // 发起请求，并在在结果返回时调用指定好的回调函数
    public request(buf: NetData, rspCmd: number, rspObject: CallbackObject, showTips: boolean = true, force: boolean = false, channelId: number = 0) {
        let node = this._channels[channelId];
        if (node) {
            node.request(buf, rspCmd, rspObject, showTips, force);
        }
    }

    // 同request，但在request之前会先判断队列中是否已有rspCmd，如有重复的则直接返回
    public requestUnique(buf: NetData, rspCmd: number, rspObject: CallbackObject, showTips: boolean = true, force: boolean = false, channelId: number = 0): boolean {
        let node = this._channels[channelId];
        if (node) {
            return node.requestUnique(buf, rspCmd, rspObject, showTips, force);
        }
        return false;
    }

    // 调用Node关闭
    public close(code?: number, reason?: string, channelId: number = 0) {
        if (this._channels[channelId]) {
            return this._channels[channelId].closeSocket(code, reason);
        }
    }
    public static httpPost(url, params, callback) {
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status == 200) {
                let respone = xhr.responseText;
                let rsp = JSON.parse(respone);

                // console.log("消息回调 respone(" + respone + ")");
                if (rsp["errcode"] == 0) {
                    if (callback != null)
                        callback(rsp);
                } else {

                    console.log("消息回调 respone(" + rsp["errcode"] + ")");
                }


            } else {
            }
        };
        xhr.responseType = "text";
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf8");
        if (utils.AccessToken != "") {

            xhr.setRequestHeader('Authorization', 'Bearer ' + utils.AccessToken);
        }
        xhr.timeout = 8000;
        xhr.withCredentials = false;
        xhr.send(params);
    }
    public static httpGet(url, callback) {
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            // Tools.log('xhr.readyState=' + xhr.readyState + '  xhr.status=' + xhr.status);
            if (xhr.readyState === 4 && xhr.status == 200) {

                let respone = xhr.responseText;
                let rsp = JSON.parse(respone);
                callback(rsp);
            } else {
                // callback(-1);
            }
        };
        xhr.responseType = "text";
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST');
        xhr.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type');
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        xhr.setRequestHeader('Authorization', 'Bearer ' + utils.AccessToken);
        xhr.withCredentials = false;
        xhr.send();
    }
}

export let netManager = NetManager.getInstance();