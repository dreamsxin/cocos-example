const {ccclass, property} = cc._decorator;

export namespace Util{
    export function instantPrefab(path:string, callback){
        cc.loader.loadRes(path, (err, prefab) => {
            var node:cc.Node = cc.instantiate(prefab);
            node.name = path.substr(path.lastIndexOf("/")+1);
            node.position = cc.Vec2.ZERO;
            callback(node);
        });
    }

    export function radian(vec2:cc.Vec2){
        let radian = vec2.angle(cc.Vec2.RIGHT);
        if(vec2.y < 0){
            radian = 2*Math.PI - radian;
        }
        return radian;
    }
    export function angle(vec2:cc.Vec2){
        return radian(vec2)*180/Math.PI;
    }
    export function radToVec2(rad){
        return cc.v2(Math.cos(rad), Math.sin(rad));
    }
    export function setAnchor(node:cc.Node, anchorX, anchorY){
        let dx = (anchorX - node.anchorX) * node.width;
        let dy = (anchorY - node.anchorY) * node.height;
        node.x += dx;
        node.y += dy;
        for(let i=0;i<node.childrenCount;i++){
            let child = node.children[i];
            child.x-=dx;
            child.y-=dy;
        }
        node.anchorX = anchorX;
        node.anchorY = anchorY;
    }
    export function randomIdx(len){
        return Math.floor(Math.random()*len);
    }

    export function random(min, max){
        return Math.floor(Math.random()*(max-min))+min;
    }

    export function lerp(cur, tar, ratio){
        return (tar-cur)*ratio+cur;
    }
    export function move(cur, tar, step){
        if(Math.abs(tar-cur) > step){
            if(cur < tar){
                return cur + step;
            }else{
                return cur - step;
            }
        }else{
            return tar;
        }    
    }
}