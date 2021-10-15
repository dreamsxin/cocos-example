"use strict";

/**
    1、生成灰边白心的小方块。
    2、第一次触摸， 白变黑； 再次触摸， 黑变白。 循环往复
    3、点击开始， 进行细胞分裂
 */
cc.Class({
  "extends": cc.Component,
  properties: {
    cellPrefab: cc.Prefab,
    //细胞格子预制体
    cellAreaNode: cc.Node //细胞总界面

  },
  onLoad: function onLoad() {
    this.cellAreaArray();
    this.pause = true; //暂停

    this.tt = 0; //计时

    this.cellAreaNode.on("touchstart", this.onTouchStart, this); //绑定触摸事件
  },
  pauseGame: function pauseGame() {
    this.pause = !this.pause; //暂停=非true=false，就是开始了

    var string = this.pause == false ? "进行中" : "暂停中";
    cc.find("Canvas/bg/Button/Background/Label").getComponent(cc.Label).string = string;
    console.log("Button的string" + string);
  },
  //一、没有用二维数组存储方块
  cellAreaNoArray: function cellAreaNoArray() {
    this.maxSize = 10; //单个细胞边长

    this.maxHCnt = this.cellAreaNode.height / this.maxSize; //高有多少个,600

    this.maxWCnt = this.cellAreaNode.width / this.maxSize; //宽有多少个,800

    console.log("0、高和宽：" + this.cellAreaNode.height, this.cellAreaNode.width); //打印高和宽

    for (var i = 0; i < this.maxWCnt; i++) {
      //改了变竖，说明是宽对应x轴
      for (var j = 0; j < this.maxHCnt; j++) {
        var cellNode = cc.instantiate(this.cellPrefab); //预制体克隆

        cellNode.setPosition(cc.v2(i * this.maxSize, j * this.maxSize)); //在坐标位置生成方格

        this.cellAreaNode.addChild(cellNode); //将cellNode加到cellAreaNode父节点。
      }
    }
  },
  //二、用二维数组存储方块
  cellAreaArray: function cellAreaArray() {
    this.maxSize = 10; //单个细胞边长

    this.maxHCnt = this.cellAreaNode.height / this.maxSize; //高有60个,600

    this.maxWCnt = this.cellAreaNode.width / this.maxSize; //宽有80个,800

    console.log("0、高和宽：" + this.cellAreaNode.height, this.cellAreaNode.width); //打印高和宽

    this.cellNodeArr = []; //细胞数组,长度为0

    for (var i = 0; i < this.maxWCnt; i++) {
      //改了变竖，说明是宽对应x轴
      this.cellNodeArr[i] = []; //二维数组，到这里i确定二维数组的一维长度

      for (var j = 0; j < this.maxHCnt; j++) {
        var cellNode = cc.instantiate(this.cellPrefab); //预制体克隆

        cellNode.setPosition(cc.v2(i * this.maxSize, j * this.maxSize)); //设置位置

        cellNode.getComponent('cell').setState(0); //为this.state初始化

        this.cellNodeArr[i].push(cellNode); //压入细胞数组
        //addChild: The child to add must be instance of cc.Node, not cc.Label.

        this.cellAreaNode.addChild(cellNode); //将cellNode加到cellAreaNode父节点。
      }

      this.cellNodeArr.push(this.cellNodeArr[i]); //console.log("赋值后的this.cellNodeArr" + this.cellNodeArr)
    }
  },
  onTouchStart: function onTouchStart(e) {
    var pos = e.getLocation(); //世界坐标

    console.log("坐标pos：" + pos);
    var n_pos = this.cellAreaNode.convertToNodeSpaceAR(pos); //将世界坐标转化为节点坐标

    console.log("坐标n_pos：" + n_pos); //计算block的坐标

    var i = parseInt(n_pos.x / this.maxSize); //节点坐标/单位边长=坐标

    var j = parseInt(n_pos.y / this.maxSize); //节点坐标/单位边长=坐标

    console.log("i,j：" + i, j);
    var cellNode = this.cellNodeArr[i][j]; //拿到对应节点
    //Cannot read property 'getComponent' of undefined

    cellNode.getComponent('cell').switchState(); //cell.js文件中的方法，改变颜色
  },
  //第二阶段的代码量
  update: function update(dt) {
    //pause==true，退出update
    if (this.pause) return; //0.1秒变化一次

    this.tt += dt;

    if (this.tt >= 0.11) {
      this.tt = 0;
      this.lifeChange();
    }
  },
  //处理结果
  lifeChange: function lifeChange() {
    var nowStateMap = [];
    var nextStateMap = []; //1、赋值

    for (var i = 0; i < this.maxWCnt; i++) {
      nowStateMap[i] = [];
      nextStateMap[i] = [];

      for (var j = 0; j < this.maxHCnt; j++) {
        var cellState = this.cellNodeArr[i][j].getComponent("cell").state;
        nowStateMap[i][j] = cellState;
        nextStateMap[i][j] = cellState;
      }
    } //console.log("开始" + nowStateMap.length, nextStateMap.length)
    //2、处理


    for (var _i = 0; _i < this.maxWCnt; _i++) {
      for (var _j = 0; _j < this.maxHCnt; _j++) {
        var state = this.cellLifeCheck(nowStateMap, {
          i: _i,
          j: _j
        }); //console.log("else白(-1),2不变(-1),3黑(1)返回的是" + state);
        //这句能不能不写,不写会闪眼，全部在变化
        //处理生死的格子，-1是不变

        if (state == 1 || state == 0) {
          nextStateMap[_i][_j] = state;
        }
      }
    } //3、结束，产生变化


    for (var _i2 = 0; _i2 < this.maxWCnt; _i2++) {
      for (var _j2 = 0; _j2 < this.maxHCnt; _j2++) {
        var _cellState = nextStateMap[_i2][_j2]; //console.log("变化的返回值" + cellState)

        this.cellNodeArr[_i2][_j2].getComponent("cell").setState(_cellState);
      }
    }
  },
  //处理返回值和边界检测
  cellLifeCheck: function cellLifeCheck(stateMap, index) {
    //3生2不变else死
    //偏移量
    var grid = [{
      //y=1
      i: -1,
      j: 1
    }, {
      i: 0,
      j: 1
    }, {
      i: 1,
      j: 1
    }, //y=0
    {
      i: -1,
      j: 0
    }, {
      i: 1,
      j: 0
    }, //y=-1
    {
      i: -1,
      j: -1
    }, {
      i: 0,
      j: -1
    }, {
      i: 1,
      j: -1
    }]; //计算totalNum

    var totalLifeNum = 0;

    for (var _i3 = 0, _grid = grid; _i3 < _grid.length; _i3++) {
      var g = _grid[_i3];
      var i = index.i + g.i;
      var j = index.j + g.j; //边界溢出

      if (i < 0) {
        i = this.maxWCnt - 1;
      }

      if (j < 0) {
        j = this.maxHCnt - 1;
      }

      if (i >= this.maxWCnt) {
        i = 0;
      }

      if (j >= this.maxHCnt) {
        j = 0;
      } //console.log("index" + index.i, index.j)
      //console.log("坐标" + i, j)


      var cellState = stateMap[i][j];

      if (cellState != 0) {
        //1黑0白
        totalLifeNum++;
      }
    } //处理结果返回值


    if (totalLifeNum == 3) {
      //生
      return 1;
    } else if (totalLifeNum == 2) {
      //不变
      return -1;
    } else {
      //死
      return 0;
    }
  }
});