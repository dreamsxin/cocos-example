
const State = {
    stand: 1,
    attack: 2,
    hurk: 3,
}

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.hp = 5;
        this.isHit = false;

        this.anima = 'idle';
        this.rb = this.node.getComponent(cc.RigidBody);

        this._speed = 60;
        this.sp = cc.v2(0, 0);
        this.tt = 0;

        this.enemyState = State.stand;

        this.EnemyAni = this.node.getChildByName('body').getComponent(cc.Animation);
        this.EnemyAni.on('finished', (e, data) => {
            if (data.name == 'hurt') {
                this.hp--;
                this.isHit = false;
                this.enemyState = State.stand;
                if (this.hp == 0) {
                    this.node.destroy();
                }
            } else if (data.name == 'attack') {
                this.setAnim('idle');
                this.enemyState = State.stand;
            }
        });

        this.moveLeft = false;
        this.moveRight = false;

        // setInterval(() => {
        //     this.moveLeft = !this.moveLeft;
        //     this.moveRight = !this.moveRight;
        // }, 1000);

        //获取玩家的Node节点
        this.playerNode = cc.find('Canvas/bg/hero');
    },

    getEnemyState() {
        return this.enemyState;
    },

    hurt() {
        if (this.isHit) return;
        this.isHit = true;
        this.enemyState = State.hurt;

        this.lv = this.rb.linearVelocity;
        this.lv.x = 0;
        this.rb.linearVelocity = this.lv;

        this.setAnim('hurt');
    },

    attack() {
        this.setAnim('attack');
        this.lv = this.rb.linearVelocity;
        this.lv.x = 0;
        this.rb.linearVelocity = this.lv;
    },

    move() {
        let anima = this.anima;
        let scaleX = Math.abs(this.node.scaleX);
        this.lv = this.rb.linearVelocity;

        if (this.moveLeft) {
            this.sp.x = -1;
            this.node.scaleX = -scaleX;
            anima = 'run';
        } else if (this.moveRight) {
            this.sp.x = 1;
            this.node.scaleX = scaleX;
            anima = 'run';
        } else {
            this.sp.x = 0;
            anima = 'idle';
        }

        if (this.sp.x) {
            this.lv.x = this.sp.x * this._speed;
        } else {
            this.lv.x = 0;
        }

        this.rb.linearVelocity = this.lv;

        if (anima) {
            this.setAnim(anima);
        }
    },

    enemyAction(tt) {
        let p_pos = this.playerNode.position;
        let e_pos = this.node.position;
        let dis = cc.Vec2.distance(e_pos, p_pos);

        if (dis <= 25) {
            // console.log("攻击英雄");
            this.moveLeft = false;
            this.moveRight = false;
            this.enemyState = State.attack;

        } else if (dis <= 100) {
            // console.log("追击英雄");
            let v = p_pos.sub(e_pos);
            if (v.x < 0) {
                this.moveLeft = true;
                this.moveRight = false;
            } else {
                this.moveLeft = false;
                this.moveRight = true;
            }
            this.enemyState = State.stand;
        } else {
            this.moveLeft = false;
            this.moveRight = false;
        }
    },

    setAnim(anima) {
        if (this.anima == anima) return;
        this.anima = anima;
        this.EnemyAni.play(anima);
    },

    update(dt) {
        this.tt += dt;
        if (this.tt >= 0.3 && this.enemyState == State.stand) {
            this.enemyAction(dt);
            this.tt = 0;
        }

        if (this.enemyState == State.attack) {
            this.attack();   //攻击
        } else if (this.enemyState == State.stand) {
            this.move();     //移动
        }
    },
});
