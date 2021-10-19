/** 游戏数据 */
class GlobalGame {
    /** 当前关卡 */
    private currentLevel: number;
    /** 当前关卡过关时间 */
    private currentTime: number = 0;

    /** 设置当前关卡等级 */
    public setCurrentLevel(currentLevel: number): void {
        this.currentLevel = currentLevel;
    }
    /** 获取当前关卡等级 */
    public getCurrentLevel() {
        return this.currentLevel;
    }
    /** 增加关卡 */
    public incrLevel(d: number = 1) {
        this.currentLevel += d;
        return this.currentLevel;
    }


    /**获取当前游戏时间 */
    public getCurrentTime() {
        return this.currentTime;
    }
    /** 设置当前游戏时间 */
    public setCurrentTime(timestamp: number) {
        this.currentTime = timestamp;
    }
    /**自增当前游戏时间 */
    public incrCurrentTime(d: number = 1) {
        this.currentTime += d;
        return this.currentTime;
    }
}

export default new GlobalGame;
