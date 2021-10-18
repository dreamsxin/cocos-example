
var Common = require("Common");
var Transform = require("Transform");

var RIGHT_LINES = [
  [-4, 0, -3, -1, -2, -2, -1, -3, 0, -4],
  [-4, 1, -3, 0, -2, -1, -1, -2, 0, -3, 1, -4],
  [-4, 2, -3, 1, -2, 0, -1, -1, 0, -2, 1, -3, 2, -4],
  [-4, 3, -3, 2, -2, 1, -1, 0, 0, -1, 1, -2, 2, -3, 3, -4],
  [-4, 4, -3, 3, -2, 2, -1, 1, 0, 0, 1, -2, 2, -2, 3, -3, 4, -4],
  [-3, 4, -2, 3, -1, 2, 0, 1, 1, 0, 2, -1, 3, -2, 4, -3],
  [-2, 4, -1, 3, 0, 2, 1, 1, 2, 0, 3, -1, 4, -2],
  [-1, 4, 0, 3, 1, 2, 2, 1, 3, 0, 4, -1],
  [0, 4, 1, 3, 2, 2, 3, 1, 4, 0]
];

var Board = cc.Class({
    extends: cc.Component,
    statics:{
    
    },
    properties: {
        _hexgaons: {
            default: {},
        },
        _hexagonsHover: {
            default: {},
        },
        hexagonPrefab: {
            default: null,
            type: cc.Prefab,
        }
    },
    buildKey: function(x, y){
        return x + "_" + y;
    },
    parseKey: function(key){
        var index = key.indexOf("_");
        var x = parseInt(key.substring(0, index));
        var y = parseInt(key.substring(index + 1));

        return cc.p(x, y);
    },
    findMatchHexagon: function(hexagonShapePool){
        return this.findMatchHexagonWithFilter(hexagonShapePool);
    },
    findMatchHexagonWithFilter: function(hexagonShapePool, filter){
        var hexaongs = hexagonShapePool.node.children;

        var matches = {};
        var matcheKeys = [];
        var matchCount = 0;
        for(var index = 0; index < hexaongs.length; index++){
            var hex = hexaongs[index];
            var pointInWorld = hexagonShapePool.node.convertToWorldSpaceAR(cc.p(hex.x, hex.y));
            var pointInBoard = this.node.convertToNodeSpaceAR(pointInWorld);
            var hexIndexInBoard = Transform.valueToPoint(pointInBoard.x, pointInBoard.y, {scale: 0.8});
            
            // cc.log("hitTest:origin(%f, %f) world(%f, %f), board(%f, %f), index(%d, %d)",hex.x, hex.y,  pointInWorld.x, pointInWorld.y, pointInBoard.x, pointInBoard.y, hexIndexInBoard.x, hexIndexInBoard.y);
            var key = this.buildKey(hexIndexInBoard.x, hexIndexInBoard.y);
            if(this._hexgaons[key] && (!filter || filter(this._hexgaons[key], hex))){
                matches[key] = hex;
                matcheKeys[matchCount++] = key;
            }
        }
       
        matches["keys"] = matcheKeys;
        return matches;
    }
    ,
    put: function(hexagonShapePool){
        var matchers = this.findMatchHexagonWithFilter(hexagonShapePool, function(hex1, hex2){
            var hexagonComp = hex1.getComponent("Hexagon");
            return hexagonComp.color == Common.COLORS.GRAY;
        });

        var keys = matchers["keys"];
        var matched = keys.length == hexagonShapePool.shape.points.length / 2;

        if(matched){
            for(var k = 0 ; k < keys.length ; k++){
                var key = keys[k];
                var hexagon =  this._hexgaons[key].getComponent("Hexagon");   
                hexagon.color = matchers[key].getComponent("Hexagon").color;
                hexagon.setSpriteFrameByColor(hexagon.color);
                hexagon.setHover(false);
            }

            
            var connectedLines = this.findLines();
            //clear lines
            connectedLines.forEach(line => {
                line.forEach (blockKey => {
                    //将已经消除的行消除掉
                    var block =  this._hexgaons[blockKey].getComponent("Hexagon");
                    block.clear();

                    //TODO 计算积分 
                });
            });
        }

        return matched;
    },
    findMultipleLines: function(map){
        var lines = [];
        var lineIndex = 0;
       
        
        for(var i = -Common.BOARD_RADIUS; i <= Common.BOARD_RADIUS; i++){
            var singleLine = [];
            var isConnected = true;
            for(var j = -Common.BOARD_RADIUS; j <= Common.BOARD_RADIUS; j++){
                var point = map(i, j);
                var key = this.buildKey(point.x, point.y);
                var block = this._hexgaons[key] ? this._hexgaons[key].getComponent("Hexagon") : null;
                
                if(block){
                    singleLine.push(key);
                    if(block.isEmpty()){
                        isConnected = false;
                        break;
                    }
                }

            
            }

            if(isConnected){
                lines.push(singleLine);
            }
        }

        return lines;
    },

    findLines: function(){
        var leftLines = this.findMultipleLines(function(i, j){
            return {x: i, y: j};
        });

        var horizontalLings = this.findMultipleLines(function(i, j){
            return {x: j, y: i};
        });

        
        var rightLines = [];
        RIGHT_LINES
        .forEach( (line) => {
            var i = 0;
            var tmp = [];
            for(; i < line.length; i+=2){
                var key = this.buildKey(line[i], line[i + 1]);
                var block = this._hexgaons[key] ? this._hexgaons[key].getComponent("Hexagon") : null;
                tmp.push(key);
                if(block && block.isEmpty()){
                     break;
                }
            }

            if(i == line.length){
                rightLines.push(tmp);   
            }
        });
 
        var lines = leftLines.concat(horizontalLings, rightLines);
        cc.log(lines.toString());

        return lines;
    },
    /**
     * 检查图片是否能够放入棋盘
     */
    checkPutIn: function(hexagonShapePool){
        for(var i = -Common.BOARD_RADIUS; i <= Common.BOARD_RADIUS; i++){
            for(var j = -Common.BOARD_RADIUS; j <= Common.BOARD_RADIUS; j++){
                var points =  hexagonShapePool.shape.points;
                var hexaongs = {};

                for(var p = 0; p < points.length ; p += 2){
                    var x = points[p] + i;
                    var y = points[p + 1] + j;
                    var key = this.buildKey(x, y);
                    hexaongs[key] = this._hexgaons[key];
                }


                var result = true;
                for(var k in hexaongs){
                    var hex = hexaongs[k];
                    if(!!!hex){
                        result = false;
                        continue;
                    }
                    var component =  hex.getComponent("Hexagon");   
                    result &= component.isEmpty();
                }

                if(result){
                    return true;
                }
            }
        }

        return false;
    },
    hover: function(hexagonShapePool){
        var matchers = this.findMatchHexagonWithFilter(hexagonShapePool, function(hex1, hex2){
                var hexagonComp = hex1.getComponent("Hexagon");
                return hexagonComp.color  == Common.COLORS.GRAY;
        });

        var keys = matchers["keys"];
        var matched = keys.length == hexagonShapePool.shape.points.length / 2;
   

        if(matched){
            var hexSet = Object.assign({}, matchers, this._hexagonsHover);
            for(var k in hexSet){
                this.setHoverForHexagon(this._hexgaons[k], !!matchers[k]);
            }

            this._hexagonsHover = matchers;
        }else{
            for(var k in this._hexagonsHover){
                this.setHoverForHexagon(this._hexgaons[k], false);
            }

            this._hexagonsHover = {};
        }
    },
    setHoverForHexagon(hexagon, hover){
        if(!hexagon){
            return;
        }
        var hexagonCnp = hexagon.getComponent("Hexagon");
        hexagonCnp.setHover(hover);
    }
    ,
    onLoad:function () {
        this.node.width = this.width;
        this.node.height = this.height;

        for(var i = -Common.BOARD_RADIUS; i <= Common.BOARD_RADIUS; i++){
            for(var j = -Common.BOARD_RADIUS; j <= Common.BOARD_RADIUS; j++){
                //-1 -2 -3 -4 ROW
                //-4 -3 -2 -1 0 1 2 3 4  COL

                //ROW 1 2 3 4 
                //COL -1 -2 -3 -4 0 1 2 3 4    
                if(i != 0 && Math.abs(i + j) > Common.BOARD_RADIUS)
                    continue;
 
               
                var scale = 0.8;    
                var width = Common.DEFAULT_BOARD_HEXAGON_WIDTH  * scale;
                var height = Common.DEFAULT_BOARD_HEXAGON_HEIGHT  * scale;
                   
                var posiiton = Transform.pointToValue(i, j, {scale: scale});
                var sprite =  cc.instantiate(this.hexagonPrefab);
                sprite.x = posiiton.x;
                sprite.y = posiiton.y;
                var hexagon = sprite.getComponent("Hexagon");
                hexagon.scale = scale;
                hexagon.color = Common.COLORS.GRAY;
                this.node.addChild(sprite);

                var key = this.buildKey(i, j);
                this._hexgaons[key] = sprite;

                // var reverseIndex = Transform.valueToPoint(posiiton.x, posiiton.y, {scale: scale});
                // cc.log("index: %d,%d <--> reverseIndex: %d, %d", i, j, reverseIndex.x, reverseIndex.y);

                var labelNode = new cc.Node();
                var label = labelNode.addComponent(cc.Label);
                label.string = i + "," + j;
                label.fontSize = 12;
                label.verticalAlign = cc.Label.CENTER;
                label.horizontalAlign = cc .Label.CENTER;
                label.lineHeight = 20;
                labelNode.x = posiiton.x;
                labelNode.y = posiiton.y;
                this.node.addChild(labelNode);
            }
        }
    }


     
})
