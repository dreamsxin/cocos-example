// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DrawingBoard from "./DrawingBoard";

const { ccclass, property } = cc._decorator;

enum GameState {
    drawing = 1,
    erasing = 2,
}

@ccclass
export default class Game extends cc.Component {
    @property(cc.Node)
    drawNode: cc.Node = null;

    @property(cc.Camera)
    captureCamera: cc.Camera = null;

    private db: DrawingBoard = null;
    private gameState: GameState = GameState.drawing;
    private texture: cc.RenderTexture = null;
    private prePos: cc.Vec2 = cc.Vec2.ZERO;
    private lastColor: cc.Color = cc.Color.BLACK;
    private lastLineWidth: number = 1;
    private history: any[] = [];

    start() {
        this.initDb();
        this.initTexture();

        this.drawNode.on("touchstart", this.onTouchStart, this);
        this.drawNode.on("touchmove", this.onTouchMove, this);
        this.drawNode.on("touchend", this.onTouchEnd, this);
        this.drawNode.on("touchcancel", this.onTouchEnd, this);
    }

    initDb() {
        //创建一个画板(需传入画板尺寸，将自动初始化)
        this.db = new DrawingBoard(this.drawNode.width, this.drawNode.height);
        //设置画板的绘图颜色（每次绘制前都可以重新设置）
        this.lastLineWidth = 5;
        this.db.setLineWidth(this.lastLineWidth);
        this.db.setColor(this.lastColor.r, this.lastColor.g, this.lastColor.b, this.lastColor.a);
        //线条端点以圆角结尾
        this.db.setLineCircleEnd(true);
    }

    initTexture() {
        this.texture = new cc.RenderTexture();
        this.texture.initWithSize(this.drawNode.width, this.drawNode.height, cc.RenderTexture.DepthStencilFormat.RB_FMT_S8);
        let spf: cc.SpriteFrame = new cc.SpriteFrame(this.texture);
        this.drawNode.getComponent(cc.Sprite).spriteFrame = spf;
    }

    onTouchStart(e: cc.Event.EventTouch) {
        //将触摸位置作为线条的起点
        //画板中使用的坐标系，与图片坐标系一样，原点在左上角，X轴向右为正，Y轴向下为正
        //所以Y轴坐标应反过来, 这里用getLocationInView而不是getLocation
        let pos = e.getLocation();
        this.prePos = this.convertToDrawNodePos(pos);
        this.db.moveTo(this.prePos.x, this.prePos.y);
    }

    onTouchMove(e: cc.Event.EventTouch) {
        let pos = e.getLocation();
        this.prePos = this.convertToDrawNodePos(pos);
        if (this.gameState == GameState.drawing) {
            //从上一次绘制线条后的终点开始向鼠标当前位置绘制线条
            this.db.lineTo(this.prePos.x, this.prePos.y);
        } else if (this.gameState == GameState.erasing) {
            // 橡皮擦
            this.db.circle(this.prePos.x, this.prePos.y, 10);
        }

        //每次画板中的数据有变化后，及时将数据应用到贴图上，在屏幕上显示出来
        this.drawToImg();
    }

    onTouchEnd(e: cc.Event.EventTouch) {
        this.addHistory();
    }

    convertToDrawNodePos(worldPos: cc.Vec2) {
        let pos = this.drawNode.convertToNodeSpaceAR(worldPos);
        pos.x += this.drawNode.width * this.drawNode.anchorX;
        pos.y += this.drawNode.height * this.drawNode.anchorY;
        pos.y = this.drawNode.height - pos.y;
        return pos;
    }

    addHistory() {
        let copy = this.db.copyData();
        let ucopy = new Uint8Array(copy);
        this.history.push({ data: ucopy });
        cc.log('历史步骤: ', this.history.length);
    }

    drawToImg() {
        //获取画板中绘制的图案数据
        let data: Uint8Array = this.db.getData();
        //将数据传递给贴图对象
        this.texture.initWithData(data, cc.Texture2D.PixelFormat.RGBA8888, this.db.width, this.db.height);
    }

    onBtnDraw() {
        this.db.setLineWidth(this.lastLineWidth);
        this.db.setColor(this.lastColor.r, this.lastColor.g, this.lastColor.b, this.lastColor.a);
        this.gameState = GameState.drawing;
    }

    onBtnErase() {
        this.db.setLineWidth(this.lastLineWidth * 3);
        // 橡皮擦的颜色不能是(0,0,0,0),因为这样会和DrawingBoard里的默认颜色相同导致绘制跳过
        this.db.setColor(255, 255, 255, 0);
        this.gameState = GameState.erasing;
    }

    onBtnClear() {
        this.db.reset();
        this.drawToImg();
        this.history.splice(0, this.history.length);
    }

    onBtnRevoke() {
        this.history.pop();
        if (this.history.length) {
            let data: Uint8Array = this.history[this.history.length - 1].data;
            this.db.setData(data.buffer);
            this.texture.initWithData(this.db.getData(), cc.Texture2D.PixelFormat.RGBA8888, this.db.width, this.db.height);
        } else {
            this.onBtnClear();
        }
        cc.log('历史记录剩余: ', this.history.length);
    }

    onBtnSave() {
        if (cc.sys.isBrowser) {
            let width = this.drawNode.width;
            let height = this.drawNode.height;

            this.captureCamera.enabled = true;
            let texture = new cc.RenderTexture();
            texture.initWithSize(width, height, cc.RenderTexture.DepthStencilFormat.RB_FMT_S8);
            this.captureCamera.targetTexture = texture;

            let canvas: HTMLCanvasElement = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext('2d');
            this.captureCamera.render();
            let data = texture.readPixels();
            // write the render data
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let imageData = ctx.createImageData(width, 1);
                let start = srow * width * 4;
                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = data[start + i];
                }
                ctx.putImageData(imageData, 0, row);
            }

            let dataUrl = canvas.toDataURL('image/jpg');
            // cc.log('iamge-base64:', dataUrl);
            let saveLink: any = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            saveLink.href = dataUrl;
            saveLink.download = String(Date.now()) + '.jpg';
            let event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            saveLink.dispatchEvent(event);
            this.scheduleOnce(t => {
                this.captureCamera.enabled = false;
            }, 0.1);
        } else {
            cc.warn('暂时只支持web端保存图片');
        }
    }

    // update (dt) {}
}
