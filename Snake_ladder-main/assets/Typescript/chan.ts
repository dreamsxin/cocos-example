
import { _decorator, Component, Node, TiledMap, tween, Vec2, Vec3, TiledLayer, UITransform, TiledTile, SpriteFrame, Sprite, Label, Prefab, instantiate, Button, color, Color, math, toDegree} from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Chan
 * DateTime = Wed Sep 15 2021 17:11:08 GMT+0530 (India Standard Time)
 * Author = chandan_krishnani
 * FileBasename = chan.ts
 * FileBasenameNoExtension = chan
 * URL = db://assets/Typescript/chan.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('Chan')
export class Chan extends Component {
 
    @property(TiledMap)
    abc:TiledMap=null;

    @property(Sprite)
    character1:any=null;

    @property(Sprite)
    character2:any=null;

    @property(Prefab)
    num:Prefab=null;

    @property(Label)
    rand=null;

    @property(SpriteFrame)
    dice=[];

    @property(Label)
    knight:null;
    @property(Label)
    robot:null;

    @property(Button)
    butt=null;
    
    @property(Prefab)
    snake=null;


    @property(Prefab)
    dice_pre=null;

    player1_dice:any=null;
    player2_dice:any=null;
    player1_rand:number=0;
    player2_rand:number=0;
    player1_active:boolean=true;
    layer:TiledLayer=null;
    tile1: TiledTile=null;
    tile2: TiledTile=null;
    tile3: TiledTile=null;
    tile4:TiledTile=null;
    tile5:TiledTile=null;
    count:number=0;

    track:boolean=false;
    player1_current_pos=[0,10];
    player2_current_pos=[0,10];

    randomnumber(event:Event,abc:string)
    {
      
      
      let knight:any=this.knight;
      let robot:any=this.robot;
      if(abc=="knight" && this.player1_active)
      {
         
         this.player1_rand=Math.random()*6;
         this.player1_rand=Math.floor(this.player1_rand);
         this.player1_dice.getComponent(Sprite).spriteFrame=this.dice[this.player1_rand];
         robot.node.getComponent(Label).color=new Color(255,255,255);
         knight.node.getComponent(Label).color=new Color(255,255,0);
         this.move(abc,this.player1_rand);

         this.player1_active=false;
         console.log(this.track);
      }
      if(abc=="robot" && !this.player1_active)
      {
        knight.node.getComponent(Label).color=new Color(255,255,255);
        robot.node.getComponent(Label).color=new Color(255,255,0);
 
        this.player2_rand=Math.random()*6;
        this.player2_rand=Math.floor(this.player2_rand);
        this.player2_dice.getComponent(Sprite).spriteFrame=this.dice[this.player2_rand];
        this.player1_active=true;
        this.move(abc,this.player2_rand);
      }
      
    }
    onLoad()
    {
      this.player1_dice=instantiate(this.dice_pre);
      this.node.addChild(this.player1_dice);

      
      this.player1_dice.setPosition(403,53,1);
      this.player2_dice=instantiate(this.dice_pre);
      this.node.addChild(this.player2_dice);
      this.player2_dice.setPosition(-400,53,1);

    }

