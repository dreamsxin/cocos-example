const maxHCnt = 4;
const maxWCnt = 4;
let dirArr = [
        { i: -1, j: 0 }, { i: 1, j: 0 }, { i: 0, j: -1 }, { i: 0, j: 1 }
    ]
    // 链接两块地图
function conectMap(mapNameArr, index, dirNum, dirNotNull = false) {
    let dir = dirArr[dirNum]
    let nearIndex = {
        i: dir.i + index.i,
        j: dir.j + index.j,
    }
    if (nearIndex.i >= maxHCnt || nearIndex.j >= maxWCnt || nearIndex.i < 0 || nearIndex.j < 0) {
        return;
    }
    if (dirNotNull && mapNameArr[nearIndex.i][nearIndex.j] == '00000') { return; }
    let nowMapName = mapNameArr[index.i][index.j].split('')
    let nearMapName = mapNameArr[nearIndex.i][nearIndex.j].split('')
    nowMapName[dirNum] = '1';
    let nearNum;
    if (dirNum == 0) {
        nearNum = 1;
    } else if (dirNum == 1) {
        nearNum = 0;
    } else if (dirNum == 2) {
        nearNum = 3;
    } else if (dirNum == 3) {
        nearNum = 2;
    }
    nearMapName[nearNum] = '1';
    mapNameArr[index.i][index.j] = nowMapName.join('')
    mapNameArr[nearIndex.i][nearIndex.j] = nearMapName.join('')
}
// 随机链接地图
function randEmptyMap(mapNameArr) {

    for (let i = 0; i < maxHCnt; i++) {
        for (let j = 0; j < maxWCnt; j++) {
            let mapName = mapNameArr[i][j];
            if (mapName != '00000') continue;
            let dirNum = parseInt(Math.random() * dirArr.length);
            conectMap(mapNameArr, { i, j }, dirNum, true)
        }
    }
}
// 生成地图
function getRandNameArr() {
    let { mapArr, stIndex } = randBaseMap()
    let mapNameArr = []
    for (let i = 0; i < maxHCnt; i++) {
        mapNameArr[i] = []
        for (let j = 0; j < maxWCnt; j++) {
            mapNameArr[i][j] = '00000'
        }
    }
    for (let i = 0; i < maxHCnt; i++) {
        for (let j = 0; j < maxWCnt; j++) {
            if (!mapArr[i][j]) continue;
            for (let dirNum = 0; dirNum < dirArr.length; dirNum++) {
                conectMap(mapNameArr, { i, j }, dirNum);
            }
        }
    }
    randEmptyMap(mapNameArr)
    return mapNameArr;
}
//生成基础随机数组
function randBaseMap() {
    let mapCnt = 8; //地图块数量
    let mapArr = []
    for (let i = 0; i < maxHCnt; i++) {
        mapArr[i] = []
        for (let j = 0; j < maxWCnt; j++) {
            mapArr[i][j] = 0
        }
    }
    let stIndex = {
        i: parseInt(Math.random() * maxHCnt),
        j: parseInt(Math.random() * maxWCnt)
    }
    let nextArr = setMap(mapArr, stIndex)
    mapCnt--
    while (mapCnt && nextArr.length > 0) {
        let randNum = nextArr[parseInt(Math.random() * nextArr.length)]
        let nextIndex = nextArr.splice(randNum, 1)[0]
        let nearArr = setMap(mapArr, nextIndex)
        if (nextArr) {
            mapCnt--
            nextArr = uniqNextArr([...nearArr, ...nextArr])
        }
    }
    return { mapArr, stIndex }
}
// 去重
function uniqNextArr(nextArr) {
    let tag = {};
    let arr = [];
    for (let index of nextArr) {
        let num = index.i * maxHCnt + index.j * maxWCnt;
        if (!tag[num]) {
            tag[num] = 1;
            arr.push(index);
        }
    }
    return arr;
}

// 设置通路，周围的路
function setMap(mapArr, index) {
    // 判断随机点是否大于最大以及最小
    if (index.i >= maxHCnt || index.j >= maxWCnt || index.i < 0 || index.j < 0) {
        return null;
    }
    // 判断是否已经被设置
    if (mapArr[index.i][index.j]) {
        return null;
    }
    mapArr[index.i][index.j] = 1
        // 定义相邻位置数组
    let nearArr = []
    for (let dir of dirArr) {
        let i = dir.i + index.i;
        let j = dir.j + index.j;
        // 判断周围是否超过边界
        if (i >= maxHCnt || j >= maxWCnt || i < 0 || j < 0) {
            // 超出不需要处理
            continue;
        }
        // 如果不存在
        if (!mapArr[i][j]) {
            nearArr.push({ i, j })
        }
    }

    return nearArr;

}
module.exports = {
    getRandNameArr
}