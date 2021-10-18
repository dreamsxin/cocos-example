// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var {COLORS} = require("Common");

var Shape = function(){
    this.points = [];
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.color = COLORS.GRAY
};


function createShare(points, color, offsetX = 0, offsetY = 0){
    var startX = 0;
    var startY = 0;
    var endY = 0;
    var endX = 0;

    for(var index = 0; index < points.length ; index+=2){
        var x = points[index];
        var y = points[index + 1];
        startX = Math.min(startX, x);
        startY = Math.min(startY, y);

        endX = Math.max(endX, x);
        endY = Math.max(endY, y);
    }
    var sh = new 
    Shape();
    sh.points = points;
    sh.startX = startX;
    sh.startY = startY;
    sh.endX = endX;
    sh.endY = endY;
    sh.color = color;
    sh.offsetX = offsetX;
    sh.offsetY = offsetY;
    
    return sh;
}




var SHAPES = [ 
    /*
        * * * * 
    */
    createShare( 
        [   
            0, 0,
            1, 0, 
            2, 0, 
            3, 0 
        ], COLORS.BLUE, -1.5),


    /*
           *
          * 
         * 
        * 
    */
    createShare( 
        [   0, 0, 
            0, 1, 
            0, 2, 
            0, 3 
        ] , COLORS.CYAN, 0,  -1.5),
        
    /*
          *
         * *
          * 
    */    
    createShare( 
        [   
            -1, 2,
            -1, 1, 
            0 , 1,
            0 , 0,
            // -1, 0
        ] , COLORS.DARK_BLUE)   
];


function getShareAtIndex(index){
    if(index == undefined){
        index = parseInt(Math.random() * SHAPES.length);
    }
 
    return SHAPES[index];
}


module.exports = {
    getShareAtIndex: getShareAtIndex,
    Shape : Shape
}