// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;
    @property(cc.RigidBody)
    playerRigidBody: cc.RigidBody = null;
    @property(cc.Graphics)
    graphics: cc.Graphics = null;
    @property(cc.Node)
    posTip: cc.Node = null;
    @property(cc.Graphics)
    graphicsPoint: cc.Graphics = null;
    @property(cc.Graphics)
    graphicsDebug: cc.Graphics = null;

    circleCollider:cc.PhysicsCircleCollider
    circleRadius:number;
    // LIFE-CYCLE CALLBACKS:

    navigate:cc.Node;
    navigatePoint:cc.Node;

    firstContactNode:cc.Node;
    firstContactSpeedVel:cc.Vec2;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags =  cc.PhysicsManager.DrawBits.e_shapeBit
        let canvas = cc.find("Canvas")
        cc.find("Canvas").on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            let playerPos = this.player.convertToWorldSpaceAR(cc.Vec2.ZERO);
            let targetPos = event.getLocation();
            let dir = targetPos.sub(playerPos);
            let speed = dir.normalize().mul(500);
            this.playerRigidBody.linearVelocity = speed;
            this.posTip.setPosition(this.posTip.parent.convertToNodeSpaceAR(event.getLocation()))
        })
        canvas.on(cc.Node.EventType.TOUCH_START, this.onTouchMove, this)
        canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.circleCollider = this.player.getComponent(cc.PhysicsCircleCollider);
        this.circleRadius = this.circleCollider.radius;
        this.navigate = cc.find("navigate",this.node);
        this.navigatePoint = cc.find("navigate/point",this.node);
        let palyer = this.player.getComponent(Player);
        palyer.game = this
    }

    onPreSolve(contact:cc.PhysicsContact,self:cc.PhysicsCollider,other:cc.PhysicsCollider){
        if(other.node == this.firstContactNode){
            contact.disabledOnce = true;
            this.playerRigidBody.linearVelocity = this.firstContactSpeedVel.mul(500)
        }
    }

    getStartPos(centerPos:cc.Vec2,startAngle:number,endAngle:number,num:number, radius:number){
        var result:cc.Vec2[] = [];
        var space = (endAngle - startAngle) / (num-1);
        for(var i = 0; i < num; i++){
            let angle = startAngle + i * space;
            result.push(cc.v2(centerPos.x + radius * Math.cos(angle), centerPos.y + radius * Math.sin(angle)));
        }
        return result;
    }

    onTouchMove(event: cc.Event.EventTouch) {
        this.graphicsPoint.clear();
        this.graphicsDebug.clear();
        let playerPos = this.player.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let targetPos = event.getLocation();
        let rayCastDistance = 4000;
        let norDir = targetPos.sub(playerPos).normalize()
        let dir = norDir.mul(rayCastDistance);
        // targetPos = playerPos.add(dir)
        let angle = -dir.signAngle(cc.Vec2.RIGHT);
        let startAngle = angle - cc.misc.degreesToRadians(90);
        let endAngle = angle + cc.misc.degreesToRadians(90);
        let num = 5;
        let startPoss = this.getStartPos(playerPos,startAngle,endAngle,num,this.circleRadius);
        // let hitPoss:cc.PhysicsRayCastResult[][] = [];
        let resultHitPosInfo:cc.PhysicsRayCastResult;
        let resultHitStartPosIndex:number = -1;
        let minDis = -1;
        let circleCenterNeedMove:cc.Vec2
        for(var i = 0; i < startPoss.length; i++){
            // this.drawCriclePoint(startPoss[i])
            var oneTargetPos = startPoss[i].add(dir);
            this.drawDebug(startPoss[i],oneTargetPos)
            var oneCastResult = cc.director.getPhysicsManager().rayCast(startPoss[i], oneTargetPos, cc.RayCastType.AllClosest);
            var notPlayerResult:cc.PhysicsRayCastResult;
            if(oneCastResult){
                for(var j = 0; j < oneCastResult.length; j++){
                    if(oneCastResult[j].collider.node!=this.player){
                        notPlayerResult = oneCastResult[j]
                        break;
                    }
                }
            }
            if(notPlayerResult){
                let subVel = notPlayerResult.point.sub(startPoss[i])
                let dis = subVel.len();
                if(minDis == -1 || dis <= minDis){
                    // console.log("碰到的是",i)
                    minDis = dis
                    resultHitPosInfo = notPlayerResult;
                    resultHitStartPosIndex = i;
                    circleCenterNeedMove = subVel
                }
            }
        }
        
        if (resultHitPosInfo) {
            this.firstContactNode = resultHitPosInfo.collider.node
            let contactPoint = resultHitPosInfo.point;
            this.drawCriclePoint(contactPoint)
            let resultStartPos = startPoss[resultHitStartPosIndex]
            let vel = contactPoint.sub(resultStartPos);
            let normal = resultHitPosInfo.normal;
            let angle1 = -vel.signAngle(normal);
            let velNegative = vel.neg();
            let angle2 = -velNegative.signAngle(normal);
            let rotateAngle = -(angle1 + angle2);
            let reflactVel = vel.rotate(rotateAngle);
            this.firstContactSpeedVel = reflactVel.normalize();
            let posInReflactVel = contactPoint.add(reflactVel.normalize().mul(100))
            let contactCircleCenter = playerPos.add(circleCenterNeedMove)
            let drawPos1 = contactCircleCenter.add(vel.normalize().mul(-40))
            this.draw(playerPos,drawPos1,drawPos1)
            this.navigate.active = true;
            this.navigate.setPosition(this.navigate.parent.convertToNodeSpaceAR(contactCircleCenter))
            let pointAngle = -reflactVel.signAngle(cc.Vec2.RIGHT)-Math.PI/2;
            this.navigatePoint.angle = cc.misc.radiansToDegrees(pointAngle)

        }else{
            this.firstContactNode = null;
            this.firstContactSpeedVel = null;
            this.graphics.clear()
            this.navigate.active = false;
        }
        // for (var i = 0; i < results.length; i++) {
        //     var result = results[i];
        //     var collider = result.collider;
        //     var point = result.point;
        //     var normal = result.normal;
        //     var fraction = result.fraction;
        // }
    }

    drawCriclePoint(point:cc.Vec2){
        this.graphicsPoint.circle(point.x,point.y,3)
        this.graphicsPoint.fill()
    }

    drawDebug(startPos:cc.Vec2,endPos:cc.Vec2){
        this.graphicsDebug.moveTo(startPos.x,startPos.y);
        this.graphicsDebug.lineTo(endPos.x,endPos.y);
        this.graphicsDebug.stroke();
    }

    getPoints(pos1: cc.Vec2, pos2: cc.Vec2) {
        let points = [];
        let pointSpace = 20;
        let vel = pos2.sub(pos1);
        let velNor = vel.normalize()
        let dis = vel.len();
        let num = Math.ceil(dis / pointSpace);
        for (var i = 0; i < num; i++) {
            let newPos = pos1.add(velNor.mul(i * pointSpace))
            points.push(newPos);
        }
        points.push(pos2);
        return points;
    }

    draw(pos1: cc.Vec2, pos2: cc.Vec2, pos3: cc.Vec2) {
        // this.graphics.clear();
        // let points = [];
        // let poss1 = this.getPoints(pos1, pos2)
        // let poss2 = this.getPoints(pos2, pos3)
        // points = points.concat(pos1)
        // points = points.concat(poss2)

        // this.graphics.moveTo(points[0].x,points[0].y)
        // for(var i = 1; i < points.length; i++){
        //     this.graphics.lineTo(points[i].x,points[i].y)
        //     this.graphics.moveTo(points[i].x,points[i].y)
        // }
        // this.graphics.stroke();
    }

    // update (dt) {}
}
