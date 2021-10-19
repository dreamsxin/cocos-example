/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("./cocos_proto");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.msg = (function() {

    /**
     * Namespace msg.
     * @exports msg
     * @namespace
     */
    var msg = {};

    /**
     * MessageID enum.
     * @name msg.MessageID
     * @enum {string}
     * @property {number} MSG_Ping=0 MSG_Ping value
     * @property {number} MSG_Pong=1 MSG_Pong value
     * @property {number} MSG_Error_S2C=2 MSG_Error_S2C value
     * @property {number} MSG_Login_C2S=3 MSG_Login_C2S value
     * @property {number} MSG_Login_S2C=4 MSG_Login_S2C value
     * @property {number} MSG_Logout_C2S=5 MSG_Logout_C2S value
     * @property {number} MSG_Logout_S2C=6 MSG_Logout_S2C value
     * @property {number} MSG_QuickStart_C2S=7 MSG_QuickStart_C2S value
     * @property {number} MSG_ChangeTable_C2S=8 MSG_ChangeTable_C2S value
     * @property {number} MSG_JoinRoom_S2C=9 MSG_JoinRoom_S2C value
     * @property {number} MSG_EnterRoom_S2C=10 MSG_EnterRoom_S2C value
     * @property {number} MSG_NoticeJoin_S2C=11 MSG_NoticeJoin_S2C value
     * @property {number} MSG_LeaveRoom_C2S=12 MSG_LeaveRoom_C2S value
     * @property {number} MSG_LeaveRoom_S2C=13 MSG_LeaveRoom_S2C value
     * @property {number} MSG_SitDown_C2S=14 MSG_SitDown_C2S value
     * @property {number} MSG_SitDown_S2C=15 MSG_SitDown_S2C value
     * @property {number} MSG_StandUp_C2S=16 MSG_StandUp_C2S value
     * @property {number} MSG_StandUp_S2C=17 MSG_StandUp_S2C value
     * @property {number} MSG_PlayerAction_C2S=18 MSG_PlayerAction_C2S value
     * @property {number} MSG_PlayerAction_S2C=19 MSG_PlayerAction_S2C value
     * @property {number} MSG_PlayerActionChange_S2C=20 MSG_PlayerActionChange_S2C value
     * @property {number} MSG_AddChips_C2S=21 MSG_AddChips_C2S value
     * @property {number} MSG_AddChips_S2C=22 MSG_AddChips_S2C value
     * @property {number} MSG_GameStepChange_S2C=23 MSG_GameStepChange_S2C value
     * @property {number} MSG_ResultGameData_S2C=24 MSG_ResultGameData_S2C value
     * @property {number} MSG_ReadyTime_S2C=25 MSG_ReadyTime_S2C value
     * @property {number} MSG_SettleTime_S2C=26 MSG_SettleTime_S2C value
     * @property {number} MSG_PushCardTime_S2C=27 MSG_PushCardTime_S2C value
     * @property {number} MSG_RoomStatus_C2S=28 MSG_RoomStatus_C2S value
     * @property {number} MSG_RoomStatus_S2C=29 MSG_RoomStatus_S2C value
     * @property {number} MSG_EmojiChat_C2S=30 MSG_EmojiChat_C2S value
     * @property {number} MSG_EmojiChat_S2C=31 MSG_EmojiChat_S2C value
     * @property {number} MSG_PiPeiPlayer_S2C=32 MSG_PiPeiPlayer_S2C value
     * @property {number} MSG_PiPeiData_S2C=33 MSG_PiPeiData_S2C value
     * @property {number} MSG_SendActTimer_S2C=34 MSG_SendActTimer_S2C value
     * @property {number} MSG_SendRoomData_S2C=35 MSG_SendRoomData_S2C value
     * @property {number} MSG_WaitPlayerList_C2S=36 MSG_WaitPlayerList_C2S value
     * @property {number} MSG_WaitPlayerList_S2C=37 MSG_WaitPlayerList_S2C value
     * @property {number} MSG_ShowRoomInfo_C2S=38 MSG_ShowRoomInfo_C2S value
     * @property {number} MSG_ShowRoomInfo_S2C=39 MSG_ShowRoomInfo_S2C value
     */
    msg.MessageID = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "MSG_Ping"] = 0;
        values[valuesById[1] = "MSG_Pong"] = 1;
        values[valuesById[2] = "MSG_Error_S2C"] = 2;
        values[valuesById[3] = "MSG_Login_C2S"] = 3;
        values[valuesById[4] = "MSG_Login_S2C"] = 4;
        values[valuesById[5] = "MSG_Logout_C2S"] = 5;
        values[valuesById[6] = "MSG_Logout_S2C"] = 6;
        values[valuesById[7] = "MSG_QuickStart_C2S"] = 7;
        values[valuesById[8] = "MSG_ChangeTable_C2S"] = 8;
        values[valuesById[9] = "MSG_JoinRoom_S2C"] = 9;
        values[valuesById[10] = "MSG_EnterRoom_S2C"] = 10;
        values[valuesById[11] = "MSG_NoticeJoin_S2C"] = 11;
        values[valuesById[12] = "MSG_LeaveRoom_C2S"] = 12;
        values[valuesById[13] = "MSG_LeaveRoom_S2C"] = 13;
        values[valuesById[14] = "MSG_SitDown_C2S"] = 14;
        values[valuesById[15] = "MSG_SitDown_S2C"] = 15;
        values[valuesById[16] = "MSG_StandUp_C2S"] = 16;
        values[valuesById[17] = "MSG_StandUp_S2C"] = 17;
        values[valuesById[18] = "MSG_PlayerAction_C2S"] = 18;
        values[valuesById[19] = "MSG_PlayerAction_S2C"] = 19;
        values[valuesById[20] = "MSG_PlayerActionChange_S2C"] = 20;
        values[valuesById[21] = "MSG_AddChips_C2S"] = 21;
        values[valuesById[22] = "MSG_AddChips_S2C"] = 22;
        values[valuesById[23] = "MSG_GameStepChange_S2C"] = 23;
        values[valuesById[24] = "MSG_ResultGameData_S2C"] = 24;
        values[valuesById[25] = "MSG_ReadyTime_S2C"] = 25;
        values[valuesById[26] = "MSG_SettleTime_S2C"] = 26;
        values[valuesById[27] = "MSG_PushCardTime_S2C"] = 27;
        values[valuesById[28] = "MSG_RoomStatus_C2S"] = 28;
        values[valuesById[29] = "MSG_RoomStatus_S2C"] = 29;
        values[valuesById[30] = "MSG_EmojiChat_C2S"] = 30;
        values[valuesById[31] = "MSG_EmojiChat_S2C"] = 31;
        values[valuesById[32] = "MSG_PiPeiPlayer_S2C"] = 32;
        values[valuesById[33] = "MSG_PiPeiData_S2C"] = 33;
        values[valuesById[34] = "MSG_SendActTimer_S2C"] = 34;
        values[valuesById[35] = "MSG_SendRoomData_S2C"] = 35;
        values[valuesById[36] = "MSG_WaitPlayerList_C2S"] = 36;
        values[valuesById[37] = "MSG_WaitPlayerList_S2C"] = 37;
        values[valuesById[38] = "MSG_ShowRoomInfo_C2S"] = 38;
        values[valuesById[39] = "MSG_ShowRoomInfo_S2C"] = 39;
        return values;
    })();

    msg.Ping = (function() {

        /**
         * Properties of a Ping.
         * @memberof msg
         * @interface IPing
         */

        /**
         * Constructs a new Ping.
         * @memberof msg
         * @classdesc Represents a Ping.
         * @implements IPing
         * @constructor
         * @param {msg.IPing=} [properties] Properties to set
         */
        function Ping(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new Ping instance using the specified properties.
         * @function create
         * @memberof msg.Ping
         * @static
         * @param {msg.IPing=} [properties] Properties to set
         * @returns {msg.Ping} Ping instance
         */
        Ping.create = function create(properties) {
            return new Ping(properties);
        };

        /**
         * Encodes the specified Ping message. Does not implicitly {@link msg.Ping.verify|verify} messages.
         * @function encode
         * @memberof msg.Ping
         * @static
         * @param {msg.IPing} message Ping message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Ping.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified Ping message, length delimited. Does not implicitly {@link msg.Ping.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.Ping
         * @static
         * @param {msg.IPing} message Ping message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Ping.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Ping message from the specified reader or buffer.
         * @function decode
         * @memberof msg.Ping
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.Ping} Ping
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Ping.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.Ping();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Ping message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.Ping
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.Ping} Ping
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Ping.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Ping message.
         * @function verify
         * @memberof msg.Ping
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Ping.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a Ping message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.Ping
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.Ping} Ping
         */
        Ping.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.Ping)
                return object;
            return new $root.msg.Ping();
        };

        /**
         * Creates a plain object from a Ping message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.Ping
         * @static
         * @param {msg.Ping} message Ping
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Ping.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this Ping to JSON.
         * @function toJSON
         * @memberof msg.Ping
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Ping.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Ping;
    })();

    msg.Pong = (function() {

        /**
         * Properties of a Pong.
         * @memberof msg
         * @interface IPong
         * @property {number|Long|null} [serverTime] Pong serverTime
         */

        /**
         * Constructs a new Pong.
         * @memberof msg
         * @classdesc Represents a Pong.
         * @implements IPong
         * @constructor
         * @param {msg.IPong=} [properties] Properties to set
         */
        function Pong(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Pong serverTime.
         * @member {number|Long} serverTime
         * @memberof msg.Pong
         * @instance
         */
        Pong.prototype.serverTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new Pong instance using the specified properties.
         * @function create
         * @memberof msg.Pong
         * @static
         * @param {msg.IPong=} [properties] Properties to set
         * @returns {msg.Pong} Pong instance
         */
        Pong.create = function create(properties) {
            return new Pong(properties);
        };

        /**
         * Encodes the specified Pong message. Does not implicitly {@link msg.Pong.verify|verify} messages.
         * @function encode
         * @memberof msg.Pong
         * @static
         * @param {msg.IPong} message Pong message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Pong.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.serverTime != null && message.hasOwnProperty("serverTime"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.serverTime);
            return writer;
        };

        /**
         * Encodes the specified Pong message, length delimited. Does not implicitly {@link msg.Pong.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.Pong
         * @static
         * @param {msg.IPong} message Pong message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Pong.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Pong message from the specified reader or buffer.
         * @function decode
         * @memberof msg.Pong
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.Pong} Pong
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Pong.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.Pong();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.serverTime = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Pong message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.Pong
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.Pong} Pong
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Pong.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Pong message.
         * @function verify
         * @memberof msg.Pong
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Pong.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.serverTime != null && message.hasOwnProperty("serverTime"))
                if (!$util.isInteger(message.serverTime) && !(message.serverTime && $util.isInteger(message.serverTime.low) && $util.isInteger(message.serverTime.high)))
                    return "serverTime: integer|Long expected";
            return null;
        };

        /**
         * Creates a Pong message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.Pong
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.Pong} Pong
         */
        Pong.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.Pong)
                return object;
            var message = new $root.msg.Pong();
            if (object.serverTime != null)
                if ($util.Long)
                    (message.serverTime = $util.Long.fromValue(object.serverTime)).unsigned = false;
                else if (typeof object.serverTime === "string")
                    message.serverTime = parseInt(object.serverTime, 10);
                else if (typeof object.serverTime === "number")
                    message.serverTime = object.serverTime;
                else if (typeof object.serverTime === "object")
                    message.serverTime = new $util.LongBits(object.serverTime.low >>> 0, object.serverTime.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a Pong message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.Pong
         * @static
         * @param {msg.Pong} message Pong
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Pong.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.serverTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.serverTime = options.longs === String ? "0" : 0;
            if (message.serverTime != null && message.hasOwnProperty("serverTime"))
                if (typeof message.serverTime === "number")
                    object.serverTime = options.longs === String ? String(message.serverTime) : message.serverTime;
                else
                    object.serverTime = options.longs === String ? $util.Long.prototype.toString.call(message.serverTime) : options.longs === Number ? new $util.LongBits(message.serverTime.low >>> 0, message.serverTime.high >>> 0).toNumber() : message.serverTime;
            return object;
        };

        /**
         * Converts this Pong to JSON.
         * @function toJSON
         * @memberof msg.Pong
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Pong.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Pong;
    })();

    /**
     * ErrorMsg enum.
     * @name msg.ErrorMsg
     * @enum {string}
     * @property {number} SUCCESS=0 SUCCESS value
     * @property {number} UserRepeatLogin=101 UserRepeatLogin value
     * @property {number} UserRemoteLogin=102 UserRemoteLogin value
     * @property {number} ChipsInsufficient=103 ChipsInsufficient value
     * @property {number} ChairAlreadyFull=104 ChairAlreadyFull value
     * @property {number} UserNotChangeTable=105 UserNotChangeTable value
     * @property {number} UserTimeOutFoldCard=106 UserTimeOutFoldCard value
     * @property {number} UserStandUpTimeOut=107 UserStandUpTimeOut value
     * @property {number} UserInGameNotStandUp=108 UserInGameNotStandUp value
     * @property {number} UserInGameStandUpFold=109 UserInGameStandUpFold value
     */
    msg.ErrorMsg = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "SUCCESS"] = 0;
        values[valuesById[101] = "UserRepeatLogin"] = 101;
        values[valuesById[102] = "UserRemoteLogin"] = 102;
        values[valuesById[103] = "ChipsInsufficient"] = 103;
        values[valuesById[104] = "ChairAlreadyFull"] = 104;
        values[valuesById[105] = "UserNotChangeTable"] = 105;
        values[valuesById[106] = "UserTimeOutFoldCard"] = 106;
        values[valuesById[107] = "UserStandUpTimeOut"] = 107;
        values[valuesById[108] = "UserInGameNotStandUp"] = 108;
        values[valuesById[109] = "UserInGameStandUpFold"] = 109;
        return values;
    })();

    msg.Error_S2C = (function() {

        /**
         * Properties of an Error_S2C.
         * @memberof msg
         * @interface IError_S2C
         * @property {msg.ErrorMsg|null} [error] Error_S2C error
         * @property {string|null} [data] Error_S2C data
         */

        /**
         * Constructs a new Error_S2C.
         * @memberof msg
         * @classdesc Represents an Error_S2C.
         * @implements IError_S2C
         * @constructor
         * @param {msg.IError_S2C=} [properties] Properties to set
         */
        function Error_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Error_S2C error.
         * @member {msg.ErrorMsg} error
         * @memberof msg.Error_S2C
         * @instance
         */
        Error_S2C.prototype.error = 0;

        /**
         * Error_S2C data.
         * @member {string} data
         * @memberof msg.Error_S2C
         * @instance
         */
        Error_S2C.prototype.data = "";

        /**
         * Creates a new Error_S2C instance using the specified properties.
         * @function create
         * @memberof msg.Error_S2C
         * @static
         * @param {msg.IError_S2C=} [properties] Properties to set
         * @returns {msg.Error_S2C} Error_S2C instance
         */
        Error_S2C.create = function create(properties) {
            return new Error_S2C(properties);
        };

        /**
         * Encodes the specified Error_S2C message. Does not implicitly {@link msg.Error_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.Error_S2C
         * @static
         * @param {msg.IError_S2C} message Error_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Error_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.error != null && message.hasOwnProperty("error"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.error);
            if (message.data != null && message.hasOwnProperty("data"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.data);
            return writer;
        };

        /**
         * Encodes the specified Error_S2C message, length delimited. Does not implicitly {@link msg.Error_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.Error_S2C
         * @static
         * @param {msg.IError_S2C} message Error_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Error_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Error_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.Error_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.Error_S2C} Error_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Error_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.Error_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.error = reader.int32();
                    break;
                case 2:
                    message.data = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Error_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.Error_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.Error_S2C} Error_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Error_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Error_S2C message.
         * @function verify
         * @memberof msg.Error_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Error_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.error != null && message.hasOwnProperty("error"))
                switch (message.error) {
                default:
                    return "error: enum value expected";
                case 0:
                case 101:
                case 102:
                case 103:
                case 104:
                case 105:
                case 106:
                case 107:
                case 108:
                case 109:
                    break;
                }
            if (message.data != null && message.hasOwnProperty("data"))
                if (!$util.isString(message.data))
                    return "data: string expected";
            return null;
        };

        /**
         * Creates an Error_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.Error_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.Error_S2C} Error_S2C
         */
        Error_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.Error_S2C)
                return object;
            var message = new $root.msg.Error_S2C();
            switch (object.error) {
            case "SUCCESS":
            case 0:
                message.error = 0;
                break;
            case "UserRepeatLogin":
            case 101:
                message.error = 101;
                break;
            case "UserRemoteLogin":
            case 102:
                message.error = 102;
                break;
            case "ChipsInsufficient":
            case 103:
                message.error = 103;
                break;
            case "ChairAlreadyFull":
            case 104:
                message.error = 104;
                break;
            case "UserNotChangeTable":
            case 105:
                message.error = 105;
                break;
            case "UserTimeOutFoldCard":
            case 106:
                message.error = 106;
                break;
            case "UserStandUpTimeOut":
            case 107:
                message.error = 107;
                break;
            case "UserInGameNotStandUp":
            case 108:
                message.error = 108;
                break;
            case "UserInGameStandUpFold":
            case 109:
                message.error = 109;
                break;
            }
            if (object.data != null)
                message.data = String(object.data);
            return message;
        };

        /**
         * Creates a plain object from an Error_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.Error_S2C
         * @static
         * @param {msg.Error_S2C} message Error_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Error_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.error = options.enums === String ? "SUCCESS" : 0;
                object.data = "";
            }
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = options.enums === String ? $root.msg.ErrorMsg[message.error] : message.error;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = message.data;
            return object;
        };

        /**
         * Converts this Error_S2C to JSON.
         * @function toJSON
         * @memberof msg.Error_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Error_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Error_S2C;
    })();

    msg.Login_C2S = (function() {

        /**
         * Properties of a Login_C2S.
         * @memberof msg
         * @interface ILogin_C2S
         * @property {string|null} [Id] Login_C2S Id
         * @property {string|null} [PassWord] Login_C2S PassWord
         * @property {string|null} [Token] Login_C2S Token
         */

        /**
         * Constructs a new Login_C2S.
         * @memberof msg
         * @classdesc Represents a Login_C2S.
         * @implements ILogin_C2S
         * @constructor
         * @param {msg.ILogin_C2S=} [properties] Properties to set
         */
        function Login_C2S(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Login_C2S Id.
         * @member {string} Id
         * @memberof msg.Login_C2S
         * @instance
         */
        Login_C2S.prototype.Id = "";

        /**
         * Login_C2S PassWord.
         * @member {string} PassWord
         * @memberof msg.Login_C2S
         * @instance
         */
        Login_C2S.prototype.PassWord = "";

        /**
         * Login_C2S Token.
         * @member {string} Token
         * @memberof msg.Login_C2S
         * @instance
         */
        Login_C2S.prototype.Token = "";

        /**
         * Creates a new Login_C2S instance using the specified properties.
         * @function create
         * @memberof msg.Login_C2S
         * @static
         * @param {msg.ILogin_C2S=} [properties] Properties to set
         * @returns {msg.Login_C2S} Login_C2S instance
         */
        Login_C2S.create = function create(properties) {
            return new Login_C2S(properties);
        };

        /**
         * Encodes the specified Login_C2S message. Does not implicitly {@link msg.Login_C2S.verify|verify} messages.
         * @function encode
         * @memberof msg.Login_C2S
         * @static
         * @param {msg.ILogin_C2S} message Login_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Login_C2S.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.Id != null && message.hasOwnProperty("Id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.Id);
            if (message.PassWord != null && message.hasOwnProperty("PassWord"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.PassWord);
            if (message.Token != null && message.hasOwnProperty("Token"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.Token);
            return writer;
        };

        /**
         * Encodes the specified Login_C2S message, length delimited. Does not implicitly {@link msg.Login_C2S.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.Login_C2S
         * @static
         * @param {msg.ILogin_C2S} message Login_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Login_C2S.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Login_C2S message from the specified reader or buffer.
         * @function decode
         * @memberof msg.Login_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.Login_C2S} Login_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Login_C2S.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.Login_C2S();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.Id = reader.string();
                    break;
                case 2:
                    message.PassWord = reader.string();
                    break;
                case 3:
                    message.Token = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Login_C2S message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.Login_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.Login_C2S} Login_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Login_C2S.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Login_C2S message.
         * @function verify
         * @memberof msg.Login_C2S
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Login_C2S.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.Id != null && message.hasOwnProperty("Id"))
                if (!$util.isString(message.Id))
                    return "Id: string expected";
            if (message.PassWord != null && message.hasOwnProperty("PassWord"))
                if (!$util.isString(message.PassWord))
                    return "PassWord: string expected";
            if (message.Token != null && message.hasOwnProperty("Token"))
                if (!$util.isString(message.Token))
                    return "Token: string expected";
            return null;
        };

        /**
         * Creates a Login_C2S message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.Login_C2S
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.Login_C2S} Login_C2S
         */
        Login_C2S.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.Login_C2S)
                return object;
            var message = new $root.msg.Login_C2S();
            if (object.Id != null)
                message.Id = String(object.Id);
            if (object.PassWord != null)
                message.PassWord = String(object.PassWord);
            if (object.Token != null)
                message.Token = String(object.Token);
            return message;
        };

        /**
         * Creates a plain object from a Login_C2S message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.Login_C2S
         * @static
         * @param {msg.Login_C2S} message Login_C2S
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Login_C2S.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.Id = "";
                object.PassWord = "";
                object.Token = "";
            }
            if (message.Id != null && message.hasOwnProperty("Id"))
                object.Id = message.Id;
            if (message.PassWord != null && message.hasOwnProperty("PassWord"))
                object.PassWord = message.PassWord;
            if (message.Token != null && message.hasOwnProperty("Token"))
                object.Token = message.Token;
            return object;
        };

        /**
         * Converts this Login_C2S to JSON.
         * @function toJSON
         * @memberof msg.Login_C2S
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Login_C2S.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Login_C2S;
    })();

    msg.PlayerInfo = (function() {

        /**
         * Properties of a PlayerInfo.
         * @memberof msg
         * @interface IPlayerInfo
         * @property {string|null} [Id] PlayerInfo Id
         * @property {string|null} [nickName] PlayerInfo nickName
         * @property {string|null} [headImg] PlayerInfo headImg
         * @property {number|null} [account] PlayerInfo account
         */

        /**
         * Constructs a new PlayerInfo.
         * @memberof msg
         * @classdesc Represents a PlayerInfo.
         * @implements IPlayerInfo
         * @constructor
         * @param {msg.IPlayerInfo=} [properties] Properties to set
         */
        function PlayerInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerInfo Id.
         * @member {string} Id
         * @memberof msg.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.Id = "";

        /**
         * PlayerInfo nickName.
         * @member {string} nickName
         * @memberof msg.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.nickName = "";

        /**
         * PlayerInfo headImg.
         * @member {string} headImg
         * @memberof msg.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.headImg = "";

        /**
         * PlayerInfo account.
         * @member {number} account
         * @memberof msg.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.account = 0;

        /**
         * Creates a new PlayerInfo instance using the specified properties.
         * @function create
         * @memberof msg.PlayerInfo
         * @static
         * @param {msg.IPlayerInfo=} [properties] Properties to set
         * @returns {msg.PlayerInfo} PlayerInfo instance
         */
        PlayerInfo.create = function create(properties) {
            return new PlayerInfo(properties);
        };

        /**
         * Encodes the specified PlayerInfo message. Does not implicitly {@link msg.PlayerInfo.verify|verify} messages.
         * @function encode
         * @memberof msg.PlayerInfo
         * @static
         * @param {msg.IPlayerInfo} message PlayerInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.Id != null && message.hasOwnProperty("Id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.Id);
            if (message.nickName != null && message.hasOwnProperty("nickName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.nickName);
            if (message.headImg != null && message.hasOwnProperty("headImg"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.headImg);
            if (message.account != null && message.hasOwnProperty("account"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.account);
            return writer;
        };

        /**
         * Encodes the specified PlayerInfo message, length delimited. Does not implicitly {@link msg.PlayerInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.PlayerInfo
         * @static
         * @param {msg.IPlayerInfo} message PlayerInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PlayerInfo message from the specified reader or buffer.
         * @function decode
         * @memberof msg.PlayerInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.PlayerInfo} PlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.PlayerInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.Id = reader.string();
                    break;
                case 2:
                    message.nickName = reader.string();
                    break;
                case 3:
                    message.headImg = reader.string();
                    break;
                case 4:
                    message.account = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PlayerInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.PlayerInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.PlayerInfo} PlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerInfo message.
         * @function verify
         * @memberof msg.PlayerInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.Id != null && message.hasOwnProperty("Id"))
                if (!$util.isString(message.Id))
                    return "Id: string expected";
            if (message.nickName != null && message.hasOwnProperty("nickName"))
                if (!$util.isString(message.nickName))
                    return "nickName: string expected";
            if (message.headImg != null && message.hasOwnProperty("headImg"))
                if (!$util.isString(message.headImg))
                    return "headImg: string expected";
            if (message.account != null && message.hasOwnProperty("account"))
                if (typeof message.account !== "number")
                    return "account: number expected";
            return null;
        };

        /**
         * Creates a PlayerInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.PlayerInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.PlayerInfo} PlayerInfo
         */
        PlayerInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.PlayerInfo)
                return object;
            var message = new $root.msg.PlayerInfo();
            if (object.Id != null)
                message.Id = String(object.Id);
            if (object.nickName != null)
                message.nickName = String(object.nickName);
            if (object.headImg != null)
                message.headImg = String(object.headImg);
            if (object.account != null)
                message.account = Number(object.account);
            return message;
        };

        /**
         * Creates a plain object from a PlayerInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.PlayerInfo
         * @static
         * @param {msg.PlayerInfo} message PlayerInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.Id = "";
                object.nickName = "";
                object.headImg = "";
                object.account = 0;
            }
            if (message.Id != null && message.hasOwnProperty("Id"))
                object.Id = message.Id;
            if (message.nickName != null && message.hasOwnProperty("nickName"))
                object.nickName = message.nickName;
            if (message.headImg != null && message.hasOwnProperty("headImg"))
                object.headImg = message.headImg;
            if (message.account != null && message.hasOwnProperty("account"))
                object.account = options.json && !isFinite(message.account) ? String(message.account) : message.account;
            return object;
        };

        /**
         * Converts this PlayerInfo to JSON.
         * @function toJSON
         * @memberof msg.PlayerInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PlayerInfo;
    })();

    msg.Login_S2C = (function() {

        /**
         * Properties of a Login_S2C.
         * @memberof msg
         * @interface ILogin_S2C
         * @property {msg.IPlayerInfo|null} [playerInfo] Login_S2C playerInfo
         * @property {boolean|null} [backroom] Login_S2C backroom
         */

        /**
         * Constructs a new Login_S2C.
         * @memberof msg
         * @classdesc Represents a Login_S2C.
         * @implements ILogin_S2C
         * @constructor
         * @param {msg.ILogin_S2C=} [properties] Properties to set
         */
        function Login_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Login_S2C playerInfo.
         * @member {msg.IPlayerInfo|null|undefined} playerInfo
         * @memberof msg.Login_S2C
         * @instance
         */
        Login_S2C.prototype.playerInfo = null;

        /**
         * Login_S2C backroom.
         * @member {boolean} backroom
         * @memberof msg.Login_S2C
         * @instance
         */
        Login_S2C.prototype.backroom = false;

        /**
         * Creates a new Login_S2C instance using the specified properties.
         * @function create
         * @memberof msg.Login_S2C
         * @static
         * @param {msg.ILogin_S2C=} [properties] Properties to set
         * @returns {msg.Login_S2C} Login_S2C instance
         */
        Login_S2C.create = function create(properties) {
            return new Login_S2C(properties);
        };

        /**
         * Encodes the specified Login_S2C message. Does not implicitly {@link msg.Login_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.Login_S2C
         * @static
         * @param {msg.ILogin_S2C} message Login_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Login_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.playerInfo != null && message.hasOwnProperty("playerInfo"))
                $root.msg.PlayerInfo.encode(message.playerInfo, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.backroom != null && message.hasOwnProperty("backroom"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.backroom);
            return writer;
        };

        /**
         * Encodes the specified Login_S2C message, length delimited. Does not implicitly {@link msg.Login_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.Login_S2C
         * @static
         * @param {msg.ILogin_S2C} message Login_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Login_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Login_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.Login_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.Login_S2C} Login_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Login_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.Login_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.playerInfo = $root.msg.PlayerInfo.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.backroom = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Login_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.Login_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.Login_S2C} Login_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Login_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Login_S2C message.
         * @function verify
         * @memberof msg.Login_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Login_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.playerInfo != null && message.hasOwnProperty("playerInfo")) {
                var error = $root.msg.PlayerInfo.verify(message.playerInfo);
                if (error)
                    return "playerInfo." + error;
            }
            if (message.backroom != null && message.hasOwnProperty("backroom"))
                if (typeof message.backroom !== "boolean")
                    return "backroom: boolean expected";
            return null;
        };

        /**
         * Creates a Login_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.Login_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.Login_S2C} Login_S2C
         */
        Login_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.Login_S2C)
                return object;
            var message = new $root.msg.Login_S2C();
            if (object.playerInfo != null) {
                if (typeof object.playerInfo !== "object")
                    throw TypeError(".msg.Login_S2C.playerInfo: object expected");
                message.playerInfo = $root.msg.PlayerInfo.fromObject(object.playerInfo);
            }
            if (object.backroom != null)
                message.backroom = Boolean(object.backroom);
            return message;
        };

        /**
         * Creates a plain object from a Login_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.Login_S2C
         * @static
         * @param {msg.Login_S2C} message Login_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Login_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.playerInfo = null;
                object.backroom = false;
            }
            if (message.playerInfo != null && message.hasOwnProperty("playerInfo"))
                object.playerInfo = $root.msg.PlayerInfo.toObject(message.playerInfo, options);
            if (message.backroom != null && message.hasOwnProperty("backroom"))
                object.backroom = message.backroom;
            return object;
        };

        /**
         * Converts this Login_S2C to JSON.
         * @function toJSON
         * @memberof msg.Login_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Login_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Login_S2C;
    })();

    msg.Logout_C2S = (function() {

        /**
         * Properties of a Logout_C2S.
         * @memberof msg
         * @interface ILogout_C2S
         */

        /**
         * Constructs a new Logout_C2S.
         * @memberof msg
         * @classdesc Represents a Logout_C2S.
         * @implements ILogout_C2S
         * @constructor
         * @param {msg.ILogout_C2S=} [properties] Properties to set
         */
        function Logout_C2S(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new Logout_C2S instance using the specified properties.
         * @function create
         * @memberof msg.Logout_C2S
         * @static
         * @param {msg.ILogout_C2S=} [properties] Properties to set
         * @returns {msg.Logout_C2S} Logout_C2S instance
         */
        Logout_C2S.create = function create(properties) {
            return new Logout_C2S(properties);
        };

        /**
         * Encodes the specified Logout_C2S message. Does not implicitly {@link msg.Logout_C2S.verify|verify} messages.
         * @function encode
         * @memberof msg.Logout_C2S
         * @static
         * @param {msg.ILogout_C2S} message Logout_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Logout_C2S.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified Logout_C2S message, length delimited. Does not implicitly {@link msg.Logout_C2S.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.Logout_C2S
         * @static
         * @param {msg.ILogout_C2S} message Logout_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Logout_C2S.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Logout_C2S message from the specified reader or buffer.
         * @function decode
         * @memberof msg.Logout_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.Logout_C2S} Logout_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Logout_C2S.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.Logout_C2S();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Logout_C2S message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.Logout_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.Logout_C2S} Logout_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Logout_C2S.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Logout_C2S message.
         * @function verify
         * @memberof msg.Logout_C2S
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Logout_C2S.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a Logout_C2S message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.Logout_C2S
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.Logout_C2S} Logout_C2S
         */
        Logout_C2S.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.Logout_C2S)
                return object;
            return new $root.msg.Logout_C2S();
        };

        /**
         * Creates a plain object from a Logout_C2S message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.Logout_C2S
         * @static
         * @param {msg.Logout_C2S} message Logout_C2S
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Logout_C2S.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this Logout_C2S to JSON.
         * @function toJSON
         * @memberof msg.Logout_C2S
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Logout_C2S.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Logout_C2S;
    })();

    msg.Logout_S2C = (function() {

        /**
         * Properties of a Logout_S2C.
         * @memberof msg
         * @interface ILogout_S2C
         */

        /**
         * Constructs a new Logout_S2C.
         * @memberof msg
         * @classdesc Represents a Logout_S2C.
         * @implements ILogout_S2C
         * @constructor
         * @param {msg.ILogout_S2C=} [properties] Properties to set
         */
        function Logout_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new Logout_S2C instance using the specified properties.
         * @function create
         * @memberof msg.Logout_S2C
         * @static
         * @param {msg.ILogout_S2C=} [properties] Properties to set
         * @returns {msg.Logout_S2C} Logout_S2C instance
         */
        Logout_S2C.create = function create(properties) {
            return new Logout_S2C(properties);
        };

        /**
         * Encodes the specified Logout_S2C message. Does not implicitly {@link msg.Logout_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.Logout_S2C
         * @static
         * @param {msg.ILogout_S2C} message Logout_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Logout_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified Logout_S2C message, length delimited. Does not implicitly {@link msg.Logout_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.Logout_S2C
         * @static
         * @param {msg.ILogout_S2C} message Logout_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Logout_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Logout_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.Logout_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.Logout_S2C} Logout_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Logout_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.Logout_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Logout_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.Logout_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.Logout_S2C} Logout_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Logout_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Logout_S2C message.
         * @function verify
         * @memberof msg.Logout_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Logout_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a Logout_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.Logout_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.Logout_S2C} Logout_S2C
         */
        Logout_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.Logout_S2C)
                return object;
            return new $root.msg.Logout_S2C();
        };

        /**
         * Creates a plain object from a Logout_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.Logout_S2C
         * @static
         * @param {msg.Logout_S2C} message Logout_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Logout_S2C.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this Logout_S2C to JSON.
         * @function toJSON
         * @memberof msg.Logout_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Logout_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Logout_S2C;
    })();

    /**
     * CardSuit enum.
     * @name msg.CardSuit
     * @enum {string}
     * @property {number} XXX_Card=0 XXX_Card value
     * @property {number} HighCard=1 HighCard value
     * @property {number} OnePair=2 OnePair value
     * @property {number} TwoPairs=3 TwoPairs value
     * @property {number} ThreeKind=4 ThreeKind value
     * @property {number} Straight=5 Straight value
     * @property {number} Flush=6 Flush value
     * @property {number} FullHouse=7 FullHouse value
     * @property {number} FourKind=8 FourKind value
     * @property {number} StraightFlush=9 StraightFlush value
     * @property {number} RoyalFlush=10 RoyalFlush value
     */
    msg.CardSuit = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "XXX_Card"] = 0;
        values[valuesById[1] = "HighCard"] = 1;
        values[valuesById[2] = "OnePair"] = 2;
        values[valuesById[3] = "TwoPairs"] = 3;
        values[valuesById[4] = "ThreeKind"] = 4;
        values[valuesById[5] = "Straight"] = 5;
        values[valuesById[6] = "Flush"] = 6;
        values[valuesById[7] = "FullHouse"] = 7;
        values[valuesById[8] = "FourKind"] = 8;
        values[valuesById[9] = "StraightFlush"] = 9;
        values[valuesById[10] = "RoyalFlush"] = 10;
        return values;
    })();

    /**
     * GameStep enum.
     * @name msg.GameStep
     * @enum {string}
     * @property {number} Waiting=0 Waiting value
     * @property {number} PreFlop=1 PreFlop value
     * @property {number} Flop=2 Flop value
     * @property {number} Turn=3 Turn value
     * @property {number} River=4 River value
     * @property {number} ShowDown=5 ShowDown value
     */
    msg.GameStep = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "Waiting"] = 0;
        values[valuesById[1] = "PreFlop"] = 1;
        values[valuesById[2] = "Flop"] = 2;
        values[valuesById[3] = "Turn"] = 3;
        values[valuesById[4] = "River"] = 4;
        values[valuesById[5] = "ShowDown"] = 5;
        return values;
    })();

    /**
     * ActionStatus enum.
     * @name msg.ActionStatus
     * @enum {string}
     * @property {number} WAITING=0 WAITING value
     * @property {number} RAISE=1 RAISE value
     * @property {number} CALL=2 CALL value
     * @property {number} CHECK=3 CHECK value
     * @property {number} FOLD=4 FOLD value
     * @property {number} ALLIN=5 ALLIN value
     */
    msg.ActionStatus = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "WAITING"] = 0;
        values[valuesById[1] = "RAISE"] = 1;
        values[valuesById[2] = "CALL"] = 2;
        values[valuesById[3] = "CHECK"] = 3;
        values[valuesById[4] = "FOLD"] = 4;
        values[valuesById[5] = "ALLIN"] = 5;
        return values;
    })();

    /**
     * BlindType enum.
     * @name msg.BlindType
     * @enum {string}
     * @property {number} No_Blind=0 No_Blind value
     * @property {number} Small_Blind=1 Small_Blind value
     * @property {number} Big_Blind=2 Big_Blind value
     */
    msg.BlindType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "No_Blind"] = 0;
        values[valuesById[1] = "Small_Blind"] = 1;
        values[valuesById[2] = "Big_Blind"] = 2;
        return values;
    })();

    msg.CardSuitData = (function() {

        /**
         * Properties of a CardSuitData.
         * @memberof msg
         * @interface ICardSuitData
         * @property {Array.<number>|null} [handCardKeys] CardSuitData handCardKeys
         * @property {Array.<number>|null} [publicCardKeys] CardSuitData publicCardKeys
         * @property {msg.CardSuit|null} [suitPattern] CardSuitData suitPattern
         */

        /**
         * Constructs a new CardSuitData.
         * @memberof msg
         * @classdesc Represents a CardSuitData.
         * @implements ICardSuitData
         * @constructor
         * @param {msg.ICardSuitData=} [properties] Properties to set
         */
        function CardSuitData(properties) {
            this.handCardKeys = [];
            this.publicCardKeys = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CardSuitData handCardKeys.
         * @member {Array.<number>} handCardKeys
         * @memberof msg.CardSuitData
         * @instance
         */
        CardSuitData.prototype.handCardKeys = $util.emptyArray;

        /**
         * CardSuitData publicCardKeys.
         * @member {Array.<number>} publicCardKeys
         * @memberof msg.CardSuitData
         * @instance
         */
        CardSuitData.prototype.publicCardKeys = $util.emptyArray;

        /**
         * CardSuitData suitPattern.
         * @member {msg.CardSuit} suitPattern
         * @memberof msg.CardSuitData
         * @instance
         */
        CardSuitData.prototype.suitPattern = 0;

        /**
         * Creates a new CardSuitData instance using the specified properties.
         * @function create
         * @memberof msg.CardSuitData
         * @static
         * @param {msg.ICardSuitData=} [properties] Properties to set
         * @returns {msg.CardSuitData} CardSuitData instance
         */
        CardSuitData.create = function create(properties) {
            return new CardSuitData(properties);
        };

        /**
         * Encodes the specified CardSuitData message. Does not implicitly {@link msg.CardSuitData.verify|verify} messages.
         * @function encode
         * @memberof msg.CardSuitData
         * @static
         * @param {msg.ICardSuitData} message CardSuitData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CardSuitData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.handCardKeys != null && message.handCardKeys.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (var i = 0; i < message.handCardKeys.length; ++i)
                    writer.int32(message.handCardKeys[i]);
                writer.ldelim();
            }
            if (message.publicCardKeys != null && message.publicCardKeys.length) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork();
                for (var i = 0; i < message.publicCardKeys.length; ++i)
                    writer.int32(message.publicCardKeys[i]);
                writer.ldelim();
            }
            if (message.suitPattern != null && message.hasOwnProperty("suitPattern"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.suitPattern);
            return writer;
        };

        /**
         * Encodes the specified CardSuitData message, length delimited. Does not implicitly {@link msg.CardSuitData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.CardSuitData
         * @static
         * @param {msg.ICardSuitData} message CardSuitData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CardSuitData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CardSuitData message from the specified reader or buffer.
         * @function decode
         * @memberof msg.CardSuitData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.CardSuitData} CardSuitData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CardSuitData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.CardSuitData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.handCardKeys && message.handCardKeys.length))
                        message.handCardKeys = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.handCardKeys.push(reader.int32());
                    } else
                        message.handCardKeys.push(reader.int32());
                    break;
                case 2:
                    if (!(message.publicCardKeys && message.publicCardKeys.length))
                        message.publicCardKeys = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.publicCardKeys.push(reader.int32());
                    } else
                        message.publicCardKeys.push(reader.int32());
                    break;
                case 3:
                    message.suitPattern = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CardSuitData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.CardSuitData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.CardSuitData} CardSuitData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CardSuitData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CardSuitData message.
         * @function verify
         * @memberof msg.CardSuitData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CardSuitData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.handCardKeys != null && message.hasOwnProperty("handCardKeys")) {
                if (!Array.isArray(message.handCardKeys))
                    return "handCardKeys: array expected";
                for (var i = 0; i < message.handCardKeys.length; ++i)
                    if (!$util.isInteger(message.handCardKeys[i]))
                        return "handCardKeys: integer[] expected";
            }
            if (message.publicCardKeys != null && message.hasOwnProperty("publicCardKeys")) {
                if (!Array.isArray(message.publicCardKeys))
                    return "publicCardKeys: array expected";
                for (var i = 0; i < message.publicCardKeys.length; ++i)
                    if (!$util.isInteger(message.publicCardKeys[i]))
                        return "publicCardKeys: integer[] expected";
            }
            if (message.suitPattern != null && message.hasOwnProperty("suitPattern"))
                switch (message.suitPattern) {
                default:
                    return "suitPattern: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                    break;
                }
            return null;
        };

        /**
         * Creates a CardSuitData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.CardSuitData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.CardSuitData} CardSuitData
         */
        CardSuitData.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.CardSuitData)
                return object;
            var message = new $root.msg.CardSuitData();
            if (object.handCardKeys) {
                if (!Array.isArray(object.handCardKeys))
                    throw TypeError(".msg.CardSuitData.handCardKeys: array expected");
                message.handCardKeys = [];
                for (var i = 0; i < object.handCardKeys.length; ++i)
                    message.handCardKeys[i] = object.handCardKeys[i] | 0;
            }
            if (object.publicCardKeys) {
                if (!Array.isArray(object.publicCardKeys))
                    throw TypeError(".msg.CardSuitData.publicCardKeys: array expected");
                message.publicCardKeys = [];
                for (var i = 0; i < object.publicCardKeys.length; ++i)
                    message.publicCardKeys[i] = object.publicCardKeys[i] | 0;
            }
            switch (object.suitPattern) {
            case "XXX_Card":
            case 0:
                message.suitPattern = 0;
                break;
            case "HighCard":
            case 1:
                message.suitPattern = 1;
                break;
            case "OnePair":
            case 2:
                message.suitPattern = 2;
                break;
            case "TwoPairs":
            case 3:
                message.suitPattern = 3;
                break;
            case "ThreeKind":
            case 4:
                message.suitPattern = 4;
                break;
            case "Straight":
            case 5:
                message.suitPattern = 5;
                break;
            case "Flush":
            case 6:
                message.suitPattern = 6;
                break;
            case "FullHouse":
            case 7:
                message.suitPattern = 7;
                break;
            case "FourKind":
            case 8:
                message.suitPattern = 8;
                break;
            case "StraightFlush":
            case 9:
                message.suitPattern = 9;
                break;
            case "RoyalFlush":
            case 10:
                message.suitPattern = 10;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a CardSuitData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.CardSuitData
         * @static
         * @param {msg.CardSuitData} message CardSuitData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CardSuitData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.handCardKeys = [];
                object.publicCardKeys = [];
            }
            if (options.defaults)
                object.suitPattern = options.enums === String ? "XXX_Card" : 0;
            if (message.handCardKeys && message.handCardKeys.length) {
                object.handCardKeys = [];
                for (var j = 0; j < message.handCardKeys.length; ++j)
                    object.handCardKeys[j] = message.handCardKeys[j];
            }
            if (message.publicCardKeys && message.publicCardKeys.length) {
                object.publicCardKeys = [];
                for (var j = 0; j < message.publicCardKeys.length; ++j)
                    object.publicCardKeys[j] = message.publicCardKeys[j];
            }
            if (message.suitPattern != null && message.hasOwnProperty("suitPattern"))
                object.suitPattern = options.enums === String ? $root.msg.CardSuit[message.suitPattern] : message.suitPattern;
            return object;
        };

        /**
         * Converts this CardSuitData to JSON.
         * @function toJSON
         * @memberof msg.CardSuitData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CardSuitData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CardSuitData;
    })();

    msg.PlayerData = (function() {

        /**
         * Properties of a PlayerData.
         * @memberof msg
         * @interface IPlayerData
         * @property {msg.IPlayerInfo|null} [playerInfo] PlayerData playerInfo
         * @property {number|null} [chair] PlayerData chair
         * @property {number|null} [standUPNum] PlayerData standUPNum
         * @property {number|null} [chips] PlayerData chips
         * @property {number|null} [roomChips] PlayerData roomChips
         * @property {msg.ActionStatus|null} [actionStatus] PlayerData actionStatus
         * @property {number|null} [gameStep] PlayerData gameStep
         * @property {number|null} [downBets] PlayerData downBets
         * @property {number|null} [lunDownBets] PlayerData lunDownBets
         * @property {number|null} [totalDownBet] PlayerData totalDownBet
         * @property {Array.<number>|null} [handCards] PlayerData handCards
         * @property {msg.ICardSuitData|null} [cardSuitData] PlayerData cardSuitData
         * @property {number|null} [resultMoney] PlayerData resultMoney
         * @property {msg.BlindType|null} [blindType] PlayerData blindType
         * @property {boolean|null} [IsButton] PlayerData IsButton
         * @property {boolean|null} [IsAllIn] PlayerData IsAllIn
         * @property {boolean|null} [IsWinner] PlayerData IsWinner
         * @property {boolean|null} [IsInGame] PlayerData IsInGame
         * @property {boolean|null} [IsStandUp] PlayerData IsStandUp
         * @property {boolean|null} [IsLeaveR] PlayerData IsLeaveR
         * @property {number|null} [timerCount] PlayerData timerCount
         * @property {number|null} [account] PlayerData account
         * @property {number|null} [resultGetMoney] PlayerData resultGetMoney
         */

        /**
         * Constructs a new PlayerData.
         * @memberof msg
         * @classdesc Represents a PlayerData.
         * @implements IPlayerData
         * @constructor
         * @param {msg.IPlayerData=} [properties] Properties to set
         */
        function PlayerData(properties) {
            this.handCards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerData playerInfo.
         * @member {msg.IPlayerInfo|null|undefined} playerInfo
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.playerInfo = null;

        /**
         * PlayerData chair.
         * @member {number} chair
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.chair = 0;

        /**
         * PlayerData standUPNum.
         * @member {number} standUPNum
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.standUPNum = 0;

        /**
         * PlayerData chips.
         * @member {number} chips
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.chips = 0;

        /**
         * PlayerData roomChips.
         * @member {number} roomChips
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.roomChips = 0;

        /**
         * PlayerData actionStatus.
         * @member {msg.ActionStatus} actionStatus
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.actionStatus = 0;

        /**
         * PlayerData gameStep.
         * @member {number} gameStep
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.gameStep = 0;

        /**
         * PlayerData downBets.
         * @member {number} downBets
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.downBets = 0;

        /**
         * PlayerData lunDownBets.
         * @member {number} lunDownBets
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.lunDownBets = 0;

        /**
         * PlayerData totalDownBet.
         * @member {number} totalDownBet
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.totalDownBet = 0;

        /**
         * PlayerData handCards.
         * @member {Array.<number>} handCards
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.handCards = $util.emptyArray;

        /**
         * PlayerData cardSuitData.
         * @member {msg.ICardSuitData|null|undefined} cardSuitData
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.cardSuitData = null;

        /**
         * PlayerData resultMoney.
         * @member {number} resultMoney
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.resultMoney = 0;

        /**
         * PlayerData blindType.
         * @member {msg.BlindType} blindType
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.blindType = 0;

        /**
         * PlayerData IsButton.
         * @member {boolean} IsButton
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.IsButton = false;

        /**
         * PlayerData IsAllIn.
         * @member {boolean} IsAllIn
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.IsAllIn = false;

        /**
         * PlayerData IsWinner.
         * @member {boolean} IsWinner
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.IsWinner = false;

        /**
         * PlayerData IsInGame.
         * @member {boolean} IsInGame
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.IsInGame = false;

        /**
         * PlayerData IsStandUp.
         * @member {boolean} IsStandUp
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.IsStandUp = false;

        /**
         * PlayerData IsLeaveR.
         * @member {boolean} IsLeaveR
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.IsLeaveR = false;

        /**
         * PlayerData timerCount.
         * @member {number} timerCount
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.timerCount = 0;

        /**
         * PlayerData account.
         * @member {number} account
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.account = 0;

        /**
         * PlayerData resultGetMoney.
         * @member {number} resultGetMoney
         * @memberof msg.PlayerData
         * @instance
         */
        PlayerData.prototype.resultGetMoney = 0;

        /**
         * Creates a new PlayerData instance using the specified properties.
         * @function create
         * @memberof msg.PlayerData
         * @static
         * @param {msg.IPlayerData=} [properties] Properties to set
         * @returns {msg.PlayerData} PlayerData instance
         */
        PlayerData.create = function create(properties) {
            return new PlayerData(properties);
        };

        /**
         * Encodes the specified PlayerData message. Does not implicitly {@link msg.PlayerData.verify|verify} messages.
         * @function encode
         * @memberof msg.PlayerData
         * @static
         * @param {msg.IPlayerData} message PlayerData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.playerInfo != null && message.hasOwnProperty("playerInfo"))
                $root.msg.PlayerInfo.encode(message.playerInfo, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.chair != null && message.hasOwnProperty("chair"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.chair);
            if (message.standUPNum != null && message.hasOwnProperty("standUPNum"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.standUPNum);
            if (message.chips != null && message.hasOwnProperty("chips"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.chips);
            if (message.roomChips != null && message.hasOwnProperty("roomChips"))
                writer.uint32(/* id 5, wireType 1 =*/41).double(message.roomChips);
            if (message.actionStatus != null && message.hasOwnProperty("actionStatus"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.actionStatus);
            if (message.gameStep != null && message.hasOwnProperty("gameStep"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.gameStep);
            if (message.downBets != null && message.hasOwnProperty("downBets"))
                writer.uint32(/* id 8, wireType 1 =*/65).double(message.downBets);
            if (message.lunDownBets != null && message.hasOwnProperty("lunDownBets"))
                writer.uint32(/* id 9, wireType 1 =*/73).double(message.lunDownBets);
            if (message.totalDownBet != null && message.hasOwnProperty("totalDownBet"))
                writer.uint32(/* id 10, wireType 1 =*/81).double(message.totalDownBet);
            if (message.handCards != null && message.handCards.length) {
                writer.uint32(/* id 11, wireType 2 =*/90).fork();
                for (var i = 0; i < message.handCards.length; ++i)
                    writer.int32(message.handCards[i]);
                writer.ldelim();
            }
            if (message.cardSuitData != null && message.hasOwnProperty("cardSuitData"))
                $root.msg.CardSuitData.encode(message.cardSuitData, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.resultMoney != null && message.hasOwnProperty("resultMoney"))
                writer.uint32(/* id 13, wireType 1 =*/105).double(message.resultMoney);
            if (message.blindType != null && message.hasOwnProperty("blindType"))
                writer.uint32(/* id 14, wireType 0 =*/112).int32(message.blindType);
            if (message.IsButton != null && message.hasOwnProperty("IsButton"))
                writer.uint32(/* id 15, wireType 0 =*/120).bool(message.IsButton);
            if (message.IsAllIn != null && message.hasOwnProperty("IsAllIn"))
                writer.uint32(/* id 16, wireType 0 =*/128).bool(message.IsAllIn);
            if (message.IsWinner != null && message.hasOwnProperty("IsWinner"))
                writer.uint32(/* id 17, wireType 0 =*/136).bool(message.IsWinner);
            if (message.IsInGame != null && message.hasOwnProperty("IsInGame"))
                writer.uint32(/* id 18, wireType 0 =*/144).bool(message.IsInGame);
            if (message.IsStandUp != null && message.hasOwnProperty("IsStandUp"))
                writer.uint32(/* id 19, wireType 0 =*/152).bool(message.IsStandUp);
            if (message.IsLeaveR != null && message.hasOwnProperty("IsLeaveR"))
                writer.uint32(/* id 20, wireType 0 =*/160).bool(message.IsLeaveR);
            if (message.timerCount != null && message.hasOwnProperty("timerCount"))
                writer.uint32(/* id 21, wireType 1 =*/169).double(message.timerCount);
            if (message.account != null && message.hasOwnProperty("account"))
                writer.uint32(/* id 22, wireType 1 =*/177).double(message.account);
            if (message.resultGetMoney != null && message.hasOwnProperty("resultGetMoney"))
                writer.uint32(/* id 23, wireType 1 =*/185).double(message.resultGetMoney);
            return writer;
        };

        /**
         * Encodes the specified PlayerData message, length delimited. Does not implicitly {@link msg.PlayerData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.PlayerData
         * @static
         * @param {msg.IPlayerData} message PlayerData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PlayerData message from the specified reader or buffer.
         * @function decode
         * @memberof msg.PlayerData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.PlayerData} PlayerData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.PlayerData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.playerInfo = $root.msg.PlayerInfo.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.chair = reader.int32();
                    break;
                case 3:
                    message.standUPNum = reader.int32();
                    break;
                case 4:
                    message.chips = reader.double();
                    break;
                case 5:
                    message.roomChips = reader.double();
                    break;
                case 6:
                    message.actionStatus = reader.int32();
                    break;
                case 7:
                    message.gameStep = reader.int32();
                    break;
                case 8:
                    message.downBets = reader.double();
                    break;
                case 9:
                    message.lunDownBets = reader.double();
                    break;
                case 10:
                    message.totalDownBet = reader.double();
                    break;
                case 11:
                    if (!(message.handCards && message.handCards.length))
                        message.handCards = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.handCards.push(reader.int32());
                    } else
                        message.handCards.push(reader.int32());
                    break;
                case 12:
                    message.cardSuitData = $root.msg.CardSuitData.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.resultMoney = reader.double();
                    break;
                case 14:
                    message.blindType = reader.int32();
                    break;
                case 15:
                    message.IsButton = reader.bool();
                    break;
                case 16:
                    message.IsAllIn = reader.bool();
                    break;
                case 17:
                    message.IsWinner = reader.bool();
                    break;
                case 18:
                    message.IsInGame = reader.bool();
                    break;
                case 19:
                    message.IsStandUp = reader.bool();
                    break;
                case 20:
                    message.IsLeaveR = reader.bool();
                    break;
                case 21:
                    message.timerCount = reader.double();
                    break;
                case 22:
                    message.account = reader.double();
                    break;
                case 23:
                    message.resultGetMoney = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PlayerData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.PlayerData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.PlayerData} PlayerData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerData message.
         * @function verify
         * @memberof msg.PlayerData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.playerInfo != null && message.hasOwnProperty("playerInfo")) {
                var error = $root.msg.PlayerInfo.verify(message.playerInfo);
                if (error)
                    return "playerInfo." + error;
            }
            if (message.chair != null && message.hasOwnProperty("chair"))
                if (!$util.isInteger(message.chair))
                    return "chair: integer expected";
            if (message.standUPNum != null && message.hasOwnProperty("standUPNum"))
                if (!$util.isInteger(message.standUPNum))
                    return "standUPNum: integer expected";
            if (message.chips != null && message.hasOwnProperty("chips"))
                if (typeof message.chips !== "number")
                    return "chips: number expected";
            if (message.roomChips != null && message.hasOwnProperty("roomChips"))
                if (typeof message.roomChips !== "number")
                    return "roomChips: number expected";
            if (message.actionStatus != null && message.hasOwnProperty("actionStatus"))
                switch (message.actionStatus) {
                default:
                    return "actionStatus: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
            if (message.gameStep != null && message.hasOwnProperty("gameStep"))
                if (!$util.isInteger(message.gameStep))
                    return "gameStep: integer expected";
            if (message.downBets != null && message.hasOwnProperty("downBets"))
                if (typeof message.downBets !== "number")
                    return "downBets: number expected";
            if (message.lunDownBets != null && message.hasOwnProperty("lunDownBets"))
                if (typeof message.lunDownBets !== "number")
                    return "lunDownBets: number expected";
            if (message.totalDownBet != null && message.hasOwnProperty("totalDownBet"))
                if (typeof message.totalDownBet !== "number")
                    return "totalDownBet: number expected";
            if (message.handCards != null && message.hasOwnProperty("handCards")) {
                if (!Array.isArray(message.handCards))
                    return "handCards: array expected";
                for (var i = 0; i < message.handCards.length; ++i)
                    if (!$util.isInteger(message.handCards[i]))
                        return "handCards: integer[] expected";
            }
            if (message.cardSuitData != null && message.hasOwnProperty("cardSuitData")) {
                var error = $root.msg.CardSuitData.verify(message.cardSuitData);
                if (error)
                    return "cardSuitData." + error;
            }
            if (message.resultMoney != null && message.hasOwnProperty("resultMoney"))
                if (typeof message.resultMoney !== "number")
                    return "resultMoney: number expected";
            if (message.blindType != null && message.hasOwnProperty("blindType"))
                switch (message.blindType) {
                default:
                    return "blindType: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.IsButton != null && message.hasOwnProperty("IsButton"))
                if (typeof message.IsButton !== "boolean")
                    return "IsButton: boolean expected";
            if (message.IsAllIn != null && message.hasOwnProperty("IsAllIn"))
                if (typeof message.IsAllIn !== "boolean")
                    return "IsAllIn: boolean expected";
            if (message.IsWinner != null && message.hasOwnProperty("IsWinner"))
                if (typeof message.IsWinner !== "boolean")
                    return "IsWinner: boolean expected";
            if (message.IsInGame != null && message.hasOwnProperty("IsInGame"))
                if (typeof message.IsInGame !== "boolean")
                    return "IsInGame: boolean expected";
            if (message.IsStandUp != null && message.hasOwnProperty("IsStandUp"))
                if (typeof message.IsStandUp !== "boolean")
                    return "IsStandUp: boolean expected";
            if (message.IsLeaveR != null && message.hasOwnProperty("IsLeaveR"))
                if (typeof message.IsLeaveR !== "boolean")
                    return "IsLeaveR: boolean expected";
            if (message.timerCount != null && message.hasOwnProperty("timerCount"))
                if (typeof message.timerCount !== "number")
                    return "timerCount: number expected";
            if (message.account != null && message.hasOwnProperty("account"))
                if (typeof message.account !== "number")
                    return "account: number expected";
            if (message.resultGetMoney != null && message.hasOwnProperty("resultGetMoney"))
                if (typeof message.resultGetMoney !== "number")
                    return "resultGetMoney: number expected";
            return null;
        };

        /**
         * Creates a PlayerData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.PlayerData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.PlayerData} PlayerData
         */
        PlayerData.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.PlayerData)
                return object;
            var message = new $root.msg.PlayerData();
            if (object.playerInfo != null) {
                if (typeof object.playerInfo !== "object")
                    throw TypeError(".msg.PlayerData.playerInfo: object expected");
                message.playerInfo = $root.msg.PlayerInfo.fromObject(object.playerInfo);
            }
            if (object.chair != null)
                message.chair = object.chair | 0;
            if (object.standUPNum != null)
                message.standUPNum = object.standUPNum | 0;
            if (object.chips != null)
                message.chips = Number(object.chips);
            if (object.roomChips != null)
                message.roomChips = Number(object.roomChips);
            switch (object.actionStatus) {
            case "WAITING":
            case 0:
                message.actionStatus = 0;
                break;
            case "RAISE":
            case 1:
                message.actionStatus = 1;
                break;
            case "CALL":
            case 2:
                message.actionStatus = 2;
                break;
            case "CHECK":
            case 3:
                message.actionStatus = 3;
                break;
            case "FOLD":
            case 4:
                message.actionStatus = 4;
                break;
            case "ALLIN":
            case 5:
                message.actionStatus = 5;
                break;
            }
            if (object.gameStep != null)
                message.gameStep = object.gameStep | 0;
            if (object.downBets != null)
                message.downBets = Number(object.downBets);
            if (object.lunDownBets != null)
                message.lunDownBets = Number(object.lunDownBets);
            if (object.totalDownBet != null)
                message.totalDownBet = Number(object.totalDownBet);
            if (object.handCards) {
                if (!Array.isArray(object.handCards))
                    throw TypeError(".msg.PlayerData.handCards: array expected");
                message.handCards = [];
                for (var i = 0; i < object.handCards.length; ++i)
                    message.handCards[i] = object.handCards[i] | 0;
            }
            if (object.cardSuitData != null) {
                if (typeof object.cardSuitData !== "object")
                    throw TypeError(".msg.PlayerData.cardSuitData: object expected");
                message.cardSuitData = $root.msg.CardSuitData.fromObject(object.cardSuitData);
            }
            if (object.resultMoney != null)
                message.resultMoney = Number(object.resultMoney);
            switch (object.blindType) {
            case "No_Blind":
            case 0:
                message.blindType = 0;
                break;
            case "Small_Blind":
            case 1:
                message.blindType = 1;
                break;
            case "Big_Blind":
            case 2:
                message.blindType = 2;
                break;
            }
            if (object.IsButton != null)
                message.IsButton = Boolean(object.IsButton);
            if (object.IsAllIn != null)
                message.IsAllIn = Boolean(object.IsAllIn);
            if (object.IsWinner != null)
                message.IsWinner = Boolean(object.IsWinner);
            if (object.IsInGame != null)
                message.IsInGame = Boolean(object.IsInGame);
            if (object.IsStandUp != null)
                message.IsStandUp = Boolean(object.IsStandUp);
            if (object.IsLeaveR != null)
                message.IsLeaveR = Boolean(object.IsLeaveR);
            if (object.timerCount != null)
                message.timerCount = Number(object.timerCount);
            if (object.account != null)
                message.account = Number(object.account);
            if (object.resultGetMoney != null)
                message.resultGetMoney = Number(object.resultGetMoney);
            return message;
        };

        /**
         * Creates a plain object from a PlayerData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.PlayerData
         * @static
         * @param {msg.PlayerData} message PlayerData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.handCards = [];
            if (options.defaults) {
                object.playerInfo = null;
                object.chair = 0;
                object.standUPNum = 0;
                object.chips = 0;
                object.roomChips = 0;
                object.actionStatus = options.enums === String ? "WAITING" : 0;
                object.gameStep = 0;
                object.downBets = 0;
                object.lunDownBets = 0;
                object.totalDownBet = 0;
                object.cardSuitData = null;
                object.resultMoney = 0;
                object.blindType = options.enums === String ? "No_Blind" : 0;
                object.IsButton = false;
                object.IsAllIn = false;
                object.IsWinner = false;
                object.IsInGame = false;
                object.IsStandUp = false;
                object.IsLeaveR = false;
                object.timerCount = 0;
                object.account = 0;
                object.resultGetMoney = 0;
            }
            if (message.playerInfo != null && message.hasOwnProperty("playerInfo"))
                object.playerInfo = $root.msg.PlayerInfo.toObject(message.playerInfo, options);
            if (message.chair != null && message.hasOwnProperty("chair"))
                object.chair = message.chair;
            if (message.standUPNum != null && message.hasOwnProperty("standUPNum"))
                object.standUPNum = message.standUPNum;
            if (message.chips != null && message.hasOwnProperty("chips"))
                object.chips = options.json && !isFinite(message.chips) ? String(message.chips) : message.chips;
            if (message.roomChips != null && message.hasOwnProperty("roomChips"))
                object.roomChips = options.json && !isFinite(message.roomChips) ? String(message.roomChips) : message.roomChips;
            if (message.actionStatus != null && message.hasOwnProperty("actionStatus"))
                object.actionStatus = options.enums === String ? $root.msg.ActionStatus[message.actionStatus] : message.actionStatus;
            if (message.gameStep != null && message.hasOwnProperty("gameStep"))
                object.gameStep = message.gameStep;
            if (message.downBets != null && message.hasOwnProperty("downBets"))
                object.downBets = options.json && !isFinite(message.downBets) ? String(message.downBets) : message.downBets;
            if (message.lunDownBets != null && message.hasOwnProperty("lunDownBets"))
                object.lunDownBets = options.json && !isFinite(message.lunDownBets) ? String(message.lunDownBets) : message.lunDownBets;
            if (message.totalDownBet != null && message.hasOwnProperty("totalDownBet"))
                object.totalDownBet = options.json && !isFinite(message.totalDownBet) ? String(message.totalDownBet) : message.totalDownBet;
            if (message.handCards && message.handCards.length) {
                object.handCards = [];
                for (var j = 0; j < message.handCards.length; ++j)
                    object.handCards[j] = message.handCards[j];
            }
            if (message.cardSuitData != null && message.hasOwnProperty("cardSuitData"))
                object.cardSuitData = $root.msg.CardSuitData.toObject(message.cardSuitData, options);
            if (message.resultMoney != null && message.hasOwnProperty("resultMoney"))
                object.resultMoney = options.json && !isFinite(message.resultMoney) ? String(message.resultMoney) : message.resultMoney;
            if (message.blindType != null && message.hasOwnProperty("blindType"))
                object.blindType = options.enums === String ? $root.msg.BlindType[message.blindType] : message.blindType;
            if (message.IsButton != null && message.hasOwnProperty("IsButton"))
                object.IsButton = message.IsButton;
            if (message.IsAllIn != null && message.hasOwnProperty("IsAllIn"))
                object.IsAllIn = message.IsAllIn;
            if (message.IsWinner != null && message.hasOwnProperty("IsWinner"))
                object.IsWinner = message.IsWinner;
            if (message.IsInGame != null && message.hasOwnProperty("IsInGame"))
                object.IsInGame = message.IsInGame;
            if (message.IsStandUp != null && message.hasOwnProperty("IsStandUp"))
                object.IsStandUp = message.IsStandUp;
            if (message.IsLeaveR != null && message.hasOwnProperty("IsLeaveR"))
                object.IsLeaveR = message.IsLeaveR;
            if (message.timerCount != null && message.hasOwnProperty("timerCount"))
                object.timerCount = options.json && !isFinite(message.timerCount) ? String(message.timerCount) : message.timerCount;
            if (message.account != null && message.hasOwnProperty("account"))
                object.account = options.json && !isFinite(message.account) ? String(message.account) : message.account;
            if (message.resultGetMoney != null && message.hasOwnProperty("resultGetMoney"))
                object.resultGetMoney = options.json && !isFinite(message.resultGetMoney) ? String(message.resultGetMoney) : message.resultGetMoney;
            return object;
        };

        /**
         * Converts this PlayerData to JSON.
         * @function toJSON
         * @memberof msg.PlayerData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PlayerData;
    })();

    msg.RoomData = (function() {

        /**
         * Properties of a RoomData.
         * @memberof msg
         * @interface IRoomData
         * @property {string|null} [roomId] RoomData roomId
         * @property {string|null} [cfgId] RoomData cfgId
         * @property {msg.GameStep|null} [gameStep] RoomData gameStep
         * @property {number|null} [minRaise] RoomData minRaise
         * @property {number|null} [preChips] RoomData preChips
         * @property {string|null} [activeId] RoomData activeId
         * @property {number|null} [banker] RoomData banker
         * @property {number|null} [bigBlind] RoomData bigBlind
         * @property {number|null} [potMoney] RoomData potMoney
         * @property {number|null} [isShowDown] RoomData isShowDown
         * @property {boolean|null} [isHaveAllin] RoomData isHaveAllin
         * @property {Array.<number>|null} [publicCards] RoomData publicCards
         * @property {Array.<msg.IPlayerData>|null} [playerData] RoomData playerData
         * @property {Array.<msg.IPlayerData>|null} [AllPlayer] RoomData AllPlayer
         */

        /**
         * Constructs a new RoomData.
         * @memberof msg
         * @classdesc Represents a RoomData.
         * @implements IRoomData
         * @constructor
         * @param {msg.IRoomData=} [properties] Properties to set
         */
        function RoomData(properties) {
            this.publicCards = [];
            this.playerData = [];
            this.AllPlayer = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomData roomId.
         * @member {string} roomId
         * @memberof msg.RoomData
         * @instance
         */
        RoomData.prototype.roomId = "";

        /**
         * RoomData cfgId.
         * @member {string} cfgId
         * @memberof msg.RoomData
         * @instance
         */
        RoomData.prototype.cfgId = "";

        /**
         * RoomData gameStep.
         * @member {msg.GameStep} gameStep
         * @memberof msg.RoomData
         * @instance
         */
        RoomData.prototype.gameStep = 0;

        /**
         * RoomData minRaise.
         * @member {number} minRaise
         * @memberof msg.RoomData
         * @instance
         */
        RoomData.prototype.minRaise = 0;

        /**
         * RoomData preChips.
         * @member {number} preChips
         * @memberof msg.RoomData
         * @instance
         */
        RoomData.prototype.preChips = 0;

        /**
         * RoomData activeId.
         * @member {string} activeId
         * @memberof msg.RoomData
         * @instance
         */
        RoomData.prototype.activeId = "";

        /**
         * RoomData banker.
         * @member {number} banker
         * @memberof msg.RoomData
         * @instance
         */
        RoomData.prototype.banker = 0;

        /**
         * RoomData bigBlind.
         * @member {number} bigBlind
         * @memberof msg.RoomData
         * @instance
         */
        RoomData.prototype.bigBlind = 0;

        /**
         * RoomData potMoney.
         * @member {number} potMoney
         * @memberof msg.RoomData
         * @instance
         */
        RoomData.prototype.potMoney = 0;

        /**
         * RoomData isShowDown.
         * @member {number} isShowDown
         * @memberof msg.RoomData
         * @instance
         */
        RoomData.prototype.isShowDown = 0;

        /**
         * RoomData isHaveAllin.
         * @member {boolean} isHaveAllin
         * @memberof msg.RoomData
         * @instance
         */
        RoomData.prototype.isHaveAllin = false;

        /**
         * RoomData publicCards.
         * @member {Array.<number>} publicCards
         * @memberof msg.RoomData
         * @instance
         */
        RoomData.prototype.publicCards = $util.emptyArray;

        /**
         * RoomData playerData.
         * @member {Array.<msg.IPlayerData>} playerData
         * @memberof msg.RoomData
         * @instance
         */
        RoomData.prototype.playerData = $util.emptyArray;

        /**
         * RoomData AllPlayer.
         * @member {Array.<msg.IPlayerData>} AllPlayer
         * @memberof msg.RoomData
         * @instance
         */
        RoomData.prototype.AllPlayer = $util.emptyArray;

        /**
         * Creates a new RoomData instance using the specified properties.
         * @function create
         * @memberof msg.RoomData
         * @static
         * @param {msg.IRoomData=} [properties] Properties to set
         * @returns {msg.RoomData} RoomData instance
         */
        RoomData.create = function create(properties) {
            return new RoomData(properties);
        };

        /**
         * Encodes the specified RoomData message. Does not implicitly {@link msg.RoomData.verify|verify} messages.
         * @function encode
         * @memberof msg.RoomData
         * @static
         * @param {msg.IRoomData} message RoomData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.cfgId);
            if (message.gameStep != null && message.hasOwnProperty("gameStep"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.gameStep);
            if (message.minRaise != null && message.hasOwnProperty("minRaise"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.minRaise);
            if (message.preChips != null && message.hasOwnProperty("preChips"))
                writer.uint32(/* id 5, wireType 1 =*/41).double(message.preChips);
            if (message.activeId != null && message.hasOwnProperty("activeId"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.activeId);
            if (message.banker != null && message.hasOwnProperty("banker"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.banker);
            if (message.bigBlind != null && message.hasOwnProperty("bigBlind"))
                writer.uint32(/* id 8, wireType 1 =*/65).double(message.bigBlind);
            if (message.potMoney != null && message.hasOwnProperty("potMoney"))
                writer.uint32(/* id 9, wireType 1 =*/73).double(message.potMoney);
            if (message.isShowDown != null && message.hasOwnProperty("isShowDown"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.isShowDown);
            if (message.isHaveAllin != null && message.hasOwnProperty("isHaveAllin"))
                writer.uint32(/* id 11, wireType 0 =*/88).bool(message.isHaveAllin);
            if (message.publicCards != null && message.publicCards.length) {
                writer.uint32(/* id 12, wireType 2 =*/98).fork();
                for (var i = 0; i < message.publicCards.length; ++i)
                    writer.int32(message.publicCards[i]);
                writer.ldelim();
            }
            if (message.playerData != null && message.playerData.length)
                for (var i = 0; i < message.playerData.length; ++i)
                    $root.msg.PlayerData.encode(message.playerData[i], writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
            if (message.AllPlayer != null && message.AllPlayer.length)
                for (var i = 0; i < message.AllPlayer.length; ++i)
                    $root.msg.PlayerData.encode(message.AllPlayer[i], writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified RoomData message, length delimited. Does not implicitly {@link msg.RoomData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.RoomData
         * @static
         * @param {msg.IRoomData} message RoomData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomData message from the specified reader or buffer.
         * @function decode
         * @memberof msg.RoomData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.RoomData} RoomData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.RoomData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomId = reader.string();
                    break;
                case 2:
                    message.cfgId = reader.string();
                    break;
                case 3:
                    message.gameStep = reader.int32();
                    break;
                case 4:
                    message.minRaise = reader.double();
                    break;
                case 5:
                    message.preChips = reader.double();
                    break;
                case 6:
                    message.activeId = reader.string();
                    break;
                case 7:
                    message.banker = reader.int32();
                    break;
                case 8:
                    message.bigBlind = reader.double();
                    break;
                case 9:
                    message.potMoney = reader.double();
                    break;
                case 10:
                    message.isShowDown = reader.int32();
                    break;
                case 11:
                    message.isHaveAllin = reader.bool();
                    break;
                case 12:
                    if (!(message.publicCards && message.publicCards.length))
                        message.publicCards = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.publicCards.push(reader.int32());
                    } else
                        message.publicCards.push(reader.int32());
                    break;
                case 13:
                    if (!(message.playerData && message.playerData.length))
                        message.playerData = [];
                    message.playerData.push($root.msg.PlayerData.decode(reader, reader.uint32()));
                    break;
                case 14:
                    if (!(message.AllPlayer && message.AllPlayer.length))
                        message.AllPlayer = [];
                    message.AllPlayer.push($root.msg.PlayerData.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.RoomData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.RoomData} RoomData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomData message.
         * @function verify
         * @memberof msg.RoomData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                if (!$util.isString(message.roomId))
                    return "roomId: string expected";
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                if (!$util.isString(message.cfgId))
                    return "cfgId: string expected";
            if (message.gameStep != null && message.hasOwnProperty("gameStep"))
                switch (message.gameStep) {
                default:
                    return "gameStep: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
            if (message.minRaise != null && message.hasOwnProperty("minRaise"))
                if (typeof message.minRaise !== "number")
                    return "minRaise: number expected";
            if (message.preChips != null && message.hasOwnProperty("preChips"))
                if (typeof message.preChips !== "number")
                    return "preChips: number expected";
            if (message.activeId != null && message.hasOwnProperty("activeId"))
                if (!$util.isString(message.activeId))
                    return "activeId: string expected";
            if (message.banker != null && message.hasOwnProperty("banker"))
                if (!$util.isInteger(message.banker))
                    return "banker: integer expected";
            if (message.bigBlind != null && message.hasOwnProperty("bigBlind"))
                if (typeof message.bigBlind !== "number")
                    return "bigBlind: number expected";
            if (message.potMoney != null && message.hasOwnProperty("potMoney"))
                if (typeof message.potMoney !== "number")
                    return "potMoney: number expected";
            if (message.isShowDown != null && message.hasOwnProperty("isShowDown"))
                if (!$util.isInteger(message.isShowDown))
                    return "isShowDown: integer expected";
            if (message.isHaveAllin != null && message.hasOwnProperty("isHaveAllin"))
                if (typeof message.isHaveAllin !== "boolean")
                    return "isHaveAllin: boolean expected";
            if (message.publicCards != null && message.hasOwnProperty("publicCards")) {
                if (!Array.isArray(message.publicCards))
                    return "publicCards: array expected";
                for (var i = 0; i < message.publicCards.length; ++i)
                    if (!$util.isInteger(message.publicCards[i]))
                        return "publicCards: integer[] expected";
            }
            if (message.playerData != null && message.hasOwnProperty("playerData")) {
                if (!Array.isArray(message.playerData))
                    return "playerData: array expected";
                for (var i = 0; i < message.playerData.length; ++i) {
                    var error = $root.msg.PlayerData.verify(message.playerData[i]);
                    if (error)
                        return "playerData." + error;
                }
            }
            if (message.AllPlayer != null && message.hasOwnProperty("AllPlayer")) {
                if (!Array.isArray(message.AllPlayer))
                    return "AllPlayer: array expected";
                for (var i = 0; i < message.AllPlayer.length; ++i) {
                    var error = $root.msg.PlayerData.verify(message.AllPlayer[i]);
                    if (error)
                        return "AllPlayer." + error;
                }
            }
            return null;
        };

        /**
         * Creates a RoomData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.RoomData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.RoomData} RoomData
         */
        RoomData.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.RoomData)
                return object;
            var message = new $root.msg.RoomData();
            if (object.roomId != null)
                message.roomId = String(object.roomId);
            if (object.cfgId != null)
                message.cfgId = String(object.cfgId);
            switch (object.gameStep) {
            case "Waiting":
            case 0:
                message.gameStep = 0;
                break;
            case "PreFlop":
            case 1:
                message.gameStep = 1;
                break;
            case "Flop":
            case 2:
                message.gameStep = 2;
                break;
            case "Turn":
            case 3:
                message.gameStep = 3;
                break;
            case "River":
            case 4:
                message.gameStep = 4;
                break;
            case "ShowDown":
            case 5:
                message.gameStep = 5;
                break;
            }
            if (object.minRaise != null)
                message.minRaise = Number(object.minRaise);
            if (object.preChips != null)
                message.preChips = Number(object.preChips);
            if (object.activeId != null)
                message.activeId = String(object.activeId);
            if (object.banker != null)
                message.banker = object.banker | 0;
            if (object.bigBlind != null)
                message.bigBlind = Number(object.bigBlind);
            if (object.potMoney != null)
                message.potMoney = Number(object.potMoney);
            if (object.isShowDown != null)
                message.isShowDown = object.isShowDown | 0;
            if (object.isHaveAllin != null)
                message.isHaveAllin = Boolean(object.isHaveAllin);
            if (object.publicCards) {
                if (!Array.isArray(object.publicCards))
                    throw TypeError(".msg.RoomData.publicCards: array expected");
                message.publicCards = [];
                for (var i = 0; i < object.publicCards.length; ++i)
                    message.publicCards[i] = object.publicCards[i] | 0;
            }
            if (object.playerData) {
                if (!Array.isArray(object.playerData))
                    throw TypeError(".msg.RoomData.playerData: array expected");
                message.playerData = [];
                for (var i = 0; i < object.playerData.length; ++i) {
                    if (typeof object.playerData[i] !== "object")
                        throw TypeError(".msg.RoomData.playerData: object expected");
                    message.playerData[i] = $root.msg.PlayerData.fromObject(object.playerData[i]);
                }
            }
            if (object.AllPlayer) {
                if (!Array.isArray(object.AllPlayer))
                    throw TypeError(".msg.RoomData.AllPlayer: array expected");
                message.AllPlayer = [];
                for (var i = 0; i < object.AllPlayer.length; ++i) {
                    if (typeof object.AllPlayer[i] !== "object")
                        throw TypeError(".msg.RoomData.AllPlayer: object expected");
                    message.AllPlayer[i] = $root.msg.PlayerData.fromObject(object.AllPlayer[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a RoomData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.RoomData
         * @static
         * @param {msg.RoomData} message RoomData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.publicCards = [];
                object.playerData = [];
                object.AllPlayer = [];
            }
            if (options.defaults) {
                object.roomId = "";
                object.cfgId = "";
                object.gameStep = options.enums === String ? "Waiting" : 0;
                object.minRaise = 0;
                object.preChips = 0;
                object.activeId = "";
                object.banker = 0;
                object.bigBlind = 0;
                object.potMoney = 0;
                object.isShowDown = 0;
                object.isHaveAllin = false;
            }
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                object.cfgId = message.cfgId;
            if (message.gameStep != null && message.hasOwnProperty("gameStep"))
                object.gameStep = options.enums === String ? $root.msg.GameStep[message.gameStep] : message.gameStep;
            if (message.minRaise != null && message.hasOwnProperty("minRaise"))
                object.minRaise = options.json && !isFinite(message.minRaise) ? String(message.minRaise) : message.minRaise;
            if (message.preChips != null && message.hasOwnProperty("preChips"))
                object.preChips = options.json && !isFinite(message.preChips) ? String(message.preChips) : message.preChips;
            if (message.activeId != null && message.hasOwnProperty("activeId"))
                object.activeId = message.activeId;
            if (message.banker != null && message.hasOwnProperty("banker"))
                object.banker = message.banker;
            if (message.bigBlind != null && message.hasOwnProperty("bigBlind"))
                object.bigBlind = options.json && !isFinite(message.bigBlind) ? String(message.bigBlind) : message.bigBlind;
            if (message.potMoney != null && message.hasOwnProperty("potMoney"))
                object.potMoney = options.json && !isFinite(message.potMoney) ? String(message.potMoney) : message.potMoney;
            if (message.isShowDown != null && message.hasOwnProperty("isShowDown"))
                object.isShowDown = message.isShowDown;
            if (message.isHaveAllin != null && message.hasOwnProperty("isHaveAllin"))
                object.isHaveAllin = message.isHaveAllin;
            if (message.publicCards && message.publicCards.length) {
                object.publicCards = [];
                for (var j = 0; j < message.publicCards.length; ++j)
                    object.publicCards[j] = message.publicCards[j];
            }
            if (message.playerData && message.playerData.length) {
                object.playerData = [];
                for (var j = 0; j < message.playerData.length; ++j)
                    object.playerData[j] = $root.msg.PlayerData.toObject(message.playerData[j], options);
            }
            if (message.AllPlayer && message.AllPlayer.length) {
                object.AllPlayer = [];
                for (var j = 0; j < message.AllPlayer.length; ++j)
                    object.AllPlayer[j] = $root.msg.PlayerData.toObject(message.AllPlayer[j], options);
            }
            return object;
        };

        /**
         * Converts this RoomData to JSON.
         * @function toJSON
         * @memberof msg.RoomData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomData;
    })();

    msg.QuickStart_C2S = (function() {

        /**
         * Properties of a QuickStart_C2S.
         * @memberof msg
         * @interface IQuickStart_C2S
         * @property {string|null} [cfgId] QuickStart_C2S cfgId
         */

        /**
         * Constructs a new QuickStart_C2S.
         * @memberof msg
         * @classdesc Represents a QuickStart_C2S.
         * @implements IQuickStart_C2S
         * @constructor
         * @param {msg.IQuickStart_C2S=} [properties] Properties to set
         */
        function QuickStart_C2S(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QuickStart_C2S cfgId.
         * @member {string} cfgId
         * @memberof msg.QuickStart_C2S
         * @instance
         */
        QuickStart_C2S.prototype.cfgId = "";

        /**
         * Creates a new QuickStart_C2S instance using the specified properties.
         * @function create
         * @memberof msg.QuickStart_C2S
         * @static
         * @param {msg.IQuickStart_C2S=} [properties] Properties to set
         * @returns {msg.QuickStart_C2S} QuickStart_C2S instance
         */
        QuickStart_C2S.create = function create(properties) {
            return new QuickStart_C2S(properties);
        };

        /**
         * Encodes the specified QuickStart_C2S message. Does not implicitly {@link msg.QuickStart_C2S.verify|verify} messages.
         * @function encode
         * @memberof msg.QuickStart_C2S
         * @static
         * @param {msg.IQuickStart_C2S} message QuickStart_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QuickStart_C2S.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cfgId);
            return writer;
        };

        /**
         * Encodes the specified QuickStart_C2S message, length delimited. Does not implicitly {@link msg.QuickStart_C2S.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.QuickStart_C2S
         * @static
         * @param {msg.IQuickStart_C2S} message QuickStart_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QuickStart_C2S.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a QuickStart_C2S message from the specified reader or buffer.
         * @function decode
         * @memberof msg.QuickStart_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.QuickStart_C2S} QuickStart_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QuickStart_C2S.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.QuickStart_C2S();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cfgId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a QuickStart_C2S message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.QuickStart_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.QuickStart_C2S} QuickStart_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QuickStart_C2S.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a QuickStart_C2S message.
         * @function verify
         * @memberof msg.QuickStart_C2S
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        QuickStart_C2S.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                if (!$util.isString(message.cfgId))
                    return "cfgId: string expected";
            return null;
        };

        /**
         * Creates a QuickStart_C2S message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.QuickStart_C2S
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.QuickStart_C2S} QuickStart_C2S
         */
        QuickStart_C2S.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.QuickStart_C2S)
                return object;
            var message = new $root.msg.QuickStart_C2S();
            if (object.cfgId != null)
                message.cfgId = String(object.cfgId);
            return message;
        };

        /**
         * Creates a plain object from a QuickStart_C2S message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.QuickStart_C2S
         * @static
         * @param {msg.QuickStart_C2S} message QuickStart_C2S
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        QuickStart_C2S.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.cfgId = "";
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                object.cfgId = message.cfgId;
            return object;
        };

        /**
         * Converts this QuickStart_C2S to JSON.
         * @function toJSON
         * @memberof msg.QuickStart_C2S
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        QuickStart_C2S.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return QuickStart_C2S;
    })();

    msg.ChangeTable_C2S = (function() {

        /**
         * Properties of a ChangeTable_C2S.
         * @memberof msg
         * @interface IChangeTable_C2S
         */

        /**
         * Constructs a new ChangeTable_C2S.
         * @memberof msg
         * @classdesc Represents a ChangeTable_C2S.
         * @implements IChangeTable_C2S
         * @constructor
         * @param {msg.IChangeTable_C2S=} [properties] Properties to set
         */
        function ChangeTable_C2S(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new ChangeTable_C2S instance using the specified properties.
         * @function create
         * @memberof msg.ChangeTable_C2S
         * @static
         * @param {msg.IChangeTable_C2S=} [properties] Properties to set
         * @returns {msg.ChangeTable_C2S} ChangeTable_C2S instance
         */
        ChangeTable_C2S.create = function create(properties) {
            return new ChangeTable_C2S(properties);
        };

        /**
         * Encodes the specified ChangeTable_C2S message. Does not implicitly {@link msg.ChangeTable_C2S.verify|verify} messages.
         * @function encode
         * @memberof msg.ChangeTable_C2S
         * @static
         * @param {msg.IChangeTable_C2S} message ChangeTable_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChangeTable_C2S.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified ChangeTable_C2S message, length delimited. Does not implicitly {@link msg.ChangeTable_C2S.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.ChangeTable_C2S
         * @static
         * @param {msg.IChangeTable_C2S} message ChangeTable_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChangeTable_C2S.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ChangeTable_C2S message from the specified reader or buffer.
         * @function decode
         * @memberof msg.ChangeTable_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.ChangeTable_C2S} ChangeTable_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChangeTable_C2S.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.ChangeTable_C2S();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ChangeTable_C2S message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.ChangeTable_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.ChangeTable_C2S} ChangeTable_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChangeTable_C2S.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ChangeTable_C2S message.
         * @function verify
         * @memberof msg.ChangeTable_C2S
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ChangeTable_C2S.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a ChangeTable_C2S message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.ChangeTable_C2S
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.ChangeTable_C2S} ChangeTable_C2S
         */
        ChangeTable_C2S.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.ChangeTable_C2S)
                return object;
            return new $root.msg.ChangeTable_C2S();
        };

        /**
         * Creates a plain object from a ChangeTable_C2S message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.ChangeTable_C2S
         * @static
         * @param {msg.ChangeTable_C2S} message ChangeTable_C2S
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ChangeTable_C2S.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this ChangeTable_C2S to JSON.
         * @function toJSON
         * @memberof msg.ChangeTable_C2S
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ChangeTable_C2S.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ChangeTable_C2S;
    })();

    msg.JoinRoom_S2C = (function() {

        /**
         * Properties of a JoinRoom_S2C.
         * @memberof msg
         * @interface IJoinRoom_S2C
         * @property {msg.IRoomData|null} [roomData] JoinRoom_S2C roomData
         */

        /**
         * Constructs a new JoinRoom_S2C.
         * @memberof msg
         * @classdesc Represents a JoinRoom_S2C.
         * @implements IJoinRoom_S2C
         * @constructor
         * @param {msg.IJoinRoom_S2C=} [properties] Properties to set
         */
        function JoinRoom_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * JoinRoom_S2C roomData.
         * @member {msg.IRoomData|null|undefined} roomData
         * @memberof msg.JoinRoom_S2C
         * @instance
         */
        JoinRoom_S2C.prototype.roomData = null;

        /**
         * Creates a new JoinRoom_S2C instance using the specified properties.
         * @function create
         * @memberof msg.JoinRoom_S2C
         * @static
         * @param {msg.IJoinRoom_S2C=} [properties] Properties to set
         * @returns {msg.JoinRoom_S2C} JoinRoom_S2C instance
         */
        JoinRoom_S2C.create = function create(properties) {
            return new JoinRoom_S2C(properties);
        };

        /**
         * Encodes the specified JoinRoom_S2C message. Does not implicitly {@link msg.JoinRoom_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.JoinRoom_S2C
         * @static
         * @param {msg.IJoinRoom_S2C} message JoinRoom_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JoinRoom_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                $root.msg.RoomData.encode(message.roomData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified JoinRoom_S2C message, length delimited. Does not implicitly {@link msg.JoinRoom_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.JoinRoom_S2C
         * @static
         * @param {msg.IJoinRoom_S2C} message JoinRoom_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JoinRoom_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a JoinRoom_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.JoinRoom_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.JoinRoom_S2C} JoinRoom_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JoinRoom_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.JoinRoom_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomData = $root.msg.RoomData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a JoinRoom_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.JoinRoom_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.JoinRoom_S2C} JoinRoom_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JoinRoom_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a JoinRoom_S2C message.
         * @function verify
         * @memberof msg.JoinRoom_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        JoinRoom_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomData != null && message.hasOwnProperty("roomData")) {
                var error = $root.msg.RoomData.verify(message.roomData);
                if (error)
                    return "roomData." + error;
            }
            return null;
        };

        /**
         * Creates a JoinRoom_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.JoinRoom_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.JoinRoom_S2C} JoinRoom_S2C
         */
        JoinRoom_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.JoinRoom_S2C)
                return object;
            var message = new $root.msg.JoinRoom_S2C();
            if (object.roomData != null) {
                if (typeof object.roomData !== "object")
                    throw TypeError(".msg.JoinRoom_S2C.roomData: object expected");
                message.roomData = $root.msg.RoomData.fromObject(object.roomData);
            }
            return message;
        };

        /**
         * Creates a plain object from a JoinRoom_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.JoinRoom_S2C
         * @static
         * @param {msg.JoinRoom_S2C} message JoinRoom_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        JoinRoom_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.roomData = null;
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                object.roomData = $root.msg.RoomData.toObject(message.roomData, options);
            return object;
        };

        /**
         * Converts this JoinRoom_S2C to JSON.
         * @function toJSON
         * @memberof msg.JoinRoom_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        JoinRoom_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return JoinRoom_S2C;
    })();

    msg.EnterRoom_S2C = (function() {

        /**
         * Properties of an EnterRoom_S2C.
         * @memberof msg
         * @interface IEnterRoom_S2C
         * @property {msg.IRoomData|null} [roomData] EnterRoom_S2C roomData
         */

        /**
         * Constructs a new EnterRoom_S2C.
         * @memberof msg
         * @classdesc Represents an EnterRoom_S2C.
         * @implements IEnterRoom_S2C
         * @constructor
         * @param {msg.IEnterRoom_S2C=} [properties] Properties to set
         */
        function EnterRoom_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EnterRoom_S2C roomData.
         * @member {msg.IRoomData|null|undefined} roomData
         * @memberof msg.EnterRoom_S2C
         * @instance
         */
        EnterRoom_S2C.prototype.roomData = null;

        /**
         * Creates a new EnterRoom_S2C instance using the specified properties.
         * @function create
         * @memberof msg.EnterRoom_S2C
         * @static
         * @param {msg.IEnterRoom_S2C=} [properties] Properties to set
         * @returns {msg.EnterRoom_S2C} EnterRoom_S2C instance
         */
        EnterRoom_S2C.create = function create(properties) {
            return new EnterRoom_S2C(properties);
        };

        /**
         * Encodes the specified EnterRoom_S2C message. Does not implicitly {@link msg.EnterRoom_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.EnterRoom_S2C
         * @static
         * @param {msg.IEnterRoom_S2C} message EnterRoom_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterRoom_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                $root.msg.RoomData.encode(message.roomData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified EnterRoom_S2C message, length delimited. Does not implicitly {@link msg.EnterRoom_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.EnterRoom_S2C
         * @static
         * @param {msg.IEnterRoom_S2C} message EnterRoom_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterRoom_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EnterRoom_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.EnterRoom_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.EnterRoom_S2C} EnterRoom_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterRoom_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.EnterRoom_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomData = $root.msg.RoomData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EnterRoom_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.EnterRoom_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.EnterRoom_S2C} EnterRoom_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterRoom_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EnterRoom_S2C message.
         * @function verify
         * @memberof msg.EnterRoom_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EnterRoom_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomData != null && message.hasOwnProperty("roomData")) {
                var error = $root.msg.RoomData.verify(message.roomData);
                if (error)
                    return "roomData." + error;
            }
            return null;
        };

        /**
         * Creates an EnterRoom_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.EnterRoom_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.EnterRoom_S2C} EnterRoom_S2C
         */
        EnterRoom_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.EnterRoom_S2C)
                return object;
            var message = new $root.msg.EnterRoom_S2C();
            if (object.roomData != null) {
                if (typeof object.roomData !== "object")
                    throw TypeError(".msg.EnterRoom_S2C.roomData: object expected");
                message.roomData = $root.msg.RoomData.fromObject(object.roomData);
            }
            return message;
        };

        /**
         * Creates a plain object from an EnterRoom_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.EnterRoom_S2C
         * @static
         * @param {msg.EnterRoom_S2C} message EnterRoom_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EnterRoom_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.roomData = null;
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                object.roomData = $root.msg.RoomData.toObject(message.roomData, options);
            return object;
        };

        /**
         * Converts this EnterRoom_S2C to JSON.
         * @function toJSON
         * @memberof msg.EnterRoom_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EnterRoom_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EnterRoom_S2C;
    })();

    msg.NoticeJoin_S2C = (function() {

        /**
         * Properties of a NoticeJoin_S2C.
         * @memberof msg
         * @interface INoticeJoin_S2C
         * @property {msg.IPlayerData|null} [playerData] NoticeJoin_S2C playerData
         */

        /**
         * Constructs a new NoticeJoin_S2C.
         * @memberof msg
         * @classdesc Represents a NoticeJoin_S2C.
         * @implements INoticeJoin_S2C
         * @constructor
         * @param {msg.INoticeJoin_S2C=} [properties] Properties to set
         */
        function NoticeJoin_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NoticeJoin_S2C playerData.
         * @member {msg.IPlayerData|null|undefined} playerData
         * @memberof msg.NoticeJoin_S2C
         * @instance
         */
        NoticeJoin_S2C.prototype.playerData = null;

        /**
         * Creates a new NoticeJoin_S2C instance using the specified properties.
         * @function create
         * @memberof msg.NoticeJoin_S2C
         * @static
         * @param {msg.INoticeJoin_S2C=} [properties] Properties to set
         * @returns {msg.NoticeJoin_S2C} NoticeJoin_S2C instance
         */
        NoticeJoin_S2C.create = function create(properties) {
            return new NoticeJoin_S2C(properties);
        };

        /**
         * Encodes the specified NoticeJoin_S2C message. Does not implicitly {@link msg.NoticeJoin_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.NoticeJoin_S2C
         * @static
         * @param {msg.INoticeJoin_S2C} message NoticeJoin_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NoticeJoin_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.playerData != null && message.hasOwnProperty("playerData"))
                $root.msg.PlayerData.encode(message.playerData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified NoticeJoin_S2C message, length delimited. Does not implicitly {@link msg.NoticeJoin_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.NoticeJoin_S2C
         * @static
         * @param {msg.INoticeJoin_S2C} message NoticeJoin_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NoticeJoin_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NoticeJoin_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.NoticeJoin_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.NoticeJoin_S2C} NoticeJoin_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NoticeJoin_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.NoticeJoin_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.playerData = $root.msg.PlayerData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a NoticeJoin_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.NoticeJoin_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.NoticeJoin_S2C} NoticeJoin_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NoticeJoin_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NoticeJoin_S2C message.
         * @function verify
         * @memberof msg.NoticeJoin_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NoticeJoin_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.playerData != null && message.hasOwnProperty("playerData")) {
                var error = $root.msg.PlayerData.verify(message.playerData);
                if (error)
                    return "playerData." + error;
            }
            return null;
        };

        /**
         * Creates a NoticeJoin_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.NoticeJoin_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.NoticeJoin_S2C} NoticeJoin_S2C
         */
        NoticeJoin_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.NoticeJoin_S2C)
                return object;
            var message = new $root.msg.NoticeJoin_S2C();
            if (object.playerData != null) {
                if (typeof object.playerData !== "object")
                    throw TypeError(".msg.NoticeJoin_S2C.playerData: object expected");
                message.playerData = $root.msg.PlayerData.fromObject(object.playerData);
            }
            return message;
        };

        /**
         * Creates a plain object from a NoticeJoin_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.NoticeJoin_S2C
         * @static
         * @param {msg.NoticeJoin_S2C} message NoticeJoin_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NoticeJoin_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.playerData = null;
            if (message.playerData != null && message.hasOwnProperty("playerData"))
                object.playerData = $root.msg.PlayerData.toObject(message.playerData, options);
            return object;
        };

        /**
         * Converts this NoticeJoin_S2C to JSON.
         * @function toJSON
         * @memberof msg.NoticeJoin_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NoticeJoin_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return NoticeJoin_S2C;
    })();

    msg.LeaveRoom_C2S = (function() {

        /**
         * Properties of a LeaveRoom_C2S.
         * @memberof msg
         * @interface ILeaveRoom_C2S
         */

        /**
         * Constructs a new LeaveRoom_C2S.
         * @memberof msg
         * @classdesc Represents a LeaveRoom_C2S.
         * @implements ILeaveRoom_C2S
         * @constructor
         * @param {msg.ILeaveRoom_C2S=} [properties] Properties to set
         */
        function LeaveRoom_C2S(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new LeaveRoom_C2S instance using the specified properties.
         * @function create
         * @memberof msg.LeaveRoom_C2S
         * @static
         * @param {msg.ILeaveRoom_C2S=} [properties] Properties to set
         * @returns {msg.LeaveRoom_C2S} LeaveRoom_C2S instance
         */
        LeaveRoom_C2S.create = function create(properties) {
            return new LeaveRoom_C2S(properties);
        };

        /**
         * Encodes the specified LeaveRoom_C2S message. Does not implicitly {@link msg.LeaveRoom_C2S.verify|verify} messages.
         * @function encode
         * @memberof msg.LeaveRoom_C2S
         * @static
         * @param {msg.ILeaveRoom_C2S} message LeaveRoom_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LeaveRoom_C2S.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified LeaveRoom_C2S message, length delimited. Does not implicitly {@link msg.LeaveRoom_C2S.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.LeaveRoom_C2S
         * @static
         * @param {msg.ILeaveRoom_C2S} message LeaveRoom_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LeaveRoom_C2S.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LeaveRoom_C2S message from the specified reader or buffer.
         * @function decode
         * @memberof msg.LeaveRoom_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.LeaveRoom_C2S} LeaveRoom_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LeaveRoom_C2S.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.LeaveRoom_C2S();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LeaveRoom_C2S message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.LeaveRoom_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.LeaveRoom_C2S} LeaveRoom_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LeaveRoom_C2S.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LeaveRoom_C2S message.
         * @function verify
         * @memberof msg.LeaveRoom_C2S
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LeaveRoom_C2S.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a LeaveRoom_C2S message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.LeaveRoom_C2S
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.LeaveRoom_C2S} LeaveRoom_C2S
         */
        LeaveRoom_C2S.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.LeaveRoom_C2S)
                return object;
            return new $root.msg.LeaveRoom_C2S();
        };

        /**
         * Creates a plain object from a LeaveRoom_C2S message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.LeaveRoom_C2S
         * @static
         * @param {msg.LeaveRoom_C2S} message LeaveRoom_C2S
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LeaveRoom_C2S.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this LeaveRoom_C2S to JSON.
         * @function toJSON
         * @memberof msg.LeaveRoom_C2S
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LeaveRoom_C2S.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LeaveRoom_C2S;
    })();

    msg.LeaveRoom_S2C = (function() {

        /**
         * Properties of a LeaveRoom_S2C.
         * @memberof msg
         * @interface ILeaveRoom_S2C
         * @property {msg.IPlayerData|null} [playerData] LeaveRoom_S2C playerData
         */

        /**
         * Constructs a new LeaveRoom_S2C.
         * @memberof msg
         * @classdesc Represents a LeaveRoom_S2C.
         * @implements ILeaveRoom_S2C
         * @constructor
         * @param {msg.ILeaveRoom_S2C=} [properties] Properties to set
         */
        function LeaveRoom_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LeaveRoom_S2C playerData.
         * @member {msg.IPlayerData|null|undefined} playerData
         * @memberof msg.LeaveRoom_S2C
         * @instance
         */
        LeaveRoom_S2C.prototype.playerData = null;

        /**
         * Creates a new LeaveRoom_S2C instance using the specified properties.
         * @function create
         * @memberof msg.LeaveRoom_S2C
         * @static
         * @param {msg.ILeaveRoom_S2C=} [properties] Properties to set
         * @returns {msg.LeaveRoom_S2C} LeaveRoom_S2C instance
         */
        LeaveRoom_S2C.create = function create(properties) {
            return new LeaveRoom_S2C(properties);
        };

        /**
         * Encodes the specified LeaveRoom_S2C message. Does not implicitly {@link msg.LeaveRoom_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.LeaveRoom_S2C
         * @static
         * @param {msg.ILeaveRoom_S2C} message LeaveRoom_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LeaveRoom_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.playerData != null && message.hasOwnProperty("playerData"))
                $root.msg.PlayerData.encode(message.playerData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified LeaveRoom_S2C message, length delimited. Does not implicitly {@link msg.LeaveRoom_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.LeaveRoom_S2C
         * @static
         * @param {msg.ILeaveRoom_S2C} message LeaveRoom_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LeaveRoom_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LeaveRoom_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.LeaveRoom_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.LeaveRoom_S2C} LeaveRoom_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LeaveRoom_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.LeaveRoom_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.playerData = $root.msg.PlayerData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LeaveRoom_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.LeaveRoom_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.LeaveRoom_S2C} LeaveRoom_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LeaveRoom_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LeaveRoom_S2C message.
         * @function verify
         * @memberof msg.LeaveRoom_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LeaveRoom_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.playerData != null && message.hasOwnProperty("playerData")) {
                var error = $root.msg.PlayerData.verify(message.playerData);
                if (error)
                    return "playerData." + error;
            }
            return null;
        };

        /**
         * Creates a LeaveRoom_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.LeaveRoom_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.LeaveRoom_S2C} LeaveRoom_S2C
         */
        LeaveRoom_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.LeaveRoom_S2C)
                return object;
            var message = new $root.msg.LeaveRoom_S2C();
            if (object.playerData != null) {
                if (typeof object.playerData !== "object")
                    throw TypeError(".msg.LeaveRoom_S2C.playerData: object expected");
                message.playerData = $root.msg.PlayerData.fromObject(object.playerData);
            }
            return message;
        };

        /**
         * Creates a plain object from a LeaveRoom_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.LeaveRoom_S2C
         * @static
         * @param {msg.LeaveRoom_S2C} message LeaveRoom_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LeaveRoom_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.playerData = null;
            if (message.playerData != null && message.hasOwnProperty("playerData"))
                object.playerData = $root.msg.PlayerData.toObject(message.playerData, options);
            return object;
        };

        /**
         * Converts this LeaveRoom_S2C to JSON.
         * @function toJSON
         * @memberof msg.LeaveRoom_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LeaveRoom_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LeaveRoom_S2C;
    })();

    msg.SitDown_C2S = (function() {

        /**
         * Properties of a SitDown_C2S.
         * @memberof msg
         * @interface ISitDown_C2S
         */

        /**
         * Constructs a new SitDown_C2S.
         * @memberof msg
         * @classdesc Represents a SitDown_C2S.
         * @implements ISitDown_C2S
         * @constructor
         * @param {msg.ISitDown_C2S=} [properties] Properties to set
         */
        function SitDown_C2S(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new SitDown_C2S instance using the specified properties.
         * @function create
         * @memberof msg.SitDown_C2S
         * @static
         * @param {msg.ISitDown_C2S=} [properties] Properties to set
         * @returns {msg.SitDown_C2S} SitDown_C2S instance
         */
        SitDown_C2S.create = function create(properties) {
            return new SitDown_C2S(properties);
        };

        /**
         * Encodes the specified SitDown_C2S message. Does not implicitly {@link msg.SitDown_C2S.verify|verify} messages.
         * @function encode
         * @memberof msg.SitDown_C2S
         * @static
         * @param {msg.ISitDown_C2S} message SitDown_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SitDown_C2S.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified SitDown_C2S message, length delimited. Does not implicitly {@link msg.SitDown_C2S.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.SitDown_C2S
         * @static
         * @param {msg.ISitDown_C2S} message SitDown_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SitDown_C2S.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SitDown_C2S message from the specified reader or buffer.
         * @function decode
         * @memberof msg.SitDown_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.SitDown_C2S} SitDown_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SitDown_C2S.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.SitDown_C2S();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SitDown_C2S message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.SitDown_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.SitDown_C2S} SitDown_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SitDown_C2S.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SitDown_C2S message.
         * @function verify
         * @memberof msg.SitDown_C2S
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SitDown_C2S.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a SitDown_C2S message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.SitDown_C2S
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.SitDown_C2S} SitDown_C2S
         */
        SitDown_C2S.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.SitDown_C2S)
                return object;
            return new $root.msg.SitDown_C2S();
        };

        /**
         * Creates a plain object from a SitDown_C2S message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.SitDown_C2S
         * @static
         * @param {msg.SitDown_C2S} message SitDown_C2S
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SitDown_C2S.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this SitDown_C2S to JSON.
         * @function toJSON
         * @memberof msg.SitDown_C2S
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SitDown_C2S.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SitDown_C2S;
    })();

    msg.SitDown_S2C = (function() {

        /**
         * Properties of a SitDown_S2C.
         * @memberof msg
         * @interface ISitDown_S2C
         * @property {msg.IPlayerData|null} [playerData] SitDown_S2C playerData
         * @property {msg.IRoomData|null} [roomData] SitDown_S2C roomData
         */

        /**
         * Constructs a new SitDown_S2C.
         * @memberof msg
         * @classdesc Represents a SitDown_S2C.
         * @implements ISitDown_S2C
         * @constructor
         * @param {msg.ISitDown_S2C=} [properties] Properties to set
         */
        function SitDown_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SitDown_S2C playerData.
         * @member {msg.IPlayerData|null|undefined} playerData
         * @memberof msg.SitDown_S2C
         * @instance
         */
        SitDown_S2C.prototype.playerData = null;

        /**
         * SitDown_S2C roomData.
         * @member {msg.IRoomData|null|undefined} roomData
         * @memberof msg.SitDown_S2C
         * @instance
         */
        SitDown_S2C.prototype.roomData = null;

        /**
         * Creates a new SitDown_S2C instance using the specified properties.
         * @function create
         * @memberof msg.SitDown_S2C
         * @static
         * @param {msg.ISitDown_S2C=} [properties] Properties to set
         * @returns {msg.SitDown_S2C} SitDown_S2C instance
         */
        SitDown_S2C.create = function create(properties) {
            return new SitDown_S2C(properties);
        };

        /**
         * Encodes the specified SitDown_S2C message. Does not implicitly {@link msg.SitDown_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.SitDown_S2C
         * @static
         * @param {msg.ISitDown_S2C} message SitDown_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SitDown_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.playerData != null && message.hasOwnProperty("playerData"))
                $root.msg.PlayerData.encode(message.playerData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                $root.msg.RoomData.encode(message.roomData, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SitDown_S2C message, length delimited. Does not implicitly {@link msg.SitDown_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.SitDown_S2C
         * @static
         * @param {msg.ISitDown_S2C} message SitDown_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SitDown_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SitDown_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.SitDown_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.SitDown_S2C} SitDown_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SitDown_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.SitDown_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.playerData = $root.msg.PlayerData.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.roomData = $root.msg.RoomData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SitDown_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.SitDown_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.SitDown_S2C} SitDown_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SitDown_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SitDown_S2C message.
         * @function verify
         * @memberof msg.SitDown_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SitDown_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.playerData != null && message.hasOwnProperty("playerData")) {
                var error = $root.msg.PlayerData.verify(message.playerData);
                if (error)
                    return "playerData." + error;
            }
            if (message.roomData != null && message.hasOwnProperty("roomData")) {
                var error = $root.msg.RoomData.verify(message.roomData);
                if (error)
                    return "roomData." + error;
            }
            return null;
        };

        /**
         * Creates a SitDown_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.SitDown_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.SitDown_S2C} SitDown_S2C
         */
        SitDown_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.SitDown_S2C)
                return object;
            var message = new $root.msg.SitDown_S2C();
            if (object.playerData != null) {
                if (typeof object.playerData !== "object")
                    throw TypeError(".msg.SitDown_S2C.playerData: object expected");
                message.playerData = $root.msg.PlayerData.fromObject(object.playerData);
            }
            if (object.roomData != null) {
                if (typeof object.roomData !== "object")
                    throw TypeError(".msg.SitDown_S2C.roomData: object expected");
                message.roomData = $root.msg.RoomData.fromObject(object.roomData);
            }
            return message;
        };

        /**
         * Creates a plain object from a SitDown_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.SitDown_S2C
         * @static
         * @param {msg.SitDown_S2C} message SitDown_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SitDown_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.playerData = null;
                object.roomData = null;
            }
            if (message.playerData != null && message.hasOwnProperty("playerData"))
                object.playerData = $root.msg.PlayerData.toObject(message.playerData, options);
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                object.roomData = $root.msg.RoomData.toObject(message.roomData, options);
            return object;
        };

        /**
         * Converts this SitDown_S2C to JSON.
         * @function toJSON
         * @memberof msg.SitDown_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SitDown_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SitDown_S2C;
    })();

    msg.StandUp_C2S = (function() {

        /**
         * Properties of a StandUp_C2S.
         * @memberof msg
         * @interface IStandUp_C2S
         */

        /**
         * Constructs a new StandUp_C2S.
         * @memberof msg
         * @classdesc Represents a StandUp_C2S.
         * @implements IStandUp_C2S
         * @constructor
         * @param {msg.IStandUp_C2S=} [properties] Properties to set
         */
        function StandUp_C2S(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new StandUp_C2S instance using the specified properties.
         * @function create
         * @memberof msg.StandUp_C2S
         * @static
         * @param {msg.IStandUp_C2S=} [properties] Properties to set
         * @returns {msg.StandUp_C2S} StandUp_C2S instance
         */
        StandUp_C2S.create = function create(properties) {
            return new StandUp_C2S(properties);
        };

        /**
         * Encodes the specified StandUp_C2S message. Does not implicitly {@link msg.StandUp_C2S.verify|verify} messages.
         * @function encode
         * @memberof msg.StandUp_C2S
         * @static
         * @param {msg.IStandUp_C2S} message StandUp_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StandUp_C2S.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified StandUp_C2S message, length delimited. Does not implicitly {@link msg.StandUp_C2S.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.StandUp_C2S
         * @static
         * @param {msg.IStandUp_C2S} message StandUp_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StandUp_C2S.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StandUp_C2S message from the specified reader or buffer.
         * @function decode
         * @memberof msg.StandUp_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.StandUp_C2S} StandUp_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StandUp_C2S.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.StandUp_C2S();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StandUp_C2S message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.StandUp_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.StandUp_C2S} StandUp_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StandUp_C2S.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StandUp_C2S message.
         * @function verify
         * @memberof msg.StandUp_C2S
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StandUp_C2S.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a StandUp_C2S message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.StandUp_C2S
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.StandUp_C2S} StandUp_C2S
         */
        StandUp_C2S.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.StandUp_C2S)
                return object;
            return new $root.msg.StandUp_C2S();
        };

        /**
         * Creates a plain object from a StandUp_C2S message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.StandUp_C2S
         * @static
         * @param {msg.StandUp_C2S} message StandUp_C2S
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StandUp_C2S.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this StandUp_C2S to JSON.
         * @function toJSON
         * @memberof msg.StandUp_C2S
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StandUp_C2S.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StandUp_C2S;
    })();

    msg.StandUp_S2C = (function() {

        /**
         * Properties of a StandUp_S2C.
         * @memberof msg
         * @interface IStandUp_S2C
         * @property {msg.IPlayerData|null} [playerData] StandUp_S2C playerData
         */

        /**
         * Constructs a new StandUp_S2C.
         * @memberof msg
         * @classdesc Represents a StandUp_S2C.
         * @implements IStandUp_S2C
         * @constructor
         * @param {msg.IStandUp_S2C=} [properties] Properties to set
         */
        function StandUp_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StandUp_S2C playerData.
         * @member {msg.IPlayerData|null|undefined} playerData
         * @memberof msg.StandUp_S2C
         * @instance
         */
        StandUp_S2C.prototype.playerData = null;

        /**
         * Creates a new StandUp_S2C instance using the specified properties.
         * @function create
         * @memberof msg.StandUp_S2C
         * @static
         * @param {msg.IStandUp_S2C=} [properties] Properties to set
         * @returns {msg.StandUp_S2C} StandUp_S2C instance
         */
        StandUp_S2C.create = function create(properties) {
            return new StandUp_S2C(properties);
        };

        /**
         * Encodes the specified StandUp_S2C message. Does not implicitly {@link msg.StandUp_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.StandUp_S2C
         * @static
         * @param {msg.IStandUp_S2C} message StandUp_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StandUp_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.playerData != null && message.hasOwnProperty("playerData"))
                $root.msg.PlayerData.encode(message.playerData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified StandUp_S2C message, length delimited. Does not implicitly {@link msg.StandUp_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.StandUp_S2C
         * @static
         * @param {msg.IStandUp_S2C} message StandUp_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StandUp_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StandUp_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.StandUp_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.StandUp_S2C} StandUp_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StandUp_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.StandUp_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.playerData = $root.msg.PlayerData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StandUp_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.StandUp_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.StandUp_S2C} StandUp_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StandUp_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StandUp_S2C message.
         * @function verify
         * @memberof msg.StandUp_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StandUp_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.playerData != null && message.hasOwnProperty("playerData")) {
                var error = $root.msg.PlayerData.verify(message.playerData);
                if (error)
                    return "playerData." + error;
            }
            return null;
        };

        /**
         * Creates a StandUp_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.StandUp_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.StandUp_S2C} StandUp_S2C
         */
        StandUp_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.StandUp_S2C)
                return object;
            var message = new $root.msg.StandUp_S2C();
            if (object.playerData != null) {
                if (typeof object.playerData !== "object")
                    throw TypeError(".msg.StandUp_S2C.playerData: object expected");
                message.playerData = $root.msg.PlayerData.fromObject(object.playerData);
            }
            return message;
        };

        /**
         * Creates a plain object from a StandUp_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.StandUp_S2C
         * @static
         * @param {msg.StandUp_S2C} message StandUp_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StandUp_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.playerData = null;
            if (message.playerData != null && message.hasOwnProperty("playerData"))
                object.playerData = $root.msg.PlayerData.toObject(message.playerData, options);
            return object;
        };

        /**
         * Converts this StandUp_S2C to JSON.
         * @function toJSON
         * @memberof msg.StandUp_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StandUp_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StandUp_S2C;
    })();

    msg.PlayerAction_C2S = (function() {

        /**
         * Properties of a PlayerAction_C2S.
         * @memberof msg
         * @interface IPlayerAction_C2S
         * @property {number|null} [betAmount] PlayerAction_C2S betAmount
         * @property {msg.ActionStatus|null} [action] PlayerAction_C2S action
         */

        /**
         * Constructs a new PlayerAction_C2S.
         * @memberof msg
         * @classdesc Represents a PlayerAction_C2S.
         * @implements IPlayerAction_C2S
         * @constructor
         * @param {msg.IPlayerAction_C2S=} [properties] Properties to set
         */
        function PlayerAction_C2S(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerAction_C2S betAmount.
         * @member {number} betAmount
         * @memberof msg.PlayerAction_C2S
         * @instance
         */
        PlayerAction_C2S.prototype.betAmount = 0;

        /**
         * PlayerAction_C2S action.
         * @member {msg.ActionStatus} action
         * @memberof msg.PlayerAction_C2S
         * @instance
         */
        PlayerAction_C2S.prototype.action = 0;

        /**
         * Creates a new PlayerAction_C2S instance using the specified properties.
         * @function create
         * @memberof msg.PlayerAction_C2S
         * @static
         * @param {msg.IPlayerAction_C2S=} [properties] Properties to set
         * @returns {msg.PlayerAction_C2S} PlayerAction_C2S instance
         */
        PlayerAction_C2S.create = function create(properties) {
            return new PlayerAction_C2S(properties);
        };

        /**
         * Encodes the specified PlayerAction_C2S message. Does not implicitly {@link msg.PlayerAction_C2S.verify|verify} messages.
         * @function encode
         * @memberof msg.PlayerAction_C2S
         * @static
         * @param {msg.IPlayerAction_C2S} message PlayerAction_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerAction_C2S.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.betAmount != null && message.hasOwnProperty("betAmount"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.betAmount);
            if (message.action != null && message.hasOwnProperty("action"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.action);
            return writer;
        };

        /**
         * Encodes the specified PlayerAction_C2S message, length delimited. Does not implicitly {@link msg.PlayerAction_C2S.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.PlayerAction_C2S
         * @static
         * @param {msg.IPlayerAction_C2S} message PlayerAction_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerAction_C2S.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PlayerAction_C2S message from the specified reader or buffer.
         * @function decode
         * @memberof msg.PlayerAction_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.PlayerAction_C2S} PlayerAction_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerAction_C2S.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.PlayerAction_C2S();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.betAmount = reader.double();
                    break;
                case 2:
                    message.action = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PlayerAction_C2S message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.PlayerAction_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.PlayerAction_C2S} PlayerAction_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerAction_C2S.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerAction_C2S message.
         * @function verify
         * @memberof msg.PlayerAction_C2S
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerAction_C2S.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.betAmount != null && message.hasOwnProperty("betAmount"))
                if (typeof message.betAmount !== "number")
                    return "betAmount: number expected";
            if (message.action != null && message.hasOwnProperty("action"))
                switch (message.action) {
                default:
                    return "action: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
            return null;
        };

        /**
         * Creates a PlayerAction_C2S message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.PlayerAction_C2S
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.PlayerAction_C2S} PlayerAction_C2S
         */
        PlayerAction_C2S.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.PlayerAction_C2S)
                return object;
            var message = new $root.msg.PlayerAction_C2S();
            if (object.betAmount != null)
                message.betAmount = Number(object.betAmount);
            switch (object.action) {
            case "WAITING":
            case 0:
                message.action = 0;
                break;
            case "RAISE":
            case 1:
                message.action = 1;
                break;
            case "CALL":
            case 2:
                message.action = 2;
                break;
            case "CHECK":
            case 3:
                message.action = 3;
                break;
            case "FOLD":
            case 4:
                message.action = 4;
                break;
            case "ALLIN":
            case 5:
                message.action = 5;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a PlayerAction_C2S message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.PlayerAction_C2S
         * @static
         * @param {msg.PlayerAction_C2S} message PlayerAction_C2S
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerAction_C2S.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.betAmount = 0;
                object.action = options.enums === String ? "WAITING" : 0;
            }
            if (message.betAmount != null && message.hasOwnProperty("betAmount"))
                object.betAmount = options.json && !isFinite(message.betAmount) ? String(message.betAmount) : message.betAmount;
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = options.enums === String ? $root.msg.ActionStatus[message.action] : message.action;
            return object;
        };

        /**
         * Converts this PlayerAction_C2S to JSON.
         * @function toJSON
         * @memberof msg.PlayerAction_C2S
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerAction_C2S.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PlayerAction_C2S;
    })();

    msg.PlayerAction_S2C = (function() {

        /**
         * Properties of a PlayerAction_S2C.
         * @memberof msg
         * @interface IPlayerAction_S2C
         * @property {string|null} [Id] PlayerAction_S2C Id
         * @property {number|null} [chair] PlayerAction_S2C chair
         * @property {number|null} [chips] PlayerAction_S2C chips
         * @property {number|null} [downBet] PlayerAction_S2C downBet
         * @property {number|null} [preChips] PlayerAction_S2C preChips
         * @property {number|null} [potMoney] PlayerAction_S2C potMoney
         * @property {msg.ActionStatus|null} [actionType] PlayerAction_S2C actionType
         */

        /**
         * Constructs a new PlayerAction_S2C.
         * @memberof msg
         * @classdesc Represents a PlayerAction_S2C.
         * @implements IPlayerAction_S2C
         * @constructor
         * @param {msg.IPlayerAction_S2C=} [properties] Properties to set
         */
        function PlayerAction_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerAction_S2C Id.
         * @member {string} Id
         * @memberof msg.PlayerAction_S2C
         * @instance
         */
        PlayerAction_S2C.prototype.Id = "";

        /**
         * PlayerAction_S2C chair.
         * @member {number} chair
         * @memberof msg.PlayerAction_S2C
         * @instance
         */
        PlayerAction_S2C.prototype.chair = 0;

        /**
         * PlayerAction_S2C chips.
         * @member {number} chips
         * @memberof msg.PlayerAction_S2C
         * @instance
         */
        PlayerAction_S2C.prototype.chips = 0;

        /**
         * PlayerAction_S2C downBet.
         * @member {number} downBet
         * @memberof msg.PlayerAction_S2C
         * @instance
         */
        PlayerAction_S2C.prototype.downBet = 0;

        /**
         * PlayerAction_S2C preChips.
         * @member {number} preChips
         * @memberof msg.PlayerAction_S2C
         * @instance
         */
        PlayerAction_S2C.prototype.preChips = 0;

        /**
         * PlayerAction_S2C potMoney.
         * @member {number} potMoney
         * @memberof msg.PlayerAction_S2C
         * @instance
         */
        PlayerAction_S2C.prototype.potMoney = 0;

        /**
         * PlayerAction_S2C actionType.
         * @member {msg.ActionStatus} actionType
         * @memberof msg.PlayerAction_S2C
         * @instance
         */
        PlayerAction_S2C.prototype.actionType = 0;

        /**
         * Creates a new PlayerAction_S2C instance using the specified properties.
         * @function create
         * @memberof msg.PlayerAction_S2C
         * @static
         * @param {msg.IPlayerAction_S2C=} [properties] Properties to set
         * @returns {msg.PlayerAction_S2C} PlayerAction_S2C instance
         */
        PlayerAction_S2C.create = function create(properties) {
            return new PlayerAction_S2C(properties);
        };

        /**
         * Encodes the specified PlayerAction_S2C message. Does not implicitly {@link msg.PlayerAction_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.PlayerAction_S2C
         * @static
         * @param {msg.IPlayerAction_S2C} message PlayerAction_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerAction_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.Id != null && message.hasOwnProperty("Id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.Id);
            if (message.chair != null && message.hasOwnProperty("chair"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.chair);
            if (message.chips != null && message.hasOwnProperty("chips"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.chips);
            if (message.downBet != null && message.hasOwnProperty("downBet"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.downBet);
            if (message.preChips != null && message.hasOwnProperty("preChips"))
                writer.uint32(/* id 5, wireType 1 =*/41).double(message.preChips);
            if (message.potMoney != null && message.hasOwnProperty("potMoney"))
                writer.uint32(/* id 6, wireType 1 =*/49).double(message.potMoney);
            if (message.actionType != null && message.hasOwnProperty("actionType"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.actionType);
            return writer;
        };

        /**
         * Encodes the specified PlayerAction_S2C message, length delimited. Does not implicitly {@link msg.PlayerAction_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.PlayerAction_S2C
         * @static
         * @param {msg.IPlayerAction_S2C} message PlayerAction_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerAction_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PlayerAction_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.PlayerAction_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.PlayerAction_S2C} PlayerAction_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerAction_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.PlayerAction_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.Id = reader.string();
                    break;
                case 2:
                    message.chair = reader.int32();
                    break;
                case 3:
                    message.chips = reader.double();
                    break;
                case 4:
                    message.downBet = reader.double();
                    break;
                case 5:
                    message.preChips = reader.double();
                    break;
                case 6:
                    message.potMoney = reader.double();
                    break;
                case 7:
                    message.actionType = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PlayerAction_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.PlayerAction_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.PlayerAction_S2C} PlayerAction_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerAction_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerAction_S2C message.
         * @function verify
         * @memberof msg.PlayerAction_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerAction_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.Id != null && message.hasOwnProperty("Id"))
                if (!$util.isString(message.Id))
                    return "Id: string expected";
            if (message.chair != null && message.hasOwnProperty("chair"))
                if (!$util.isInteger(message.chair))
                    return "chair: integer expected";
            if (message.chips != null && message.hasOwnProperty("chips"))
                if (typeof message.chips !== "number")
                    return "chips: number expected";
            if (message.downBet != null && message.hasOwnProperty("downBet"))
                if (typeof message.downBet !== "number")
                    return "downBet: number expected";
            if (message.preChips != null && message.hasOwnProperty("preChips"))
                if (typeof message.preChips !== "number")
                    return "preChips: number expected";
            if (message.potMoney != null && message.hasOwnProperty("potMoney"))
                if (typeof message.potMoney !== "number")
                    return "potMoney: number expected";
            if (message.actionType != null && message.hasOwnProperty("actionType"))
                switch (message.actionType) {
                default:
                    return "actionType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
            return null;
        };

        /**
         * Creates a PlayerAction_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.PlayerAction_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.PlayerAction_S2C} PlayerAction_S2C
         */
        PlayerAction_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.PlayerAction_S2C)
                return object;
            var message = new $root.msg.PlayerAction_S2C();
            if (object.Id != null)
                message.Id = String(object.Id);
            if (object.chair != null)
                message.chair = object.chair | 0;
            if (object.chips != null)
                message.chips = Number(object.chips);
            if (object.downBet != null)
                message.downBet = Number(object.downBet);
            if (object.preChips != null)
                message.preChips = Number(object.preChips);
            if (object.potMoney != null)
                message.potMoney = Number(object.potMoney);
            switch (object.actionType) {
            case "WAITING":
            case 0:
                message.actionType = 0;
                break;
            case "RAISE":
            case 1:
                message.actionType = 1;
                break;
            case "CALL":
            case 2:
                message.actionType = 2;
                break;
            case "CHECK":
            case 3:
                message.actionType = 3;
                break;
            case "FOLD":
            case 4:
                message.actionType = 4;
                break;
            case "ALLIN":
            case 5:
                message.actionType = 5;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a PlayerAction_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.PlayerAction_S2C
         * @static
         * @param {msg.PlayerAction_S2C} message PlayerAction_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerAction_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.Id = "";
                object.chair = 0;
                object.chips = 0;
                object.downBet = 0;
                object.preChips = 0;
                object.potMoney = 0;
                object.actionType = options.enums === String ? "WAITING" : 0;
            }
            if (message.Id != null && message.hasOwnProperty("Id"))
                object.Id = message.Id;
            if (message.chair != null && message.hasOwnProperty("chair"))
                object.chair = message.chair;
            if (message.chips != null && message.hasOwnProperty("chips"))
                object.chips = options.json && !isFinite(message.chips) ? String(message.chips) : message.chips;
            if (message.downBet != null && message.hasOwnProperty("downBet"))
                object.downBet = options.json && !isFinite(message.downBet) ? String(message.downBet) : message.downBet;
            if (message.preChips != null && message.hasOwnProperty("preChips"))
                object.preChips = options.json && !isFinite(message.preChips) ? String(message.preChips) : message.preChips;
            if (message.potMoney != null && message.hasOwnProperty("potMoney"))
                object.potMoney = options.json && !isFinite(message.potMoney) ? String(message.potMoney) : message.potMoney;
            if (message.actionType != null && message.hasOwnProperty("actionType"))
                object.actionType = options.enums === String ? $root.msg.ActionStatus[message.actionType] : message.actionType;
            return object;
        };

        /**
         * Converts this PlayerAction_S2C to JSON.
         * @function toJSON
         * @memberof msg.PlayerAction_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerAction_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PlayerAction_S2C;
    })();

    msg.PlayerActionChange_S2C = (function() {

        /**
         * Properties of a PlayerActionChange_S2C.
         * @memberof msg
         * @interface IPlayerActionChange_S2C
         * @property {msg.IRoomData|null} [roomData] PlayerActionChange_S2C roomData
         */

        /**
         * Constructs a new PlayerActionChange_S2C.
         * @memberof msg
         * @classdesc Represents a PlayerActionChange_S2C.
         * @implements IPlayerActionChange_S2C
         * @constructor
         * @param {msg.IPlayerActionChange_S2C=} [properties] Properties to set
         */
        function PlayerActionChange_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerActionChange_S2C roomData.
         * @member {msg.IRoomData|null|undefined} roomData
         * @memberof msg.PlayerActionChange_S2C
         * @instance
         */
        PlayerActionChange_S2C.prototype.roomData = null;

        /**
         * Creates a new PlayerActionChange_S2C instance using the specified properties.
         * @function create
         * @memberof msg.PlayerActionChange_S2C
         * @static
         * @param {msg.IPlayerActionChange_S2C=} [properties] Properties to set
         * @returns {msg.PlayerActionChange_S2C} PlayerActionChange_S2C instance
         */
        PlayerActionChange_S2C.create = function create(properties) {
            return new PlayerActionChange_S2C(properties);
        };

        /**
         * Encodes the specified PlayerActionChange_S2C message. Does not implicitly {@link msg.PlayerActionChange_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.PlayerActionChange_S2C
         * @static
         * @param {msg.IPlayerActionChange_S2C} message PlayerActionChange_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerActionChange_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                $root.msg.RoomData.encode(message.roomData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PlayerActionChange_S2C message, length delimited. Does not implicitly {@link msg.PlayerActionChange_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.PlayerActionChange_S2C
         * @static
         * @param {msg.IPlayerActionChange_S2C} message PlayerActionChange_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerActionChange_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PlayerActionChange_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.PlayerActionChange_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.PlayerActionChange_S2C} PlayerActionChange_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerActionChange_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.PlayerActionChange_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomData = $root.msg.RoomData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PlayerActionChange_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.PlayerActionChange_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.PlayerActionChange_S2C} PlayerActionChange_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerActionChange_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerActionChange_S2C message.
         * @function verify
         * @memberof msg.PlayerActionChange_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerActionChange_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomData != null && message.hasOwnProperty("roomData")) {
                var error = $root.msg.RoomData.verify(message.roomData);
                if (error)
                    return "roomData." + error;
            }
            return null;
        };

        /**
         * Creates a PlayerActionChange_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.PlayerActionChange_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.PlayerActionChange_S2C} PlayerActionChange_S2C
         */
        PlayerActionChange_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.PlayerActionChange_S2C)
                return object;
            var message = new $root.msg.PlayerActionChange_S2C();
            if (object.roomData != null) {
                if (typeof object.roomData !== "object")
                    throw TypeError(".msg.PlayerActionChange_S2C.roomData: object expected");
                message.roomData = $root.msg.RoomData.fromObject(object.roomData);
            }
            return message;
        };

        /**
         * Creates a plain object from a PlayerActionChange_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.PlayerActionChange_S2C
         * @static
         * @param {msg.PlayerActionChange_S2C} message PlayerActionChange_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerActionChange_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.roomData = null;
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                object.roomData = $root.msg.RoomData.toObject(message.roomData, options);
            return object;
        };

        /**
         * Converts this PlayerActionChange_S2C to JSON.
         * @function toJSON
         * @memberof msg.PlayerActionChange_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerActionChange_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PlayerActionChange_S2C;
    })();

    msg.AddChips_C2S = (function() {

        /**
         * Properties of an AddChips_C2S.
         * @memberof msg
         * @interface IAddChips_C2S
         * @property {number|null} [addChips] AddChips_C2S addChips
         * @property {number|null} [sysBuyChips] AddChips_C2S sysBuyChips
         */

        /**
         * Constructs a new AddChips_C2S.
         * @memberof msg
         * @classdesc Represents an AddChips_C2S.
         * @implements IAddChips_C2S
         * @constructor
         * @param {msg.IAddChips_C2S=} [properties] Properties to set
         */
        function AddChips_C2S(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AddChips_C2S addChips.
         * @member {number} addChips
         * @memberof msg.AddChips_C2S
         * @instance
         */
        AddChips_C2S.prototype.addChips = 0;

        /**
         * AddChips_C2S sysBuyChips.
         * @member {number} sysBuyChips
         * @memberof msg.AddChips_C2S
         * @instance
         */
        AddChips_C2S.prototype.sysBuyChips = 0;

        /**
         * Creates a new AddChips_C2S instance using the specified properties.
         * @function create
         * @memberof msg.AddChips_C2S
         * @static
         * @param {msg.IAddChips_C2S=} [properties] Properties to set
         * @returns {msg.AddChips_C2S} AddChips_C2S instance
         */
        AddChips_C2S.create = function create(properties) {
            return new AddChips_C2S(properties);
        };

        /**
         * Encodes the specified AddChips_C2S message. Does not implicitly {@link msg.AddChips_C2S.verify|verify} messages.
         * @function encode
         * @memberof msg.AddChips_C2S
         * @static
         * @param {msg.IAddChips_C2S} message AddChips_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddChips_C2S.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.addChips != null && message.hasOwnProperty("addChips"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.addChips);
            if (message.sysBuyChips != null && message.hasOwnProperty("sysBuyChips"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.sysBuyChips);
            return writer;
        };

        /**
         * Encodes the specified AddChips_C2S message, length delimited. Does not implicitly {@link msg.AddChips_C2S.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.AddChips_C2S
         * @static
         * @param {msg.IAddChips_C2S} message AddChips_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddChips_C2S.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AddChips_C2S message from the specified reader or buffer.
         * @function decode
         * @memberof msg.AddChips_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.AddChips_C2S} AddChips_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddChips_C2S.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.AddChips_C2S();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.addChips = reader.double();
                    break;
                case 2:
                    message.sysBuyChips = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AddChips_C2S message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.AddChips_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.AddChips_C2S} AddChips_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddChips_C2S.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AddChips_C2S message.
         * @function verify
         * @memberof msg.AddChips_C2S
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AddChips_C2S.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.addChips != null && message.hasOwnProperty("addChips"))
                if (typeof message.addChips !== "number")
                    return "addChips: number expected";
            if (message.sysBuyChips != null && message.hasOwnProperty("sysBuyChips"))
                if (!$util.isInteger(message.sysBuyChips))
                    return "sysBuyChips: integer expected";
            return null;
        };

        /**
         * Creates an AddChips_C2S message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.AddChips_C2S
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.AddChips_C2S} AddChips_C2S
         */
        AddChips_C2S.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.AddChips_C2S)
                return object;
            var message = new $root.msg.AddChips_C2S();
            if (object.addChips != null)
                message.addChips = Number(object.addChips);
            if (object.sysBuyChips != null)
                message.sysBuyChips = object.sysBuyChips | 0;
            return message;
        };

        /**
         * Creates a plain object from an AddChips_C2S message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.AddChips_C2S
         * @static
         * @param {msg.AddChips_C2S} message AddChips_C2S
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AddChips_C2S.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.addChips = 0;
                object.sysBuyChips = 0;
            }
            if (message.addChips != null && message.hasOwnProperty("addChips"))
                object.addChips = options.json && !isFinite(message.addChips) ? String(message.addChips) : message.addChips;
            if (message.sysBuyChips != null && message.hasOwnProperty("sysBuyChips"))
                object.sysBuyChips = message.sysBuyChips;
            return object;
        };

        /**
         * Converts this AddChips_C2S to JSON.
         * @function toJSON
         * @memberof msg.AddChips_C2S
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AddChips_C2S.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AddChips_C2S;
    })();

    msg.AddChips_S2C = (function() {

        /**
         * Properties of an AddChips_S2C.
         * @memberof msg
         * @interface IAddChips_S2C
         * @property {number|null} [chair] AddChips_S2C chair
         * @property {number|null} [addChips] AddChips_S2C addChips
         * @property {number|null} [chips] AddChips_S2C chips
         * @property {number|null} [roomChips] AddChips_S2C roomChips
         * @property {number|null} [sysBuyChips] AddChips_S2C sysBuyChips
         */

        /**
         * Constructs a new AddChips_S2C.
         * @memberof msg
         * @classdesc Represents an AddChips_S2C.
         * @implements IAddChips_S2C
         * @constructor
         * @param {msg.IAddChips_S2C=} [properties] Properties to set
         */
        function AddChips_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AddChips_S2C chair.
         * @member {number} chair
         * @memberof msg.AddChips_S2C
         * @instance
         */
        AddChips_S2C.prototype.chair = 0;

        /**
         * AddChips_S2C addChips.
         * @member {number} addChips
         * @memberof msg.AddChips_S2C
         * @instance
         */
        AddChips_S2C.prototype.addChips = 0;

        /**
         * AddChips_S2C chips.
         * @member {number} chips
         * @memberof msg.AddChips_S2C
         * @instance
         */
        AddChips_S2C.prototype.chips = 0;

        /**
         * AddChips_S2C roomChips.
         * @member {number} roomChips
         * @memberof msg.AddChips_S2C
         * @instance
         */
        AddChips_S2C.prototype.roomChips = 0;

        /**
         * AddChips_S2C sysBuyChips.
         * @member {number} sysBuyChips
         * @memberof msg.AddChips_S2C
         * @instance
         */
        AddChips_S2C.prototype.sysBuyChips = 0;

        /**
         * Creates a new AddChips_S2C instance using the specified properties.
         * @function create
         * @memberof msg.AddChips_S2C
         * @static
         * @param {msg.IAddChips_S2C=} [properties] Properties to set
         * @returns {msg.AddChips_S2C} AddChips_S2C instance
         */
        AddChips_S2C.create = function create(properties) {
            return new AddChips_S2C(properties);
        };

        /**
         * Encodes the specified AddChips_S2C message. Does not implicitly {@link msg.AddChips_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.AddChips_S2C
         * @static
         * @param {msg.IAddChips_S2C} message AddChips_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddChips_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.chair != null && message.hasOwnProperty("chair"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.chair);
            if (message.addChips != null && message.hasOwnProperty("addChips"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.addChips);
            if (message.chips != null && message.hasOwnProperty("chips"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.chips);
            if (message.roomChips != null && message.hasOwnProperty("roomChips"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.roomChips);
            if (message.sysBuyChips != null && message.hasOwnProperty("sysBuyChips"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.sysBuyChips);
            return writer;
        };

        /**
         * Encodes the specified AddChips_S2C message, length delimited. Does not implicitly {@link msg.AddChips_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.AddChips_S2C
         * @static
         * @param {msg.IAddChips_S2C} message AddChips_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddChips_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AddChips_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.AddChips_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.AddChips_S2C} AddChips_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddChips_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.AddChips_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.chair = reader.int32();
                    break;
                case 2:
                    message.addChips = reader.double();
                    break;
                case 3:
                    message.chips = reader.double();
                    break;
                case 4:
                    message.roomChips = reader.double();
                    break;
                case 5:
                    message.sysBuyChips = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AddChips_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.AddChips_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.AddChips_S2C} AddChips_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddChips_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AddChips_S2C message.
         * @function verify
         * @memberof msg.AddChips_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AddChips_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.chair != null && message.hasOwnProperty("chair"))
                if (!$util.isInteger(message.chair))
                    return "chair: integer expected";
            if (message.addChips != null && message.hasOwnProperty("addChips"))
                if (typeof message.addChips !== "number")
                    return "addChips: number expected";
            if (message.chips != null && message.hasOwnProperty("chips"))
                if (typeof message.chips !== "number")
                    return "chips: number expected";
            if (message.roomChips != null && message.hasOwnProperty("roomChips"))
                if (typeof message.roomChips !== "number")
                    return "roomChips: number expected";
            if (message.sysBuyChips != null && message.hasOwnProperty("sysBuyChips"))
                if (!$util.isInteger(message.sysBuyChips))
                    return "sysBuyChips: integer expected";
            return null;
        };

        /**
         * Creates an AddChips_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.AddChips_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.AddChips_S2C} AddChips_S2C
         */
        AddChips_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.AddChips_S2C)
                return object;
            var message = new $root.msg.AddChips_S2C();
            if (object.chair != null)
                message.chair = object.chair | 0;
            if (object.addChips != null)
                message.addChips = Number(object.addChips);
            if (object.chips != null)
                message.chips = Number(object.chips);
            if (object.roomChips != null)
                message.roomChips = Number(object.roomChips);
            if (object.sysBuyChips != null)
                message.sysBuyChips = object.sysBuyChips | 0;
            return message;
        };

        /**
         * Creates a plain object from an AddChips_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.AddChips_S2C
         * @static
         * @param {msg.AddChips_S2C} message AddChips_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AddChips_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.chair = 0;
                object.addChips = 0;
                object.chips = 0;
                object.roomChips = 0;
                object.sysBuyChips = 0;
            }
            if (message.chair != null && message.hasOwnProperty("chair"))
                object.chair = message.chair;
            if (message.addChips != null && message.hasOwnProperty("addChips"))
                object.addChips = options.json && !isFinite(message.addChips) ? String(message.addChips) : message.addChips;
            if (message.chips != null && message.hasOwnProperty("chips"))
                object.chips = options.json && !isFinite(message.chips) ? String(message.chips) : message.chips;
            if (message.roomChips != null && message.hasOwnProperty("roomChips"))
                object.roomChips = options.json && !isFinite(message.roomChips) ? String(message.roomChips) : message.roomChips;
            if (message.sysBuyChips != null && message.hasOwnProperty("sysBuyChips"))
                object.sysBuyChips = message.sysBuyChips;
            return object;
        };

        /**
         * Converts this AddChips_S2C to JSON.
         * @function toJSON
         * @memberof msg.AddChips_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AddChips_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AddChips_S2C;
    })();

    msg.GameStepChange_S2C = (function() {

        /**
         * Properties of a GameStepChange_S2C.
         * @memberof msg
         * @interface IGameStepChange_S2C
         * @property {msg.IRoomData|null} [roomData] GameStepChange_S2C roomData
         */

        /**
         * Constructs a new GameStepChange_S2C.
         * @memberof msg
         * @classdesc Represents a GameStepChange_S2C.
         * @implements IGameStepChange_S2C
         * @constructor
         * @param {msg.IGameStepChange_S2C=} [properties] Properties to set
         */
        function GameStepChange_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameStepChange_S2C roomData.
         * @member {msg.IRoomData|null|undefined} roomData
         * @memberof msg.GameStepChange_S2C
         * @instance
         */
        GameStepChange_S2C.prototype.roomData = null;

        /**
         * Creates a new GameStepChange_S2C instance using the specified properties.
         * @function create
         * @memberof msg.GameStepChange_S2C
         * @static
         * @param {msg.IGameStepChange_S2C=} [properties] Properties to set
         * @returns {msg.GameStepChange_S2C} GameStepChange_S2C instance
         */
        GameStepChange_S2C.create = function create(properties) {
            return new GameStepChange_S2C(properties);
        };

        /**
         * Encodes the specified GameStepChange_S2C message. Does not implicitly {@link msg.GameStepChange_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.GameStepChange_S2C
         * @static
         * @param {msg.IGameStepChange_S2C} message GameStepChange_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameStepChange_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                $root.msg.RoomData.encode(message.roomData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GameStepChange_S2C message, length delimited. Does not implicitly {@link msg.GameStepChange_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.GameStepChange_S2C
         * @static
         * @param {msg.IGameStepChange_S2C} message GameStepChange_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameStepChange_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameStepChange_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.GameStepChange_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.GameStepChange_S2C} GameStepChange_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameStepChange_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.GameStepChange_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomData = $root.msg.RoomData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameStepChange_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.GameStepChange_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.GameStepChange_S2C} GameStepChange_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameStepChange_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameStepChange_S2C message.
         * @function verify
         * @memberof msg.GameStepChange_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameStepChange_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomData != null && message.hasOwnProperty("roomData")) {
                var error = $root.msg.RoomData.verify(message.roomData);
                if (error)
                    return "roomData." + error;
            }
            return null;
        };

        /**
         * Creates a GameStepChange_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.GameStepChange_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.GameStepChange_S2C} GameStepChange_S2C
         */
        GameStepChange_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.GameStepChange_S2C)
                return object;
            var message = new $root.msg.GameStepChange_S2C();
            if (object.roomData != null) {
                if (typeof object.roomData !== "object")
                    throw TypeError(".msg.GameStepChange_S2C.roomData: object expected");
                message.roomData = $root.msg.RoomData.fromObject(object.roomData);
            }
            return message;
        };

        /**
         * Creates a plain object from a GameStepChange_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.GameStepChange_S2C
         * @static
         * @param {msg.GameStepChange_S2C} message GameStepChange_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameStepChange_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.roomData = null;
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                object.roomData = $root.msg.RoomData.toObject(message.roomData, options);
            return object;
        };

        /**
         * Converts this GameStepChange_S2C to JSON.
         * @function toJSON
         * @memberof msg.GameStepChange_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameStepChange_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GameStepChange_S2C;
    })();

    msg.ResultGameData_S2C = (function() {

        /**
         * Properties of a ResultGameData_S2C.
         * @memberof msg
         * @interface IResultGameData_S2C
         * @property {msg.IRoomData|null} [roomData] ResultGameData_S2C roomData
         */

        /**
         * Constructs a new ResultGameData_S2C.
         * @memberof msg
         * @classdesc Represents a ResultGameData_S2C.
         * @implements IResultGameData_S2C
         * @constructor
         * @param {msg.IResultGameData_S2C=} [properties] Properties to set
         */
        function ResultGameData_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ResultGameData_S2C roomData.
         * @member {msg.IRoomData|null|undefined} roomData
         * @memberof msg.ResultGameData_S2C
         * @instance
         */
        ResultGameData_S2C.prototype.roomData = null;

        /**
         * Creates a new ResultGameData_S2C instance using the specified properties.
         * @function create
         * @memberof msg.ResultGameData_S2C
         * @static
         * @param {msg.IResultGameData_S2C=} [properties] Properties to set
         * @returns {msg.ResultGameData_S2C} ResultGameData_S2C instance
         */
        ResultGameData_S2C.create = function create(properties) {
            return new ResultGameData_S2C(properties);
        };

        /**
         * Encodes the specified ResultGameData_S2C message. Does not implicitly {@link msg.ResultGameData_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.ResultGameData_S2C
         * @static
         * @param {msg.IResultGameData_S2C} message ResultGameData_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ResultGameData_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                $root.msg.RoomData.encode(message.roomData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ResultGameData_S2C message, length delimited. Does not implicitly {@link msg.ResultGameData_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.ResultGameData_S2C
         * @static
         * @param {msg.IResultGameData_S2C} message ResultGameData_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ResultGameData_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ResultGameData_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.ResultGameData_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.ResultGameData_S2C} ResultGameData_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ResultGameData_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.ResultGameData_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomData = $root.msg.RoomData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ResultGameData_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.ResultGameData_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.ResultGameData_S2C} ResultGameData_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ResultGameData_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ResultGameData_S2C message.
         * @function verify
         * @memberof msg.ResultGameData_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ResultGameData_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomData != null && message.hasOwnProperty("roomData")) {
                var error = $root.msg.RoomData.verify(message.roomData);
                if (error)
                    return "roomData." + error;
            }
            return null;
        };

        /**
         * Creates a ResultGameData_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.ResultGameData_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.ResultGameData_S2C} ResultGameData_S2C
         */
        ResultGameData_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.ResultGameData_S2C)
                return object;
            var message = new $root.msg.ResultGameData_S2C();
            if (object.roomData != null) {
                if (typeof object.roomData !== "object")
                    throw TypeError(".msg.ResultGameData_S2C.roomData: object expected");
                message.roomData = $root.msg.RoomData.fromObject(object.roomData);
            }
            return message;
        };

        /**
         * Creates a plain object from a ResultGameData_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.ResultGameData_S2C
         * @static
         * @param {msg.ResultGameData_S2C} message ResultGameData_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ResultGameData_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.roomData = null;
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                object.roomData = $root.msg.RoomData.toObject(message.roomData, options);
            return object;
        };

        /**
         * Converts this ResultGameData_S2C to JSON.
         * @function toJSON
         * @memberof msg.ResultGameData_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ResultGameData_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ResultGameData_S2C;
    })();

    msg.ReadyTime_S2C = (function() {

        /**
         * Properties of a ReadyTime_S2C.
         * @memberof msg
         * @interface IReadyTime_S2C
         * @property {number|null} [readyTime] ReadyTime_S2C readyTime
         */

        /**
         * Constructs a new ReadyTime_S2C.
         * @memberof msg
         * @classdesc Represents a ReadyTime_S2C.
         * @implements IReadyTime_S2C
         * @constructor
         * @param {msg.IReadyTime_S2C=} [properties] Properties to set
         */
        function ReadyTime_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ReadyTime_S2C readyTime.
         * @member {number} readyTime
         * @memberof msg.ReadyTime_S2C
         * @instance
         */
        ReadyTime_S2C.prototype.readyTime = 0;

        /**
         * Creates a new ReadyTime_S2C instance using the specified properties.
         * @function create
         * @memberof msg.ReadyTime_S2C
         * @static
         * @param {msg.IReadyTime_S2C=} [properties] Properties to set
         * @returns {msg.ReadyTime_S2C} ReadyTime_S2C instance
         */
        ReadyTime_S2C.create = function create(properties) {
            return new ReadyTime_S2C(properties);
        };

        /**
         * Encodes the specified ReadyTime_S2C message. Does not implicitly {@link msg.ReadyTime_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.ReadyTime_S2C
         * @static
         * @param {msg.IReadyTime_S2C} message ReadyTime_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReadyTime_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.readyTime != null && message.hasOwnProperty("readyTime"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.readyTime);
            return writer;
        };

        /**
         * Encodes the specified ReadyTime_S2C message, length delimited. Does not implicitly {@link msg.ReadyTime_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.ReadyTime_S2C
         * @static
         * @param {msg.IReadyTime_S2C} message ReadyTime_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReadyTime_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReadyTime_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.ReadyTime_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.ReadyTime_S2C} ReadyTime_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReadyTime_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.ReadyTime_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.readyTime = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ReadyTime_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.ReadyTime_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.ReadyTime_S2C} ReadyTime_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReadyTime_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ReadyTime_S2C message.
         * @function verify
         * @memberof msg.ReadyTime_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ReadyTime_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.readyTime != null && message.hasOwnProperty("readyTime"))
                if (!$util.isInteger(message.readyTime))
                    return "readyTime: integer expected";
            return null;
        };

        /**
         * Creates a ReadyTime_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.ReadyTime_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.ReadyTime_S2C} ReadyTime_S2C
         */
        ReadyTime_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.ReadyTime_S2C)
                return object;
            var message = new $root.msg.ReadyTime_S2C();
            if (object.readyTime != null)
                message.readyTime = object.readyTime | 0;
            return message;
        };

        /**
         * Creates a plain object from a ReadyTime_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.ReadyTime_S2C
         * @static
         * @param {msg.ReadyTime_S2C} message ReadyTime_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ReadyTime_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.readyTime = 0;
            if (message.readyTime != null && message.hasOwnProperty("readyTime"))
                object.readyTime = message.readyTime;
            return object;
        };

        /**
         * Converts this ReadyTime_S2C to JSON.
         * @function toJSON
         * @memberof msg.ReadyTime_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ReadyTime_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ReadyTime_S2C;
    })();

    msg.SettleTime_S2C = (function() {

        /**
         * Properties of a SettleTime_S2C.
         * @memberof msg
         * @interface ISettleTime_S2C
         * @property {number|null} [settleTime] SettleTime_S2C settleTime
         */

        /**
         * Constructs a new SettleTime_S2C.
         * @memberof msg
         * @classdesc Represents a SettleTime_S2C.
         * @implements ISettleTime_S2C
         * @constructor
         * @param {msg.ISettleTime_S2C=} [properties] Properties to set
         */
        function SettleTime_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SettleTime_S2C settleTime.
         * @member {number} settleTime
         * @memberof msg.SettleTime_S2C
         * @instance
         */
        SettleTime_S2C.prototype.settleTime = 0;

        /**
         * Creates a new SettleTime_S2C instance using the specified properties.
         * @function create
         * @memberof msg.SettleTime_S2C
         * @static
         * @param {msg.ISettleTime_S2C=} [properties] Properties to set
         * @returns {msg.SettleTime_S2C} SettleTime_S2C instance
         */
        SettleTime_S2C.create = function create(properties) {
            return new SettleTime_S2C(properties);
        };

        /**
         * Encodes the specified SettleTime_S2C message. Does not implicitly {@link msg.SettleTime_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.SettleTime_S2C
         * @static
         * @param {msg.ISettleTime_S2C} message SettleTime_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SettleTime_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.settleTime != null && message.hasOwnProperty("settleTime"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.settleTime);
            return writer;
        };

        /**
         * Encodes the specified SettleTime_S2C message, length delimited. Does not implicitly {@link msg.SettleTime_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.SettleTime_S2C
         * @static
         * @param {msg.ISettleTime_S2C} message SettleTime_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SettleTime_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SettleTime_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.SettleTime_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.SettleTime_S2C} SettleTime_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SettleTime_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.SettleTime_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.settleTime = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SettleTime_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.SettleTime_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.SettleTime_S2C} SettleTime_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SettleTime_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SettleTime_S2C message.
         * @function verify
         * @memberof msg.SettleTime_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SettleTime_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.settleTime != null && message.hasOwnProperty("settleTime"))
                if (!$util.isInteger(message.settleTime))
                    return "settleTime: integer expected";
            return null;
        };

        /**
         * Creates a SettleTime_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.SettleTime_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.SettleTime_S2C} SettleTime_S2C
         */
        SettleTime_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.SettleTime_S2C)
                return object;
            var message = new $root.msg.SettleTime_S2C();
            if (object.settleTime != null)
                message.settleTime = object.settleTime | 0;
            return message;
        };

        /**
         * Creates a plain object from a SettleTime_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.SettleTime_S2C
         * @static
         * @param {msg.SettleTime_S2C} message SettleTime_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SettleTime_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.settleTime = 0;
            if (message.settleTime != null && message.hasOwnProperty("settleTime"))
                object.settleTime = message.settleTime;
            return object;
        };

        /**
         * Converts this SettleTime_S2C to JSON.
         * @function toJSON
         * @memberof msg.SettleTime_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SettleTime_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SettleTime_S2C;
    })();

    msg.PushCardTime_S2C = (function() {

        /**
         * Properties of a PushCardTime_S2C.
         * @memberof msg
         * @interface IPushCardTime_S2C
         * @property {msg.IRoomData|null} [roomData] PushCardTime_S2C roomData
         */

        /**
         * Constructs a new PushCardTime_S2C.
         * @memberof msg
         * @classdesc Represents a PushCardTime_S2C.
         * @implements IPushCardTime_S2C
         * @constructor
         * @param {msg.IPushCardTime_S2C=} [properties] Properties to set
         */
        function PushCardTime_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PushCardTime_S2C roomData.
         * @member {msg.IRoomData|null|undefined} roomData
         * @memberof msg.PushCardTime_S2C
         * @instance
         */
        PushCardTime_S2C.prototype.roomData = null;

        /**
         * Creates a new PushCardTime_S2C instance using the specified properties.
         * @function create
         * @memberof msg.PushCardTime_S2C
         * @static
         * @param {msg.IPushCardTime_S2C=} [properties] Properties to set
         * @returns {msg.PushCardTime_S2C} PushCardTime_S2C instance
         */
        PushCardTime_S2C.create = function create(properties) {
            return new PushCardTime_S2C(properties);
        };

        /**
         * Encodes the specified PushCardTime_S2C message. Does not implicitly {@link msg.PushCardTime_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.PushCardTime_S2C
         * @static
         * @param {msg.IPushCardTime_S2C} message PushCardTime_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PushCardTime_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                $root.msg.RoomData.encode(message.roomData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PushCardTime_S2C message, length delimited. Does not implicitly {@link msg.PushCardTime_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.PushCardTime_S2C
         * @static
         * @param {msg.IPushCardTime_S2C} message PushCardTime_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PushCardTime_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PushCardTime_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.PushCardTime_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.PushCardTime_S2C} PushCardTime_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PushCardTime_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.PushCardTime_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomData = $root.msg.RoomData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PushCardTime_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.PushCardTime_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.PushCardTime_S2C} PushCardTime_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PushCardTime_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PushCardTime_S2C message.
         * @function verify
         * @memberof msg.PushCardTime_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PushCardTime_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomData != null && message.hasOwnProperty("roomData")) {
                var error = $root.msg.RoomData.verify(message.roomData);
                if (error)
                    return "roomData." + error;
            }
            return null;
        };

        /**
         * Creates a PushCardTime_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.PushCardTime_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.PushCardTime_S2C} PushCardTime_S2C
         */
        PushCardTime_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.PushCardTime_S2C)
                return object;
            var message = new $root.msg.PushCardTime_S2C();
            if (object.roomData != null) {
                if (typeof object.roomData !== "object")
                    throw TypeError(".msg.PushCardTime_S2C.roomData: object expected");
                message.roomData = $root.msg.RoomData.fromObject(object.roomData);
            }
            return message;
        };

        /**
         * Creates a plain object from a PushCardTime_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.PushCardTime_S2C
         * @static
         * @param {msg.PushCardTime_S2C} message PushCardTime_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PushCardTime_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.roomData = null;
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                object.roomData = $root.msg.RoomData.toObject(message.roomData, options);
            return object;
        };

        /**
         * Converts this PushCardTime_S2C to JSON.
         * @function toJSON
         * @memberof msg.PushCardTime_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PushCardTime_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PushCardTime_S2C;
    })();

    msg.RoomStatus_C2S = (function() {

        /**
         * Properties of a RoomStatus_C2S.
         * @memberof msg
         * @interface IRoomStatus_C2S
         * @property {string|null} [cfgId] RoomStatus_C2S cfgId
         */

        /**
         * Constructs a new RoomStatus_C2S.
         * @memberof msg
         * @classdesc Represents a RoomStatus_C2S.
         * @implements IRoomStatus_C2S
         * @constructor
         * @param {msg.IRoomStatus_C2S=} [properties] Properties to set
         */
        function RoomStatus_C2S(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomStatus_C2S cfgId.
         * @member {string} cfgId
         * @memberof msg.RoomStatus_C2S
         * @instance
         */
        RoomStatus_C2S.prototype.cfgId = "";

        /**
         * Creates a new RoomStatus_C2S instance using the specified properties.
         * @function create
         * @memberof msg.RoomStatus_C2S
         * @static
         * @param {msg.IRoomStatus_C2S=} [properties] Properties to set
         * @returns {msg.RoomStatus_C2S} RoomStatus_C2S instance
         */
        RoomStatus_C2S.create = function create(properties) {
            return new RoomStatus_C2S(properties);
        };

        /**
         * Encodes the specified RoomStatus_C2S message. Does not implicitly {@link msg.RoomStatus_C2S.verify|verify} messages.
         * @function encode
         * @memberof msg.RoomStatus_C2S
         * @static
         * @param {msg.IRoomStatus_C2S} message RoomStatus_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomStatus_C2S.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cfgId);
            return writer;
        };

        /**
         * Encodes the specified RoomStatus_C2S message, length delimited. Does not implicitly {@link msg.RoomStatus_C2S.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.RoomStatus_C2S
         * @static
         * @param {msg.IRoomStatus_C2S} message RoomStatus_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomStatus_C2S.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomStatus_C2S message from the specified reader or buffer.
         * @function decode
         * @memberof msg.RoomStatus_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.RoomStatus_C2S} RoomStatus_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomStatus_C2S.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.RoomStatus_C2S();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cfgId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomStatus_C2S message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.RoomStatus_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.RoomStatus_C2S} RoomStatus_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomStatus_C2S.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomStatus_C2S message.
         * @function verify
         * @memberof msg.RoomStatus_C2S
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomStatus_C2S.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                if (!$util.isString(message.cfgId))
                    return "cfgId: string expected";
            return null;
        };

        /**
         * Creates a RoomStatus_C2S message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.RoomStatus_C2S
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.RoomStatus_C2S} RoomStatus_C2S
         */
        RoomStatus_C2S.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.RoomStatus_C2S)
                return object;
            var message = new $root.msg.RoomStatus_C2S();
            if (object.cfgId != null)
                message.cfgId = String(object.cfgId);
            return message;
        };

        /**
         * Creates a plain object from a RoomStatus_C2S message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.RoomStatus_C2S
         * @static
         * @param {msg.RoomStatus_C2S} message RoomStatus_C2S
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomStatus_C2S.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.cfgId = "";
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                object.cfgId = message.cfgId;
            return object;
        };

        /**
         * Converts this RoomStatus_C2S to JSON.
         * @function toJSON
         * @memberof msg.RoomStatus_C2S
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomStatus_C2S.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomStatus_C2S;
    })();

    msg.RoomStatus_S2C = (function() {

        /**
         * Properties of a RoomStatus_S2C.
         * @memberof msg
         * @interface IRoomStatus_S2C
         * @property {string|null} [cfgId] RoomStatus_S2C cfgId
         * @property {string|null} [RoomIdNow] RoomStatus_S2C RoomIdNow
         */

        /**
         * Constructs a new RoomStatus_S2C.
         * @memberof msg
         * @classdesc Represents a RoomStatus_S2C.
         * @implements IRoomStatus_S2C
         * @constructor
         * @param {msg.IRoomStatus_S2C=} [properties] Properties to set
         */
        function RoomStatus_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomStatus_S2C cfgId.
         * @member {string} cfgId
         * @memberof msg.RoomStatus_S2C
         * @instance
         */
        RoomStatus_S2C.prototype.cfgId = "";

        /**
         * RoomStatus_S2C RoomIdNow.
         * @member {string} RoomIdNow
         * @memberof msg.RoomStatus_S2C
         * @instance
         */
        RoomStatus_S2C.prototype.RoomIdNow = "";

        /**
         * Creates a new RoomStatus_S2C instance using the specified properties.
         * @function create
         * @memberof msg.RoomStatus_S2C
         * @static
         * @param {msg.IRoomStatus_S2C=} [properties] Properties to set
         * @returns {msg.RoomStatus_S2C} RoomStatus_S2C instance
         */
        RoomStatus_S2C.create = function create(properties) {
            return new RoomStatus_S2C(properties);
        };

        /**
         * Encodes the specified RoomStatus_S2C message. Does not implicitly {@link msg.RoomStatus_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.RoomStatus_S2C
         * @static
         * @param {msg.IRoomStatus_S2C} message RoomStatus_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomStatus_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cfgId);
            if (message.RoomIdNow != null && message.hasOwnProperty("RoomIdNow"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.RoomIdNow);
            return writer;
        };

        /**
         * Encodes the specified RoomStatus_S2C message, length delimited. Does not implicitly {@link msg.RoomStatus_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.RoomStatus_S2C
         * @static
         * @param {msg.IRoomStatus_S2C} message RoomStatus_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomStatus_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomStatus_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.RoomStatus_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.RoomStatus_S2C} RoomStatus_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomStatus_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.RoomStatus_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cfgId = reader.string();
                    break;
                case 2:
                    message.RoomIdNow = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomStatus_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.RoomStatus_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.RoomStatus_S2C} RoomStatus_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomStatus_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomStatus_S2C message.
         * @function verify
         * @memberof msg.RoomStatus_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomStatus_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                if (!$util.isString(message.cfgId))
                    return "cfgId: string expected";
            if (message.RoomIdNow != null && message.hasOwnProperty("RoomIdNow"))
                if (!$util.isString(message.RoomIdNow))
                    return "RoomIdNow: string expected";
            return null;
        };

        /**
         * Creates a RoomStatus_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.RoomStatus_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.RoomStatus_S2C} RoomStatus_S2C
         */
        RoomStatus_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.RoomStatus_S2C)
                return object;
            var message = new $root.msg.RoomStatus_S2C();
            if (object.cfgId != null)
                message.cfgId = String(object.cfgId);
            if (object.RoomIdNow != null)
                message.RoomIdNow = String(object.RoomIdNow);
            return message;
        };

        /**
         * Creates a plain object from a RoomStatus_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.RoomStatus_S2C
         * @static
         * @param {msg.RoomStatus_S2C} message RoomStatus_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomStatus_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cfgId = "";
                object.RoomIdNow = "";
            }
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                object.cfgId = message.cfgId;
            if (message.RoomIdNow != null && message.hasOwnProperty("RoomIdNow"))
                object.RoomIdNow = message.RoomIdNow;
            return object;
        };

        /**
         * Converts this RoomStatus_S2C to JSON.
         * @function toJSON
         * @memberof msg.RoomStatus_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomStatus_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomStatus_S2C;
    })();

    msg.EmojiChat_C2S = (function() {

        /**
         * Properties of an EmojiChat_C2S.
         * @memberof msg
         * @interface IEmojiChat_C2S
         * @property {number|null} [actNum] EmojiChat_C2S actNum
         * @property {number|null} [goalChair] EmojiChat_C2S goalChair
         */

        /**
         * Constructs a new EmojiChat_C2S.
         * @memberof msg
         * @classdesc Represents an EmojiChat_C2S.
         * @implements IEmojiChat_C2S
         * @constructor
         * @param {msg.IEmojiChat_C2S=} [properties] Properties to set
         */
        function EmojiChat_C2S(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EmojiChat_C2S actNum.
         * @member {number} actNum
         * @memberof msg.EmojiChat_C2S
         * @instance
         */
        EmojiChat_C2S.prototype.actNum = 0;

        /**
         * EmojiChat_C2S goalChair.
         * @member {number} goalChair
         * @memberof msg.EmojiChat_C2S
         * @instance
         */
        EmojiChat_C2S.prototype.goalChair = 0;

        /**
         * Creates a new EmojiChat_C2S instance using the specified properties.
         * @function create
         * @memberof msg.EmojiChat_C2S
         * @static
         * @param {msg.IEmojiChat_C2S=} [properties] Properties to set
         * @returns {msg.EmojiChat_C2S} EmojiChat_C2S instance
         */
        EmojiChat_C2S.create = function create(properties) {
            return new EmojiChat_C2S(properties);
        };

        /**
         * Encodes the specified EmojiChat_C2S message. Does not implicitly {@link msg.EmojiChat_C2S.verify|verify} messages.
         * @function encode
         * @memberof msg.EmojiChat_C2S
         * @static
         * @param {msg.IEmojiChat_C2S} message EmojiChat_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EmojiChat_C2S.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.actNum != null && message.hasOwnProperty("actNum"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.actNum);
            if (message.goalChair != null && message.hasOwnProperty("goalChair"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.goalChair);
            return writer;
        };

        /**
         * Encodes the specified EmojiChat_C2S message, length delimited. Does not implicitly {@link msg.EmojiChat_C2S.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.EmojiChat_C2S
         * @static
         * @param {msg.IEmojiChat_C2S} message EmojiChat_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EmojiChat_C2S.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EmojiChat_C2S message from the specified reader or buffer.
         * @function decode
         * @memberof msg.EmojiChat_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.EmojiChat_C2S} EmojiChat_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EmojiChat_C2S.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.EmojiChat_C2S();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.actNum = reader.int32();
                    break;
                case 2:
                    message.goalChair = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EmojiChat_C2S message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.EmojiChat_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.EmojiChat_C2S} EmojiChat_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EmojiChat_C2S.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EmojiChat_C2S message.
         * @function verify
         * @memberof msg.EmojiChat_C2S
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EmojiChat_C2S.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.actNum != null && message.hasOwnProperty("actNum"))
                if (!$util.isInteger(message.actNum))
                    return "actNum: integer expected";
            if (message.goalChair != null && message.hasOwnProperty("goalChair"))
                if (!$util.isInteger(message.goalChair))
                    return "goalChair: integer expected";
            return null;
        };

        /**
         * Creates an EmojiChat_C2S message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.EmojiChat_C2S
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.EmojiChat_C2S} EmojiChat_C2S
         */
        EmojiChat_C2S.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.EmojiChat_C2S)
                return object;
            var message = new $root.msg.EmojiChat_C2S();
            if (object.actNum != null)
                message.actNum = object.actNum | 0;
            if (object.goalChair != null)
                message.goalChair = object.goalChair | 0;
            return message;
        };

        /**
         * Creates a plain object from an EmojiChat_C2S message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.EmojiChat_C2S
         * @static
         * @param {msg.EmojiChat_C2S} message EmojiChat_C2S
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EmojiChat_C2S.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.actNum = 0;
                object.goalChair = 0;
            }
            if (message.actNum != null && message.hasOwnProperty("actNum"))
                object.actNum = message.actNum;
            if (message.goalChair != null && message.hasOwnProperty("goalChair"))
                object.goalChair = message.goalChair;
            return object;
        };

        /**
         * Converts this EmojiChat_C2S to JSON.
         * @function toJSON
         * @memberof msg.EmojiChat_C2S
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EmojiChat_C2S.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EmojiChat_C2S;
    })();

    msg.EmojiChat_S2C = (function() {

        /**
         * Properties of an EmojiChat_S2C.
         * @memberof msg
         * @interface IEmojiChat_S2C
         * @property {number|null} [actNum] EmojiChat_S2C actNum
         * @property {number|null} [actChair] EmojiChat_S2C actChair
         * @property {number|null} [goalChair] EmojiChat_S2C goalChair
         */

        /**
         * Constructs a new EmojiChat_S2C.
         * @memberof msg
         * @classdesc Represents an EmojiChat_S2C.
         * @implements IEmojiChat_S2C
         * @constructor
         * @param {msg.IEmojiChat_S2C=} [properties] Properties to set
         */
        function EmojiChat_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EmojiChat_S2C actNum.
         * @member {number} actNum
         * @memberof msg.EmojiChat_S2C
         * @instance
         */
        EmojiChat_S2C.prototype.actNum = 0;

        /**
         * EmojiChat_S2C actChair.
         * @member {number} actChair
         * @memberof msg.EmojiChat_S2C
         * @instance
         */
        EmojiChat_S2C.prototype.actChair = 0;

        /**
         * EmojiChat_S2C goalChair.
         * @member {number} goalChair
         * @memberof msg.EmojiChat_S2C
         * @instance
         */
        EmojiChat_S2C.prototype.goalChair = 0;

        /**
         * Creates a new EmojiChat_S2C instance using the specified properties.
         * @function create
         * @memberof msg.EmojiChat_S2C
         * @static
         * @param {msg.IEmojiChat_S2C=} [properties] Properties to set
         * @returns {msg.EmojiChat_S2C} EmojiChat_S2C instance
         */
        EmojiChat_S2C.create = function create(properties) {
            return new EmojiChat_S2C(properties);
        };

        /**
         * Encodes the specified EmojiChat_S2C message. Does not implicitly {@link msg.EmojiChat_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.EmojiChat_S2C
         * @static
         * @param {msg.IEmojiChat_S2C} message EmojiChat_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EmojiChat_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.actNum != null && message.hasOwnProperty("actNum"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.actNum);
            if (message.actChair != null && message.hasOwnProperty("actChair"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.actChair);
            if (message.goalChair != null && message.hasOwnProperty("goalChair"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.goalChair);
            return writer;
        };

        /**
         * Encodes the specified EmojiChat_S2C message, length delimited. Does not implicitly {@link msg.EmojiChat_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.EmojiChat_S2C
         * @static
         * @param {msg.IEmojiChat_S2C} message EmojiChat_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EmojiChat_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EmojiChat_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.EmojiChat_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.EmojiChat_S2C} EmojiChat_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EmojiChat_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.EmojiChat_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.actNum = reader.int32();
                    break;
                case 2:
                    message.actChair = reader.int32();
                    break;
                case 3:
                    message.goalChair = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EmojiChat_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.EmojiChat_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.EmojiChat_S2C} EmojiChat_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EmojiChat_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EmojiChat_S2C message.
         * @function verify
         * @memberof msg.EmojiChat_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EmojiChat_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.actNum != null && message.hasOwnProperty("actNum"))
                if (!$util.isInteger(message.actNum))
                    return "actNum: integer expected";
            if (message.actChair != null && message.hasOwnProperty("actChair"))
                if (!$util.isInteger(message.actChair))
                    return "actChair: integer expected";
            if (message.goalChair != null && message.hasOwnProperty("goalChair"))
                if (!$util.isInteger(message.goalChair))
                    return "goalChair: integer expected";
            return null;
        };

        /**
         * Creates an EmojiChat_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.EmojiChat_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.EmojiChat_S2C} EmojiChat_S2C
         */
        EmojiChat_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.EmojiChat_S2C)
                return object;
            var message = new $root.msg.EmojiChat_S2C();
            if (object.actNum != null)
                message.actNum = object.actNum | 0;
            if (object.actChair != null)
                message.actChair = object.actChair | 0;
            if (object.goalChair != null)
                message.goalChair = object.goalChair | 0;
            return message;
        };

        /**
         * Creates a plain object from an EmojiChat_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.EmojiChat_S2C
         * @static
         * @param {msg.EmojiChat_S2C} message EmojiChat_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EmojiChat_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.actNum = 0;
                object.actChair = 0;
                object.goalChair = 0;
            }
            if (message.actNum != null && message.hasOwnProperty("actNum"))
                object.actNum = message.actNum;
            if (message.actChair != null && message.hasOwnProperty("actChair"))
                object.actChair = message.actChair;
            if (message.goalChair != null && message.hasOwnProperty("goalChair"))
                object.goalChair = message.goalChair;
            return object;
        };

        /**
         * Converts this EmojiChat_S2C to JSON.
         * @function toJSON
         * @memberof msg.EmojiChat_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EmojiChat_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EmojiChat_S2C;
    })();

    msg.PiPeiPlayer_S2C = (function() {

        /**
         * Properties of a PiPeiPlayer_S2C.
         * @memberof msg
         * @interface IPiPeiPlayer_S2C
         */

        /**
         * Constructs a new PiPeiPlayer_S2C.
         * @memberof msg
         * @classdesc Represents a PiPeiPlayer_S2C.
         * @implements IPiPeiPlayer_S2C
         * @constructor
         * @param {msg.IPiPeiPlayer_S2C=} [properties] Properties to set
         */
        function PiPeiPlayer_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new PiPeiPlayer_S2C instance using the specified properties.
         * @function create
         * @memberof msg.PiPeiPlayer_S2C
         * @static
         * @param {msg.IPiPeiPlayer_S2C=} [properties] Properties to set
         * @returns {msg.PiPeiPlayer_S2C} PiPeiPlayer_S2C instance
         */
        PiPeiPlayer_S2C.create = function create(properties) {
            return new PiPeiPlayer_S2C(properties);
        };

        /**
         * Encodes the specified PiPeiPlayer_S2C message. Does not implicitly {@link msg.PiPeiPlayer_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.PiPeiPlayer_S2C
         * @static
         * @param {msg.IPiPeiPlayer_S2C} message PiPeiPlayer_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PiPeiPlayer_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified PiPeiPlayer_S2C message, length delimited. Does not implicitly {@link msg.PiPeiPlayer_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.PiPeiPlayer_S2C
         * @static
         * @param {msg.IPiPeiPlayer_S2C} message PiPeiPlayer_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PiPeiPlayer_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PiPeiPlayer_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.PiPeiPlayer_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.PiPeiPlayer_S2C} PiPeiPlayer_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PiPeiPlayer_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.PiPeiPlayer_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PiPeiPlayer_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.PiPeiPlayer_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.PiPeiPlayer_S2C} PiPeiPlayer_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PiPeiPlayer_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PiPeiPlayer_S2C message.
         * @function verify
         * @memberof msg.PiPeiPlayer_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PiPeiPlayer_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a PiPeiPlayer_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.PiPeiPlayer_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.PiPeiPlayer_S2C} PiPeiPlayer_S2C
         */
        PiPeiPlayer_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.PiPeiPlayer_S2C)
                return object;
            return new $root.msg.PiPeiPlayer_S2C();
        };

        /**
         * Creates a plain object from a PiPeiPlayer_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.PiPeiPlayer_S2C
         * @static
         * @param {msg.PiPeiPlayer_S2C} message PiPeiPlayer_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PiPeiPlayer_S2C.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this PiPeiPlayer_S2C to JSON.
         * @function toJSON
         * @memberof msg.PiPeiPlayer_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PiPeiPlayer_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PiPeiPlayer_S2C;
    })();

    msg.PiPeiData_S2C = (function() {

        /**
         * Properties of a PiPeiData_S2C.
         * @memberof msg
         * @interface IPiPeiData_S2C
         * @property {msg.IRoomData|null} [roomData] PiPeiData_S2C roomData
         */

        /**
         * Constructs a new PiPeiData_S2C.
         * @memberof msg
         * @classdesc Represents a PiPeiData_S2C.
         * @implements IPiPeiData_S2C
         * @constructor
         * @param {msg.IPiPeiData_S2C=} [properties] Properties to set
         */
        function PiPeiData_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PiPeiData_S2C roomData.
         * @member {msg.IRoomData|null|undefined} roomData
         * @memberof msg.PiPeiData_S2C
         * @instance
         */
        PiPeiData_S2C.prototype.roomData = null;

        /**
         * Creates a new PiPeiData_S2C instance using the specified properties.
         * @function create
         * @memberof msg.PiPeiData_S2C
         * @static
         * @param {msg.IPiPeiData_S2C=} [properties] Properties to set
         * @returns {msg.PiPeiData_S2C} PiPeiData_S2C instance
         */
        PiPeiData_S2C.create = function create(properties) {
            return new PiPeiData_S2C(properties);
        };

        /**
         * Encodes the specified PiPeiData_S2C message. Does not implicitly {@link msg.PiPeiData_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.PiPeiData_S2C
         * @static
         * @param {msg.IPiPeiData_S2C} message PiPeiData_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PiPeiData_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                $root.msg.RoomData.encode(message.roomData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PiPeiData_S2C message, length delimited. Does not implicitly {@link msg.PiPeiData_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.PiPeiData_S2C
         * @static
         * @param {msg.IPiPeiData_S2C} message PiPeiData_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PiPeiData_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PiPeiData_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.PiPeiData_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.PiPeiData_S2C} PiPeiData_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PiPeiData_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.PiPeiData_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomData = $root.msg.RoomData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PiPeiData_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.PiPeiData_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.PiPeiData_S2C} PiPeiData_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PiPeiData_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PiPeiData_S2C message.
         * @function verify
         * @memberof msg.PiPeiData_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PiPeiData_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomData != null && message.hasOwnProperty("roomData")) {
                var error = $root.msg.RoomData.verify(message.roomData);
                if (error)
                    return "roomData." + error;
            }
            return null;
        };

        /**
         * Creates a PiPeiData_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.PiPeiData_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.PiPeiData_S2C} PiPeiData_S2C
         */
        PiPeiData_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.PiPeiData_S2C)
                return object;
            var message = new $root.msg.PiPeiData_S2C();
            if (object.roomData != null) {
                if (typeof object.roomData !== "object")
                    throw TypeError(".msg.PiPeiData_S2C.roomData: object expected");
                message.roomData = $root.msg.RoomData.fromObject(object.roomData);
            }
            return message;
        };

        /**
         * Creates a plain object from a PiPeiData_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.PiPeiData_S2C
         * @static
         * @param {msg.PiPeiData_S2C} message PiPeiData_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PiPeiData_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.roomData = null;
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                object.roomData = $root.msg.RoomData.toObject(message.roomData, options);
            return object;
        };

        /**
         * Converts this PiPeiData_S2C to JSON.
         * @function toJSON
         * @memberof msg.PiPeiData_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PiPeiData_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PiPeiData_S2C;
    })();

    msg.SendActTimer_S2C = (function() {

        /**
         * Properties of a SendActTimer_S2C.
         * @memberof msg
         * @interface ISendActTimer_S2C
         * @property {number|null} [actChair] SendActTimer_S2C actChair
         * @property {number|null} [timer] SendActTimer_S2C timer
         */

        /**
         * Constructs a new SendActTimer_S2C.
         * @memberof msg
         * @classdesc Represents a SendActTimer_S2C.
         * @implements ISendActTimer_S2C
         * @constructor
         * @param {msg.ISendActTimer_S2C=} [properties] Properties to set
         */
        function SendActTimer_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SendActTimer_S2C actChair.
         * @member {number} actChair
         * @memberof msg.SendActTimer_S2C
         * @instance
         */
        SendActTimer_S2C.prototype.actChair = 0;

        /**
         * SendActTimer_S2C timer.
         * @member {number} timer
         * @memberof msg.SendActTimer_S2C
         * @instance
         */
        SendActTimer_S2C.prototype.timer = 0;

        /**
         * Creates a new SendActTimer_S2C instance using the specified properties.
         * @function create
         * @memberof msg.SendActTimer_S2C
         * @static
         * @param {msg.ISendActTimer_S2C=} [properties] Properties to set
         * @returns {msg.SendActTimer_S2C} SendActTimer_S2C instance
         */
        SendActTimer_S2C.create = function create(properties) {
            return new SendActTimer_S2C(properties);
        };

        /**
         * Encodes the specified SendActTimer_S2C message. Does not implicitly {@link msg.SendActTimer_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.SendActTimer_S2C
         * @static
         * @param {msg.ISendActTimer_S2C} message SendActTimer_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendActTimer_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.actChair != null && message.hasOwnProperty("actChair"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.actChair);
            if (message.timer != null && message.hasOwnProperty("timer"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.timer);
            return writer;
        };

        /**
         * Encodes the specified SendActTimer_S2C message, length delimited. Does not implicitly {@link msg.SendActTimer_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.SendActTimer_S2C
         * @static
         * @param {msg.ISendActTimer_S2C} message SendActTimer_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendActTimer_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SendActTimer_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.SendActTimer_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.SendActTimer_S2C} SendActTimer_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendActTimer_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.SendActTimer_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.actChair = reader.int32();
                    break;
                case 2:
                    message.timer = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SendActTimer_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.SendActTimer_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.SendActTimer_S2C} SendActTimer_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendActTimer_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SendActTimer_S2C message.
         * @function verify
         * @memberof msg.SendActTimer_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SendActTimer_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.actChair != null && message.hasOwnProperty("actChair"))
                if (!$util.isInteger(message.actChair))
                    return "actChair: integer expected";
            if (message.timer != null && message.hasOwnProperty("timer"))
                if (typeof message.timer !== "number")
                    return "timer: number expected";
            return null;
        };

        /**
         * Creates a SendActTimer_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.SendActTimer_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.SendActTimer_S2C} SendActTimer_S2C
         */
        SendActTimer_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.SendActTimer_S2C)
                return object;
            var message = new $root.msg.SendActTimer_S2C();
            if (object.actChair != null)
                message.actChair = object.actChair | 0;
            if (object.timer != null)
                message.timer = Number(object.timer);
            return message;
        };

        /**
         * Creates a plain object from a SendActTimer_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.SendActTimer_S2C
         * @static
         * @param {msg.SendActTimer_S2C} message SendActTimer_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SendActTimer_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.actChair = 0;
                object.timer = 0;
            }
            if (message.actChair != null && message.hasOwnProperty("actChair"))
                object.actChair = message.actChair;
            if (message.timer != null && message.hasOwnProperty("timer"))
                object.timer = options.json && !isFinite(message.timer) ? String(message.timer) : message.timer;
            return object;
        };

        /**
         * Converts this SendActTimer_S2C to JSON.
         * @function toJSON
         * @memberof msg.SendActTimer_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SendActTimer_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SendActTimer_S2C;
    })();

    msg.SendRoomData_S2C = (function() {

        /**
         * Properties of a SendRoomData_S2C.
         * @memberof msg
         * @interface ISendRoomData_S2C
         * @property {msg.IRoomData|null} [roomData] SendRoomData_S2C roomData
         */

        /**
         * Constructs a new SendRoomData_S2C.
         * @memberof msg
         * @classdesc Represents a SendRoomData_S2C.
         * @implements ISendRoomData_S2C
         * @constructor
         * @param {msg.ISendRoomData_S2C=} [properties] Properties to set
         */
        function SendRoomData_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SendRoomData_S2C roomData.
         * @member {msg.IRoomData|null|undefined} roomData
         * @memberof msg.SendRoomData_S2C
         * @instance
         */
        SendRoomData_S2C.prototype.roomData = null;

        /**
         * Creates a new SendRoomData_S2C instance using the specified properties.
         * @function create
         * @memberof msg.SendRoomData_S2C
         * @static
         * @param {msg.ISendRoomData_S2C=} [properties] Properties to set
         * @returns {msg.SendRoomData_S2C} SendRoomData_S2C instance
         */
        SendRoomData_S2C.create = function create(properties) {
            return new SendRoomData_S2C(properties);
        };

        /**
         * Encodes the specified SendRoomData_S2C message. Does not implicitly {@link msg.SendRoomData_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.SendRoomData_S2C
         * @static
         * @param {msg.ISendRoomData_S2C} message SendRoomData_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendRoomData_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                $root.msg.RoomData.encode(message.roomData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SendRoomData_S2C message, length delimited. Does not implicitly {@link msg.SendRoomData_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.SendRoomData_S2C
         * @static
         * @param {msg.ISendRoomData_S2C} message SendRoomData_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendRoomData_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SendRoomData_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.SendRoomData_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.SendRoomData_S2C} SendRoomData_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendRoomData_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.SendRoomData_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomData = $root.msg.RoomData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SendRoomData_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.SendRoomData_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.SendRoomData_S2C} SendRoomData_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendRoomData_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SendRoomData_S2C message.
         * @function verify
         * @memberof msg.SendRoomData_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SendRoomData_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomData != null && message.hasOwnProperty("roomData")) {
                var error = $root.msg.RoomData.verify(message.roomData);
                if (error)
                    return "roomData." + error;
            }
            return null;
        };

        /**
         * Creates a SendRoomData_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.SendRoomData_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.SendRoomData_S2C} SendRoomData_S2C
         */
        SendRoomData_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.SendRoomData_S2C)
                return object;
            var message = new $root.msg.SendRoomData_S2C();
            if (object.roomData != null) {
                if (typeof object.roomData !== "object")
                    throw TypeError(".msg.SendRoomData_S2C.roomData: object expected");
                message.roomData = $root.msg.RoomData.fromObject(object.roomData);
            }
            return message;
        };

        /**
         * Creates a plain object from a SendRoomData_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.SendRoomData_S2C
         * @static
         * @param {msg.SendRoomData_S2C} message SendRoomData_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SendRoomData_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.roomData = null;
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                object.roomData = $root.msg.RoomData.toObject(message.roomData, options);
            return object;
        };

        /**
         * Converts this SendRoomData_S2C to JSON.
         * @function toJSON
         * @memberof msg.SendRoomData_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SendRoomData_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SendRoomData_S2C;
    })();

    msg.WaitPlayerList_C2S = (function() {

        /**
         * Properties of a WaitPlayerList_C2S.
         * @memberof msg
         * @interface IWaitPlayerList_C2S
         * @property {number|null} [WaitStatus] WaitPlayerList_C2S WaitStatus
         * @property {string|null} [cfgId] WaitPlayerList_C2S cfgId
         */

        /**
         * Constructs a new WaitPlayerList_C2S.
         * @memberof msg
         * @classdesc Represents a WaitPlayerList_C2S.
         * @implements IWaitPlayerList_C2S
         * @constructor
         * @param {msg.IWaitPlayerList_C2S=} [properties] Properties to set
         */
        function WaitPlayerList_C2S(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WaitPlayerList_C2S WaitStatus.
         * @member {number} WaitStatus
         * @memberof msg.WaitPlayerList_C2S
         * @instance
         */
        WaitPlayerList_C2S.prototype.WaitStatus = 0;

        /**
         * WaitPlayerList_C2S cfgId.
         * @member {string} cfgId
         * @memberof msg.WaitPlayerList_C2S
         * @instance
         */
        WaitPlayerList_C2S.prototype.cfgId = "";

        /**
         * Creates a new WaitPlayerList_C2S instance using the specified properties.
         * @function create
         * @memberof msg.WaitPlayerList_C2S
         * @static
         * @param {msg.IWaitPlayerList_C2S=} [properties] Properties to set
         * @returns {msg.WaitPlayerList_C2S} WaitPlayerList_C2S instance
         */
        WaitPlayerList_C2S.create = function create(properties) {
            return new WaitPlayerList_C2S(properties);
        };

        /**
         * Encodes the specified WaitPlayerList_C2S message. Does not implicitly {@link msg.WaitPlayerList_C2S.verify|verify} messages.
         * @function encode
         * @memberof msg.WaitPlayerList_C2S
         * @static
         * @param {msg.IWaitPlayerList_C2S} message WaitPlayerList_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WaitPlayerList_C2S.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.WaitStatus != null && message.hasOwnProperty("WaitStatus"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.WaitStatus);
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.cfgId);
            return writer;
        };

        /**
         * Encodes the specified WaitPlayerList_C2S message, length delimited. Does not implicitly {@link msg.WaitPlayerList_C2S.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.WaitPlayerList_C2S
         * @static
         * @param {msg.IWaitPlayerList_C2S} message WaitPlayerList_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WaitPlayerList_C2S.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WaitPlayerList_C2S message from the specified reader or buffer.
         * @function decode
         * @memberof msg.WaitPlayerList_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.WaitPlayerList_C2S} WaitPlayerList_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WaitPlayerList_C2S.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.WaitPlayerList_C2S();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.WaitStatus = reader.int32();
                    break;
                case 2:
                    message.cfgId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a WaitPlayerList_C2S message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.WaitPlayerList_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.WaitPlayerList_C2S} WaitPlayerList_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WaitPlayerList_C2S.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WaitPlayerList_C2S message.
         * @function verify
         * @memberof msg.WaitPlayerList_C2S
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WaitPlayerList_C2S.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.WaitStatus != null && message.hasOwnProperty("WaitStatus"))
                if (!$util.isInteger(message.WaitStatus))
                    return "WaitStatus: integer expected";
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                if (!$util.isString(message.cfgId))
                    return "cfgId: string expected";
            return null;
        };

        /**
         * Creates a WaitPlayerList_C2S message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.WaitPlayerList_C2S
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.WaitPlayerList_C2S} WaitPlayerList_C2S
         */
        WaitPlayerList_C2S.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.WaitPlayerList_C2S)
                return object;
            var message = new $root.msg.WaitPlayerList_C2S();
            if (object.WaitStatus != null)
                message.WaitStatus = object.WaitStatus | 0;
            if (object.cfgId != null)
                message.cfgId = String(object.cfgId);
            return message;
        };

        /**
         * Creates a plain object from a WaitPlayerList_C2S message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.WaitPlayerList_C2S
         * @static
         * @param {msg.WaitPlayerList_C2S} message WaitPlayerList_C2S
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WaitPlayerList_C2S.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.WaitStatus = 0;
                object.cfgId = "";
            }
            if (message.WaitStatus != null && message.hasOwnProperty("WaitStatus"))
                object.WaitStatus = message.WaitStatus;
            if (message.cfgId != null && message.hasOwnProperty("cfgId"))
                object.cfgId = message.cfgId;
            return object;
        };

        /**
         * Converts this WaitPlayerList_C2S to JSON.
         * @function toJSON
         * @memberof msg.WaitPlayerList_C2S
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WaitPlayerList_C2S.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return WaitPlayerList_C2S;
    })();

    msg.WaitPlayerList_S2C = (function() {

        /**
         * Properties of a WaitPlayerList_S2C.
         * @memberof msg
         * @interface IWaitPlayerList_S2C
         * @property {number|null} [WaitStatus] WaitPlayerList_S2C WaitStatus
         */

        /**
         * Constructs a new WaitPlayerList_S2C.
         * @memberof msg
         * @classdesc Represents a WaitPlayerList_S2C.
         * @implements IWaitPlayerList_S2C
         * @constructor
         * @param {msg.IWaitPlayerList_S2C=} [properties] Properties to set
         */
        function WaitPlayerList_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WaitPlayerList_S2C WaitStatus.
         * @member {number} WaitStatus
         * @memberof msg.WaitPlayerList_S2C
         * @instance
         */
        WaitPlayerList_S2C.prototype.WaitStatus = 0;

        /**
         * Creates a new WaitPlayerList_S2C instance using the specified properties.
         * @function create
         * @memberof msg.WaitPlayerList_S2C
         * @static
         * @param {msg.IWaitPlayerList_S2C=} [properties] Properties to set
         * @returns {msg.WaitPlayerList_S2C} WaitPlayerList_S2C instance
         */
        WaitPlayerList_S2C.create = function create(properties) {
            return new WaitPlayerList_S2C(properties);
        };

        /**
         * Encodes the specified WaitPlayerList_S2C message. Does not implicitly {@link msg.WaitPlayerList_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.WaitPlayerList_S2C
         * @static
         * @param {msg.IWaitPlayerList_S2C} message WaitPlayerList_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WaitPlayerList_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.WaitStatus != null && message.hasOwnProperty("WaitStatus"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.WaitStatus);
            return writer;
        };

        /**
         * Encodes the specified WaitPlayerList_S2C message, length delimited. Does not implicitly {@link msg.WaitPlayerList_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.WaitPlayerList_S2C
         * @static
         * @param {msg.IWaitPlayerList_S2C} message WaitPlayerList_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WaitPlayerList_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WaitPlayerList_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.WaitPlayerList_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.WaitPlayerList_S2C} WaitPlayerList_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WaitPlayerList_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.WaitPlayerList_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.WaitStatus = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a WaitPlayerList_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.WaitPlayerList_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.WaitPlayerList_S2C} WaitPlayerList_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WaitPlayerList_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WaitPlayerList_S2C message.
         * @function verify
         * @memberof msg.WaitPlayerList_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WaitPlayerList_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.WaitStatus != null && message.hasOwnProperty("WaitStatus"))
                if (!$util.isInteger(message.WaitStatus))
                    return "WaitStatus: integer expected";
            return null;
        };

        /**
         * Creates a WaitPlayerList_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.WaitPlayerList_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.WaitPlayerList_S2C} WaitPlayerList_S2C
         */
        WaitPlayerList_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.WaitPlayerList_S2C)
                return object;
            var message = new $root.msg.WaitPlayerList_S2C();
            if (object.WaitStatus != null)
                message.WaitStatus = object.WaitStatus | 0;
            return message;
        };

        /**
         * Creates a plain object from a WaitPlayerList_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.WaitPlayerList_S2C
         * @static
         * @param {msg.WaitPlayerList_S2C} message WaitPlayerList_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WaitPlayerList_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.WaitStatus = 0;
            if (message.WaitStatus != null && message.hasOwnProperty("WaitStatus"))
                object.WaitStatus = message.WaitStatus;
            return object;
        };

        /**
         * Converts this WaitPlayerList_S2C to JSON.
         * @function toJSON
         * @memberof msg.WaitPlayerList_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WaitPlayerList_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return WaitPlayerList_S2C;
    })();

    msg.ShowRoomInfo_C2S = (function() {

        /**
         * Properties of a ShowRoomInfo_C2S.
         * @memberof msg
         * @interface IShowRoomInfo_C2S
         */

        /**
         * Constructs a new ShowRoomInfo_C2S.
         * @memberof msg
         * @classdesc Represents a ShowRoomInfo_C2S.
         * @implements IShowRoomInfo_C2S
         * @constructor
         * @param {msg.IShowRoomInfo_C2S=} [properties] Properties to set
         */
        function ShowRoomInfo_C2S(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new ShowRoomInfo_C2S instance using the specified properties.
         * @function create
         * @memberof msg.ShowRoomInfo_C2S
         * @static
         * @param {msg.IShowRoomInfo_C2S=} [properties] Properties to set
         * @returns {msg.ShowRoomInfo_C2S} ShowRoomInfo_C2S instance
         */
        ShowRoomInfo_C2S.create = function create(properties) {
            return new ShowRoomInfo_C2S(properties);
        };

        /**
         * Encodes the specified ShowRoomInfo_C2S message. Does not implicitly {@link msg.ShowRoomInfo_C2S.verify|verify} messages.
         * @function encode
         * @memberof msg.ShowRoomInfo_C2S
         * @static
         * @param {msg.IShowRoomInfo_C2S} message ShowRoomInfo_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ShowRoomInfo_C2S.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified ShowRoomInfo_C2S message, length delimited. Does not implicitly {@link msg.ShowRoomInfo_C2S.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.ShowRoomInfo_C2S
         * @static
         * @param {msg.IShowRoomInfo_C2S} message ShowRoomInfo_C2S message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ShowRoomInfo_C2S.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ShowRoomInfo_C2S message from the specified reader or buffer.
         * @function decode
         * @memberof msg.ShowRoomInfo_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.ShowRoomInfo_C2S} ShowRoomInfo_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ShowRoomInfo_C2S.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.ShowRoomInfo_C2S();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ShowRoomInfo_C2S message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.ShowRoomInfo_C2S
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.ShowRoomInfo_C2S} ShowRoomInfo_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ShowRoomInfo_C2S.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ShowRoomInfo_C2S message.
         * @function verify
         * @memberof msg.ShowRoomInfo_C2S
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ShowRoomInfo_C2S.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a ShowRoomInfo_C2S message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.ShowRoomInfo_C2S
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.ShowRoomInfo_C2S} ShowRoomInfo_C2S
         */
        ShowRoomInfo_C2S.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.ShowRoomInfo_C2S)
                return object;
            return new $root.msg.ShowRoomInfo_C2S();
        };

        /**
         * Creates a plain object from a ShowRoomInfo_C2S message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.ShowRoomInfo_C2S
         * @static
         * @param {msg.ShowRoomInfo_C2S} message ShowRoomInfo_C2S
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ShowRoomInfo_C2S.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this ShowRoomInfo_C2S to JSON.
         * @function toJSON
         * @memberof msg.ShowRoomInfo_C2S
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ShowRoomInfo_C2S.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ShowRoomInfo_C2S;
    })();

    msg.ShowRoomInfo_S2C = (function() {

        /**
         * Properties of a ShowRoomInfo_S2C.
         * @memberof msg
         * @interface IShowRoomInfo_S2C
         * @property {msg.IRoomData|null} [roomData] ShowRoomInfo_S2C roomData
         */

        /**
         * Constructs a new ShowRoomInfo_S2C.
         * @memberof msg
         * @classdesc Represents a ShowRoomInfo_S2C.
         * @implements IShowRoomInfo_S2C
         * @constructor
         * @param {msg.IShowRoomInfo_S2C=} [properties] Properties to set
         */
        function ShowRoomInfo_S2C(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ShowRoomInfo_S2C roomData.
         * @member {msg.IRoomData|null|undefined} roomData
         * @memberof msg.ShowRoomInfo_S2C
         * @instance
         */
        ShowRoomInfo_S2C.prototype.roomData = null;

        /**
         * Creates a new ShowRoomInfo_S2C instance using the specified properties.
         * @function create
         * @memberof msg.ShowRoomInfo_S2C
         * @static
         * @param {msg.IShowRoomInfo_S2C=} [properties] Properties to set
         * @returns {msg.ShowRoomInfo_S2C} ShowRoomInfo_S2C instance
         */
        ShowRoomInfo_S2C.create = function create(properties) {
            return new ShowRoomInfo_S2C(properties);
        };

        /**
         * Encodes the specified ShowRoomInfo_S2C message. Does not implicitly {@link msg.ShowRoomInfo_S2C.verify|verify} messages.
         * @function encode
         * @memberof msg.ShowRoomInfo_S2C
         * @static
         * @param {msg.IShowRoomInfo_S2C} message ShowRoomInfo_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ShowRoomInfo_S2C.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                $root.msg.RoomData.encode(message.roomData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ShowRoomInfo_S2C message, length delimited. Does not implicitly {@link msg.ShowRoomInfo_S2C.verify|verify} messages.
         * @function encodeDelimited
         * @memberof msg.ShowRoomInfo_S2C
         * @static
         * @param {msg.IShowRoomInfo_S2C} message ShowRoomInfo_S2C message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ShowRoomInfo_S2C.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ShowRoomInfo_S2C message from the specified reader or buffer.
         * @function decode
         * @memberof msg.ShowRoomInfo_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {msg.ShowRoomInfo_S2C} ShowRoomInfo_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ShowRoomInfo_S2C.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.msg.ShowRoomInfo_S2C();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomData = $root.msg.RoomData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ShowRoomInfo_S2C message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof msg.ShowRoomInfo_S2C
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {msg.ShowRoomInfo_S2C} ShowRoomInfo_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ShowRoomInfo_S2C.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ShowRoomInfo_S2C message.
         * @function verify
         * @memberof msg.ShowRoomInfo_S2C
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ShowRoomInfo_S2C.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomData != null && message.hasOwnProperty("roomData")) {
                var error = $root.msg.RoomData.verify(message.roomData);
                if (error)
                    return "roomData." + error;
            }
            return null;
        };

        /**
         * Creates a ShowRoomInfo_S2C message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof msg.ShowRoomInfo_S2C
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {msg.ShowRoomInfo_S2C} ShowRoomInfo_S2C
         */
        ShowRoomInfo_S2C.fromObject = function fromObject(object) {
            if (object instanceof $root.msg.ShowRoomInfo_S2C)
                return object;
            var message = new $root.msg.ShowRoomInfo_S2C();
            if (object.roomData != null) {
                if (typeof object.roomData !== "object")
                    throw TypeError(".msg.ShowRoomInfo_S2C.roomData: object expected");
                message.roomData = $root.msg.RoomData.fromObject(object.roomData);
            }
            return message;
        };

        /**
         * Creates a plain object from a ShowRoomInfo_S2C message. Also converts values to other types if specified.
         * @function toObject
         * @memberof msg.ShowRoomInfo_S2C
         * @static
         * @param {msg.ShowRoomInfo_S2C} message ShowRoomInfo_S2C
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ShowRoomInfo_S2C.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.roomData = null;
            if (message.roomData != null && message.hasOwnProperty("roomData"))
                object.roomData = $root.msg.RoomData.toObject(message.roomData, options);
            return object;
        };

        /**
         * Converts this ShowRoomInfo_S2C to JSON.
         * @function toJSON
         * @memberof msg.ShowRoomInfo_S2C
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ShowRoomInfo_S2C.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ShowRoomInfo_S2C;
    })();

    return msg;
})();

module.exports = $root;
