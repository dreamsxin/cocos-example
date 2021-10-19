const view = (vname) => { return require('./../scripts/views/' + vname + 'View'); }

module.exports = {
    // 登录
    1001: (req, res) => { return view('Login').SignIn(req, res); },
    // 玩家
    1002: (req, res) => { return view('Player').PlayerCreate(req, res); },
    1003: (req, res) => { return view('Player').PlayerDressSetting(req, res); },
    // 关卡
    1050: (req, res) => { return view('Quest').QuestBattle(req, res); },
    1051: (req, res) => { return view('Quest').QuestStoryRecord(req, res); },
    1052: (req, res) => { return view('Quest').QuestClothing(req, res); },
    1053: (req, res) => { return view('Quest').QuestStarAward(req, res); },
    // 随从
    1101: (req, res) => { return view('Hero').HeroList(req, res); },
    1102: (req, res) => { return view('Hero').HeroLevelUp(req, res); },
    1103: (req, res) => { return view('Hero').HeroEvolutionUp(req, res); },
    1104: (req, res) => { return view('Hero').HeroStepUp(req, res); },
    1105: (req, res) => { return view('Hero').HeroPosition(req, res); },
    1106: (req, res) => { return view('Hero').HeroEmbattle(req, res); },
    // 道具
    1151: (req, res) => { return view('Item').ItemList(req, res); },
    // 抽卡
    1201: (req, res) => { return view('Gacha').GachaResult(req, res); },
    // 模拟经营
    1251: (req, res) => { return view('Simulation').SimulationProductList(req, res); },
    1252: (req, res) => { return view('Simulation').SimulationResult(req, res); },
    1253: (req, res) => { return view('Simulation').SimulationWorkingFast(req, res); },
    1254: (req, res) => { return view('Simulation').SimulationUpgradeBar(req, res); },
    1255: (req, res) => { return view('Simulation').SimulationRefreshOrder(req, res); },
    1256: (req, res) => { return view('Simulation').SimulationOrderResult(req, res); },
    1257: (req, res) => { return view('Simulation').SimulationUpgradeWarehouse(req, res); },
    // GM
    9001: (req, res) => { return view('Gm').GmAddItem(req, res); }
}