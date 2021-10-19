import Particle from "./Particle";
import Pool from "./Pool";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ParticleSystem extends cc.Component {
    //发射属性
    @property
    duration:number = 0;
    @property
    emitSpeed:number = 10;
    @property
    startX:number = 0;
    @property
    startY:number = 0;


    //粒子属性
    @property
    lifeTime :number = 0;
    @property
    speedX:number = 0;
    @property
    speedVarianceX :number = 0;
    @property
    speedY:number = 0;
    @property
    speedVarianceY :number = 0;



    private timer:number = 0;
    private emitTimer:number = 0;
    private playing: boolean = false;
    private particles:Particle[] = [];

    @property(Pool)
    pool:Pool = null;

    onLoad () {

    }

    start () {
    }
    
    update (dt) {
        if(this.playing || this.particles.length>0){
            if(this.timer >= this.duration){
                this.playing = false;
            }else{
                this.timer += dt;
            }
            this.emitTimer += dt;
            if(this.playing && this.emitTimer > 1/this.emitSpeed){
                this.emitTimer -= 1/this.emitSpeed;
                let particleNode = this.pool.getInstance(this.node);
                let particle = particleNode.getComponent(Particle);
                particleNode.position = cc.v2(this.startX, this.startY);
                particle.speedX = this.speedX + (Math.random()*2-1)*this.speedVarianceX;
                particle.speedY = this.speedY + (Math.random()*2-1)*this.speedVarianceY;
                particle.lifeTime = this.lifeTime;
                this.particles.push(particle);
            }
            this.updateParticles(dt);   
        }
    }
    updateParticles(dt){
        let diedList = [];
        for(let i=0;i<this.particles.length;i++){
            let p = this.particles[i];
            p.node.position = p.node.position.add(cc.v2(p.speedX*dt, p.speedY*dt));
            p.lifeTime -= dt;
            if(p.lifeTime <= 0){
                diedList.push(p);
            }
        }
        for(let i=0;i<diedList.length;i++){
            let p = diedList[i];
            this.particles.splice(this.particles.indexOf(p), 1);
            this.pool.returnInstance(p.node);
        }
    }
    removeAllParticle(){
        for(let i=0;i<this.particles.length;i++){
            let p = this.particles[i];
            this.pool.returnInstance(p.node);
        }
        this.particles = [];
    }
    play(){
        this.timer = 0;
        this.playing = true;
    }
}
