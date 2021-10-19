
import { _decorator, Component, Node, TiledMap, Vec2, Label, UITransformComponent, TiledTile, TiledLayer, tween, Vec3, computeRatioByType, easing, Prefab, instantiate, size, SpriteFrame, UITransform, toDegree, math } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = TileScript
 * DateTime = Wed Sep 15 2021 11:44:38 GMT+0530 (India Standard Time)
 * Author = alokraj0024
 * FileBasename = TileScript.ts
 * FileBasenameNoExtension = TileScript
 * URL = db://assets/scripts/TileScript.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 * Math.floor(Math.random() * (max - min + 1)) + min;
 */
 
@ccclass('TileScript')
export class TileScript extends Component {
    
    @property(TiledMap)
    tileMap : TiledMap = null;

    @property(Node)
    playerOne : Node = null;

    @property(Node)
    playerTwo : Node = null;

    @property(Prefab)
    prefabLabel : Prefab = null;

    @property(Prefab)
    snake : Prefab = null;

    @property(Prefab)
    ladder : Prefab = null;

    tileLayer : TiledLayer = null;
    tile : TiledTile = null;
    tileCurrPos : Vec3 = null;
    noOfSix : number = 0;
    playerOneTileX : number = 0;
    playerOneTileY : number = 9;
    playerTwoTileX : number = 0;
    playerTwoTileY : number = 9;
    playerOneinitialPos : Vec3 = null;
    playertwoInitialPos : Vec3 = null;

    arrayOfSnakesHead : number[] = [];
    arrayOfSnakesTail : number[] = [];
    arrayOfLaddersHead : number[] = [];
    arrayOfLaddersTail : number[] = [];

    start () {
        this.tileLayer = this.tileMap.getLayer('Tile Layer 1');
        this.tileCurrPos = this.tileLayer.getTiledTileAt(0,9,true).node.position;

        this.playerOne.setPosition(new Vec3(this.tileCurrPos.x+8,this.tileCurrPos.y+15,0));
        this.playerTwo.setPosition(new Vec3(this.tileCurrPos.x+25,this.tileCurrPos.y+15,0));
        tween(this.playerOne)
            .to(1,{angle : 90})
        let k = 1;
        for(let i = 9;i>=0;i--)
        {
            let startLoop : number = null;
            let endLoop : number = null;
            if(i%2==0)
            {
                for(let l=9;l>=0;l--)
                {
                    let ch = instantiate(this.prefabLabel);
                    let tileNow = this.tileLayer.getTiledTileAt(l,i,true).node.position;
                    ch.getComponent(Label).string = `${k++}`;
                    this.tileMap.node.addChild(ch);
                    ch.setPosition(tileNow.x+10,tileNow.y-8,1);
                }
            }
            else
            {
                for(let j=0;j<=9;j++)
                {
                    let ch = instantiate(this.prefabLabel);
                    let tileNow = this.tileLayer.getTiledTileAt(j,i,true).node.position;
                    ch.getComponent(Label).string = `${k++}`;
                    this.tileMap.node.addChild(ch);
                    ch.setPosition(tileNow.x+10,tileNow.y-8,1);
                }
            }
        }
        this.addSnakes();
        this.addLadders();
    }

