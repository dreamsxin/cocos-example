const ws = require('ws')

//const { deflate, unzip } = require('zlib');
const CODE_OFFSET = 4;
const BODY_LENGTH_OFFSET = 4;

class PacketWrapper
{
    static unpack(bytes)
    {
        return new Promise((resolve, reject) => {
            const code = bytes.readUInt32BE(0);
            const bodyLength = bytes.readUInt32BE(CODE_OFFSET);
            const body = bytes.slice((CODE_OFFSET + BODY_LENGTH_OFFSET),
                (CODE_OFFSET + BODY_LENGTH_OFFSET) + bodyLength);
            //unzip(body, (err, buffer) => {
            //    if (err) {
            //        reject(err);
            //    } else {
                    try {
                        resolve({
                            code: code,
                            body: JSON.parse(body.toString())
                        });
                    } catch (e) {
                        reject(e);
                    }
            //    }
            //});
        });
    }

    static pack(payload) // payload={ code, body }
    {
        return new Promise((resolve, reject) => {
            //deflate(JSON.stringify(payload.body), (err, buffer) => {
            //    if (err) {
            //        reject(err);
            //    } else {
                    try {
                        const body = Buffer.from(JSON.stringify(payload.body));
                
                        const header = Buffer.alloc(CODE_OFFSET + BODY_LENGTH_OFFSET, 0);
                        header.writeInt32BE(payload.code, 0);
                        header.writeInt32BE(body.length, CODE_OFFSET);
            
                        const packet = Buffer.concat([header, body], 
                            (CODE_OFFSET+BODY_LENGTH_OFFSET) + body.length);
                        
                        resolve(packet);
                    } catch (e) {
                        reject(e);
                    }
            //    }
            //});
        });
    }
}

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcGVuaWQiOiIyeFcyU0Z6U0QyMkZFV1ctekgySU0yRTJuMjI5Z1Jqd3gyWFNKQUNLLWpkRlVDS0VORVdTamprTUlNSUpPS1NFNFZWVlZCRERERkYtREQtUFBQIiwiaWF0IjoxNjA2MzgwODY0LCJleHAiOjE2MDYzODgwNjR9.3ewbrlnukHvBMc3eLxdEpljMCSuQf9vZbn4aso_Bux4";
let wsUri = 'ws://172.18.0.209:8090';//'ws://61.173.73.133:8191'; // 'ws://172.18.0.209:8090';
let cli = new ws(wsUri);
cli.on('open', () => {
    // 打包
    PacketWrapper.pack({ code: 1001, body: { 
        token: token,
    }}).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
})

function PlayerCreate(params)
{
    PacketWrapper.pack({ code: 1002, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}

function QuestStoryRecord(params)
{
    PacketWrapper.pack({ code: 1051, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}

function PveBattle(params)
{
    PacketWrapper.pack({ code: 1050, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}

function PlayerDressSetting(params)
{
    PacketWrapper.pack({ code: 1003, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}

function QuestClothing(params)
{
    PacketWrapper.pack({ code: 1052, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}

function QuestStarAward(params)
{
    PacketWrapper.pack({ code: 1053, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}

function Gacha(params)
{
    PacketWrapper.pack({ code: 1201, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}

function HeroPosition(params)
{
    PacketWrapper.pack({ code: 1105, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}

function HeroLevelUp(params)
{
    PacketWrapper.pack({ code: 1102, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}

function HeroEmbattle(params)
{
    PacketWrapper.pack({ code: 1106, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}

// =====================================================
// 模拟经营
// =====================================================
function SimulationProductList(params)
{
    PacketWrapper.pack({ code: 1251, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}
function SimulationResult(params)
{
    PacketWrapper.pack({ code: 1252, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}
function SimulationWorkingFast(params)
{
    PacketWrapper.pack({ code: 1253, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}
function SimulationUpgradeBar(params)
{
    PacketWrapper.pack({ code: 1254, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}
function SimulationRefreshOrder(params)
{
    PacketWrapper.pack({ code: 1255, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}
function SimulationOrderResult(params)
{
    PacketWrapper.pack({ code: 1256, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}
function SimulationUpgradeWarehouse(params)
{
    PacketWrapper.pack({ code: 1257, body: params }).then(packet => {
        cli.send(packet);
    }).catch(err => { console.error(err); });
}

// =================================================

let ret = true;

cli.on('message', (bytes) => {
    // 解包
    PacketWrapper.unpack(bytes).then(req => {
        if (req.code !== 1001)
            console.log(JSON.stringify(req));
            

        if (ret) {
            
            //PlayerCreate({ token: token, name: "FF-KLD-DD-PPP" });
            //HeroLevelUp({ heroId: 1, state: 0 })
            //HeroPosition({ heroId: 7, pos: 2 })
            //QuestStoryRecord({ questId: 101 });
            //PveBattle({ questId: 102 });
            //QuestStarAward({ chapterId: 1, pos: 1});
            /*PlayerDressSetting({
                hair: 0,
                makeup: 11,
                topClothe: 0,
                bottomClothe: 1,
                fullClothe:  2,
                headwear: 0,
                neckwear: 0,
                ear: 0,
                hang: 0,
                handwear: 0,
                handheld: 0,
                sock:  0,
                shoe: 0
            })*/
            /*QuestClothing({ questId: 102, clothes: {
                hair: 10001,
                makeup: 20001,
                topClothe: 0,
                bottomClothe: 0,
                fullClothe:  50002,
                headwear: 60001,
                neckwear: 70001,
                ear: 80001,
                hang: 90001,
                handwear: 100001,
                handheld: 110001,
                sock:  120001,
                shoe: 130002
            }})*/
            //Gacha({ count: 1 });
            //HeroEmbattle({ embattle:[{id:1,pos:1},{id:2,pos:2},{id:3,pos:3},{id:4,pos:4},{id:5,pos:5},{id:6,pos:6}] });

            // ===================================
            // 模拟经营
            // ===================================
            SimulationProductList({})
            //SimulationResult({ type: 1 })
            //SimulationWorkingFast({ type: 1  })
            //SimulationUpgradeBar({})
            //SimulationRefreshOrder({})
            //SimulationOrderResult({ orderId: 1 })
            //SimulationUpgradeWarehouse({})

            ret = false;
        }
    }).catch(err => { console.error(err); });
})