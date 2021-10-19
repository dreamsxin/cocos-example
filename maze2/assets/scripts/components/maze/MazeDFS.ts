/** 深度优先生成迷宫 */
export default class MazeDFS {
    /** 迷宫地图 */
    private maze: MazePoint[][] = [];
    /** 地图大小 */
    private size: MazeSize = null;

    /** 入口出口位置 */
    private enter: MazeXY = null;
    /** 出口自动生成 */
    private exit: MazeXY = null;
    /** 当前位置 */
    private current: MazeXY = null;

    //获取地图大小
    public getSize() {
        return this.size
    }


    /**
     * 初始化生成所有单元格被隔开的地图
     * @param size 
     */
    init(size: MazeSize): this {
        this.size = size;
        let height = size.height * 2 - 1;
        let width = size.width * 2 - 1;
        for (let y = 0; y < height; y++) {
            this.maze[y] = [];
            for (let x = 0; x < width; x++) {
                let isWall = x % 2 == 0 && y % 2 == 0
                let point: MazePoint = {
                    x, y, wall: !isWall, visit: false,
                };
                this.maze[y][x] = point
            }
        }

        this.setRandomEnter();
        return this;
    }

    /** 设置随机入口 */
    setRandomEnter() {
        let x = Math.floor(Math.random() * this.size.width);
        let y = Math.floor(Math.random() * this.size.height);
        this.enter = { x, y };
        this.current = this.enter;
    }

    /** 设置入口和出口位置 */
    setEnterAndExit(enter: MazeXY = { x: 0, y: 0 }, exit: MazeXY = { x: this.size.width - 1, y: this.size.height - 1 }): this {
        this.enter = enter
        this.exit = exit
        this.current = this.enter;
        return this;
    }

    //获取转化后的入口和出口位置信息
    /** 获取入口和出口位置信息 */
    getEnterAndExitPoint(): { enter: MazePoint, exit: MazePoint } {
        let enter = this.maze[this.enter.y * 2][this.enter.x * 2];
        let exit = this.maze[this.exit.y * 2][this.exit.x * 2];
        return { enter, exit }
    }

    /**
     * 生成迷宫
     * 生成后的迷宫是原始大小的2倍
     */
    generateMaze() {
        //最深长度
        let lenLog = 0;


        // 访问记录
        let history: MazeXY[] = [{ x: this.current.x, y: this.current.y }];
        while (history.length > 0) {

            //生成出口位置
            if (lenLog < history.length) {
                this.exit = history[history.length - 1];
                lenLog = history.length;
            }


            //已访问
            this.maze[this.current.y][this.current.x].visit = true;
            //获取可行走的随机位置
            let nextPos: MazeXY | false = this.dirRandomPoint(this.maze[this.current.y][this.current.x])
            if (!nextPos) {
                //返回上一步
                this.current = history.pop();
                continue;
            };

            //记录所有的可选择路口
            if (lenLog < history.length) {
                this.exit = history[history.length - 1];
                lenLog = history.length;
            }


            //打通墙壁
            this.digWall(nextPos);
            //设置下一步为当前
            this.current = nextPos;
            history.push(nextPos)
        }
        return this;
    }
    /** 获取迷宫 */
    public getMaze() {
        return this.maze;
    }

    //当前所在位置
    moveCurrentPos: MazeXY = null;

    //获取当前所在位置
    public getMoveCurrentPos() {
        if (this.moveCurrentPos == null) {
            this.moveCurrentPos = { x: this.enter.x * 2, y: this.enter.y * 2 }
        }
        return this.moveCurrentPos;
    }

    /** 获取在当前位置角色可以移动的方向 */
    public getDirMove(curPos: MazeXY) {
        let dirData = {
            up: this.maze[curPos.y - 1] ? this.maze[curPos.y - 1][curPos.x] && !this.maze[curPos.y - 1][curPos.x].wall : false,
            down: this.maze[curPos.y + 1] ? this.maze[curPos.y + 1][curPos.x] && !this.maze[curPos.y + 1][curPos.x].wall : false,
            left: this.maze[curPos.y][curPos.x - 1] && !this.maze[curPos.y][curPos.x - 1].wall,
            right: this.maze[curPos.y][curPos.x + 1] && !this.maze[curPos.y][curPos.x + 1].wall,
        };
        return dirData;
    }

