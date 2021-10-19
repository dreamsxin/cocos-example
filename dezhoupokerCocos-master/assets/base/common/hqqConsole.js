
cc.Class({
    extends: cc.Component,

    properties: {
        btn: cc.Node,
        window: cc.Node,
        view: cc.Node,
        content: cc.Node,
        dragBar: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this.contentlist = [this.content]
        this.num = 0
        this.poslist = [cc.v2(0, 0)]
        for (let i = 0; i < 19; i++) {
            let node = cc.instantiate(this.content)
            let pos = cc.v2(0, 19 * (i + 1))
            this.poslist.push(pos)
            node.x = 0
            node.y = pos.y
            this.contentlist.push(node)
            this.view.addChild(node)
        }
        cc.game.addPersistRootNode(this.node);
        this.node.zIndex = cc.macro.MAX_ZINDEX;
        // this.btn.x = -cc.winSize.width / 2 + 50
        // this.btn.y = -25
        this.btnpos = this.btn.getPosition()
        this.btn.on(cc.Node.EventType.TOUCH_MOVE, this.onClickMove, this);
        this.btn.on(cc.Node.EventType.TOUCH_END, this.onClickEnd, this);
    },

    init() {
        var self = this;

        console.error = function () {
            let data = ""
            for (let i = 0; i < arguments.length; i++) {
                data += arguments[i] + " "
            }
            self.contentlist[self.num].getComponent(cc.Label).string = 'console.error:' + data;
            self.contentlist[self.num].color = new cc.Color(255, 0, 0)
            self.check(self)
        };

        console.warn = function () {
            let data = ""
            for (let i = 0; i < arguments.length; i++) {
                data += arguments[i] + " "
            }
            self.contentlist[self.num].getComponent(cc.Label).string = 'console.warn:' + data;
            self.contentlist[self.num].color = new cc.Color(0, 0, 255)
            self.check(self)
        };

        console.log = function () {
            let data = ""
            for (let i = 0; i < arguments.length; i++) {
                data += arguments[i] + " "
            }
            self.contentlist[self.num].getComponent(cc.Label).string = 'console.log:' + data;
            self.contentlist[self.num].color = new cc.Color(0, 0, 0)
            self.check(self)
        };

        cc.log = function () {
            let data = ""
            for (let i = 0; i < arguments.length; i++) {
                data += arguments[i] + " "
            }
            self.contentlist[self.num].getComponent(cc.Label).string = 'log:' + data;
            self.contentlist[self.num].color = new cc.Color(0, 0, 0)

            self.check(self)
        };

        cc.warn = function () {
            let data = ""
            for (let i = 0; i < arguments.length; i++) {
                data += arguments[i] + " "
            }
            self.contentlist[self.num].getComponent(cc.Label).string = 'warn:' + data;
            self.contentlist[self.num].color = new cc.Color(0, 0, 255)

            self.check(self)
        };

        cc.error = function () {
            let data = ""
            for (let i = 0; i < arguments.length; i++) {
                data += arguments[i] + " "
            }
            self.contentlist[self.num].getComponent(cc.Label).string = 'error:' + data;
            self.contentlist[self.num].color = new cc.Color(255, 0, 0)

            self.check(self)
        };

        cc.syslog = function () {
            let data = ""
            for (let i = 0; i < arguments.length; i++) {
                data += arguments[i] + " "
            }
            self.contentlist[self.num].getComponent(cc.Label).string = 'syslog:' + data;
            self.contentlist[self.num].color = new cc.Color(255, 0, 0)

            self.check(self)
        };

        self.dragBar.on('touchmove', function (touch) {
            var x = touch.getPreviousLocation().x - touch.getLocationX();
            var y = touch.getPreviousLocation().y - touch.getLocationY();
            self.window.x += -x;
            self.window.y += -y;
        });
    },

    check(self) {
        let start = self.num
        for (let i = 19; i >= 0; i--) {
            self.contentlist[start].y = self.poslist[i].y
            start++
            if (start > 19) {
                start = 0
            }
        }
        self.num++
        if (self.num >= 20) {
            self.num = 0
        }
    },

    onClickMove(event) {
        let pos = event.touch.getLocation()
        pos = this.node.convertToNodeSpaceAR(pos)
        if (pos.x <= -cc.winSize.width / 2 + 50 || pos.y >= -25 || pos.x >= cc.winSize.width / 2 - 50 || pos.y <= -cc.winSize.height + 25) {
        } else if (this.btnpos.x != pos.x || this.btnpos.y != pos.y) {
            this.btn.setPosition(pos)
        } else {

        }
        event.stopPropagation();
    },
    onClickEnd(event) {
        if (this.btnpos.x != this.btn.x || this.btnpos.y != this.btn.y) {

        } else {
            this.onClickBtn()
        }
        this.btnpos = this.btn.getPosition()
        event.stopPropagation();
    },

    onClickBtn() {
        this.window.active = !this.window.active;
    },
}); 
