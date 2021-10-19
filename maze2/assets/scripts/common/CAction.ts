// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalLayers from "../global/GlobalLayers";
import CActionLayerBase from "./CActionLayerBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CAction extends cc.Component {

    private static configsNode = {
        /** Layers节点所在位置 */
        layers: "Canvas/Layers",
        // layers: "Common/Layers",
        /** layer的prefab所在 相对resources */
        prefabLayer: "prefab/layers/",
    };


    /**
     * 切换场景
     * @param name 场景名
     */
    public static onScene(name: string, call?: () => void) {
        cc.director.loadScene(name, () => {
            if (call) call();
            //通过场景名播放背景
            // let audio = cc.find('Common/Audio').getComponent(CAudio);
            // audio.playBgmScene(name)
        })
    }
    onSceneButton(event: cc.Event.EventTouch, customEventData: string) {
        CAction.onScene(customEventData)
    }

    //初始化指定层
    public static initLayer(name: string) {
        this.onOpenLayer(name, true);
    }


    /**
     * 打开指定层
     * @param name 层prefab名称
     */
    public static onOpenLayer(name: string, isInit: boolean = false) {
        //layers层
        let layersNode = cc.find(CAction.configsNode.layers);
        if (!layersNode) return;

        //层位置
        let zIndex = GlobalLayers.getLength();

        //打开的和当先显示为同一个层
        if (GlobalLayers[zIndex] === name) return;


        //已存在则打开
        let childNode = layersNode.getChildByName(name);
        if (childNode) {
            childNode.getComponent(CActionLayerBase).onOpen(Number(zIndex))
            //记录
            GlobalLayers.push(name)
        } else {
            //读取后打开
            CAction.getPrefabLayer(name, (prefab) => {
                let n = cc.instantiate(prefab);
                layersNode.addChild(n, 0, name)
                if (isInit) {
                    n.getComponent(CActionLayerBase).initSize()
                } else {
                    n.getComponent(CActionLayerBase).onOpen(Number(zIndex))
                    //记录打开层
                    GlobalLayers.push(name)
                }

            })
        }
    }
    onOpenLayerButton(event: cc.Event.EventTouch, customEventData: string) {
        CAction.onOpenLayer(customEventData)
    }



    /**
     * 后退指定层数 
     * @param name 后退层数 
     */
    public static onBackLayer(name?: string) {
        let [num] = String(name).split('-')
        if (!name) {
            [num] = ['1'];
        }

        let layerNum = typeof num === 'string' ? Number(num) : 1;
        let node = cc.find(CAction.configsNode.layers);
        for (let i = 0; i < layerNum; i++) {
            let c = GlobalLayers.pop()
            if (c) {
                let childNode = node.getChildByName(c);
                childNode?.getComponent(CActionLayerBase).onClose()
            }
        }
    }
    onBackLayerButton(event: cc.Event.EventTouch, customEventData: string) {
        CAction.onBackLayer(customEventData)
    }


    /**
     * 关闭所有层
     */
    public static onBackAll() {
        let node = cc.find(CAction.configsNode.layers);
        let layerName: string = null;
        while (layerName = GlobalLayers.pop()) {
            let childNode = node.getChildByName(layerName);
            childNode?.getComponent(CActionLayerBase).onClose()
        }
    }

    /**
     * 获取layer的prefab
     * @param name layer名称
     * @param call 获取成功回调
     */
    public static getPrefabLayer(name: string, call: (prefab: cc.Prefab) => void): any {
        //资源加载完毕会自动缓存
        cc.resources.load(this.configsNode.prefabLayer + name, cc.Prefab, (err, asset: cc.Prefab) => {
            if (err) cc.error(err)
            call(asset)
        })
    }
}
