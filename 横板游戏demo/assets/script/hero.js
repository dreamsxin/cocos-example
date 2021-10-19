
const Input = {};
const State = {
    stand: 1,
    attack: 2,
    jump: 3
}

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this._speed = 300;
        this.sp = cc.v2(0, 0);

        this.combo = 0;

        //设置玩家状态
        this.heroState = State.stand;
        this.anima = 'idle';
        this.heroAni = this.node.getChildByName('body').getComponent(cc.Animation);
        this.heroAni.on('finished', this.onAnimaFinished, this);
        this.rb = this.node.getComponent(cc.RigidBody);

        //绑定键盘监听事件
        cc.systemEvent.on('keydown', this.onKeydown, this);
        cc.systemEvent.on('keyup', this.onKeyup, this);
    },

    getHeroState() {
        return this.heroState;
    },

    setAnim(anima) {
        if (this.anima == anima) return;
        this.anima = anima;
        this.heroAni.play(anima);
    },

    onDestroy() {
        this.heroAni.off('finished', this.onAnimaFinished, this);
        cc.systemEvent.off('keydown', this.onKeydown, this);
        cc.systemEvent.off('keyup', this.onKeyup, this);
    },

    onAnimaFinished(e, data) {
        if (data.name == 'attack1' || data.name == 'attack2' || data.name == 'attack3') {
            // console.log('攻击结束');
            this.heroState = State.stand;
            this.combo = (this.combo + 1) % 3;

            setTimeout(() => {
                if (this.heroState == State.attack) return;
                this.combo = 0;
            }, 500);
        }
    },

    onKeydown(e) {
        Input[e.keyCode] = 1;
    },

    onKeyup(e) {
        Input[e.keyCode] = 0;
    },

    //攻击
    attack() {
        this.lv = this.rb.linearVelocity;
        if (Input[cc.macro.KEY.j]) {
            if (this.combo == 0) {
                this.setAnim('attack1');
            } else if (this.combo == 1) {
                this.setAnim('attack2');
            } else if (this.combo == 2) {
                this.setAnim('attack3');
            }
            this.lv.x = 0;
        }
        this.rb.linearVelocity = this.lv;
    },

    //移动
    move() {
        let anima = this.anima;
        let scaleX = Math.abs(this.node.scaleX);
        this.lv = this.rb.linearVelocity;

        // this.combo = 0;
        if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
            this.sp.x = -1;
            this.node.scaleX = -scaleX;
            anima = 'run';
        } else if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
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

    //跳跃
    jump() {
        this.lv = this.rb.linearVelocity;
        this.lv.y = this.node.y + 180;
        this.rb.linearVelocity = this.lv;
        setTimeout(() => {
            this.heroState = State.stand;
        }, 1000);
    },

    update(dt) {
        //状态切换
        switch (this.heroState) {
            case State.stand: {
                if (Input[cc.macro.KEY.j]) {
                    this.heroState = State.attack;
                }
                else if (Input[cc.macro.KEY.k]) {
                    this.heroState = State.jump;
                }
                break;
            }
        }

        //攻击
        if (this.heroState == State.attack) {
            this.attack();
        } else if (this.heroState == State.stand) {
            this.move();
        } else if (this.heroState == State.jump) {
            this.jump();
        }
    },
});