
export class ExecuteAsync {

    private _nextHandle: any;
    private _createItemHandle: any;
    _target: cc.Component;

    public setCallBack(target: cc.Component, createItemHandle: any, nextHandle: any) {
        this._nextHandle = nextHandle;
        this._createItemHandle = createItemHandle;
        this._target = target;
    }

    async createAllItems(arr: any) {
        await this.executePreFrame(this._getItemGenerator(arr), 1);

        if (this._nextHandle && this._target) {
            this._nextHandle.apply(this._target);
        }
    }

    /**
     * 分帧执行 Generator 逻辑
     *
     * @param generator 生成器
     * @param duration 持续时间（ms），每次执行 Generator 的操作时，最长可持续执行时长。假设值为8ms，那么表示1帧（总共16ms）下，分出8ms时间给此逻辑执行
     */
    private executePreFrame(generator: Generator, duration: number) {
        return new Promise((resolve, reject) => {
            let gen = generator;
            // 创建执行函数
            let execute = () => {
                // 执行之前，先记录开始时间
                let startTime = new Date().getTime();

                // 然后一直从 Generator 中获取已经拆分好的代码段出来执行
                for (let iter = gen.next(); ; iter = gen.next()) {
                    // 判断是否已经执行完所有 Generator 的小代码段，如果是的话，那么就表示任务完成
                    if (iter == null || iter.done) {
                        resolve();
                        return;
                    }

                    // 每执行完一段小代码段，都检查一下是否已经超过我们分配的本帧，这些小代码端的最大可执行时间
                    if (new Date().getTime() - startTime > duration) {
                        // 如果超过了，那么本帧就不在执行，开定时器，让下一帧再执行
                        this._target.scheduleOnce(() => {
                            execute();
                        });
                        return;
                    }
                }
            };

            // 运行执行函数
            execute();
        });
    }

    private *_getItemGenerator(arr: { [x: string]: any; }) {
        for (var i in arr) {
            yield this._createItemHandle(arr[i]);
        }
    }
}

export let executeAsync: ExecuteAsync = new ExecuteAsync();