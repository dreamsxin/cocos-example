// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var BOARD_RADIUS = 4;
var DEFAULT_BOARD_HEXAGON_WIDTH = 61.0;
var DEFAULT_BOARD_HEXAGON_HEIGHT = 67.0 ;
var BOARD_HEXAGON_MUP_X =  0.5;
var BOARD_HEXAGON_MUP_Y =  (Math.sqrt(3.0) * 0.5);

var COLORS_OFFSET = 2;
var COLORS = {
    "GRAY": "gray",
    "SHADOW": "shadow",
    "BLUE": "blue",
    "CYAN": "cyan",
    "DARK_BLUE": "darkblue",
    "DARK_CYAN": "darkcyan",
    "DARK_GREEN": "darkgreen",
    "DARK_LIGHT_YELLOW": "darklightyellow", 
    "DARKRED": "darkred", 
    "DARK_YELLOW": "darkyellow", 
    "GREEN": "green",
    "LIGHT_YELLOW": "lightyellow",
    "RED": "red",
    "WHITE": "white",
    "YELLOW": "yellow",
}

function getColorWithOffset(offset=COLORS_OFFSET){
    var values = [COLORS.GRAY, COLORS.SHADOW, COLORS.BLUE, COLORS.CYAN, COLORS.DARK_BLUE, COLORS.DARK_CYAN, COLORS.DARK_GREEN, 
        COLORS.DARK_LIGHT_YELLOW, COLORS.DARKRED, COLORS.DARK_YELLOW, COLORS.GREEN, COLORS.LIGHT_YELLOW, COLORS.WHITE, COLORS.YELLOW];
    var index =   (cc.random0To1() * (values.length - offset));
    return values[parseInt(index) + offset];
}

module.exports = {
    BOARD_RADIUS: BOARD_RADIUS,
    DEFAULT_BOARD_HEXAGON_WIDTH: DEFAULT_BOARD_HEXAGON_WIDTH,
    DEFAULT_BOARD_HEXAGON_HEIGHT: DEFAULT_BOARD_HEXAGON_HEIGHT,
    BOARD_HEXAGON_MUP_X: BOARD_HEXAGON_MUP_X,
    BOARD_HEXAGON_MUP_Y: BOARD_HEXAGON_MUP_Y,

    COLORS_OFFSET: COLORS_OFFSET,
    COLORS: COLORS,

    getColorWithOffset: getColorWithOffset,
    
}