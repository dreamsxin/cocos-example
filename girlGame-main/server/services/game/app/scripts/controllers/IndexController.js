const { DataHelper } = require('./../../com/helpers');
const { Simulation } = require('./SimulationController');

function getPlayerTemporaryKey(key, field, callback)
{
    DataHelper.getHashValue("temporary_keys:" + key, field, value => {
        callback(value);
    });
}

function setPlayerTemporaryKey(key, doc, callback)
{
    DataHelper.setHashValue("temporary_keys:" + key, doc, () => {
        callback();
    });
}

// cron隔日重置数据
function toCronDayResetData(uuid, callback)
{
    /*
    setPlayerTemporaryKey(uuid, { LOGIN_DAY_RECORD_TIME: new Date().getTime() }, () => {
        let simulationPtr = new Simulation(uuid);
        simulationPtr.load(() => {
            simulationPtr.resetSimulationData(); // 重置模拟经营数据
            simulationPtr.save(() => {
                callback();
            });
        });
    });*/
    callback();
}

// 登陆隔日重置数据
function toLoginDayResetData(uuid, callback)
{
    /*
    let now = new Date();
    getPlayerTemporaryKey(uuid, "LOGIN_DAY_RECORD_TIME", recTime => {
        let recFlag = false;
        if (!recTime) { recTime = now.getTime(); recFlag = true; }
        let dt = new Date(recTime);
        if (now.getFullYear() !== dt.getFullYear() || 
                now.getMonth() !== dt.getMonth() ||
                    now.getDate() !== dt.getDate()) {
            // 已隔天重置需要隔日重置的数据
            let simulationPtr = new Simulation(uuid);
            simulationPtr.load(() => {
                simulationPtr.resetSimulationData(); // 重置模拟经营数据
                simulationPtr.save(() => {
                    setPlayerTemporaryKey(uuid, { LOGIN_DAY_RECORD_TIME: now.getTime() }, () => {
                        callback();
                    });
                });
            });
        } else {
            if (recFlag) {
                setPlayerTemporaryKey(uuid, { LOGIN_DAY_RECORD_TIME: recTime }, () => {
                    callback();
                });
            } else {
                callback();
            }
        }
    });*/
    callback();
}

module.exports = {
    getPlayerTemporaryKey,
    setPlayerTemporaryKey,
    toCronDayResetData,
    toLoginDayResetData
}