module.exports = () => {
    return {
        info: {
            vitality: 999 // 体力
        },
        currency: {
            diamond: 99999, // 元宝
            silver: 9999999, // 银子
            gold: 9999999 // 铜钱
        },
        heros: [1], // 初始随从
        items: [ // 初始道具
            { id: 5, count: 99 },
            { id: 6, count: 99 },
            { id: 7, count: 99 },
            { id: 8, count: 99 },
            { id: 9, count: 99 },
            { id: 10, count: 99 },
            { id: 11, count: 99 },
            { id: 12, count: 99 },
            { id: 13, count: 99 },
            { id: 14, count: 99 },
            { id: 15, count: 99 },
            { id: 16, count: 99 },
            { id: 17, count: 99 },
            { id: 18, count: 99 },
            { id: 19, count: 99 },
            { id: 20, count: 99 },
            { id: 21, count: 99 },
            { id: 22, count: 99 },
            { id: 31, count: 99 }
        ],
        clothes: { // 默认套装
            hair_id: 10001,  // 发型
            makeup_id: 20001, // 妆容
            top_clothe_id: 0, // 上装
            bottom_clothe_id: 0, // 下装
            full_clothe_id: 50001, // 上下装
            head_wear_id: 0, // 头饰
            neck_wear_id: 0, // 颈饰
            ear_id: 0, // 耳饰
            hang_id: 0, // 挂饰
            hand_wear_id: 0, // 手饰
            hand_held_id: 0, // 手持
            sock_id: 0, // 袜子
            shoe_id: 0 // 鞋子
        },
        position_unlock: [1, 1, 1, 5, 7, 9],
        // 模拟经营
        simulation: {
            work_fast_need_diamond: 50, // 生产加速所需元宝
            // 订单
            order_num_max: 8, // 最大刷新数
            order_refresh_free_count: 2, // 免费刷新次数
            order_refresh_delay_time: 12 * 60 * 60 * 1000, // 隔时刷新（小时）
            order_refresh_need_diamond: [5, 8, 12, 15, 20], // 刷新所需元宝（次数为数组长度）
            order_star_probability: [40, 28, 18, 10, 4], // 星级概率
            // 仓库
            warehouse_count_default: [50, 50, 50, 50], // 默认数量上限（布匹、染料、蚕丝、配件）
            warehouse_upgrade_need_diamond: [5, 8, 12, 15, 20], // 升级所需元宝
            warehouse_count_ext: [20, 30, 50, 60, 80], // 扩容数量
        }
    }
}