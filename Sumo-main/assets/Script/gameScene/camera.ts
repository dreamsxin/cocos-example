
import { _decorator, Component, Node, misc, Vec3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Camera
 * DateTime = Tue Sep 28 2021 11:56:59 GMT+0530 (India Standard Time)
 * Author = sushant
 * FileBasename = camera.ts
 * FileBasenameNoExtension = camera
 * URL = db://assets/script/camera/camera.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('Camera')
export class Camera extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({ type: Node })
    public player = null;

    start() {
        // [3]
    }

    update(deltaTime: number) {
        let target_position = new Vec2(this.player.getPosition().x, this.player.getPosition().z);

        target_position.lerp(target_position, 0.1);

        this.node.setPosition(new Vec3(target_position.x, this.node.getPosition().y, target_position.y));
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
