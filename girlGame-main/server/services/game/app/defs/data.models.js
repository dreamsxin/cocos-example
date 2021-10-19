module.exports = {
    "players": () => {
        return {
            openid: "",
            player_id: "0",
            name: "",
            head: "",
            level: 1,
            exp: 0,
            diamond: 0, // 元宝
            silver: 0, // 银两
            gold: 0, // 铜钱
            vitality_val: 0, // 体力
            battle_val: 0, // 战力
            career_lv: 0, // 官阶
            power_val: 0, // 权力
            popularity_val: 0, // 人气
            glamour_val: 0, // 魅力
            title_id: 0, // 称号ID
            hair_id: 0,
            face_id: 0,
            body_id: 0,
            status: 1
        }
    },
    "player_heros": () => {
        return {
            __mainkey: "hero_id",
            player_id: "0",
            hero_id: 0,
            pos: 0,
            power: 0,
            level: 1,
            exp: 0,
            energy: 0,
            step: 0,
            star: 0,
            type: 0,
            occupation: 0,
            occupation_lv: 0,
            attr_base_atk: 0,
            attr_base_def: 0,
            attr_base_hp: 0,
            attr_base_dex: 0,
            attr_base_critical: 0,
            attr_base_sta: 0,
            attr_base_acc: 0,
            attr_base_eva: 0,
            attr_step_atk: 0,
            attr_step_def: 0,
            attr_step_hp: 0,
            attr_step_dex: 0,
            attr_step_critical: 0,
            attr_step_sta: 0,
            attr_step_acc: 0,
            attr_step_eva: 0,
            attr_evolution_atk: 0,
            attr_evolution_def: 0,
            attr_evolution_hp: 0,
            attr_evolution_dex: 0,
            attr_evolution_critical: 0,
            attr_evolution_sta: 0,
            attr_evolution_acc: 0,
            attr_evolution_eva: 0,
            lottype: 0,
            skills: [],
            status: 1
        }
    },
    "player_items": () => {
        return {
            __mainkey: "item_uid",
            player_id: "0",
            item_uid: "0",
            item_id: 0,
            count: 0
        }
    },
    "player_quests": () => {
        return {
            player_id: "0",
            unlock_data: [],
            star_award_data: []
        }
    },
    "player_clothes": () => {
        return {
            player_id: "0",
            hair_id: 0, 
            makeup_id: 0, 
            top_clothe_id: 0, 
            bottom_clothe_id: 0, 
            full_clothe_id: 0,
            head_wear_id: 0, 
            neck_wear_id: 0, 
            ear_id: 0, 
            hang_id: 0,
            hand_wear_id: 0, 
            hand_held_id: 0,
            sock_id: 0, 
            shoe_id: 0
        }
    },
    "player_wardrobes": () => {
        return {
            player_id: "0",
            wardrobe_data: []
        }
    },
    "player_simulations": () => {
        return {
            player_id: "0",
            level: 1,
            day_delay_reset_time: 0,
            order_refresh_stime: 0,
            order_refresh_free_count: 0,
            order_refresh_count: 0,
            order_data: [],
            work_data1: { id: 0, st: 0, nt: 0, count: 0 }, // 织布机（产物ID|开始时间|暂停用保存时间|产物数）
            work_data2: { id: 0, st: 0, nt: 0, count: 0 }, // 印染
            work_data3: { id: 0, st: 0, nt: 0, count: 0 }, // 蚕田
            work_data4: { id: 0, st: 0, nt: 0, count: 0 } // 车床
        }
    },
    "player_warehouses": () => {
        return {
            player_id: "0",
            level: 1,
            count_data: [],
            store_data: []
        }
    }
}