    move(abc:string,rand:number)
    {
     
      rand=rand+1;
      if(abc=="knight")
      {
        for(var i=1;i<=rand;i++)
        {
          if(this.player1_current_pos[1]%2==0)
          {

            if(this.player1_current_pos[0]==10)
            {
              this.player1_current_pos[1]--;
            }
            else
            {
             this.player1_current_pos[0]++;
            }
          }
          else
         {
          if(this.player1_current_pos[0]==1)
          {
            this.player1_current_pos[1]--;
          }
          else
          {
            this.player1_current_pos[0]--;

          }
        }
          this.animatemove(i)
         
       
        }
        if(this.player1_current_pos[0]==this.player2_current_pos[0] && this.player1_current_pos[1]==this.player2_current_pos[1])
        {
          this.player2_current_pos[0]=1;
          this.player2_current_pos[1]=10;
          this.animatemove2(1)

        }
       
      }
     else
      {
        for(var i=1;i<=rand;i++)
        {
          if(this.player2_current_pos[1]%2==0)
          {

            if(this.player2_current_pos[0]==10)
            {
              this.player2_current_pos[1]--;
            }
            else
            {
             this.player2_current_pos[0]++;
            }
          }
          else
         {
          if(this.player2_current_pos[0]==1)
          {
            this.player2_current_pos[1]--;
          }
          else
          {
            this.player2_current_pos[0]--;

          }
        }
          this.animatemove2(i)

       
        }
        if(this.player1_current_pos[0]==this.player2_current_pos[0] && this.player1_current_pos[1]==this.player2_current_pos[1])
        {
          this.player1_current_pos[0]=1;
          this.player1_current_pos[1]=10;
          this.animatemove(1)

        }
       
      }

    }
    animatemove(i:number)
    {
      this.tile1=this.layer.getTiledTileAt(this.player1_current_pos[0],this.player1_current_pos[1],true);
      tween(this.character1.node)
      .delay(i/2)
      .to(0.4,{position : new Vec3(this.tile1.node.position.x,this.tile1.node.position.y,10)})
      .start();


    }
    animatemove2(i:number)
    {
      this.tile2=this.layer.getTiledTileAt(this.player2_current_pos[0],this.player2_current_pos[1],true);
      tween(this.character2.node)
      .delay(i/2)
      .to(0.4,{position : new Vec3(this.tile2.node.position.x,this.tile2.node.position.y,10)})
      .start();


    }
    snake_array:any=[];
    snakeAndladder()
    {
      console.log("Okay called");
   
      this.tile4=this.layer.getTiledTileAt(6,1,true);
      this.tile5=this.layer.getTiledTileAt(9,10,true);
      let diff1:number=this.tile4.node.position.y-this.tile5.node.position.y;
      let diff2:number=this.tile4.node.position.x-this.tile5.node.position.x;
      this.snake_array[0]=instantiate(this.snake);
      this.abc.node.addChild(this.snake_array[0]);
      this.snake_array[0].setPosition(this.tile4.node.position.x+220,this.tile4.node.position.y+220,1);
      this.snake_array[0].setContentSize(400,diff1);
      let ang = Math.atan2(diff1,diff2);
      console.log(toDegree(ang)-90);
      tween(this.snake_array[0])
      .to(0.5,{angle : toDegree(ang)-90})
      .start();

      // this.snake_array[0].node.setSiblingIndex(300);

    

    }

    start () {
    
    this.layer=this.abc.getLayer("MAIN"); 
   
    let nd:any=null;
    let snake:any=null;
    

    for(var i=10;i>=1;i--)
    {
      for(var j=1;j<=10;j++)
      {
        nd=instantiate(this.num);
        this.abc.node.addChild(nd);
        nd.setContentSize(500,500);
        nd.getComponent(Label).LineHeight=40;
        nd.getComponent(Label).string=++this.count;
        if(i%2==0)
        {
        this.tile3=this.layer.getTiledTileAt(j,i,true);
        nd.setPosition(this.tile3.node.position.x,this.tile3.node.position.y,1);
        }
        else
        {
          this.tile3=this.layer.getTiledTileAt(11-j,i,true);
          nd.setPosition(this.tile3.node.position.x,this.tile3.node.position.y,1);

        }
      }
     
    }
    this.tile1=this.layer.getTiledTileAt(1,10,true);
    this.tile2=this.layer.getTiledTileAt(1,10,true);
    this.character1.node.setPosition(this.tile1.node.position.x,this.tile1.node.position.y,1);
    this.character2.node.setPosition(this.tile2.node.position.x,this.tile2.node.position.y,1);
    this.character1.node.setSiblingIndex(120);
    this.character2.node.setSiblingIndex(120);
    this.snakeAndladder();
       
        // [3]
    }

     update (deltaTime: number) 
     {
 
         // [4]
     }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
