/*
 Navicat Premium Data Transfer

 Source Server         : zhimeng-dev
 Source Server Type    : MySQL
 Source Server Version : 80021
 Source Host           : 172.18.0.209:3306
 Source Schema         : gamedb

 Target Server Type    : MySQL
 Target Server Version : 80021
 File Encoding         : 65001

 Date: 25/11/2020 19:46:57
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for player_clothes
-- ----------------------------
DROP TABLE IF EXISTS `player_clothes`;
CREATE TABLE `player_clothes`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `player_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `hair_id` int(0) UNSIGNED NOT NULL COMMENT '发型',
  `makeup_id` int(0) UNSIGNED NOT NULL COMMENT '妆容',
  `top_clothe_id` int(0) UNSIGNED NOT NULL COMMENT '上装',
  `bottom_clothe_id` int(0) UNSIGNED NOT NULL COMMENT '下装',
  `full_clothe_id` int(0) UNSIGNED NOT NULL COMMENT '上下套',
  `head_wear_id` int(0) UNSIGNED NOT NULL COMMENT '头饰',
  `neck_wear_id` int(0) UNSIGNED NOT NULL COMMENT '颈饰',
  `ear_id` int(0) UNSIGNED NOT NULL COMMENT '耳饰',
  `hang_id` int(0) UNSIGNED NOT NULL COMMENT '挂饰',
  `hand_wear_id` int(0) UNSIGNED NOT NULL COMMENT '手饰',
  `hand_held_id` int(0) UNSIGNED NOT NULL COMMENT '手持',
  `sock_id` int(0) UNSIGNED NOT NULL COMMENT '袜子',
  `shoe_id` int(0) UNSIGNED NOT NULL COMMENT '鞋子',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 358 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for player_heros
-- ----------------------------
DROP TABLE IF EXISTS `player_heros`;
CREATE TABLE `player_heros`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `player_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `hero_id` int(0) UNSIGNED NOT NULL COMMENT '锦魂名ID',
  `pos` int(0) UNSIGNED NOT NULL DEFAULT 0 COMMENT '布阵位置',
  `level` int(0) UNSIGNED NOT NULL COMMENT '等级',
  `exp` int(0) UNSIGNED NOT NULL DEFAULT 0,
  `energy` int(0) UNSIGNED NOT NULL,
  `step` int(0) NOT NULL COMMENT '层级（突破）',
  `star` int(0) UNSIGNED NOT NULL COMMENT '星级（升星）',
  `type` tinyint(0) UNSIGNED NOT NULL COMMENT '类型：1.肉盾\n2.战士\n3.群体输出\n4.单体输出\n5.群体控制\n6.单体控制\n7.群体治疗\n8.辅助\r\r',
  `occupation` tinyint(0) UNSIGNED NOT NULL COMMENT '职业：1.工匠\n2.乐师\n3.医者\n4.歌姬\n5.帝师\n6.酒正\n7.豪侠\n8.画师\n9.诗者\n10.剑客\r',
  `occupation_lv` tinyint(0) UNSIGNED NOT NULL COMMENT '职业级别：1.初级\n2.中级\n3.高级\r',
  `power` int(0) UNSIGNED NOT NULL COMMENT '战力',
  `attr_base_atk` int(0) NOT NULL COMMENT '基础攻击',
  `attr_base_def` int(0) NOT NULL COMMENT '基础防御',
  `attr_base_hp` int(0) NOT NULL COMMENT '基础气血',
  `attr_base_dex` int(0) NOT NULL COMMENT '基础敏捷',
  `attr_base_critical` int(0) NOT NULL COMMENT '基础会心',
  `attr_base_sta` int(0) NOT NULL COMMENT '基础韧性',
  `attr_base_acc` int(0) NOT NULL COMMENT '基础命中',
  `attr_base_eva` int(0) NOT NULL COMMENT '基础闪避',
  `attr_step_atk` int(0) NOT NULL COMMENT '突破攻击',
  `attr_step_def` int(0) NOT NULL COMMENT '突破防御',
  `attr_step_hp` int(0) NOT NULL COMMENT '突破气血',
  `attr_step_dex` int(0) NOT NULL COMMENT '突破敏捷',
  `attr_step_critical` int(0) NOT NULL COMMENT '突破会心',
  `attr_step_sta` int(0) NOT NULL COMMENT '突破韧性',
  `attr_step_acc` int(0) NOT NULL COMMENT '突破命中',
  `attr_step_eva` int(0) NOT NULL COMMENT '突破闪避',
  `attr_evolution_atk` int(0) NOT NULL COMMENT '升星攻击',
  `attr_evolution_def` int(0) NOT NULL COMMENT '升星防御',
  `attr_evolution_hp` int(0) NOT NULL COMMENT '升星气血',
  `attr_evolution_dex` int(0) NOT NULL COMMENT '升星敏捷',
  `attr_evolution_critical` int(0) NOT NULL COMMENT '升星会心',
  `attr_evolution_sta` int(0) NOT NULL COMMENT '升星韧性',
  `attr_evolution_acc` int(0) NOT NULL COMMENT '升星命中',
  `attr_evolution_eva` int(0) NOT NULL COMMENT '升星闪避',
  `lottype` tinyint(0) UNSIGNED NOT NULL COMMENT '羁绊类型',
  `skills` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '技能列表',
  `status` tinyint(0) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `hero_idx`(`player_id`, `hero_id`) USING BTREE,
  INDEX `player_id_idx`(`player_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2529 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for player_items
-- ----------------------------
DROP TABLE IF EXISTS `player_items`;
CREATE TABLE `player_items`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `player_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `item_uid` int(0) UNSIGNED NOT NULL,
  `item_id` int(0) UNSIGNED NOT NULL,
  `count` int(0) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `player_id_idx`(`player_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8512 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for player_quests
-- ----------------------------
DROP TABLE IF EXISTS `player_quests`;
CREATE TABLE `player_quests`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `player_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `unlock_data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `star_award_data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 371 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for player_simulations
-- ----------------------------
DROP TABLE IF EXISTS `player_simulations`;
CREATE TABLE `player_simulations`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `player_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `level` int(0) UNSIGNED NOT NULL COMMENT '模拟经营等级',
  `day_delay_reset_time` bigint(0) NOT NULL,
  `order_refresh_stime` bigint(0) NOT NULL COMMENT '订单刷新记录时间',
  `order_refresh_free_count` int(0) NOT NULL COMMENT '订单免费刷新次数',
  `order_refresh_count` int(0) NOT NULL COMMENT '订单付费刷新次数',
  `order_data` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '订单存储数据',
  `work_data1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '织机',
  `work_data2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '印染',
  `work_data3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '蚕田',
  `work_data4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '车床',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for player_wardrobes
-- ----------------------------
DROP TABLE IF EXISTS `player_wardrobes`;
CREATE TABLE `player_wardrobes`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `player_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `wardrobe_data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 358 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for player_warehouses
-- ----------------------------
DROP TABLE IF EXISTS `player_warehouses`;
CREATE TABLE `player_warehouses`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `player_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `level` int(0) UNSIGNED NOT NULL,
  `count_data` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `store_data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for players
-- ----------------------------
DROP TABLE IF EXISTS `players`;
CREATE TABLE `players`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `player_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `head` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '头像',
  `level` int(0) UNSIGNED NOT NULL DEFAULT 1 COMMENT '等级',
  `exp` int(0) UNSIGNED NOT NULL COMMENT '经验',
  `diamond` int(0) UNSIGNED NOT NULL COMMENT '钻石',
  `silver` int(0) UNSIGNED NOT NULL,
  `gold` int(0) UNSIGNED NOT NULL COMMENT '金币',
  `vitality_val` int(0) NOT NULL COMMENT '体力',
  `battle_val` int(0) NOT NULL COMMENT '战力',
  `career_lv` int(0) NOT NULL COMMENT '官阶',
  `power_val` int(0) NOT NULL COMMENT '权力',
  `popularity_val` int(0) NOT NULL COMMENT '人气',
  `glamour_val` int(0) NOT NULL COMMENT '魅力',
  `title_id` int(0) NOT NULL COMMENT '称号ID',
  `hair_id` int(0) NOT NULL COMMENT '发型ID',
  `face_id` int(0) NOT NULL COMMENT '表情ID',
  `body_id` int(0) NOT NULL COMMENT '身体ID',
  `status` tinyint(0) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `openid_idx`(`openid`) USING BTREE,
  UNIQUE INDEX `player_id_idx`(`player_id`) USING BTREE,
  UNIQUE INDEX `name_idx`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 408 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
