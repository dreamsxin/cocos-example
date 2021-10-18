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

/*
Matrix: 

BOARD_HEXAGON_HEIGHT                       0                                                0     
BOARD_HEXAGON_MUP_X * BOARD_HEXAGON_HEIGHT  BOARD_HEXAGON_MUP_Y  * BOARD_HEXAGON_HEIGHT     0
*/

//see https://github.com/photonstorm/phaser
function pointToValue(x, y, options = {}){
            /*
             x *   BOARD_HEXAGON_HEIGHT 0                     
             y     BOARD_HEXAGON_MUP_X  BOARD_HEXAGON_MUP_Y 
            */
           var scale = options.scale ? options.scale : 1;
           var offsetX = options.offsetX ? options.offsetX: 0;
           var offsetY = options.offsetY ? options.offsetY : 0;
           
           
           var width = scale * Common.DEFAULT_BOARD_HEXAGON_WIDTH;
           var height = scale * Common.DEFAULT_BOARD_HEXAGON_HEIGHT;

           var matrix = {
                a: height, b: 0, tx: 0,
                c: (height * Common.BOARD_HEXAGON_MUP_X), d: (height * Common.BOARD_HEXAGON_MUP_Y), ty:0
           };
           
            
           var result = cc.p(0, 0);
           result.x = matrix.a * x + matrix.c * y + matrix.tx;
           result.y = matrix.b * x + matrix.d * y + matrix.ty;
            return  result;
}




//see https://github.com/photonstorm/phaser
function valueToPoint(x, y, options = {}){
  
  var scale = options.scale ? options.scale : 1;
  var offsetX = options.offsetX ? options.offsetX: 0;
  var offsetY = options.offsetY ? options.offsetY : 0;

  var width = scale * Common.DEFAULT_BOARD_HEXAGON_WIDTH;
  var height = scale * Common.DEFAULT_BOARD_HEXAGON_HEIGHT;
 
  var matrix = {
    a: height, b: 0, tx: 0,
    c: (height * Common.BOARD_HEXAGON_MUP_X), d: (height * Common.BOARD_HEXAGON_MUP_Y), ty:0
 };

  var result = cc.p(0, 0);
  var id = 1.0 / (matrix.a * matrix.d + matrix.c * -matrix.b);

  result.x = matrix.d * id * x + -matrix.c * id * y + (matrix.ty * matrix.c - matrix.tx * matrix.d) * id;
  result.y = matrix.a * id * y + -matrix.b * id * x + (-matrix.ty * matrix.a + matrix.tx * matrix.b) * id;

  return   cc.p(parseInt(Math.round(result.x)), parseInt(Math.round(result.y)));
}


module.exports = {
    pointToValue: pointToValue,
    valueToPoint: valueToPoint
}