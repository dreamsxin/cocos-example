/**
 * 节点对象池
 */

 const NodePools: Array<PrefabPoolNode> = [];

 /**
  * 获取指定缓存池
  * @param name 缓存池名称
  */
 export function getPrefabPool(name: string): PrefabPoolNode {
     return NodePools[name]
 }
 
 export default class PrefabPoolNode {
     /**对象缓存池 */
     private nodePool: cc.NodePool;
     private prefab: cc.Prefab;
     /** 正在使用中的所有node */
     public nodes: cc.Node[] = [];
     /**缓存个数 */
     private num: number;
 
     /** 使用完毕回调 */
     public unuse: (node: cc.Node) => void;
     /** 重新使用回调 */
     public reuse: (node: cc.Node) => void;

     static getPrefabPool(name: string): PrefabPoolNode {
        return NodePools[name]
    }
 
 
     /** 静态实例化 */
     public static instance(name: string, prefab: cc.Prefab, num: number): PrefabPoolNode {
         const nodePool: PrefabPoolNode = NodePools[name]
         if (nodePool) {
             return nodePool.init(prefab)
         }
         NodePools[name] = new this(num);
         return NodePools[name].init(prefab);
     }
 
     private constructor(num: number) {
         this.nodePool = new cc.NodePool();
         this.num = num;
     }
 
     /** 初始化生成对象 */
     public init(prefab: cc.Prefab) {
         //已存在
         if (this.getSize() > 0 || this.getUseNodes().length > 0) return this;
 
         this.prefab = prefab;
         for (let i = 0; i < this.num; i++) {
             this.nodePool.put(cc.instantiate(this.prefab))
         }
 
         return this;
     }
 
 
     /** 获取所有使用中的node */
     public getUseNodes(): cc.Node[] {
         return this.nodes;
     }
 
     /** 获取对象缓存池 */
     public getNodePool(): cc.NodePool {
         return this.nodePool;
     }
 
     /** 获取当前缓冲池的可用对象数量 */
     public getSize(): number {
         return this.nodePool.size();
     }
 
 
     /**
      * 获取缓冲池中节点
      */
     public getNode(): cc.Node {
         let node = null;
         if (this.nodePool.size() > 0) {
             node = this.nodePool.get();
         } else {
             node = cc.instantiate(this.prefab);
         }
         //记录使用中的node
         let index = this.nodes.findIndex(p => p === node)
         if (index < 0) this.nodes.push(node)
 
         return node;
     }
 
     /**
      * 回收节点
      */
     public removeToPlayer(node: cc.Node): void {
         //删除使用中的node
         let index = this.nodes.findIndex(p => p === node)
         if (index >= 0) this.nodes.splice(index, 1)
 
         //回收
         this.nodePool.put(node)
     }
 
     /**
      * 回收所有节点
      */
     public removeToPlayerAll() {
         this.nodes.forEach(node => {
             this.nodePool.put(node)
         })
         this.nodes = [];
     }
 
     /**
      * 销毁所有节点
      */
     public clear() {
         this.nodePool.clear()
     }
 }