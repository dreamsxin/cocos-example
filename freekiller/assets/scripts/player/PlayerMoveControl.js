
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.keys = [];

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            var index = this.keys.indexOf(event.keyCode);
            if(index < 0)
            {
                this.keys.push(event.keyCode);
            }
        }, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
            var index = this.keys.indexOf(event.keyCode);
            if(index >= 0)
            {
                this.keys.splice(index, 1);
            }
        }, this);
    },

    onLevelLoaded(levelman) {
        this.player = levelman.getPlayerNode();
        this.displayLayer = levelman.getMapNode().getComponent(cc.TiledMap).getLayer('display');
        this.playerInfo = this.player.getComponent('PlayerInfo');

        this.tilesize = this.displayLayer.getMapTileSize();
        this.mapsize = levelman.getMapNode().getContentSize();

        // cc.log(`tilesize=(${this.tilesize.width}, ${this.tilesize.height})`);
        // cc.log(`mapsize=(${this.mapsize.width}, ${this.mapsize.height})`);
    },

    positionToRC(pos)
    {
        pos = pos.clone();

        pos.x += this.mapsize.width/2;
        pos.y += this.mapsize.height/2;

        var r = Math.floor(pos.y / this.tilesize.height);
        var c = Math.floor(pos.x / this.tilesize.width);

        // pos.y = this.mapsize.height - pos.y;
        var totalr = this.mapsize.height/this.tilesize.height;

        if (totalr != Math.floor(totalr)) {
            cc.error('mapsize和tilesize不匹配');
        }

        r = (totalr-1) - r;
        
        return {r:r, c:c};
    },

    calcYOnCircleMax(origin, radius, x)
    {
        return Math.sqrt(radius*radius-(x-origin.x)*(x-origin.x))+origin.y;
    },
    calcYOnCircleMin(origin, radius, x)
    {
        return -Math.sqrt(radius*radius-(x-origin.x)*(x-origin.x))+origin.y;
    },
    calcXOnCircleMax(origin, radius, y)
    {
        return Math.sqrt(radius*radius-(y-origin.y)*(y-origin.y))+origin.x;
    },
    calcXOnCircleMin(origin, radius, y)
    {
        return -Math.sqrt(radius*radius-(y-origin.y)*(y-origin.y))+origin.x;
    },

    rcBounding(rc)
    {
        return new cc.Rect(rc.c*this.tilesize.width - this.mapsize.width/2, 
            this.mapsize.height/2 - rc.r*this.tilesize.height - this.tilesize.height,
            this.tilesize.width,
            this.tilesize.height);
    },

    isValidRC(rc)
    {
        var totalr = this.mapsize.height/this.tilesize.height;
        var totalc = this.mapsize.width/this.tilesize.width;
        return rc.r>=0 && rc.r<totalr && rc.c>=0 && rc.c<totalc;
    },

    calcMaxCanGoToLeft(curpos)
    {
        var currc = this.positionToRC(curpos);
        var radius = this.playerInfo.radius;

        if (curpos.x%this.tilesize.width===0) {
            currc.c -= 1;
        }

        // cc.log(`left:pos=(${curpos.x},${curpos.y});rc=(${currc.r},${currc.c})`);

        var ret = [];

        var tile = {r:currc.r-1, c:currc.c-2};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var x = this.calcXOnCircleMin(curpos, radius, bound.yMin);
            ret.push(bound.xMax-x);
            // cc.log('left[0]', `tile=(${tile.r},${tile.c})`, ret[ret.length-1]);
        }

        var tile = {r:currc.r-1, c:currc.c-1};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var x = this.calcXOnCircleMin(curpos, radius, bound.yMin);
            ret.push(bound.xMax-x);
            // cc.log('left[1]', `tile=(${tile.r},${tile.c})`, ret[ret.length-1]);
        }

        var tile = {r:currc.r, c:currc.c-2};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            ret.push(bound.xMax-(curpos.x-radius));
            // cc.log('left[2]', `tile=(${tile.r},${tile.c})`, ret[ret.length-1]);
        }

        var tile = {r:currc.r, c:currc.c-1};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            ret.push(bound.xMax-(curpos.x-radius));
            // cc.log('left[3]', `tile=(${tile.r},${tile.c})`, ret[ret.length-1]);
        }

        var tile = {r:currc.r+1, c:currc.c-2};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var x = this.calcXOnCircleMin(curpos, radius, bound.yMax);
            ret.push(bound.xMax-x);
            // cc.log('left[4]', `tile=(${tile.r},${tile.c})`, ret[ret.length-1]);
        }

        var tile = {r:currc.r+1, c:currc.c-1};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var x = this.calcXOnCircleMin(curpos, radius, bound.yMax);
            ret.push(bound.xMax-x);
            // cc.log('left[5]', `tile=(${tile.r},${tile.c})`, ret[ret.length-1]);
        }

        if (ret.length===0) {
            return -this.tilesize.width;
        }
        else {
            return Math.max.apply(null, ret);
        }
    },

    calcMaxCanGoToRight(curpos)
    {
        var currc = this.positionToRC(curpos);
        var radius = this.playerInfo.radius;

        // cc.log(`right:pos=(${curpos.x},${curpos.y});rc=(${currc.r},${currc.c})`);

        var ret = [];

        var tile = {r:currc.r-1, c:currc.c+2};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var x = this.calcXOnCircleMax(curpos, radius, bound.yMin);
            ret.push(bound.xMin-x);
            // cc.log('right[0]', `tile=(${tile.r},${tile.c})`, ret[ret.length-1]);
        }

        var tile = {r:currc.r-1, c:currc.c+1};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var x = this.calcXOnCircleMax(curpos, radius, bound.yMin);
            ret.push(bound.xMin-x);
            // cc.log('right[1]', `tile=(${tile.r},${tile.c})`, ret[ret.length-1]);
        }

        var tile = {r:currc.r, c:currc.c+2};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            ret.push(bound.xMin-(curpos.x+radius));
            // cc.log('calcMaxCanGoToRight[1]', ret[ret.length-1]);
        }

        var tile = {r:currc.r, c:currc.c+1};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            ret.push(bound.xMin-(curpos.x+radius));
            // cc.log('calcMaxCanGoToRight[1]', ret[ret.length-1]);
        }

        var tile = {r:currc.r+1, c:currc.c+2};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var x = this.calcXOnCircleMax(curpos, radius, bound.yMax);
            ret.push(bound.xMin-x);
            // cc.log('calcMaxCanGoToRight[2]', ret[ret.length-1]);
        }

        var tile = {r:currc.r+1, c:currc.c+1};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var x = this.calcXOnCircleMax(curpos, radius, bound.yMax);
            ret.push(bound.xMin-x);
            // cc.log('calcMaxCanGoToRight[2]', ret[ret.length-1]);
        }

        if (ret.length===0) {
            return this.tilesize.width;
        }
        else {
            return Math.min.apply(null, ret);
        }
    },

    calcMaxCanGoToDown(curpos)
    {
        var currc = this.positionToRC(curpos);
        var radius = this.playerInfo.radius;

        if (curpos.y%this.tilesize.height===0) {
            currc.r += 1;
        }

        var debug = false;

        var ret = [];

        var tile = {r:currc.r+2, c:currc.c-1};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var y = this.calcYOnCircleMin(curpos, radius, bound.xMax);
            ret.push(bound.yMax-y);
            debug && cc.log('down[0]', `tile=(${tile.r},${tile.c})`, ret[ret.length-1]);
        }

        var tile = {r:currc.r+1, c:currc.c-1};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var y = this.calcYOnCircleMin(curpos, radius, bound.xMax);
            ret.push(bound.yMax-y);
            debug && cc.log('down[1]', `tile=(${tile.r},${tile.c})`, ret[ret.length-1]);
        }

        var tile = {r:currc.r+2, c:currc.c};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            ret.push(bound.yMax-(curpos.y-radius));
            debug && cc.log('down[2]', `tile=(${tile.r},${tile.c})`, ret[ret.length-1]);
        }

        var tile = {r:currc.r+1, c:currc.c};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            ret.push(bound.yMax-(curpos.y-radius));
            debug && cc.log('down[3]', `tile=(${tile.r},${tile.c})`, ret[ret.length-1]);
        }

        var tile = {r:currc.r+2, c:currc.c+1};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var y = this.calcYOnCircleMin(curpos, radius, bound.xMin);
            ret.push(bound.yMax-y);
            debug && cc.log('down[4]', `tile=(${tile.r},${tile.c})`, ret[ret.length-1]);
        }

        var tile = {r:currc.r+1, c:currc.c+1};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var y = this.calcYOnCircleMin(curpos, radius, bound.xMin);
            ret.push(bound.yMax-y);
            debug && cc.log('down[5]', `tile=(${tile.r},${tile.c})`, ret[ret.length-1]);
        }

        if (ret.length===0) {
            return -this.tilesize.height;
        }
        else {
            return Math.max.apply(null, ret);
        }
    },

    calcMaxCanGoToUp(curpos)
    {
        var currc = this.positionToRC(curpos);
        var radius = this.playerInfo.radius;

        // cc.log('up:', `currc=(${currc.r},${currc.c})`)

        var ret = [];

        var tile = {r:currc.r-2, c:currc.c-1};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var y = this.calcYOnCircleMax(curpos, radius, bound.xMax);
            ret.push(bound.yMin-y);
        }

        var tile = {r:currc.r-1, c:currc.c-1};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var y = this.calcYOnCircleMax(curpos, radius, bound.xMax);
            ret.push(bound.yMin-y);
        }

        var tile = {r:currc.r-2, c:currc.c};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            ret.push(bound.yMin-(curpos.y+radius));
        }

        var tile = {r:currc.r-1, c:currc.c};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            ret.push(bound.yMin-(curpos.y+radius));
        }

        var tile = {r:currc.r-2, c:currc.c+1};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var y = this.calcYOnCircleMax(curpos, radius, bound.xMin);
            ret.push(bound.yMin-y);
        }

        var tile = {r:currc.r-1, c:currc.c+1};
        if (this.isValidRC(tile) && this.displayLayer.getTileGIDAt(tile.c, tile.r)>0) {
            var bound = this.rcBounding(tile);
            var y = this.calcYOnCircleMax(curpos, radius, bound.xMin);
            ret.push(bound.yMin-y);
        }

        if (ret.length===0) {
            return this.tilesize.height;
        }
        else {
            return Math.min.apply(null, ret);
        }
    },

    checkMove(step) {

        // if (this.checked) {
        //     return;
        // }
        // this.checked = true;

        var dir = step.normalize();
        var s = dir.mul(this.playerInfo.speed);

        if (dir.x<0)
        {
            var xlimit = this.calcMaxCanGoToLeft(this.player.position);
            if (s.x < xlimit) {
                s.x = xlimit;
            }
        }
        else if (dir.x>0)
        {
            var xlimit = this.calcMaxCanGoToRight(this.player.position);
            if (s.x > xlimit) {
                s.x = xlimit;
            }
        }

        if (dir.y<0) 
        {
            var ylimit = this.calcMaxCanGoToDown(this.player.position);
            if (s.y < ylimit) {
                s.y = ylimit;
            }
        }
        else if (dir.y>0)
        {
            var ylimit = this.calcMaxCanGoToUp(this.player.position);
            if (s.y > ylimit) {
                s.y = ylimit;
            }
        }

        // cc.log('player move', s.len());

        this.player.position = this.player.position.add(s);

    },

    update(dt)
    {
        if (!this.player) {
            return;
        }
        var rc = this.positionToRC(this.player.position);

        var step = cc.v2(0,0);
        if (this.keys.indexOf(cc.macro.KEY.w)>=0) {
            step.y += 1;
        }
        if (this.keys.indexOf(cc.macro.KEY.s)>=0) {
            step.y -= 1;
        }
        if (this.keys.indexOf(cc.macro.KEY.a)>=0) {
            step.x -= 1;
        }
        if (this.keys.indexOf(cc.macro.KEY.d)>=0) {
            step.x += 1;
        }
        
        if (step.x===0 && step.y===0)
        {
            return;
        }

        this.checkMove(step);

    },
});
