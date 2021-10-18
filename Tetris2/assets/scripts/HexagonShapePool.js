// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var Common = require("Common");
var Shapes = require("Shapes");
var Transform = require("Transform");

cc.Class({
    extends: cc.Component,

    properties: {
        _initX: 0,
        _initY: 0,
        _initScale: 1,
        _touchStart: false,
        _touchEnd: false,
        index: 0, 
        shape: null,
        board: {
            default: null,
            type: cc.Node
        },

        hexagonPrefab: {
            default: null,
            type: cc.Prefab,
        }, 
        
    },
    recreate: function(){
        var shape = Shapes.getShareAtIndex(0);
        this.node.removeAllChildren(true);
        for(var pointIndex = 0; pointIndex < shape.points.length; pointIndex += 2){
            var points = shape.points;
            var x = points[pointIndex];
            var y = points[pointIndex + 1];

            var sprite =  cc.instantiate(this.hexagonPrefab);
            var position = Transform.pointToValue(x + shape.offsetX, y + shape.offsetY, {scale: 0.8});
            sprite.x = position.x;
            sprite.y = position.y;
            var hexagon = sprite.getComponent("Hexagon");
            hexagon.color = shape.color;
            hexagon.scale = 0.8;
            this.node.addChild(sprite);
        }

        this.shape = shape;
    },
    // LIFE-CYCLE CALLBACKS:



    onLoad () {
        // cc.log("shape");
        this.recreate();
        
        //TODO 事件冲突解决
        this.node.on(cc.Node.EventType.TOUCH_START, function(event){

            var board =  this.board.getComponent("Board");
            var checkPutIn = board.checkPutIn(this);
            cc.log("checkPutIn: " + checkPutIn);
            
            if(this._touchStart){
                return;
            }
             
            this._touchStart = true;
            this._initX = this.node.x;
            this._initY = this.node.y;
            this._initScale = this.node.scaleX;

            // var playScene = cc.director.getRunningScene();
            // var locationInScene = this.node.parent.convertToNodeSpaceAR(cc.p(event.getLocationX(), event.getLocationY()));
            // cc.log("TouchStart: x-> %f, y-> %f == Node: x -> %f, y -> %f", event.getLocationX(), event.getLocationY(), this.node.x, this.node.y);
            // cc.log("LocationInScene: x-> %f, y-> %f", locationInScene.x, locationInScene.y);
            var scaleUp = cc.scaleTo(0.1,1);
            // var moveUp = cc.moveTo(0.1, cc.p(this.node.x, locationInScene.y + this.node.height / 2));
            
            this.node.runAction(scaleUp);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){
           if(!this._touchStart){
                return false;
           }

           
           var locationInScene = this.node.parent.convertToNodeSpaceAR(cc.p(event.getLocationX(), event.getLocationY()));

           this.node.x = locationInScene.x;
           this.node.y = locationInScene.y ; //+ this.node.height / 2

        //    cc.log("Move node to x: %f, y: %f", this.node.x, this.node.y);
           this.board.getComponent("Board").hover(this);
           return true;
        },this);

        var touchEnd = function(event){
            if(this._touchEnd || !this._touchStart){
                return;
            }
            
            this._touchEnd = true;
            var board =  this.board.getComponent("Board");
            var result = board.put(this);

            if(!result){
                this.node.stopAllActions();
                var scaleDown = cc.scaleTo(0.1, this._initScale);
                var moveDown = cc.moveTo(0.1, cc.p(this._initX, this._initY));
                var callback = cc.callFunc(function(){
                    this._touchStart = this._touchEnd = false;
                }, this);
                this.node.runAction(cc.sequence(cc.spawn(scaleDown, moveDown), callback));
            }else{
                this.node.removeAllChildren();
                this.node.x = this._initX;
                this.node.y = this._initY;
                this.node.scaleX = this._initScale;
                this.node.scaleY = this._initScale;
                this.recreate();
                this._touchStart = this._touchEnd = false;
            }

        };
        this.node.on(cc.Node.EventType.TOUCH_END, touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, touchEnd, this);
    },

    start () {
      
    },

    update (dt) {


    },
});
