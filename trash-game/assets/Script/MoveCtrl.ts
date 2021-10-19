import {
  _decorator,
  Component,
  Node,
  systemEvent,
  SystemEventType,
  EventTouch,
  EventMouse,
  geometry,
  PhysicsSystem,
  Camera,
  CameraComponent,
  Vec2,
  TerrainCollider,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("MoveCtrl")
export class MoveCtrl extends Component {
  @property({ type: CameraComponent })
  cameraCom: CameraComponent = null!;

  @property({ type: TerrainCollider })
  terrain: TerrainCollider = null!;

  private _ray: geometry.ray = new geometry.ray();
  private _isRunning: boolean = false;
  private _speed:number = 20;

  start() {
    systemEvent.on(SystemEventType.TOUCH_END, this.move, this);
  }

  move(event: EventTouch, touch: Touch) {
    const { _touches }: any = touch;
    const { _point }: any = _touches[0];

    this.cameraCom.screenPointToRay(_point.x, _point.y, this._ray);

    if (PhysicsSystem.instance.raycast(this._ray)) {
      const r = PhysicsSystem.instance.raycastResults;
      for (let i = 0; i < r.length; i++) {
        const item = r[i];
       if(item.collider.uuid == this.terrain.uuid){
           this.node.setPosition(item.hitPoint);
       }
      }
    }


    console.log(this.node.getWorldPosition());
    
  }
  // update (deltaTime: number) {
  //     // [4]
  // }
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
