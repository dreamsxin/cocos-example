/**
    1、生成灰边白心的小方块。
    2、第一次触摸， 白变黑； 再次触摸， 黑变白。 循环往复
    3、点击开始， 进行细胞分裂
 */
cc.Class({ //空节点bg
    extends: cc.Component,

    properties: {
        cellPrefab: cc.Prefab, //细胞格子预制体
        // cellAreaNode: cc.Node, //细胞总界面
        coordinateSystemNode: cc.Node,
    },
    onLoad() {
        this.cellAreaArray();
        //this.coordinateSystem()

        //this.test()

        this.pause = true; //暂停
        this.tt = 0; //计时会清零
        this.ct = 0; //总计师，不清零

        //this.cellAreaNode.on("touchstart", this.onTouchStart, this); //绑定触摸事件
    },
    test() {
        let label = this.coordinateSystemNode.addComponent(cc.Label);
        label.string = "dfvdsgfyuesudfsjh"
        label.fontSize = 40;
        label.lineHeight = 80;

        label.node.color = new cc.color(255, 255, 0, 255)
        label.node.setPosition(0, 0)
    },
    coordinateSystem() { //坐标系未完成
        // this.labelW = []
        let labelWArr = []
        let labelWNodeArr = []

        for (let i = 0; i < 80; i = i + 5) {
            let labelNode = this.coordinateSystemNode.addComponent(cc.Node);
            let label = labelNode.addComponent(cc.Label);
            // let label = labelW[i]

            // label.enable = true
            // label.enabled = true

            label.name = "labelW" + i
            label.string = i; //坐标也是0到79
            label.fontSize = 40;
            label.lineHeight = 80;

            label.node.color = new cc.color(255, 255, 0, 255)
            label.node.width = 20;

            //labelW[i].lineHeight = 10;
            //labelW[i].zIndex = 1;

            //labelW[i].node.setPosition(cc.v2(this.cellNodeArr[i][10].x, this.cellNodeArr[i][10].y))
            //labelW[i].node.setPosition(100, 100)
            label.node.setPosition(0, 0)

            //this.coordinateSystemNode.zIndex = 1
            //this.labelW[i].push(label)
            // this.labelW[i].push(label.node)

            labelWNodeArr.push(labelNode)
            labelWArr.push(label) //没这个不显示

            // this.labelW[i] = label
        }
        console.log(labelW)
        // for (let j = 0; j < this.maxHCnt; j++) {

        // }

    },
    pauseGame() {
        this.pause = !this.pause; //暂停=非true=false，就是开始了
        let string = this.pause == false ? "进行中" : "暂停中";
        cc.find("Canvas/bg/Button/Background/Label").getComponent(cc.Label).string = string;

        console.log("Button的string" + string);
    },
    //一、没有用二维数组存储方块
    cellAreaNoArray() {
        this.maxSize = 10; //单个细胞边长
        this.maxHCnt = this.cellAreaNode.height / this.maxSize; //高有多少个,600
        this.maxWCnt = this.cellAreaNode.width / this.maxSize; //宽有多少个,800
        console.log("0、高和宽：" + this.cellAreaNode.height, this.cellAreaNode.width) //打印高和宽

        for (let i = 0; i < this.maxWCnt; i++) { //改了变竖，说明是宽对应x轴
            for (let j = 0; j < this.maxHCnt; j++) {
                let cellNode = cc.instantiate(this.cellPrefab); //预制体克隆
                cellNode.setPosition(cc.v2(i * this.maxSize, j * this.maxSize)); //在坐标位置生成方格
                //addChild: The child to add must be instance of cc.Node, not cc.Label.
                this.cellAreaNode.addChild(cellNode); //将cellNode加到cellAreaNode父节点。
            }
        }
    },
    //二、用二维数组存储方块
    cellAreaArray() {
        this.maxSize = 10; //单个细胞边长
        this.maxHCnt = this.cellAreaNode.height / this.maxSize; //高有60个,600
        this.maxWCnt = this.cellAreaNode.width / this.maxSize; //宽有80个,800
        console.log("0、高和宽：" + this.cellAreaNode.height, this.cellAreaNode.width) //打印高和宽

        this.cellNodeArr = []; //细胞数组,长度为0

        for (let i = 0; i < this.maxWCnt; i++) { //改了变竖，说明是宽对应x轴
            this.cellNodeArr[i] = []; //二维数组，到这里i确定二维数组的一维长度

            for (let j = 0; j < this.maxHCnt; j++) {
                let cellNode = cc.instantiate(this.cellPrefab); //预制体克隆
                cellNode.setPosition(cc.v2(i * this.maxSize, j * this.maxSize)); //设置位置

                cellNode.getComponent('cell').setState(0); //为this.state初始化

                this.cellNodeArr[i].push(cellNode); //压+入细胞数组
                this.cellAreaNode.addChild(cellNode); //将cellNode加到cellAreaNode父节点。

            }
            this.cellNodeArr.push(this.cellNodeArr[i]);
            //console.log("赋值后的this.cellNodeArr" + this.cellNodeArr)
        }
    },

    onTouchStart(e) {
        let pos = e.getLocation(); //世界坐标
        console.log("坐标pos：" + pos);
        let n_pos = this.cellAreaNode.convertToNodeSpaceAR(pos); //将世界坐标转化为节点坐标
        console.log("坐标n_pos：" + n_pos);

        //计算block的坐标
        let i = parseInt(n_pos.x / this.maxSize); //节点坐标/单位边长=坐标
        let j = parseInt(n_pos.y / this.maxSize); //节点坐标/单位边长=坐标
        console.log("i,j：" + i, j);

        let cellNode = this.cellNodeArr[i][j]; //拿到对应节点

        //Cannot read property 'getComponent' of undefined
        cellNode.getComponent('cell').switchState(); //cell.js文件中的方法，改变颜色
    },
    update(dt) {
        //pause==true，退出update
        if (this.pause) return;

        //0.1秒变化一次
        this.tt += dt;

        if (this.tt >= 0.1) {
            this.tt = 0;
            this.lifeChange();
            console.log("update的次数" + this.ct++)
        }
    },
    //处理结果
    lifeChange() {
        let nowStateMap = [];
        let nextStateMap = [];

        //1、赋值
        for (let i = 0; i < this.maxWCnt; i++) {
            nowStateMap[i] = [];
            nextStateMap[i] = [];

            for (let j = 0; j < this.maxHCnt; j++) {
                let cellState = this.cellNodeArr[i][j].getComponent("cell").state;

                nowStateMap[i][j] = cellState;
                nextStateMap[i][j] = cellState;
            }
        }
        console.log(nowStateMap)

    },


});