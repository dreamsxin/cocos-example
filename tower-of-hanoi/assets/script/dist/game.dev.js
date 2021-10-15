"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    blockLayerNode: cc.Node,
    //管理方块的层
    blockPrefab: cc.Prefab,
    //方块预制体
    baseNodeArr: [cc.Node] //杆盘的数组

  },
  onLoad: function onLoad() {
    window.game = this; //全局调用

    this.blockNum = 3;
    this.baseNum = 3;
    this.blockNodeArr = [[], [], []];
    this.initBlock(this.blockNum); //二维数组的定义，和方法没有放定义之后
  },
  //-360,122;0;360
  initBlock: function initBlock(num) {
    if (num >= 6) {
      //最多6关
      num = 6;
    } //节点少，不用对象池
    //删除上一关的块


    for (var i = 0; i < this.blockNodeArr.length; i++) {
      var arr = this.blockNodeArr[i];

      for (var j = 0; j < arr.length; j++) {
        arr[j].destroy();
      }
    }

    this.blockNodeArr = [[], [], []]; //3block进来，4-6block循环

    for (var _i = 0; _i < num; _i++) {
      var blockNode = cc.instantiate(this.blockPrefab);
      blockNode.setPosition(cc.v2(this.baseNodeArr[0].x, -122 + 44 * _i));
      this.blockLayerNode.addChild(blockNode);
      var blockIndex = num - 1 - _i;
      blockNode.baseIndex = 0; //记录底座编号

      blockNode.blockIndex = blockIndex; //记录块编号

      blockNode.getComponent("block").init(blockIndex); //0,1,2。作者直接传i正确，我传num-1-i才正确吗（正确指方块的颜色和大小）

      console.log(this.blockNodeArr);
      this.blockNodeArr[0].push(blockNode);
    }
  },
  //返回底座编号
  baseIndexCheck: function baseIndexCheck(pos) {
    //let pos = blockNode.position;
    for (var i = 0; i < this.baseNodeArr.length; i++) {
      var baseNode = this.baseNodeArr[i]; //console.log(this.blockNodeArr[i])

      if (pos.x >= baseNode.x - baseNode.width / 2 && pos.x <= baseNode.x + baseNode.width / 2) {
        return i; //合法位置
      }
    }

    return -1; //非法位置
  },
  //返回布尔值
  placeBlock: function placeBlock(blockNode) {
    var baseIndex = this.baseIndexCheck(blockNode);
    console.log(blockNode.width);
    console.log(this.blockNodeArr[baseIndex]);

    if (baseIndex === -1) {
      //非法放置的后续操作
      return false;
    }

    if (blockNode.baseIndex === baseIndex) {
      return false;
    }

    var arr = this.blockNodeArr[baseIndex]; //在目的地不能大压小

    console.log(arr);

    if (arr.length && blockNode.width > arr[arr.length - 1].width) {
      return false;
    } // let startPos = window.block.startPos;
    // let startBaseIndex = this.baseIndexCheck(startPos);
    // let startArr = this.blockNodeArr[startBaseIndex];
    //在起源地不能釜底抽薪
    // for (let i = 0; i < arr.length; i++) {
    //     console.log(startArr[i])
    //     if (startArr.length && blockNode.width > startArr[i].width) {
    //         return false;
    //     }
    // }


    var baseNode = this.baseNodeArr[baseIndex]; //取底座

    this.blockNodeArr[blockNode.baseIndex].pop(); //从旧的拿

    this.blockNodeArr[baseIndex].push(blockNode); //放入新的，MoveEnd的底座

    blockNode.baseIndex = baseIndex; //baseIndex设为新的
    //计算位置

    var length = this.blockNodeArr[baseIndex].length;
    console.log(this.blockNodeArr[baseIndex]);
    blockNode.setPosition(cc.v2(baseNode.x, -122 + 44 * (length - 1))); //最右边的底座的长度===块数
    //莫名其妙又不报错了

    console.log(this.blockNodeArr + "底盘");
    console.log(this.blockNodeArr.length + "底盘的长度");
    console.log(this.blockNodeArr[this.blockNum - 1]); //报错，没有

    if (this.blockNodeArr[this.baseNum - 1].length === this.blockNum) {
      console.log("游戏通关");
      this.initBlock(++this.blockNum); //下一关，报错
    }

    return true;
  }
});