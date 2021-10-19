
class Helper
{
	constructor()
	{
		this.sound = true;
		this.rescache = {};
	}

	moveNodeTo(node, newParent)
	{
		var world = node.convertToWorldSpaceAR(cc.v2(0,0));
		node.parent = newParent;
		node.position = newParent.convertToNodeSpaceAR(world);
	}

	playEffect(audioClip)
	{
		this.sound && cc.audioEngine.playEffect(audioClip);
	}

	debugObject(obj)
	{
		cc.log('----------------');
		for(let k in obj)
		{
			cc.log(k, '=', obj[k]);
		}
	}

	create(classname)
	{
		var constructor = require(classname);

		if (!constructor) {
			cc.log('找不到', classname);
		}

		return constructor ? new constructor() : null;
	}

	randSelect(arr)
	{
		if (arr.length===0)
			return null;
		if (arr.length===1)
			return arr[0];
		var index = this.randInt([0, arr.length]);
		return arr[index];
	}

	randInt(min, max)
	{
		if (min instanceof Array) {
			max = min[1];
			min = min[0];
		}

		if (min === max)
			return min;

		var rand = Math.random();
		rand = rand * (max - min);
		return Math.floor(min+rand);
	}
}

window.helper = new Helper();