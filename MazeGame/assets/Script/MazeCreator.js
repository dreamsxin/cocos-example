var config = require("./Config");

cc.Class({
    extends: cc.Component,

    properties: {
        width:0,
        height:0,
        MazeBlock:cc.Prefab,
        MazeLayer:cc.Node,
        scale:0.3,
        Node:cc.Node,
    },

    start () {
        // 0=NotChecked 
        // 1=Checked

        //Initializer 
        this.roadSizeArr = [];
        this.roadSize = 0;
        this.blocks = config.Create2DArray(this.width,this.height);
        this.arr = config.Create2DArray(this.width,this.height);
        this.directionAll = config.Create2DArray(this.width,this.height);
        for(let i=0;i<this.width;i++)
        {
            for(let j=0;j<this.height;j++)
            {
                this.arr[i][j] = 0;
                this.directionAll[i][j] = [];
                let block = cc.instantiate(this.MazeBlock);
                block.parent = this.MazeLayer;
                block.scaleX = this.scale;
                block.scaleY = this.scale;
                block.setPosition(i*(this.scale*100), j* -(this.scale*100));
                block.active = true;
                this.blocks[i][j] = block;
            }
        }
        this.MazeLayer.setPosition(this.MazeLayer.x - (this.width/2)*(this.scale*100)+(this.scale*100)*0.5, this.MazeLayer.y + (this.height/2)*(this.scale*100));

        //Start Create Maze
        this.Kill(Math.floor(Math.random()*this.width),Math.floor(Math.random()*this.height));
    },

    //Check from Left-top to Right-bottom for set next kill Location 
    //Next kill location should have neighbor with Checked 
    //Because All roads have to connect with each other roads 
    Hunt(){

        //Initialize neighbor 
        var neighbors = [];

        for(var i = 0; i< this.width; i++)
        {
            for(var j =0; j<this.height; j++)
            {
                if(this.arr[i][j] == 0) 
                {
                    if(i-1>=0 && this.arr[i-1][j] == 1)
                    {
                        //West
                            neighbors.push(1);  
                    }

                    if(j-1>=0 && this.arr[i][j-1] == 1)
                    {
                        //North
                          neighbors.push(2);  
                    }

                    if(i+1<this.width && this.arr[i+1][j] == 1)
                    {
                        //East
                            neighbors.push(3);
                    }

                    if(j+i<this.height && this.arr[i][j+1] == 1)
                    {
                        //South
                            neighbors.push(4);
                    }

                    //Check this cell has neighbor, If it has, delete nearby wall and start kill from there
                    if(neighbors.length != 0)
                    {
                    this.DeleteWall(i,j,neighbors);
                    this.Kill(i,j);
                    return;
                    }

                }
            }

        }
    },

    //DeleteWall When hunt() detected neighbor wall 
    DeleteWall(i,j,arr)
    {
        
        var dir = arr[Math.floor(Math.random()*arr.length)];
        
        switch(dir)
        {
            case 1:
                    this.directionAll[i][j].push("West");
                    this.blocks[i][j].getChildByName('West').active = false;
                    this.directionAll[i-1][j].push("East");
                    this.blocks[i-1][j].getChildByName('East').active = false;
                    break;
            case 2:
                    this.directionAll[i][j].push("North");
                    this.blocks[i][j].getChildByName('North').active = false;
                    this.directionAll[i][j-1].push("South");
                    this.blocks[i][j-1].getChildByName('South').active = false;
                    break;
            case 3:
                    this.directionAll[i][j].push("East");
                    this.blocks[i][j].getChildByName('East').active = false;
                    this.directionAll[i+1][j].push("West");
                    this.blocks[i+1][j].getChildByName('West').active = false;
                    break;
            case 4:
                    this.directionAll[i][j].push("South");
                    this.blocks[i][j].getChildByName('South').active = false;
                    this.directionAll[i][j+1].push("North");
                    this.blocks[i][j+1].getChildByName('North').active = false;
                    break;
            default:
            break;
        }
    }, 
    SetDirection(x,y) {
        var possibles = [];
        var Dir = 0;
        //Check four directions for next Kill,
        //Check neighbor arrIndex is NotChecked and check that is wall or not
             if(x-1>=0 && this.arr[x-1][y] == 0)
             {
                 possibles.push(1);
             }
             if(y-1>=0 && this.arr[x][y-1] == 0)
             {
                 possibles.push(2);
             }
             if(x+1<=this.width-1 && this.arr[x+1][y] == 0)
             {
                 possibles.push(3);
             }
             if(y+1<=this.height-1 && this.arr[x][y+1] == 0)
             {
                 possibles.push(4);
             }
             Dir = possibles[Math.floor(Math.random()*possibles.length)];
         return Dir
     },
    Kill(x,y){
        // 1=West, 2=North, 3=East, 4=South
        //Set arr[x][y] to Checked 
        this.arr[x][y] = 1;

        //Get Direction and switch and play next Kill() 
        //If there's no directions from SetDirection(), then start Hunt();
        switch(this.SetDirection(x,y))
        {
            case 1:
                    this.directionAll[x][y].push("West");
                    this.blocks[x][y].getChildByName('West').active = false;
                    this.directionAll[x-1][y].push("East");
                    this.blocks[x-1][y].getChildByName('East').active = false;
                    this.Kill(x-1,y);
            break;

            case 2:
                    this.directionAll[x][y].push("North");
                    this.blocks[x][y].getChildByName('North').active = false;
                    this.directionAll[x][y-1].push("South");
                    this.blocks[x][y-1].getChildByName('South').active = false;
                    this.Kill(x,y-1);
            break;

            case 3:
                    this.directionAll[x][y].push("East");
                    this.blocks[x][y].getChildByName('East').active = false;
                    this.directionAll[x+1][y].push("West");
                    this.blocks[x+1][y].getChildByName('West').active = false;
                    this.Kill(x+1,y);
            break;

            case 4:
                    this.directionAll[x][y].push("South");
                    this.blocks[x][y].getChildByName('South').active = false;
                    this.directionAll[x][y+1].push("North");
                    this.blocks[x][y+1].getChildByName('North').active = false;
                    this.Kill(x,y+1);
            break;

            default:
            this.Hunt();
            break;
        }
    },

    ConvertFile() {
        var arr = new Object();
        for(let i = 0; i<this.directionAll.length;i++)
        {
            for(let j = 0; j<this.directionAll.length;j++) 
            {
                var direction = [];
                if(this.directionAll[i][j].length >= 1)
                {
                    for(let z = 0; z<this.directionAll[i][j].length; z++)
                    {
                        direction.push(this.directionAll[i][j][z]);
                    }
                }
                var tempObj = direction;
                arr[i+","+j] = tempObj;
                

                
            }
        }
        console.log(arr);

        //export to .json file 
        var jsonData = JSON.stringify(arr,null,"\t");
        let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(jsonData);
        let exportfileName = '1-1.json';
        let linkElement = document.createElement('a');
        linkElement.setAttribute('href',dataUri);
        linkElement.setAttribute('download',exportfileName);
        linkElement.click();
        console.log(jsonData);
    },

});
