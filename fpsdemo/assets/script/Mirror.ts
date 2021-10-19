
import { _decorator, Component, Sprite, SpriteFrame, RenderTexture, Camera, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Mirror')
export class Mirror extends Component {
    @property({ type: Sprite })
    target: Sprite = null!;

    @property({ type: Camera })
    camera: Camera = null!;

    start() {
        const spriteframe = this.target.spriteFrame!;
        const sp = new SpriteFrame();
        sp.reset({
            originalSize: spriteframe.originalSize,
            rect: spriteframe.rect,
            offset: spriteframe.offset,
            isRotate: spriteframe.rotated,
            borderTop: spriteframe.insetTop,
            borderLeft: spriteframe.insetLeft,
            borderBottom: spriteframe.insetBottom,
            borderRight: spriteframe.insetRight,
        });

        let targetTransform = this.target.getComponent(UITransform)!;
        const renderTex = new RenderTexture();
        renderTex.reset({
            width: targetTransform.width,
            height: targetTransform.height
        });
        sp.texture = renderTex;
        this.target.spriteFrame = sp;
        this.camera.targetTexture = renderTex;
    }
}
