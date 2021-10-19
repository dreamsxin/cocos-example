var config = require("./Config");

cc.Class({
    extends: cc.Component,

    properties: {
        Fish:cc.Node,
        Canvas:cc.Node,
    },
    onLoad() {
        var self = this;
        var Xorigin;
        var XforCheck;
        var Yorigin;
        var YforCheck;
        var IsWorkable;
        var TouchLength = 30;
        console.log(config.TouchLength);

        this.Canvas.on('touchstart',function(touch){
            Xorigin = touch.getLocation().x;
            XforCheck = Xorigin;
            IsWorkable = true;

            Yorigin = touch.getLocation().y;
            YforCheck = Yorigin;
            IsWorkable = true;
        },this.node);

        this.Canvas.on('touchmove',function(event) {  
              var delta = event.touch.getDelta();


            XforCheck += delta.x;
            YforCheck += delta.y;


            //Right
            if(XforCheck > Xorigin+config.TouchLength)
            {
                if(IsWorkable) {
                    if(this.EastPtr.active)
                    {
                        this.GoEast();
                        IsWorkable = false;
                    }
                }
                
            }
            //Left
            if(XforCheck < Xorigin-config.TouchLength)
            {
                if(IsWorkable){ 
                    if(this.WestPtr.active)
                    {
                        this.GoWest();
                        IsWorkable = false;
                    }
                }
            }

            //Up
            if(YforCheck > Yorigin+config.TouchLength)
            {
                if(IsWorkable) {
                    if(this.NorthPtr.active)
                    {
                        this.GoNorth();
                        IsWorkable = false;
                    }
                }
                
            }

            //Down 
            if(YforCheck < Yorigin-config.TouchLength)
            {
                if(IsWorkable){ 
                    if(this.SouthPtr.active)
                    {
                        this.GoSouth();
                        IsWorkable = false;
                    }
                }
            }
            

        },this);   

    },
    onCollisionEnter: function(other,self) {


        //If cat overlaped with fish  
        if(other.tag == 1)
        {
            cc.director.loadScene("Main");
        }
    },
    start () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.NorthPtr =  this.node.getChildByName("NorthPtr");
        this.SouthPtr =  this.node.getChildByName("SouthPtr");
        this.EastPtr =  this.node.getChildByName("EastPtr");
        this.WestPtr =  this.node.getChildByName("WestPtr");

        var Loader = cc.find("Canvas/MazeLoader").getComponent("MazeLoader"); //Get Info's from MazeManager 
        this.mapScale = Loader.scale;
        this.width = Loader.width;
        this.height = Loader.height;
        this.directionAll = Loader.directionAll;
        this.GridLocX = 0;
        this.GridLocY = 0;
        this.CanGoArr = [];
        this.actions = [];
        this.LatestDir = null;

        this.node.zIndex = 100;
        this.Fish.zIndex = 99;
        this.node.scaleX = Loader.scale - 0.2;
        this.node.scaleY = Loader.scale - 0.2;
        this.Fish.scaleX = Loader.scale - 0.2;
        this.Fish.scaleY = Loader.scale - 0.2;
        //Set Default position of Cat 
         this.SetDefaultPosition(Loader.CatX-1, Loader.CatY-1);
         this.SetFishPosition(Loader.FishX-1, Loader.FishY-1);
        //To Check Where cat can go 
         this.Stop();

    },
    GoNorth() {
        this.SetPositionInGrid(this.GridLocX,this.GridLocY-1);
        this.LatestDir = "North";
        this.AutoMove();
    },
    GoSouth() {
        this.SetPositionInGrid(this.GridLocX,this.GridLocY+1);
        this.LatestDir = "South";
        this.AutoMove();
    },
    GoWest() {
        this.SetPositionInGrid(this.GridLocX-1,this.GridLocY)
        this.LatestDir = "West";
        this.AutoMove();
    },
    GoEast() {
        this.SetPositionInGrid(this.GridLocX+1,this.GridLocY);
        this.LatestDir = "East";
        this.AutoMove();
    },
    ChangeOpposite(){
        //Set Latest Direction's opposite 
        switch(this.LatestDir)
        {
            case "North":
            this.LatestDir = "South";
            break;
            case "South":
            this.LatestDir = "North";
            break;
            case "West":
            this.LatestDir = "East";
            break;
            case "East":
            this.LatestDir = "West";
            break;
        }
    },
    AutoMove() {
        //initialize roadarr
        var roadarr = [];

        //Get All direction that cat can go
        for (let i = 0; i<this.directionAll[this.GridLocX][this.GridLocY].length; i++)
        {
            //Set index
            roadarr[i] = this.directionAll[this.GridLocX][this.GridLocY][i];
        }

        //Except Latest Direction's opposite , because it should be one direction movement 
        if(this.LatestDir != null)
        {
            this.ChangeOpposite();
            for(let j = 0; j<roadarr.length;j++)
            {
                if(this.LatestDir == roadarr[j])
                {
                    //Delete index 
                    roadarr.splice(j,1);
                }
            }
        }

        //Except LatestDir, it should be 'one' to play next movement
        //If not, it is a dead-end or three-way or four-way
        //Cat should stop at dead-end or three, four-way
        //So Stop movement and return to cannot reach to the switch function
        if(roadarr.length != 1)
        {
            this.Stop();
            return;
        }

        //Order Next movement that cat can go 
        switch(roadarr[0])
        {
            case "West":
            this.GoWest();
            break;

            case "North":
            this.GoNorth();
            break;

            case "East":
            this.GoEast();
            break;

            case "South":
            this.GoSouth();
            break;

            default:
            break;
        }

    },
    CheckWhereCanGo() {
        //Actual set part
        for(let j = 0; j<this.CanGoArr.length;j++)
        {
            switch(this.CanGoArr[j])
            {
                case "West":
                this.WestPtr.active = true;
                break;
    
                case "North":
                this.NorthPtr.active = true;
                break;
    
                case "East":
                this.EastPtr.active = true;
                break;
    
                case "South":
                this.SouthPtr.active = true;
                break;
    
                default:
                break;
            }
        }
    },
    Stop() {
        this.WestPtr.active = false;
        this.NorthPtr.active = false;
        this.EastPtr.active =  false;
        this.SouthPtr.active = false;
        this.CanGoArr = [];

        //Get All possiblities that Cat Can go
        for (let i = 0; i<this.directionAll[this.GridLocX][this.GridLocY].length; i++)
        {
            this.CanGoArr[i] = this.directionAll[this.GridLocX][this.GridLocY][i];
        }
        //Play movement part, seperate with actions length
        if(this.actions.length == 1)
        {
         this.node.runAction(
              cc.sequence(
                this.actions[0],
                cc.callFunc(this.CheckWhereCanGo,this),
              )
            );
        }
        else if(this.actions.length > 1)
        {
            var seq1 = cc.sequence(this.actions);
          this.node.runAction(
              cc.sequence(
                  seq1,
                  cc.callFunc(this.CheckWhereCanGo,this),
              )
          );
        }
        else
        {
            this.CheckWhereCanGo();
        }

        //AfterAction, initialize actions array to get next movement 
        this.actions = [];
        

    },

    //SetPosition and push movement action to actions array. 
    //actions will play at Stop() function 
    SetPositionInGrid(x,y) {

        var locX = x * (this.mapScale*100)
        var locY = y * -(this.mapScale*100)
        var action = cc.moveTo(config.CatSpeed,cc.v2(locX,locY));
        this.actions.push(action);
        this.GridLocX = x;
        this.GridLocY = y;
    },

    //For Set Start Location 
    SetDefaultPosition(x,y) {
        this.node.setPosition(
        cc.v2(
        x * (this.mapScale*100),
        y * -(this.mapScale*100)
        ));
        this.GridLocX = x;
        this.GridLocY = y;
    },

    //For Set Fish's Start Location 
    SetFishPosition(x,y) {
        this.Fish.setPosition(
            cc.v2(
            x *(this.mapScale*100),
            y * -(this.mapScale*100)
            ));
    }
});
