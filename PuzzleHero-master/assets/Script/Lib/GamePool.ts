

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePool {

    public static Pool: { [key: string]: cc.NodePool } = {}


    public static GetPoolNode(key: string, pf: cc.Prefab = null) {
        if (GamePool.Pool[key].size() == 0) {
            if (pf == null) {
                return null
            }
            return cc.instantiate(pf)
        } else {
            let node = GamePool.Pool[key].get()
            return node
        }
    }

    public static PutPoolNode(key: string, node: cc.Node, callback: Function = null) {
        if (callback) {
            callback()
        }
        GamePool.Pool[key].put(node)
    }


    public static Init(key: string) {
        if (GamePool.Pool[key] == null) {
            GamePool.Pool[key] = new cc.NodePool(key)
        }
    }
}