    onLoad()
    {
        //this.node.on(Node.EventType.MOUSE_DOWN, this.movePlayer,this)
    }
    addSnakes()
    {
        let noOfSnakes = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        console.log(' No of snakes : ' + noOfSnakes);
        for(let i=0;i<noOfSnakes;i++)
        {
            let randomStartX = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
            let randomStartY = Math.floor(Math.random() * (7 - 0 + 1)) + 0;
            console.log('start ' + randomStartX,randomStartY);

            let randomEndX = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
            let randomEndY = Math.floor(Math.random() * (9 - (randomStartY+2) + 1)) + (randomStartY+2);
            console.log('end ' + randomEndX,randomEndY);

            let tileNowRandom1 = this.tileLayer.getTiledTileAt(randomStartX,randomStartY,true).node.position;
            let tileNowRandom2 = this.tileLayer.getTiledTileAt(randomEndX,randomEndY,true).node.position;

            let diffX = tileNowRandom1.x - tileNowRandom2.x;
            let diffY = tileNowRandom1.y - tileNowRandom2.y;
            let lengthOfSnake = Math.sqrt((diffX*diffX)+(diffY*diffY));

            let chil = instantiate(this.snake);
            this.tileMap.node.addChild(chil);
            chil.setPosition(tileNowRandom1.x+16,tileNowRandom1.y+16,1);
            chil.getComponent(UITransform).setContentSize(20,lengthOfSnake);
            let ang = Math.atan2(diffY,diffX);
            tween(chil)
                .to(1,{angle : toDegree(ang)-90})
                .start();
        }

    }
    addLadders()
    {
        let noOfLadders = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        console.log('No of ladders : ' + noOfLadders);
        for(let i=0;i<=noOfLadders;i++)
        {
            let randomStartX = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
            let randomStartY = Math.floor(Math.random() * (7 - 0 + 1)) + 0;

            let randomEndX = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
            let randomEndY = Math.floor(Math.random() * (9 - (randomStartY+2) + 1)) + randomStartY+2;

            let tileNowRandom1 = this.tileLayer.getTiledTileAt(randomStartX,randomStartY,true).node.position;
            let tileNowRandom2 = this.tileLayer.getTiledTileAt(randomEndX,randomEndY,true).node.position;
            
            let diffX = tileNowRandom1.x - tileNowRandom2.x;
            let diffY = tileNowRandom1.y - tileNowRandom2.y;
            let lengthOfSnake = Math.sqrt((diffX*diffX)+(diffY*diffY));

            let chil = instantiate(this.ladder);
            this.tileMap.node.addChild(chil);
            chil.setPosition(tileNowRandom1.x+16,tileNowRandom1.y+16,1);
            chil.getComponent(UITransform).setContentSize(20,lengthOfSnake);
            let ang = Math.atan2(diffY,diffX);
            tween(chil)
                .to(1,{angle : toDegree(ang)-90})
                .start();
        }
    }
    movePlayer()
    {
        // // Math.floor(Math.random() * (max - min + 1)) + min;
         let diceNumber = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
         console.log(diceNumber);

        if(this.playerOneTileY % 2 == 1)
        {

            this.playerOneTileX += diceNumber;
            if(this.playerOneTileX > 9)
            {
                this.playerOneTileY -= 1;
                this.playerOneTileX = 10 - (this.playerOneTileX-9);
            }

            let nextPos = this.tileLayer.getTiledTileAt(this.playerOneTileX,this.playerOneTileY).node.position;
            tween(this.playerOne)
                .to(1.2,{position : new Vec3(nextPos.x+8,nextPos.y+15,1)},{easing : 'sineIn'})
                .start();
            //this.playerOne.setPosition(nextPos.x+8,nextPos.y+15,1);
            console.log(this.playerOneTileX,this.playerOneTileY);
        }
        else
        {
            this.playerOneTileX -= diceNumber;
            if(this.playerOneTileX < 0)
            {
                this.playerOneTileY -= 1;
                this.playerOneTileX = 0 - (this.playerOneTileX)-1;
            }

            let nextPos = this.tileLayer.getTiledTileAt(this.playerOneTileX,this.playerOneTileY).node.position;
            tween(this.playerOne)
                .to(1.2,{position : new Vec3(nextPos.x+8,nextPos.y+15,1)},{easing : 'sineIn'})
                .start();
            console.log(this.playerOneTileX,this.playerOneTileY);
        }
    }
    movePlayer2()
    {
        // // Math.floor(Math.random() * (max - min + 1)) + min;
         let diceNumber = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
         console.log(diceNumber);

        if(this.playerTwoTileY % 2 == 1)
        {

            this.playerTwoTileX += diceNumber;
            if(this.playerTwoTileX > 9)
            {
                this.playerTwoTileY -= 1;
                this.playerTwoTileX = 10 - (this.playerTwoTileX-9);
            }

            let nextPos = this.tileLayer.getTiledTileAt(this.playerTwoTileX,this.playerTwoTileY).node.position;
            tween(this.playerTwo)
                .to(1.2,{position : new Vec3(nextPos.x+8,nextPos.y+15,1)},{easing : 'sineIn'})
                .start();
            //this.playerOne.setPosition(nextPos.x+8,nextPos.y+15,1);
            console.log(this.playerTwoTileX,this.playerTwoTileY);
        }
        else
        {
            this.playerTwoTileX -= diceNumber;
            if(this.playerTwoTileX < 0)
            {
                this.playerTwoTileY -= 1;
                this.playerTwoTileX = 0 - (this.playerTwoTileX)-1;
            }

            let nextPos = this.tileLayer.getTiledTileAt(this.playerTwoTileX,this.playerTwoTileY).node.position;
            tween(this.playerTwo)
                .to(1.2,{position : new Vec3(nextPos.x+8,nextPos.y+15,1)},{easing : 'sineIn'})
                .start();
            console.log(this.playerTwoTileX,this.playerTwoTileY);
        }
    }

}