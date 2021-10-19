/**
 * 全局打开层记录
 */
class GlobalLayers {
    /** layer层记录 */
    private layerRecord: Array<string> = [];
 
    /** 抛出最新记录的layer名 */
    public pop(): string {
        return this.layerRecord.pop();
    }
 
    /** 记录layer */
    public push(name: string): void {
 
        if (!name) {
            cc.error('name not exists')
            return;
        };
 
        //过滤掉相同layer
        if (this.layerRecord[this.layerRecord.length - 1] != name) {
            this.layerRecord.push(name)
        }
    }
 
    public getLength(): number {
        return this.layerRecord.length;
    }
 
}
 
export default new GlobalLayers;