    public getMoveStepData(pos: MazeXY, dir: 'up' | 'down' | 'left' | 'right') {
        //行驶数据
        let data: {
            start: MazeXY,
            end: MazeXY,
            xStep: number,
            yStep: number,
        }[] = [];
        let itemData: {
            start: MazeXY,
            end: MazeXY,
            xStep: number,
            yStep: number,
        } = {
            start: null,
            end: null,
            xStep: null,
            yStep: null,
        };

        //当前所在位置
        let curPos: MazePoint = this.maze[pos.y][pos.x];
        //上一步位置
        let prevPos: MazePoint = curPos;
        let prevTemp: MazePoint = prevPos;

        //方向选择
        let initDir: MazeXY = Object.assign({}, curPos);
        switch (dir) {
            case 'up':
                initDir.y--
                break;
            case 'down':
                initDir.y++
                break;
            case 'left':
                initDir.x--
                break;
            case 'right':
                initDir.x++
                break;
        }
        // cc.log('当前位置', initDir)

        //所选位置不能走
        if (this.maze[initDir.y]
            && this.maze[initDir.y][initDir.x]
            && !this.maze[initDir.y][initDir.x].wall) { } else {
            // cc.log('不能走')

            return data;
        }


        let isInit = false;

        do {
            //下一步方向数据
            let dirData = {
                up: this.maze[curPos.y - 1] ? this.maze[curPos.y - 1][curPos.x] : undefined,
                down: this.maze[curPos.y + 1] ? this.maze[curPos.y + 1][curPos.x] : undefined,
                left: this.maze[curPos.y][curPos.x - 1],
                right: this.maze[curPos.y][curPos.x + 1],
            };

            //下一步可行走的方向个数
            let dirCount = 0;
            //下一步位置
            let nextPos: MazePoint = null;

            //初次选择方向
            if (!isInit) {
                dirCount++
                nextPos = this.maze[initDir.y][initDir.x];
                isInit = true;
            } else {
                for (const key in dirData) {
                    if (Object.prototype.hasOwnProperty.call(dirData, key)) {
                        const element: MazePoint = dirData[key];
                        //略过已走位置
                        if (element == prevPos) continue;

                        //路
                        if (element && !element.wall) {
                            nextPos = element
                            dirCount++;
                        }
                    }
                }
            }


            //路线多或少于1条时退出
            if (dirCount != 1) {
                itemData.end = curPos;
                let addSubx = itemData.end.x - itemData.start.x
                let addSuby = itemData.end.y - itemData.start.y
                addSubx < 0 && (itemData.xStep *= -1);
                addSuby < 0 && (itemData.yStep *= -1);
                data.push(itemData)

                this.moveCurrentPos = itemData.end;
                cc.log(itemData.end, 'end')

                break;
            }

            //指定当前位置和上一步位置
            prevTemp = prevPos;
            prevPos = curPos;
            curPos = nextPos;

            //记录行驶数据
            if (!itemData.start) {
                itemData.start = prevPos;
                //走x或y
                if (prevPos.x == nextPos.x) {
                    itemData.yStep = 0;
                } else {
                    itemData.xStep = 0;
                }
            }


            let isLine = true;
            if (typeof itemData.xStep === 'number') {
                if (prevPos.y != nextPos.y) {
                    isLine = false;
                } else {
                    itemData.xStep++;
                }
            } else {
                if (prevPos.x != nextPos.x) {
                    isLine = false;
                } else {
                    itemData.yStep++;
                }
            }

            if (!isLine) {
                itemData.end = prevPos;
                let addSubx = itemData.end.x - itemData.start.x
                let addSuby = itemData.end.y - itemData.start.y
                addSubx < 0 && (itemData.xStep *= -1);
                addSuby < 0 && (itemData.yStep *= -1);


                data.push(itemData)

                curPos = prevPos;
                prevPos = prevTemp;

                itemData = {
                    start: null,
                    end: null,
                    xStep: null,
                    yStep: null,
                };
            }

        } while (true)

        return data;
    }

    /**
     * 获取在指定位置时，可移动数据
     * @param nextPos 
     */
    public getMoveData(pos: MazeXY, dir: 'up' | 'down' | 'left' | 'right') {
        //行驶数据
        let data: MazeXY[] = [];
        //
        let dataMove = [];
        //当前所在位置
        let curPos: MazePoint = this.maze[pos.y][pos.x];
        //上一步位置
        let prevPos: MazePoint = curPos;

        let test = 0;
        do {
            test++;
            if (test > 300) {
                cc.log('[[[[[[[[[[[[[test>300]]]]]]]]]]]]]')
                break;
            }


            //下一步方向数据
            let dirData = {
                up: this.maze[curPos.y - 1] ? this.maze[curPos.y - 1][curPos.x] : undefined,
                down: this.maze[curPos.y + 1] ? this.maze[curPos.y + 1][curPos.x] : undefined,
                left: this.maze[curPos.y][curPos.x - 1],
                right: this.maze[curPos.y][curPos.x + 1],
            };

            //下一步可行走的方向个数
            let dirCount = 0;
            //下一步位置
            let nextPos: MazePoint = null;

            for (const key in dirData) {
                if (Object.prototype.hasOwnProperty.call(dirData, key)) {
                    const element: MazePoint = dirData[key];
                    //略过已走位置
                    if (element == prevPos) continue;
                    //路
                    if (element && !element.wall) {
                        nextPos = element
                        dirCount++;
                    }
                }
            }
            //路线多或少于1条时退出
            if (dirCount != 1) break;

            //当前位置和上一步位置
            prevPos = curPos;
            curPos = nextPos;

            //记录行驶数据
            data.push(nextPos)
            //

        } while (true)

    }

    /**
     * 打通当前位置和下一步的墙壁
     * @param nextPos 下一步位置
     */
    private digWall(nextPos: MazeXY) {
        let xSub = nextPos.x - this.current.x;
        let ySub = nextPos.y - this.current.y;
        if (xSub == 0) {
            this.maze[this.current.y * 2 + ySub][this.current.x * 2].wall = false;
        } else {
            this.maze[this.current.y * 2][this.current.x * 2 + xSub].wall = false;
        }
    }

    /** 获取当前位置可行走的随机位置 */
    private dirRandomPoint(cur: MazePoint): MazeXY | false {
        let size = { x: this.size.width, y: this.size.height };
        let list: MazeXY[] = [];
        //x左右 y上下 -1左/下 1右/上
        for (const pos of ['x', 'y']) {
            for (const num of [-1, 1]) {
                let temp = Object.assign({}, cur);//深拷贝一下
                //可行走的位置
                if (cur[pos] + num >= 0 && cur[pos] + num < size[pos]) {
                    temp[pos] += num
                    //访问过不添加
                    if (!this.maze[temp.y][temp.x].visit) {
                        list.push(temp)
                    }
                }
            }
        }

        //没找到位置
        if (list.length <= 0) return false;

        return list[Math.floor(Math.random() * list.length)]
    }
}

