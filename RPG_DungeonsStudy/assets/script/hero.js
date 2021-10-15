const Input = {};
cc.Class({
    extends: cc.Component,

    properties: {

    },
    // onLoad () {},

    start() {
        this.hero_speed = 150
        this.sp = cc.v2(0, 0)
        this.state = '';
        this.heroAni = this.node.getComponent(cc.Animation)
        cc.systemEvent.on('keydown', this.onkeydown, this)
        cc.systemEvent.on('keyup', this.onkeyup, this)
    },
    onkeydown(e) {
        Input[e.keyCode] = 1
    },
    setState(state) {
        if (this.state == state) return;
        this.state = state;
        this.heroAni.play(this.state)

    },
    onkeyup(e) {
        Input[e.keyCode] = 0
    },
    update(dt) {
        // 如果对话框存在，并且是显示状态
        if (window.dialog && window.dialog.active) return;

        if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
            // 向左
            this.sp.x = -1

        } else if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
            // 向右
            this.sp.x = 1
        } else {
            this.sp.x = 0
        }

        if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up]) {
            // 向上
            this.sp.y = 1

        } else if (Input[cc.macro.KEY.s] || Input[cc.macro.KEY.down]) {
            // 向下
            this.sp.y = -1
        } else {
            this.sp.y = 0
        }
        this.lv = this.node.getComponent(cc.RigidBody).linearVelocity;
        if (this.sp.x) {
            this.lv.y = 0;
            this.lv.x = this.sp.x * this.hero_speed
        } else if (this.sp.y) {
            this.lv.x = 0;
            this.lv.y = this.sp.y * this.hero_speed
        } else {
            this.lv.y = this.lv.x = 0
        }
        this.node.getComponent(cc.RigidBody).linearVelocity = this.lv
        let state = '';
        if (this.sp.x == 1) {
            state = 'right'
        } else if (this.sp.x == -1) {
            state = 'left'
        } else if (this.sp.y == 1) {
            state = 'up'
        } else if (this.sp.y == -1) {
            state = 'down'
        }
        if (state) {
            this.setState(state)
        }
    },
    // 碰撞回调
    onCollisionEnter(other, self) {
        if (other.node.group == 'smog') {
            other.node.active = false
            other.node.getComponent(cc.TiledTile).gid = 0;
        }
    }
});