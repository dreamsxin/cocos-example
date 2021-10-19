var config = require("./Config");
cc.Class({
    extends: cc.Component,

    properties: {
        width:8,
        height:8,
        Mapjson:cc.JsonAsset,      
        MazeLayer:cc.Node,
        MazeBlock:cc.Prefab,
        scale:1,
        FishX:3,
        FishY:2,
        CatX:4,
        CatY:4,
    },

    start () {
        this.directionAll = config.Create2DArray(this.width,this.height);
        var a = this.Mapjson.json;
        for(let i = 0; i<this.width;i++)
        {
            for(let j = 0; j<this.height;j++)
            {
                this.directionAll[i][j] = a[i+","+j];

                //sort order =  east,north,south,west
                let block = cc.instantiate(this.MazeBlock);
                console.log(i,j,this.directionAll[i][j].sort().toString());
                    switch(this.directionAll[i][j].sort().toString())
                    {
                        case "East,North,West":
                        block.getChildByName("East,North,West").active = true;
                        break;
                        case "East,North,South":
                        block.getChildByName("East,North,South").active = true;
                        break; 
                        case "East,North,West":
                        block.getChildByName("East,North,West").active = true;
                        break;
                        case "North,South,West":
                        block.getChildByName("North,South,West").active = true;
                        break;
                        case "East,South,West":
                        block.getChildByName("East,South,West").active = true;
                        break;
                        
                        case "West":
                        block.getChildByName("West").active = true;
                        break;
                        case "East":
                        block.getChildByName("East").active = true;
                        break;
                        case "South":
                        block.getChildByName("South").active = true;
                        break;
                        case "North":
                        block.getChildByName("North").active = true;
                        break;

                        case "East,West":
                        block.getChildByName("East,West").active = true;
                        break;
                        case "North,South":
                        block.getChildByName("North,South").active = true;
                        break;

                        case "East,South":
                        block.getChildByName("East,South").active = true;
                        break;
                        case "North,West":
                        block.getChildByName("North,West").active = true;
                        break;
                        case "East,North":
                        block.getChildByName("East,North").active = true;
                        break;
                        case "South,West":
                        block.getChildByName("South,West").active = true;
                        break;

                        case "East,North,South,West":
                        block.getChildByName("Every").active = true;
                        break;
                    }
                block.parent = this.MazeLayer;
                block.scaleX = this.scale;
                block.scaleY = this.scale;
                block.setPosition(i*(this.scale*100), j* -(this.scale*100));
                block.active = true;
            }
         }

         this.MazeLayer.setPosition(this.MazeLayer.x - (this.width/2)*(this.scale*100)+(this.scale*100)*0.5, this.MazeLayer.y + (this.height/2)*(this.scale*100));
    },
});
