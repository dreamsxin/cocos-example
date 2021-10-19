// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
enum EventName {
    GAME_START = 'game-start',
    GAME_PAUSE = 'game-pause',
    GAME_RESET= 'game-reset',
    GAME_OVER = 'game-over',
    GAME_LOSE = 'game-lose',
    UPDATE_PROGRESS = "UPDATE_PROGRESS"
}

enum TargetType {
    PASS_NODE = 'pass-node',
    SPEED_NODE = 'speed-node',
    END_NODE = 'end-node'
}

@ccclass
export default class Constants {
    public static EventName = EventName
    // update (dt) {}
}
