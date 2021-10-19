
export class ShaderUtils {

    public setNodeNormal(node) {
        var sprite = node.getComponent(cc.Sprite);
        sprite && this.setGray(sprite);
        for (
            var o = node.getComponentsInChildren(cc.Sprite), i = 0;
            i < o.length;
            i++
        )
            this.setNormal(o[i]);
    }

    public setNodeGray(node) {
        var sprite = node.getComponent(cc.Sprite);
        sprite && this.setGray(sprite);
        for (
            var o = node.getComponentsInChildren(cc.Sprite), i = 0;
            i < o.length;
            i++
        )
            this.setGray(o[i]);
    }

    private setGray(sprite: cc.Sprite) {
        let variant1 = cc.MaterialVariant.createWithBuiltin(cc.Material.BUILTIN_NAME.GRAY_SPRITE, sprite);
        sprite.setMaterial(0, variant1);
    }

    private setNormal(sprite: cc.Sprite) {
        let variant1 = cc.MaterialVariant.createWithBuiltin(cc.Material.BUILTIN_NAME.SPRITE, sprite);
        sprite.setMaterial(0, variant1);
    }

}

export let shaderUtils: ShaderUtils = new ShaderUtils();