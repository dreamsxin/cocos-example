
export namespace Account {

    //  http账号登录
    export class LoginRequest {
        //  openid
        openid: string = "";
    }

    //  http账号登录
    export class LoginResponse {
        token: string = "";
        ip: string = "";
        port: string = "";
        errcode: number = 0;
    }

    //  ws玩家登录
    export class PlayerLoginRequest {
        //  openid
        token: string = "";
    }

    //  ws账号登录
    export class PlayerLoginResponse {
        player_id: string = "";// 玩家ID
        name: string = "";// 玩家名称
        head: string = "";// 玩家头像
        level: number = 0;// 玩家等级
        exp: number = 0;// 玩家经验
        diamind: number = 0;// 钻石
        gold: number = 0;// 金币
        vitality_val: number = 0;// 体力
        battle_val: number = 0;// 战力
        career_lv: number = 0;// 官阶
        power_val: number = 0;// 权力
        popularity_val: number = 0;// 人气
        glamour_val: number = 0;// 魅力
        title_id: number = 0;// 玩家称号
        hair_id: number = 0;// 玩家发型ID
        face_id: number = 0; // 玩家表情ID
        body_id: number = 0;// 玩家身体ID
    }
    //  ws玩家登录
    export class PlayerCreatRoleRequest {
        //  token
        token: string = "";
        name: string = ""; // 玩家名称
    }

    //  ws账号登录
    export class PlayerCreatRoleResponse {
        player_id: string = "";// 玩家ID
        name: string = "";// 玩家名称
        head: string = "";// 玩家头像
        level: number = 0;// 玩家等级
        exp: number = 0;// 玩家经验
        diamind: number = 0;// 钻石
        gold: number = 0;// 金币
        vitality_val: number = 0;// 体力
        battle_val: number = 0;// 战力
        career_lv: number = 0;// 官阶
        power_val: number = 0;// 权力
        popularity_val: number = 0;// 人气
        glamour_val: number = 0;// 魅力
        title_id: number = 0;// 玩家称号
        hair_id: number = 0;// 玩家发型ID
        face_id: number = 0; // 玩家表情ID
        body_id: number = 0;// 玩家身体ID
    }
    //  ws玩家登录
    export class PlayerSetBaseClothRequest {

        hairId: number = 0;// 玩家发型ID
        faceId: number = 0; // 玩家表情ID
        bodyId: number = 0;// 玩家身体ID
    }


}