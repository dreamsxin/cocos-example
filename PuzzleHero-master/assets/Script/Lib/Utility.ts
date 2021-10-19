// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Utility {

    /**Distance between two points 
    @param p1 StatrPoint
    @param p2 Distancepoint
    */
    static GetDistance(p1: cc.Vec2, p2: cc.Vec2): number {
        return p1.sub(p2).mag()
    }

    /** the retrun include Mix and Max
   @param mix MixValue
   @param max MaxValue
   @param isInt is Int Value
   
   */
    static GetRandom(mix, max, isInt = true) {
        let w = max - mix
        let r1 = Math.random() * w
        r1 += mix
        return isInt ? Math.round(r1) : r1
    }
    /**Return Destination Point 
     @param pointB StatrPoint
     @param angle Starting point angle
     @param bevel Length from starting point to end point 
    
     */

    static GetRandomNeg(mix, max, isInt = true) {
        let n = Math.random() > 0.5 ? 1 : -1
        return Utility.GetRandom(mix, max, isInt) * n
    }


    static parseObjUrlPara(obj: any) {
        let poststr: string = ""
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                poststr += `${key}=${obj[key]}&`;
            }
        }
        return poststr.substring(0, poststr.length - 1)
    }


    //the Same Mathf.Clampf
    static MathClamp(n, min, max) {
        return Math.min(Math.max(n, min), max);
    }

    static GetDegToRad(angle: number) {
        let rad = angle * Math.PI / 180
        return rad

    }

    static GetPAndLenByDeg(pointB: cc.Vec2, angle: number, bevelLen: number) {
        let radian: number = angle * Math.PI / 180;
        let xMargin: number = Math.cos(radian) * bevelLen;
        let yMargin: number = Math.sin(radian) * bevelLen;
        return cc.v2(pointB.x + xMargin, pointB.y + yMargin)
    }

    static GetDegToVec(angle: number, decimal: number = 2) {
        let rad = Utility.GetDegToRad(angle)
        let decl = Math.pow(10, decimal)
        let rx = Math.sin(rad)
        let ry = Math.cos(rad)
        return cc.v2(Math.round(rx * decl) / decl, Math.round(ry * decl) / decl)
    }



    static Get2PToDir(sp: cc.Vec2, ep: cc.Vec2) {
        return ep.sub(sp).normalize()
    }


    //Clockwise
    static Get2PToDeg(p1: cc.Vec2, p2: cc.Vec2) {
        let rnd: number = Math.atan2((p2.x - p1.x), (p2.y - p1.y))
        let angle: number = rnd * (180 / Math.PI);
        return angle
    }

    //No repeated random numbers
    static GetRandNRList(max: number, min: number = 0) {
        let list = []
        for (let i = min; i < max + 1; i++) {
            list.push(i)
        }
        let rlen = list.length - 1
        for (let i = rlen; i > -1; i--) {
            let ridx = Math.round(Math.random() * rlen)
            let _v1 = list[i]
            list[i] = list[ridx]
            list[ridx] = _v1
        }
        return list
    }

    static InCloseCheck(pt: cc.Vec2, pts: cc.Vec2[], lw: number) {
        let vertCount = pts.length
        let inside: boolean = false
        for (let i = 1; i <= vertCount; ++i) {
            let A = pts[i - 1]
            let B = pts[i % vertCount]
            let dis: any = cc.Intersection.pointLineDistance(pt, A, B, true)
            if (dis < lw) {
                return true
            }
            if ((B.y <= pt.y && pt.y < A.y) || (A.y <= pt.y && pt.y < B.y)) {
                let t: number = (pt.x - B.x) * (A.y - B.y) - (A.x - B.x) * (pt.y - B.y);
                if (A.y < B.y)
                    t = -t;
                if (t < 0)
                    inside = !inside;
            }
        }
        return inside
    }

    public static TestTimeRun(fun: Function) {
        let start = Date.now()
        fun()
        cc.log("run time:", Date.now() - start)
    }


    // Get random POS by cirle
    public static GetRandomCirPos(circler: number, center: cc.Vec2 = cc.Vec2.ZERO): cc.Vec2 {
        let pos = cc.Vec2.ZERO
        let r2 = Math.pow(circler, 2)
        let x = Utility.GetRandom(0, 2 * circler) + 1 - circler
        let y = Utility.GetRandom(0, 2 * circler) + 1 - circler
        if (r2 < (Math.pow(x, 2) + Math.pow(y, 2))) {
            pos = Utility.GetRandomCirPos(circler)
        } else {
            pos.x = center.x + x
            pos.y = center.y + y
        }
        return pos
    }

    public static LoadImgAyns(url: string, sprite: cc.Sprite, imgtype = "png") {
        if (url == null || url.length < 1) {
            return
        }
        cc.loader.load({ url: url, type: imgtype }, (err, texture) => {
            if (err != null) {
                cc.log(err)
                return
            }
            sprite.spriteFrame = new cc.SpriteFrame(texture)
        })
    }

    public static DelListItem(list: any, v: any) {
        let idx = list.indexOf(v)
        list.splice(idx, 1)
    }

    public static GetTimeStamp(mi: boolean = false) {
        return mi ? Number(new Date()) : Math.round((Number(new Date()) / 1000))
    }

    //打乱数组
    public static shuffleArr(arr: any[]) {
        let i = arr.length;
        while (i) {
            let j = Math.floor(Math.random() * i--);
            [arr[j], arr[i]] = [arr[i], arr[j]];
        }
        return arr;
    }

    public static range(min: number, max: number, seed: number): number {
        max = (max + 1) || 1;
        min = min || 0;
        seed = (seed * 9301 + 49297) % 233280;
        var rnd = seed / 233280;
        return Math.floor(min + rnd * (max - min));
    }

    public static arrInsert(arrfirst, arrlast, index) {
        if (index < 0) {
            index = 0;
        } else if (index > arrfirst.length) {
            index = arrfirst.length;
        }
        for (var i = arrlast.length - 1; i >= 0; i--) {
            arrfirst.splice(index, 0, arrlast[i]);//是在index位置用arrlast[i]替换掉arrfirst数组中的0个元素
        }
        return arrfirst;
    }

}
