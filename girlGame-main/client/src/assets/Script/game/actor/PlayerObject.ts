// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {resLoader} from "../../base/res/ResLoader";

const {ccclass, property} = cc._decorator;
type TextureAtlasPage = {
    name: string;
    height: number;
    width: number;
    texture: sp_SkeletonTexture;
    magFilter: number;
    minFilter: number;
    uWrap: number;
    vWrap: number;
}

type _size = {
    width: number;
    height: number;
}

type sp_SkeletonTexture = {
    _image: _size; // 图集的宽高
    _texture: cc.Texture2D; // cocos 原始纹理类型

}

// 如果研究过图集里面的参数这一块应该很简单
type TextureAtlasRegion = {
    degrees: number; // 图集里面旋转的角度
    height: number; // 图片在图集里面的高度
    u: number; // 要裁剪的图片在图集中的 uv 坐标, 也就是 图片的四个顶点 在 整个图集中所占用的百分比.
    u2: number;
    v: number;
    v2: number;
    width: number; //图片在图集里面的宽度
    x: number; // 图片在图集里面的x坐标
    y: number;
    index: number;
    name: string; // 插槽名字
    offsetX: number; // 裁剪出来的图片距离渲染尺寸的偏移量
    offsetY: number;
    originalHeight: number; // 图集的高度
    originalWidth: number;
    rotate: boolean; // 是否旋转

    page: TextureAtlasPage;
    renderObject: TextureAtlasRegion;
    texture: sp_SkeletonTexture;
}
@ccclass
export default class PlayerObject extends cc.Component {

    private skeleton:sp.Skeleton=null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.skeleton = this.node.getComponent(sp.Skeleton);
    }

    start () {

    }
    playAnimation(track=0,name='animation',loop=true){
        this.skeleton.setAnimation(track,name,loop);
        // var self = this;
        // resLoader.loadRes('texture/liuhai02',cc.Texture2D,(err,res)=>{
        //
        //     self.change(,'eye',res)
        // })

    }
    private change(slotName,res):void{
        let slot = this.skeleton.findSlot(slotName);
        let att = slot.attachment;
        let region = this.CreateRegion(res);
        att.region = region
        att.setRegion(region)
        att.updateOffset();
    }

    CreateRegion(texture)
    {
        let skeletonTexture = new sp.SkeletonTexture()
        skeletonTexture.setRealTexture(texture)
        let page = new sp.spine.TextureAtlasPage()
        page.name = texture.name
        page.uWrap = sp.spine.TextureWrap.ClampToEdge
        page.vWrap = sp.spine.TextureWrap.ClampToEdge
        page.texture = skeletonTexture
        page.texture.setWraps(page.uWrap, page.vWrap)
        page.width = texture.width
        page.height = texture.height

        let region = new sp.spine.TextureAtlasRegion()
        region.page = page
        region.width = texture.width
        region.height = texture.height
        region.originalWidth = texture.width
        region.originalHeight = texture.height

        region.rotate = false
        region.u = 0
        region.v = 0
        region.u2 = 1
        region.v2 = 1
        region.texture = skeletonTexture;
        return region
    }
    public setAllSkin(name){
        this.skeleton.setSkin(name);

    }
    public changeSlot(sk:sp.Skeleton, slotName:string, tex:cc.Texture2D) {
        let slot = sk.findSlot(slotName);
        let _s: _size = {
            width: tex.width,
            height: tex.height,
        }
        let sps: sp_SkeletonTexture = {
            _image: _s,
            _texture: tex,
        }
        let page: TextureAtlasPage = {
            name: tex.name,
            height: tex.height,
            width: tex.width,
            texture: sps,
            magFilter: tex["_magFilter"],
            minFilter: tex["_minFilter"],
            uWrap: tex["_wrapS"],
            vWrap: tex["_wrapT"],
        }
        let region: TextureAtlasRegion = {
            degrees: 0,
            height: tex.height, // 裁剪的数据 宽高
            width: tex.width,
            index: -1,
            name: slotName,
            x: 0,
            y: 0,
            offsetX: 0,
            offsetY: 0,
            originalHeight: tex.height,
            originalWidth: tex.width,
            rotate: false,

            page: page,
            renderObject: null,
            texture: sps,

            u: 0,
            u2: 1,
            v: 0,
            v2: 1,
        };
        region.renderObject = region;
        let attachment = new sp["spine"].RegionAttachment(slotName);
        attachment.setRegion(region);
        attachment.height = tex.height;
        attachment.width = tex.width;
        let half_width = tex.width / 2;
        let half_height = tex.height / 2;
        let offset: Float32Array = new Float32Array([-half_width, -half_height, -half_width, half_height, half_width, half_height, half_width, -half_height]);
        attachment.offset = offset;
        attachment.path = slotName;
        slot.setAttachment(attachment);

    }
}
