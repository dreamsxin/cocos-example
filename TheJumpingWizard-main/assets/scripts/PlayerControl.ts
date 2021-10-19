
import { _decorator, Component, director, systemEvent, game, SystemEvent, EventKeyboard, KeyCode, clamp, UITransform, Rect, Node, Prefab, instantiate, Collider, ICollisionEvent} from 'cc';

const { ccclass, property } = _decorator;
 
@ccclass('PlayerControl')
export class PlayerControl extends Component {
    
    vMov : number = 0.0;
    hMov : number = 0.0;

    @property speed : number = 250.0;

    start () {
        

        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        director.getScene().addChild(player);

        var collider = this.getComponent(Collider);
        collider.on("onTriggerEnter", this.onTriggerEnter, this);
    }

    onTriggerEnter (event: ICollisionEvent) {
        if(event.otherCollider.getComponent(pla) != null)
        {
            this.node.destroy();
        }
    }

    onKeyDown(event: EventKeyboard) {

        switch (event.keyCode)
        {
            case KeyCode.ARROW_UP:    this.vMov = this.speed;  break;
            case KeyCode.ARROW_RIGHT: this.hMov = this.speed;  break;
            case KeyCode.ARROW_LEFT:  this.hMov = -this.speed; break;
        }
    }

    onKeyUp(event: EventKeyboard) {

        switch (event.keyCode)
        {
            case KeyCode.ARROW_UP:
                if (this.vMov > 0)
                {
                    this.vMov = 0;
                }
            break;

            case KeyCode.ARROW_RIGHT:
                if (this.hMov > 0)
                {
                    this.hMov = 0;
                }
                break;

            case KeyCode.ARROW_LEFT:
                if (this.hMov< 0)
                {
                    this.hMov = 0;
                }
                break;
        }
    }

    update (dt: number) {
        this.move(dt)
        this.clampPosition();
    }

    private move(dt: number) {
        var pos = this.node.position;
        pos.set(pos.x + this.hMov * dt, pos.y + this.vMov * dt);
        this.node.position = pos;
    }

    private getScreenRect() : Rect
    {
        var sprite = this.getComponent(UITransform);
        var canvas = this.node.parent.getComponent(UITransform);
        return new Rect(-canvas.width / 2.0 + sprite.width / 2.0,
                        -canvas.height / 2.0 + sprite.height / 2.0,
                        canvas.width - sprite.width,
                        canvas.height - sprite.height);
    }

    private clampPosition() {
        var screenRect = this.getScreenRect();
        var x = clamp(this.node.position.x, screenRect.xMin, screenRect.xMax);
        var y = clamp(this.node.position.y, screenRect.yMin, screenRect.yMax);
        this.node.position.set(x, y);
    }

    
}


