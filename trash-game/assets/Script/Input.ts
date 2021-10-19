import { _decorator, Component, Node, EventTouch } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Input")
export class Input extends Component {
  _touchX: Number = null!;
  _touchY: Number = null!;
  _touchDX: Number = null!;
  _touchDY: Number = null!;

  //   start() {
  //     this.node.on("touch-start", this._touchStart, this);
  //     this.node.on("touch-end", this._touchEnd, this);
  //     this.node.on("touch-move", this._touchMove, this);
  //   }

  public _touchStart(event: EventTouch) {
    this._touchX = event.getStartLocation().x;
    this._touchY = event.getStartLocation().y;
    return { x: this._touchX, y: this._touchY };
  }

  public _touchEnd(event: EventTouch) {
    this._touchX = event.getPreviousLocation().x;
    this._touchY = event.getPreviousLocation().y;
    return { x: this._touchX, y: this._touchY };
  }

  public _touchMove(event: EventTouch) {
    this._touchDX = event.getStartLocation().x - event.getPreviousLocation().x;
    this._touchDY = event.getStartLocation().y - event.getPreviousLocation().y;
    return { x: this._touchDX, y: this._touchDY };
  }

  public _getPosition() {
    return this._touchX;
  }

  //   update(deltaTime: number) {

  // console.log(this._touchDX, ", ", this._touchDY);
  //   }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
