import * as $protobuf from "protobufjs";
/** Namespace msg. */
export namespace msg {

    /** MessageID enum. */
    enum MessageID {
        MSG_Ping = 0,
        MSG_Pong = 1,
        MSG_Error_S2C = 2,
        MSG_Login_C2S = 3,
        MSG_Login_S2C = 4,
        MSG_Logout_C2S = 5,
        MSG_Logout_S2C = 6,
        MSG_QuickStart_C2S = 7,
        MSG_ChangeTable_C2S = 8,
        MSG_JoinRoom_S2C = 9,
        MSG_EnterRoom_S2C = 10,
        MSG_NoticeJoin_S2C = 11,
        MSG_LeaveRoom_C2S = 12,
        MSG_LeaveRoom_S2C = 13,
        MSG_SitDown_C2S = 14,
        MSG_SitDown_S2C = 15,
        MSG_StandUp_C2S = 16,
        MSG_StandUp_S2C = 17,
        MSG_PlayerAction_C2S = 18,
        MSG_PlayerAction_S2C = 19,
        MSG_PlayerActionChange_S2C = 20,
        MSG_AddChips_C2S = 21,
        MSG_AddChips_S2C = 22,
        MSG_GameStepChange_S2C = 23,
        MSG_ResultGameData_S2C = 24,
        MSG_ReadyTime_S2C = 25,
        MSG_SettleTime_S2C = 26,
        MSG_PushCardTime_S2C = 27,
        MSG_RoomStatus_C2S = 28,
        MSG_RoomStatus_S2C = 29,
        MSG_EmojiChat_C2S = 30,
        MSG_EmojiChat_S2C = 31,
        MSG_PiPeiPlayer_S2C = 32,
        MSG_PiPeiData_S2C = 33,
        MSG_SendActTimer_S2C = 34,
        MSG_SendRoomData_S2C = 35,
        MSG_WaitPlayerList_C2S = 36,
        MSG_WaitPlayerList_S2C = 37,
        MSG_ShowRoomInfo_C2S = 38,
        MSG_ShowRoomInfo_S2C = 39
    }

    /** Properties of a Ping. */
    interface IPing {
    }

    /** Represents a Ping. */
    class Ping implements IPing {

        /**
         * Constructs a new Ping.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IPing);

        /**
         * Creates a new Ping instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Ping instance
         */
        public static create(properties?: msg.IPing): msg.Ping;

        /**
         * Encodes the specified Ping message. Does not implicitly {@link msg.Ping.verify|verify} messages.
         * @param message Ping message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IPing, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Ping message, length delimited. Does not implicitly {@link msg.Ping.verify|verify} messages.
         * @param message Ping message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IPing, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Ping message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Ping
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.Ping;

        /**
         * Decodes a Ping message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Ping
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.Ping;

        /**
         * Verifies a Ping message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Ping message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Ping
         */
        public static fromObject(object: { [k: string]: any }): msg.Ping;

        /**
         * Creates a plain object from a Ping message. Also converts values to other types if specified.
         * @param message Ping
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.Ping, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Ping to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Pong. */
    interface IPong {

        /** Pong serverTime */
        serverTime?: (number|Long|null);
    }

    /** Represents a Pong. */
    class Pong implements IPong {

        /**
         * Constructs a new Pong.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IPong);

        /** Pong serverTime. */
        public serverTime: (number|Long);

        /**
         * Creates a new Pong instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Pong instance
         */
        public static create(properties?: msg.IPong): msg.Pong;

        /**
         * Encodes the specified Pong message. Does not implicitly {@link msg.Pong.verify|verify} messages.
         * @param message Pong message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IPong, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Pong message, length delimited. Does not implicitly {@link msg.Pong.verify|verify} messages.
         * @param message Pong message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IPong, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Pong message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Pong
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.Pong;

        /**
         * Decodes a Pong message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Pong
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.Pong;

        /**
         * Verifies a Pong message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Pong message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Pong
         */
        public static fromObject(object: { [k: string]: any }): msg.Pong;

        /**
         * Creates a plain object from a Pong message. Also converts values to other types if specified.
         * @param message Pong
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.Pong, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Pong to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** ErrorMsg enum. */
    enum ErrorMsg {
        SUCCESS = 0,
        UserRepeatLogin = 101,
        UserRemoteLogin = 102,
        ChipsInsufficient = 103,
        ChairAlreadyFull = 104,
        UserNotChangeTable = 105,
        UserTimeOutFoldCard = 106,
        UserStandUpTimeOut = 107,
        UserInGameNotStandUp = 108,
        UserInGameStandUpFold = 109
    }

    /** Properties of an Error_S2C. */
    interface IError_S2C {

        /** Error_S2C error */
        error?: (msg.ErrorMsg|null);

        /** Error_S2C data */
        data?: (string|null);
    }

    /** Represents an Error_S2C. */
    class Error_S2C implements IError_S2C {

        /**
         * Constructs a new Error_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IError_S2C);

        /** Error_S2C error. */
        public error: msg.ErrorMsg;

        /** Error_S2C data. */
        public data: string;

        /**
         * Creates a new Error_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Error_S2C instance
         */
        public static create(properties?: msg.IError_S2C): msg.Error_S2C;

        /**
         * Encodes the specified Error_S2C message. Does not implicitly {@link msg.Error_S2C.verify|verify} messages.
         * @param message Error_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IError_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Error_S2C message, length delimited. Does not implicitly {@link msg.Error_S2C.verify|verify} messages.
         * @param message Error_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IError_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Error_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Error_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.Error_S2C;

        /**
         * Decodes an Error_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Error_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.Error_S2C;

        /**
         * Verifies an Error_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Error_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Error_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.Error_S2C;

        /**
         * Creates a plain object from an Error_S2C message. Also converts values to other types if specified.
         * @param message Error_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.Error_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Error_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Login_C2S. */
    interface ILogin_C2S {

        /** Login_C2S Id */
        Id?: (string|null);

        /** Login_C2S PassWord */
        PassWord?: (string|null);

        /** Login_C2S Token */
        Token?: (string|null);
    }

    /** Represents a Login_C2S. */
    class Login_C2S implements ILogin_C2S {

        /**
         * Constructs a new Login_C2S.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.ILogin_C2S);

        /** Login_C2S Id. */
        public Id: string;

        /** Login_C2S PassWord. */
        public PassWord: string;

        /** Login_C2S Token. */
        public Token: string;

        /**
         * Creates a new Login_C2S instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Login_C2S instance
         */
        public static create(properties?: msg.ILogin_C2S): msg.Login_C2S;

        /**
         * Encodes the specified Login_C2S message. Does not implicitly {@link msg.Login_C2S.verify|verify} messages.
         * @param message Login_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.ILogin_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Login_C2S message, length delimited. Does not implicitly {@link msg.Login_C2S.verify|verify} messages.
         * @param message Login_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.ILogin_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Login_C2S message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Login_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.Login_C2S;

        /**
         * Decodes a Login_C2S message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Login_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.Login_C2S;

        /**
         * Verifies a Login_C2S message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Login_C2S message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Login_C2S
         */
        public static fromObject(object: { [k: string]: any }): msg.Login_C2S;

        /**
         * Creates a plain object from a Login_C2S message. Also converts values to other types if specified.
         * @param message Login_C2S
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.Login_C2S, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Login_C2S to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PlayerInfo. */
    interface IPlayerInfo {

        /** PlayerInfo Id */
        Id?: (string|null);

        /** PlayerInfo nickName */
        nickName?: (string|null);

        /** PlayerInfo headImg */
        headImg?: (string|null);

        /** PlayerInfo account */
        account?: (number|null);
    }

    /** Represents a PlayerInfo. */
    class PlayerInfo implements IPlayerInfo {

        /**
         * Constructs a new PlayerInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IPlayerInfo);

        /** PlayerInfo Id. */
        public Id: string;

        /** PlayerInfo nickName. */
        public nickName: string;

        /** PlayerInfo headImg. */
        public headImg: string;

        /** PlayerInfo account. */
        public account: number;

        /**
         * Creates a new PlayerInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerInfo instance
         */
        public static create(properties?: msg.IPlayerInfo): msg.PlayerInfo;

        /**
         * Encodes the specified PlayerInfo message. Does not implicitly {@link msg.PlayerInfo.verify|verify} messages.
         * @param message PlayerInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IPlayerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PlayerInfo message, length delimited. Does not implicitly {@link msg.PlayerInfo.verify|verify} messages.
         * @param message PlayerInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IPlayerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.PlayerInfo;

        /**
         * Decodes a PlayerInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.PlayerInfo;

        /**
         * Verifies a PlayerInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PlayerInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PlayerInfo
         */
        public static fromObject(object: { [k: string]: any }): msg.PlayerInfo;

        /**
         * Creates a plain object from a PlayerInfo message. Also converts values to other types if specified.
         * @param message PlayerInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.PlayerInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PlayerInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Login_S2C. */
    interface ILogin_S2C {

        /** Login_S2C playerInfo */
        playerInfo?: (msg.IPlayerInfo|null);

        /** Login_S2C backroom */
        backroom?: (boolean|null);
    }

    /** Represents a Login_S2C. */
    class Login_S2C implements ILogin_S2C {

        /**
         * Constructs a new Login_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.ILogin_S2C);

        /** Login_S2C playerInfo. */
        public playerInfo?: (msg.IPlayerInfo|null);

        /** Login_S2C backroom. */
        public backroom: boolean;

        /**
         * Creates a new Login_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Login_S2C instance
         */
        public static create(properties?: msg.ILogin_S2C): msg.Login_S2C;

        /**
         * Encodes the specified Login_S2C message. Does not implicitly {@link msg.Login_S2C.verify|verify} messages.
         * @param message Login_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.ILogin_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Login_S2C message, length delimited. Does not implicitly {@link msg.Login_S2C.verify|verify} messages.
         * @param message Login_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.ILogin_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Login_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Login_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.Login_S2C;

        /**
         * Decodes a Login_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Login_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.Login_S2C;

        /**
         * Verifies a Login_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Login_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Login_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.Login_S2C;

        /**
         * Creates a plain object from a Login_S2C message. Also converts values to other types if specified.
         * @param message Login_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.Login_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Login_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Logout_C2S. */
    interface ILogout_C2S {
    }

    /** Represents a Logout_C2S. */
    class Logout_C2S implements ILogout_C2S {

        /**
         * Constructs a new Logout_C2S.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.ILogout_C2S);

        /**
         * Creates a new Logout_C2S instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Logout_C2S instance
         */
        public static create(properties?: msg.ILogout_C2S): msg.Logout_C2S;

        /**
         * Encodes the specified Logout_C2S message. Does not implicitly {@link msg.Logout_C2S.verify|verify} messages.
         * @param message Logout_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.ILogout_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Logout_C2S message, length delimited. Does not implicitly {@link msg.Logout_C2S.verify|verify} messages.
         * @param message Logout_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.ILogout_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Logout_C2S message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Logout_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.Logout_C2S;

        /**
         * Decodes a Logout_C2S message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Logout_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.Logout_C2S;

        /**
         * Verifies a Logout_C2S message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Logout_C2S message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Logout_C2S
         */
        public static fromObject(object: { [k: string]: any }): msg.Logout_C2S;

        /**
         * Creates a plain object from a Logout_C2S message. Also converts values to other types if specified.
         * @param message Logout_C2S
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.Logout_C2S, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Logout_C2S to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Logout_S2C. */
    interface ILogout_S2C {
    }

    /** Represents a Logout_S2C. */
    class Logout_S2C implements ILogout_S2C {

        /**
         * Constructs a new Logout_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.ILogout_S2C);

        /**
         * Creates a new Logout_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Logout_S2C instance
         */
        public static create(properties?: msg.ILogout_S2C): msg.Logout_S2C;

        /**
         * Encodes the specified Logout_S2C message. Does not implicitly {@link msg.Logout_S2C.verify|verify} messages.
         * @param message Logout_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.ILogout_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Logout_S2C message, length delimited. Does not implicitly {@link msg.Logout_S2C.verify|verify} messages.
         * @param message Logout_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.ILogout_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Logout_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Logout_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.Logout_S2C;

        /**
         * Decodes a Logout_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Logout_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.Logout_S2C;

        /**
         * Verifies a Logout_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Logout_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Logout_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.Logout_S2C;

        /**
         * Creates a plain object from a Logout_S2C message. Also converts values to other types if specified.
         * @param message Logout_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.Logout_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Logout_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** CardSuit enum. */
    enum CardSuit {
        XXX_Card = 0,
        HighCard = 1,
        OnePair = 2,
        TwoPairs = 3,
        ThreeKind = 4,
        Straight = 5,
        Flush = 6,
        FullHouse = 7,
        FourKind = 8,
        StraightFlush = 9,
        RoyalFlush = 10
    }

    /** GameStep enum. */
    enum GameStep {
        Waiting = 0,
        PreFlop = 1,
        Flop = 2,
        Turn = 3,
        River = 4,
        ShowDown = 5
    }

    /** ActionStatus enum. */
    enum ActionStatus {
        WAITING = 0,
        RAISE = 1,
        CALL = 2,
        CHECK = 3,
        FOLD = 4,
        ALLIN = 5
    }

    /** BlindType enum. */
    enum BlindType {
        No_Blind = 0,
        Small_Blind = 1,
        Big_Blind = 2
    }

    /** Properties of a CardSuitData. */
    interface ICardSuitData {

        /** CardSuitData handCardKeys */
        handCardKeys?: (number[]|null);

        /** CardSuitData publicCardKeys */
        publicCardKeys?: (number[]|null);

        /** CardSuitData suitPattern */
        suitPattern?: (msg.CardSuit|null);
    }

    /** Represents a CardSuitData. */
    class CardSuitData implements ICardSuitData {

        /**
         * Constructs a new CardSuitData.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.ICardSuitData);

        /** CardSuitData handCardKeys. */
        public handCardKeys: number[];

        /** CardSuitData publicCardKeys. */
        public publicCardKeys: number[];

        /** CardSuitData suitPattern. */
        public suitPattern: msg.CardSuit;

        /**
         * Creates a new CardSuitData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CardSuitData instance
         */
        public static create(properties?: msg.ICardSuitData): msg.CardSuitData;

        /**
         * Encodes the specified CardSuitData message. Does not implicitly {@link msg.CardSuitData.verify|verify} messages.
         * @param message CardSuitData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.ICardSuitData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CardSuitData message, length delimited. Does not implicitly {@link msg.CardSuitData.verify|verify} messages.
         * @param message CardSuitData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.ICardSuitData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CardSuitData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CardSuitData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.CardSuitData;

        /**
         * Decodes a CardSuitData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CardSuitData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.CardSuitData;

        /**
         * Verifies a CardSuitData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CardSuitData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CardSuitData
         */
        public static fromObject(object: { [k: string]: any }): msg.CardSuitData;

        /**
         * Creates a plain object from a CardSuitData message. Also converts values to other types if specified.
         * @param message CardSuitData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.CardSuitData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CardSuitData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PlayerData. */
    interface IPlayerData {

        /** PlayerData playerInfo */
        playerInfo?: (msg.IPlayerInfo|null);

        /** PlayerData chair */
        chair?: (number|null);

        /** PlayerData standUPNum */
        standUPNum?: (number|null);

        /** PlayerData chips */
        chips?: (number|null);

        /** PlayerData roomChips */
        roomChips?: (number|null);

        /** PlayerData actionStatus */
        actionStatus?: (msg.ActionStatus|null);

        /** PlayerData gameStep */
        gameStep?: (number|null);

        /** PlayerData downBets */
        downBets?: (number|null);

        /** PlayerData lunDownBets */
        lunDownBets?: (number|null);

        /** PlayerData totalDownBet */
        totalDownBet?: (number|null);

        /** PlayerData handCards */
        handCards?: (number[]|null);

        /** PlayerData cardSuitData */
        cardSuitData?: (msg.ICardSuitData|null);

        /** PlayerData resultMoney */
        resultMoney?: (number|null);

        /** PlayerData blindType */
        blindType?: (msg.BlindType|null);

        /** PlayerData IsButton */
        IsButton?: (boolean|null);

        /** PlayerData IsAllIn */
        IsAllIn?: (boolean|null);

        /** PlayerData IsWinner */
        IsWinner?: (boolean|null);

        /** PlayerData IsInGame */
        IsInGame?: (boolean|null);

        /** PlayerData IsStandUp */
        IsStandUp?: (boolean|null);

        /** PlayerData IsLeaveR */
        IsLeaveR?: (boolean|null);

        /** PlayerData timerCount */
        timerCount?: (number|null);

        /** PlayerData account */
        account?: (number|null);

        /** PlayerData resultGetMoney */
        resultGetMoney?: (number|null);
    }

    /** Represents a PlayerData. */
    class PlayerData implements IPlayerData {

        /**
         * Constructs a new PlayerData.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IPlayerData);

        /** PlayerData playerInfo. */
        public playerInfo?: (msg.IPlayerInfo|null);

        /** PlayerData chair. */
        public chair: number;

        /** PlayerData standUPNum. */
        public standUPNum: number;

        /** PlayerData chips. */
        public chips: number;

        /** PlayerData roomChips. */
        public roomChips: number;

        /** PlayerData actionStatus. */
        public actionStatus: msg.ActionStatus;

        /** PlayerData gameStep. */
        public gameStep: number;

        /** PlayerData downBets. */
        public downBets: number;

        /** PlayerData lunDownBets. */
        public lunDownBets: number;

        /** PlayerData totalDownBet. */
        public totalDownBet: number;

        /** PlayerData handCards. */
        public handCards: number[];

        /** PlayerData cardSuitData. */
        public cardSuitData?: (msg.ICardSuitData|null);

        /** PlayerData resultMoney. */
        public resultMoney: number;

        /** PlayerData blindType. */
        public blindType: msg.BlindType;

        /** PlayerData IsButton. */
        public IsButton: boolean;

        /** PlayerData IsAllIn. */
        public IsAllIn: boolean;

        /** PlayerData IsWinner. */
        public IsWinner: boolean;

        /** PlayerData IsInGame. */
        public IsInGame: boolean;

        /** PlayerData IsStandUp. */
        public IsStandUp: boolean;

        /** PlayerData IsLeaveR. */
        public IsLeaveR: boolean;

        /** PlayerData timerCount. */
        public timerCount: number;

        /** PlayerData account. */
        public account: number;

        /** PlayerData resultGetMoney. */
        public resultGetMoney: number;

        /**
         * Creates a new PlayerData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerData instance
         */
        public static create(properties?: msg.IPlayerData): msg.PlayerData;

        /**
         * Encodes the specified PlayerData message. Does not implicitly {@link msg.PlayerData.verify|verify} messages.
         * @param message PlayerData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IPlayerData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PlayerData message, length delimited. Does not implicitly {@link msg.PlayerData.verify|verify} messages.
         * @param message PlayerData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IPlayerData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.PlayerData;

        /**
         * Decodes a PlayerData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PlayerData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.PlayerData;

        /**
         * Verifies a PlayerData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PlayerData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PlayerData
         */
        public static fromObject(object: { [k: string]: any }): msg.PlayerData;

        /**
         * Creates a plain object from a PlayerData message. Also converts values to other types if specified.
         * @param message PlayerData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.PlayerData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PlayerData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomData. */
    interface IRoomData {

        /** RoomData roomId */
        roomId?: (string|null);

        /** RoomData cfgId */
        cfgId?: (string|null);

        /** RoomData gameStep */
        gameStep?: (msg.GameStep|null);

        /** RoomData minRaise */
        minRaise?: (number|null);

        /** RoomData preChips */
        preChips?: (number|null);

        /** RoomData activeId */
        activeId?: (string|null);

        /** RoomData banker */
        banker?: (number|null);

        /** RoomData bigBlind */
        bigBlind?: (number|null);

        /** RoomData potMoney */
        potMoney?: (number|null);

        /** RoomData isShowDown */
        isShowDown?: (number|null);

        /** RoomData isHaveAllin */
        isHaveAllin?: (boolean|null);

        /** RoomData publicCards */
        publicCards?: (number[]|null);

        /** RoomData playerData */
        playerData?: (msg.IPlayerData[]|null);

        /** RoomData AllPlayer */
        AllPlayer?: (msg.IPlayerData[]|null);
    }

    /** Represents a RoomData. */
    class RoomData implements IRoomData {

        /**
         * Constructs a new RoomData.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IRoomData);

        /** RoomData roomId. */
        public roomId: string;

        /** RoomData cfgId. */
        public cfgId: string;

        /** RoomData gameStep. */
        public gameStep: msg.GameStep;

        /** RoomData minRaise. */
        public minRaise: number;

        /** RoomData preChips. */
        public preChips: number;

        /** RoomData activeId. */
        public activeId: string;

        /** RoomData banker. */
        public banker: number;

        /** RoomData bigBlind. */
        public bigBlind: number;

        /** RoomData potMoney. */
        public potMoney: number;

        /** RoomData isShowDown. */
        public isShowDown: number;

        /** RoomData isHaveAllin. */
        public isHaveAllin: boolean;

        /** RoomData publicCards. */
        public publicCards: number[];

        /** RoomData playerData. */
        public playerData: msg.IPlayerData[];

        /** RoomData AllPlayer. */
        public AllPlayer: msg.IPlayerData[];

        /**
         * Creates a new RoomData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomData instance
         */
        public static create(properties?: msg.IRoomData): msg.RoomData;

        /**
         * Encodes the specified RoomData message. Does not implicitly {@link msg.RoomData.verify|verify} messages.
         * @param message RoomData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IRoomData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomData message, length delimited. Does not implicitly {@link msg.RoomData.verify|verify} messages.
         * @param message RoomData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IRoomData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.RoomData;

        /**
         * Decodes a RoomData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.RoomData;

        /**
         * Verifies a RoomData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomData
         */
        public static fromObject(object: { [k: string]: any }): msg.RoomData;

        /**
         * Creates a plain object from a RoomData message. Also converts values to other types if specified.
         * @param message RoomData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.RoomData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a QuickStart_C2S. */
    interface IQuickStart_C2S {

        /** QuickStart_C2S cfgId */
        cfgId?: (string|null);
    }

    /** Represents a QuickStart_C2S. */
    class QuickStart_C2S implements IQuickStart_C2S {

        /**
         * Constructs a new QuickStart_C2S.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IQuickStart_C2S);

        /** QuickStart_C2S cfgId. */
        public cfgId: string;

        /**
         * Creates a new QuickStart_C2S instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QuickStart_C2S instance
         */
        public static create(properties?: msg.IQuickStart_C2S): msg.QuickStart_C2S;

        /**
         * Encodes the specified QuickStart_C2S message. Does not implicitly {@link msg.QuickStart_C2S.verify|verify} messages.
         * @param message QuickStart_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IQuickStart_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified QuickStart_C2S message, length delimited. Does not implicitly {@link msg.QuickStart_C2S.verify|verify} messages.
         * @param message QuickStart_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IQuickStart_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QuickStart_C2S message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QuickStart_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.QuickStart_C2S;

        /**
         * Decodes a QuickStart_C2S message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns QuickStart_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.QuickStart_C2S;

        /**
         * Verifies a QuickStart_C2S message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a QuickStart_C2S message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns QuickStart_C2S
         */
        public static fromObject(object: { [k: string]: any }): msg.QuickStart_C2S;

        /**
         * Creates a plain object from a QuickStart_C2S message. Also converts values to other types if specified.
         * @param message QuickStart_C2S
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.QuickStart_C2S, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this QuickStart_C2S to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChangeTable_C2S. */
    interface IChangeTable_C2S {
    }

    /** Represents a ChangeTable_C2S. */
    class ChangeTable_C2S implements IChangeTable_C2S {

        /**
         * Constructs a new ChangeTable_C2S.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IChangeTable_C2S);

        /**
         * Creates a new ChangeTable_C2S instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChangeTable_C2S instance
         */
        public static create(properties?: msg.IChangeTable_C2S): msg.ChangeTable_C2S;

        /**
         * Encodes the specified ChangeTable_C2S message. Does not implicitly {@link msg.ChangeTable_C2S.verify|verify} messages.
         * @param message ChangeTable_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IChangeTable_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChangeTable_C2S message, length delimited. Does not implicitly {@link msg.ChangeTable_C2S.verify|verify} messages.
         * @param message ChangeTable_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IChangeTable_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChangeTable_C2S message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChangeTable_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.ChangeTable_C2S;

        /**
         * Decodes a ChangeTable_C2S message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChangeTable_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.ChangeTable_C2S;

        /**
         * Verifies a ChangeTable_C2S message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChangeTable_C2S message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChangeTable_C2S
         */
        public static fromObject(object: { [k: string]: any }): msg.ChangeTable_C2S;

        /**
         * Creates a plain object from a ChangeTable_C2S message. Also converts values to other types if specified.
         * @param message ChangeTable_C2S
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.ChangeTable_C2S, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChangeTable_C2S to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a JoinRoom_S2C. */
    interface IJoinRoom_S2C {

        /** JoinRoom_S2C roomData */
        roomData?: (msg.IRoomData|null);
    }

    /** Represents a JoinRoom_S2C. */
    class JoinRoom_S2C implements IJoinRoom_S2C {

        /**
         * Constructs a new JoinRoom_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IJoinRoom_S2C);

        /** JoinRoom_S2C roomData. */
        public roomData?: (msg.IRoomData|null);

        /**
         * Creates a new JoinRoom_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JoinRoom_S2C instance
         */
        public static create(properties?: msg.IJoinRoom_S2C): msg.JoinRoom_S2C;

        /**
         * Encodes the specified JoinRoom_S2C message. Does not implicitly {@link msg.JoinRoom_S2C.verify|verify} messages.
         * @param message JoinRoom_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IJoinRoom_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified JoinRoom_S2C message, length delimited. Does not implicitly {@link msg.JoinRoom_S2C.verify|verify} messages.
         * @param message JoinRoom_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IJoinRoom_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JoinRoom_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JoinRoom_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.JoinRoom_S2C;

        /**
         * Decodes a JoinRoom_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JoinRoom_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.JoinRoom_S2C;

        /**
         * Verifies a JoinRoom_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a JoinRoom_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns JoinRoom_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.JoinRoom_S2C;

        /**
         * Creates a plain object from a JoinRoom_S2C message. Also converts values to other types if specified.
         * @param message JoinRoom_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.JoinRoom_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this JoinRoom_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EnterRoom_S2C. */
    interface IEnterRoom_S2C {

        /** EnterRoom_S2C roomData */
        roomData?: (msg.IRoomData|null);
    }

    /** Represents an EnterRoom_S2C. */
    class EnterRoom_S2C implements IEnterRoom_S2C {

        /**
         * Constructs a new EnterRoom_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IEnterRoom_S2C);

        /** EnterRoom_S2C roomData. */
        public roomData?: (msg.IRoomData|null);

        /**
         * Creates a new EnterRoom_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EnterRoom_S2C instance
         */
        public static create(properties?: msg.IEnterRoom_S2C): msg.EnterRoom_S2C;

        /**
         * Encodes the specified EnterRoom_S2C message. Does not implicitly {@link msg.EnterRoom_S2C.verify|verify} messages.
         * @param message EnterRoom_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IEnterRoom_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EnterRoom_S2C message, length delimited. Does not implicitly {@link msg.EnterRoom_S2C.verify|verify} messages.
         * @param message EnterRoom_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IEnterRoom_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EnterRoom_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EnterRoom_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.EnterRoom_S2C;

        /**
         * Decodes an EnterRoom_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EnterRoom_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.EnterRoom_S2C;

        /**
         * Verifies an EnterRoom_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EnterRoom_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EnterRoom_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.EnterRoom_S2C;

        /**
         * Creates a plain object from an EnterRoom_S2C message. Also converts values to other types if specified.
         * @param message EnterRoom_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.EnterRoom_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EnterRoom_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a NoticeJoin_S2C. */
    interface INoticeJoin_S2C {

        /** NoticeJoin_S2C playerData */
        playerData?: (msg.IPlayerData|null);
    }

    /** Represents a NoticeJoin_S2C. */
    class NoticeJoin_S2C implements INoticeJoin_S2C {

        /**
         * Constructs a new NoticeJoin_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.INoticeJoin_S2C);

        /** NoticeJoin_S2C playerData. */
        public playerData?: (msg.IPlayerData|null);

        /**
         * Creates a new NoticeJoin_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NoticeJoin_S2C instance
         */
        public static create(properties?: msg.INoticeJoin_S2C): msg.NoticeJoin_S2C;

        /**
         * Encodes the specified NoticeJoin_S2C message. Does not implicitly {@link msg.NoticeJoin_S2C.verify|verify} messages.
         * @param message NoticeJoin_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.INoticeJoin_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NoticeJoin_S2C message, length delimited. Does not implicitly {@link msg.NoticeJoin_S2C.verify|verify} messages.
         * @param message NoticeJoin_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.INoticeJoin_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NoticeJoin_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NoticeJoin_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.NoticeJoin_S2C;

        /**
         * Decodes a NoticeJoin_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NoticeJoin_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.NoticeJoin_S2C;

        /**
         * Verifies a NoticeJoin_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NoticeJoin_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NoticeJoin_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.NoticeJoin_S2C;

        /**
         * Creates a plain object from a NoticeJoin_S2C message. Also converts values to other types if specified.
         * @param message NoticeJoin_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.NoticeJoin_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NoticeJoin_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LeaveRoom_C2S. */
    interface ILeaveRoom_C2S {
    }

    /** Represents a LeaveRoom_C2S. */
    class LeaveRoom_C2S implements ILeaveRoom_C2S {

        /**
         * Constructs a new LeaveRoom_C2S.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.ILeaveRoom_C2S);

        /**
         * Creates a new LeaveRoom_C2S instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LeaveRoom_C2S instance
         */
        public static create(properties?: msg.ILeaveRoom_C2S): msg.LeaveRoom_C2S;

        /**
         * Encodes the specified LeaveRoom_C2S message. Does not implicitly {@link msg.LeaveRoom_C2S.verify|verify} messages.
         * @param message LeaveRoom_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.ILeaveRoom_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LeaveRoom_C2S message, length delimited. Does not implicitly {@link msg.LeaveRoom_C2S.verify|verify} messages.
         * @param message LeaveRoom_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.ILeaveRoom_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LeaveRoom_C2S message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LeaveRoom_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.LeaveRoom_C2S;

        /**
         * Decodes a LeaveRoom_C2S message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LeaveRoom_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.LeaveRoom_C2S;

        /**
         * Verifies a LeaveRoom_C2S message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LeaveRoom_C2S message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LeaveRoom_C2S
         */
        public static fromObject(object: { [k: string]: any }): msg.LeaveRoom_C2S;

        /**
         * Creates a plain object from a LeaveRoom_C2S message. Also converts values to other types if specified.
         * @param message LeaveRoom_C2S
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.LeaveRoom_C2S, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LeaveRoom_C2S to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LeaveRoom_S2C. */
    interface ILeaveRoom_S2C {

        /** LeaveRoom_S2C playerData */
        playerData?: (msg.IPlayerData|null);
    }

    /** Represents a LeaveRoom_S2C. */
    class LeaveRoom_S2C implements ILeaveRoom_S2C {

        /**
         * Constructs a new LeaveRoom_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.ILeaveRoom_S2C);

        /** LeaveRoom_S2C playerData. */
        public playerData?: (msg.IPlayerData|null);

        /**
         * Creates a new LeaveRoom_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LeaveRoom_S2C instance
         */
        public static create(properties?: msg.ILeaveRoom_S2C): msg.LeaveRoom_S2C;

        /**
         * Encodes the specified LeaveRoom_S2C message. Does not implicitly {@link msg.LeaveRoom_S2C.verify|verify} messages.
         * @param message LeaveRoom_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.ILeaveRoom_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LeaveRoom_S2C message, length delimited. Does not implicitly {@link msg.LeaveRoom_S2C.verify|verify} messages.
         * @param message LeaveRoom_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.ILeaveRoom_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LeaveRoom_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LeaveRoom_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.LeaveRoom_S2C;

        /**
         * Decodes a LeaveRoom_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LeaveRoom_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.LeaveRoom_S2C;

        /**
         * Verifies a LeaveRoom_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LeaveRoom_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LeaveRoom_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.LeaveRoom_S2C;

        /**
         * Creates a plain object from a LeaveRoom_S2C message. Also converts values to other types if specified.
         * @param message LeaveRoom_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.LeaveRoom_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LeaveRoom_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SitDown_C2S. */
    interface ISitDown_C2S {
    }

    /** Represents a SitDown_C2S. */
    class SitDown_C2S implements ISitDown_C2S {

        /**
         * Constructs a new SitDown_C2S.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.ISitDown_C2S);

        /**
         * Creates a new SitDown_C2S instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SitDown_C2S instance
         */
        public static create(properties?: msg.ISitDown_C2S): msg.SitDown_C2S;

        /**
         * Encodes the specified SitDown_C2S message. Does not implicitly {@link msg.SitDown_C2S.verify|verify} messages.
         * @param message SitDown_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.ISitDown_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SitDown_C2S message, length delimited. Does not implicitly {@link msg.SitDown_C2S.verify|verify} messages.
         * @param message SitDown_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.ISitDown_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SitDown_C2S message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SitDown_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.SitDown_C2S;

        /**
         * Decodes a SitDown_C2S message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SitDown_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.SitDown_C2S;

        /**
         * Verifies a SitDown_C2S message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SitDown_C2S message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SitDown_C2S
         */
        public static fromObject(object: { [k: string]: any }): msg.SitDown_C2S;

        /**
         * Creates a plain object from a SitDown_C2S message. Also converts values to other types if specified.
         * @param message SitDown_C2S
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.SitDown_C2S, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SitDown_C2S to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SitDown_S2C. */
    interface ISitDown_S2C {

        /** SitDown_S2C playerData */
        playerData?: (msg.IPlayerData|null);

        /** SitDown_S2C roomData */
        roomData?: (msg.IRoomData|null);
    }

    /** Represents a SitDown_S2C. */
    class SitDown_S2C implements ISitDown_S2C {

        /**
         * Constructs a new SitDown_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.ISitDown_S2C);

        /** SitDown_S2C playerData. */
        public playerData?: (msg.IPlayerData|null);

        /** SitDown_S2C roomData. */
        public roomData?: (msg.IRoomData|null);

        /**
         * Creates a new SitDown_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SitDown_S2C instance
         */
        public static create(properties?: msg.ISitDown_S2C): msg.SitDown_S2C;

        /**
         * Encodes the specified SitDown_S2C message. Does not implicitly {@link msg.SitDown_S2C.verify|verify} messages.
         * @param message SitDown_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.ISitDown_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SitDown_S2C message, length delimited. Does not implicitly {@link msg.SitDown_S2C.verify|verify} messages.
         * @param message SitDown_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.ISitDown_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SitDown_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SitDown_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.SitDown_S2C;

        /**
         * Decodes a SitDown_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SitDown_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.SitDown_S2C;

        /**
         * Verifies a SitDown_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SitDown_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SitDown_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.SitDown_S2C;

        /**
         * Creates a plain object from a SitDown_S2C message. Also converts values to other types if specified.
         * @param message SitDown_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.SitDown_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SitDown_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a StandUp_C2S. */
    interface IStandUp_C2S {
    }

    /** Represents a StandUp_C2S. */
    class StandUp_C2S implements IStandUp_C2S {

        /**
         * Constructs a new StandUp_C2S.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IStandUp_C2S);

        /**
         * Creates a new StandUp_C2S instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StandUp_C2S instance
         */
        public static create(properties?: msg.IStandUp_C2S): msg.StandUp_C2S;

        /**
         * Encodes the specified StandUp_C2S message. Does not implicitly {@link msg.StandUp_C2S.verify|verify} messages.
         * @param message StandUp_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IStandUp_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StandUp_C2S message, length delimited. Does not implicitly {@link msg.StandUp_C2S.verify|verify} messages.
         * @param message StandUp_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IStandUp_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StandUp_C2S message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StandUp_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.StandUp_C2S;

        /**
         * Decodes a StandUp_C2S message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StandUp_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.StandUp_C2S;

        /**
         * Verifies a StandUp_C2S message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StandUp_C2S message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StandUp_C2S
         */
        public static fromObject(object: { [k: string]: any }): msg.StandUp_C2S;

        /**
         * Creates a plain object from a StandUp_C2S message. Also converts values to other types if specified.
         * @param message StandUp_C2S
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.StandUp_C2S, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StandUp_C2S to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a StandUp_S2C. */
    interface IStandUp_S2C {

        /** StandUp_S2C playerData */
        playerData?: (msg.IPlayerData|null);
    }

    /** Represents a StandUp_S2C. */
    class StandUp_S2C implements IStandUp_S2C {

        /**
         * Constructs a new StandUp_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IStandUp_S2C);

        /** StandUp_S2C playerData. */
        public playerData?: (msg.IPlayerData|null);

        /**
         * Creates a new StandUp_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StandUp_S2C instance
         */
        public static create(properties?: msg.IStandUp_S2C): msg.StandUp_S2C;

        /**
         * Encodes the specified StandUp_S2C message. Does not implicitly {@link msg.StandUp_S2C.verify|verify} messages.
         * @param message StandUp_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IStandUp_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StandUp_S2C message, length delimited. Does not implicitly {@link msg.StandUp_S2C.verify|verify} messages.
         * @param message StandUp_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IStandUp_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StandUp_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StandUp_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.StandUp_S2C;

        /**
         * Decodes a StandUp_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StandUp_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.StandUp_S2C;

        /**
         * Verifies a StandUp_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StandUp_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StandUp_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.StandUp_S2C;

        /**
         * Creates a plain object from a StandUp_S2C message. Also converts values to other types if specified.
         * @param message StandUp_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.StandUp_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StandUp_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PlayerAction_C2S. */
    interface IPlayerAction_C2S {

        /** PlayerAction_C2S betAmount */
        betAmount?: (number|null);

        /** PlayerAction_C2S action */
        action?: (msg.ActionStatus|null);
    }

    /** Represents a PlayerAction_C2S. */
    class PlayerAction_C2S implements IPlayerAction_C2S {

        /**
         * Constructs a new PlayerAction_C2S.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IPlayerAction_C2S);

        /** PlayerAction_C2S betAmount. */
        public betAmount: number;

        /** PlayerAction_C2S action. */
        public action: msg.ActionStatus;

        /**
         * Creates a new PlayerAction_C2S instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerAction_C2S instance
         */
        public static create(properties?: msg.IPlayerAction_C2S): msg.PlayerAction_C2S;

        /**
         * Encodes the specified PlayerAction_C2S message. Does not implicitly {@link msg.PlayerAction_C2S.verify|verify} messages.
         * @param message PlayerAction_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IPlayerAction_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PlayerAction_C2S message, length delimited. Does not implicitly {@link msg.PlayerAction_C2S.verify|verify} messages.
         * @param message PlayerAction_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IPlayerAction_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerAction_C2S message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerAction_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.PlayerAction_C2S;

        /**
         * Decodes a PlayerAction_C2S message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PlayerAction_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.PlayerAction_C2S;

        /**
         * Verifies a PlayerAction_C2S message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PlayerAction_C2S message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PlayerAction_C2S
         */
        public static fromObject(object: { [k: string]: any }): msg.PlayerAction_C2S;

        /**
         * Creates a plain object from a PlayerAction_C2S message. Also converts values to other types if specified.
         * @param message PlayerAction_C2S
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.PlayerAction_C2S, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PlayerAction_C2S to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PlayerAction_S2C. */
    interface IPlayerAction_S2C {

        /** PlayerAction_S2C Id */
        Id?: (string|null);

        /** PlayerAction_S2C chair */
        chair?: (number|null);

        /** PlayerAction_S2C chips */
        chips?: (number|null);

        /** PlayerAction_S2C downBet */
        downBet?: (number|null);

        /** PlayerAction_S2C preChips */
        preChips?: (number|null);

        /** PlayerAction_S2C potMoney */
        potMoney?: (number|null);

        /** PlayerAction_S2C actionType */
        actionType?: (msg.ActionStatus|null);
    }

    /** Represents a PlayerAction_S2C. */
    class PlayerAction_S2C implements IPlayerAction_S2C {

        /**
         * Constructs a new PlayerAction_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IPlayerAction_S2C);

        /** PlayerAction_S2C Id. */
        public Id: string;

        /** PlayerAction_S2C chair. */
        public chair: number;

        /** PlayerAction_S2C chips. */
        public chips: number;

        /** PlayerAction_S2C downBet. */
        public downBet: number;

        /** PlayerAction_S2C preChips. */
        public preChips: number;

        /** PlayerAction_S2C potMoney. */
        public potMoney: number;

        /** PlayerAction_S2C actionType. */
        public actionType: msg.ActionStatus;

        /**
         * Creates a new PlayerAction_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerAction_S2C instance
         */
        public static create(properties?: msg.IPlayerAction_S2C): msg.PlayerAction_S2C;

        /**
         * Encodes the specified PlayerAction_S2C message. Does not implicitly {@link msg.PlayerAction_S2C.verify|verify} messages.
         * @param message PlayerAction_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IPlayerAction_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PlayerAction_S2C message, length delimited. Does not implicitly {@link msg.PlayerAction_S2C.verify|verify} messages.
         * @param message PlayerAction_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IPlayerAction_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerAction_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerAction_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.PlayerAction_S2C;

        /**
         * Decodes a PlayerAction_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PlayerAction_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.PlayerAction_S2C;

        /**
         * Verifies a PlayerAction_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PlayerAction_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PlayerAction_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.PlayerAction_S2C;

        /**
         * Creates a plain object from a PlayerAction_S2C message. Also converts values to other types if specified.
         * @param message PlayerAction_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.PlayerAction_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PlayerAction_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PlayerActionChange_S2C. */
    interface IPlayerActionChange_S2C {

        /** PlayerActionChange_S2C roomData */
        roomData?: (msg.IRoomData|null);
    }

    /** Represents a PlayerActionChange_S2C. */
    class PlayerActionChange_S2C implements IPlayerActionChange_S2C {

        /**
         * Constructs a new PlayerActionChange_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IPlayerActionChange_S2C);

        /** PlayerActionChange_S2C roomData. */
        public roomData?: (msg.IRoomData|null);

        /**
         * Creates a new PlayerActionChange_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerActionChange_S2C instance
         */
        public static create(properties?: msg.IPlayerActionChange_S2C): msg.PlayerActionChange_S2C;

        /**
         * Encodes the specified PlayerActionChange_S2C message. Does not implicitly {@link msg.PlayerActionChange_S2C.verify|verify} messages.
         * @param message PlayerActionChange_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IPlayerActionChange_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PlayerActionChange_S2C message, length delimited. Does not implicitly {@link msg.PlayerActionChange_S2C.verify|verify} messages.
         * @param message PlayerActionChange_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IPlayerActionChange_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerActionChange_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerActionChange_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.PlayerActionChange_S2C;

        /**
         * Decodes a PlayerActionChange_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PlayerActionChange_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.PlayerActionChange_S2C;

        /**
         * Verifies a PlayerActionChange_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PlayerActionChange_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PlayerActionChange_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.PlayerActionChange_S2C;

        /**
         * Creates a plain object from a PlayerActionChange_S2C message. Also converts values to other types if specified.
         * @param message PlayerActionChange_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.PlayerActionChange_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PlayerActionChange_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AddChips_C2S. */
    interface IAddChips_C2S {

        /** AddChips_C2S addChips */
        addChips?: (number|null);

        /** AddChips_C2S sysBuyChips */
        sysBuyChips?: (number|null);
    }

    /** Represents an AddChips_C2S. */
    class AddChips_C2S implements IAddChips_C2S {

        /**
         * Constructs a new AddChips_C2S.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IAddChips_C2S);

        /** AddChips_C2S addChips. */
        public addChips: number;

        /** AddChips_C2S sysBuyChips. */
        public sysBuyChips: number;

        /**
         * Creates a new AddChips_C2S instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddChips_C2S instance
         */
        public static create(properties?: msg.IAddChips_C2S): msg.AddChips_C2S;

        /**
         * Encodes the specified AddChips_C2S message. Does not implicitly {@link msg.AddChips_C2S.verify|verify} messages.
         * @param message AddChips_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IAddChips_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddChips_C2S message, length delimited. Does not implicitly {@link msg.AddChips_C2S.verify|verify} messages.
         * @param message AddChips_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IAddChips_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddChips_C2S message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddChips_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.AddChips_C2S;

        /**
         * Decodes an AddChips_C2S message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddChips_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.AddChips_C2S;

        /**
         * Verifies an AddChips_C2S message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddChips_C2S message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddChips_C2S
         */
        public static fromObject(object: { [k: string]: any }): msg.AddChips_C2S;

        /**
         * Creates a plain object from an AddChips_C2S message. Also converts values to other types if specified.
         * @param message AddChips_C2S
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.AddChips_C2S, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddChips_C2S to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AddChips_S2C. */
    interface IAddChips_S2C {

        /** AddChips_S2C chair */
        chair?: (number|null);

        /** AddChips_S2C addChips */
        addChips?: (number|null);

        /** AddChips_S2C chips */
        chips?: (number|null);

        /** AddChips_S2C roomChips */
        roomChips?: (number|null);

        /** AddChips_S2C sysBuyChips */
        sysBuyChips?: (number|null);
    }

    /** Represents an AddChips_S2C. */
    class AddChips_S2C implements IAddChips_S2C {

        /**
         * Constructs a new AddChips_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IAddChips_S2C);

        /** AddChips_S2C chair. */
        public chair: number;

        /** AddChips_S2C addChips. */
        public addChips: number;

        /** AddChips_S2C chips. */
        public chips: number;

        /** AddChips_S2C roomChips. */
        public roomChips: number;

        /** AddChips_S2C sysBuyChips. */
        public sysBuyChips: number;

        /**
         * Creates a new AddChips_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddChips_S2C instance
         */
        public static create(properties?: msg.IAddChips_S2C): msg.AddChips_S2C;

        /**
         * Encodes the specified AddChips_S2C message. Does not implicitly {@link msg.AddChips_S2C.verify|verify} messages.
         * @param message AddChips_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IAddChips_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddChips_S2C message, length delimited. Does not implicitly {@link msg.AddChips_S2C.verify|verify} messages.
         * @param message AddChips_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IAddChips_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddChips_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddChips_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.AddChips_S2C;

        /**
         * Decodes an AddChips_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddChips_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.AddChips_S2C;

        /**
         * Verifies an AddChips_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddChips_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddChips_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.AddChips_S2C;

        /**
         * Creates a plain object from an AddChips_S2C message. Also converts values to other types if specified.
         * @param message AddChips_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.AddChips_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddChips_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GameStepChange_S2C. */
    interface IGameStepChange_S2C {

        /** GameStepChange_S2C roomData */
        roomData?: (msg.IRoomData|null);
    }

    /** Represents a GameStepChange_S2C. */
    class GameStepChange_S2C implements IGameStepChange_S2C {

        /**
         * Constructs a new GameStepChange_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IGameStepChange_S2C);

        /** GameStepChange_S2C roomData. */
        public roomData?: (msg.IRoomData|null);

        /**
         * Creates a new GameStepChange_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameStepChange_S2C instance
         */
        public static create(properties?: msg.IGameStepChange_S2C): msg.GameStepChange_S2C;

        /**
         * Encodes the specified GameStepChange_S2C message. Does not implicitly {@link msg.GameStepChange_S2C.verify|verify} messages.
         * @param message GameStepChange_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IGameStepChange_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameStepChange_S2C message, length delimited. Does not implicitly {@link msg.GameStepChange_S2C.verify|verify} messages.
         * @param message GameStepChange_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IGameStepChange_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameStepChange_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameStepChange_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.GameStepChange_S2C;

        /**
         * Decodes a GameStepChange_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameStepChange_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.GameStepChange_S2C;

        /**
         * Verifies a GameStepChange_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GameStepChange_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameStepChange_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.GameStepChange_S2C;

        /**
         * Creates a plain object from a GameStepChange_S2C message. Also converts values to other types if specified.
         * @param message GameStepChange_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.GameStepChange_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameStepChange_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ResultGameData_S2C. */
    interface IResultGameData_S2C {

        /** ResultGameData_S2C roomData */
        roomData?: (msg.IRoomData|null);
    }

    /** Represents a ResultGameData_S2C. */
    class ResultGameData_S2C implements IResultGameData_S2C {

        /**
         * Constructs a new ResultGameData_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IResultGameData_S2C);

        /** ResultGameData_S2C roomData. */
        public roomData?: (msg.IRoomData|null);

        /**
         * Creates a new ResultGameData_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ResultGameData_S2C instance
         */
        public static create(properties?: msg.IResultGameData_S2C): msg.ResultGameData_S2C;

        /**
         * Encodes the specified ResultGameData_S2C message. Does not implicitly {@link msg.ResultGameData_S2C.verify|verify} messages.
         * @param message ResultGameData_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IResultGameData_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ResultGameData_S2C message, length delimited. Does not implicitly {@link msg.ResultGameData_S2C.verify|verify} messages.
         * @param message ResultGameData_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IResultGameData_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ResultGameData_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ResultGameData_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.ResultGameData_S2C;

        /**
         * Decodes a ResultGameData_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ResultGameData_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.ResultGameData_S2C;

        /**
         * Verifies a ResultGameData_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ResultGameData_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ResultGameData_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.ResultGameData_S2C;

        /**
         * Creates a plain object from a ResultGameData_S2C message. Also converts values to other types if specified.
         * @param message ResultGameData_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.ResultGameData_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ResultGameData_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ReadyTime_S2C. */
    interface IReadyTime_S2C {

        /** ReadyTime_S2C readyTime */
        readyTime?: (number|null);
    }

    /** Represents a ReadyTime_S2C. */
    class ReadyTime_S2C implements IReadyTime_S2C {

        /**
         * Constructs a new ReadyTime_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IReadyTime_S2C);

        /** ReadyTime_S2C readyTime. */
        public readyTime: number;

        /**
         * Creates a new ReadyTime_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ReadyTime_S2C instance
         */
        public static create(properties?: msg.IReadyTime_S2C): msg.ReadyTime_S2C;

        /**
         * Encodes the specified ReadyTime_S2C message. Does not implicitly {@link msg.ReadyTime_S2C.verify|verify} messages.
         * @param message ReadyTime_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IReadyTime_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ReadyTime_S2C message, length delimited. Does not implicitly {@link msg.ReadyTime_S2C.verify|verify} messages.
         * @param message ReadyTime_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IReadyTime_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ReadyTime_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ReadyTime_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.ReadyTime_S2C;

        /**
         * Decodes a ReadyTime_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ReadyTime_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.ReadyTime_S2C;

        /**
         * Verifies a ReadyTime_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ReadyTime_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ReadyTime_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.ReadyTime_S2C;

        /**
         * Creates a plain object from a ReadyTime_S2C message. Also converts values to other types if specified.
         * @param message ReadyTime_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.ReadyTime_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ReadyTime_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SettleTime_S2C. */
    interface ISettleTime_S2C {

        /** SettleTime_S2C settleTime */
        settleTime?: (number|null);
    }

    /** Represents a SettleTime_S2C. */
    class SettleTime_S2C implements ISettleTime_S2C {

        /**
         * Constructs a new SettleTime_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.ISettleTime_S2C);

        /** SettleTime_S2C settleTime. */
        public settleTime: number;

        /**
         * Creates a new SettleTime_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SettleTime_S2C instance
         */
        public static create(properties?: msg.ISettleTime_S2C): msg.SettleTime_S2C;

        /**
         * Encodes the specified SettleTime_S2C message. Does not implicitly {@link msg.SettleTime_S2C.verify|verify} messages.
         * @param message SettleTime_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.ISettleTime_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SettleTime_S2C message, length delimited. Does not implicitly {@link msg.SettleTime_S2C.verify|verify} messages.
         * @param message SettleTime_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.ISettleTime_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SettleTime_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SettleTime_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.SettleTime_S2C;

        /**
         * Decodes a SettleTime_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SettleTime_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.SettleTime_S2C;

        /**
         * Verifies a SettleTime_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SettleTime_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SettleTime_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.SettleTime_S2C;

        /**
         * Creates a plain object from a SettleTime_S2C message. Also converts values to other types if specified.
         * @param message SettleTime_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.SettleTime_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SettleTime_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PushCardTime_S2C. */
    interface IPushCardTime_S2C {

        /** PushCardTime_S2C roomData */
        roomData?: (msg.IRoomData|null);
    }

    /** Represents a PushCardTime_S2C. */
    class PushCardTime_S2C implements IPushCardTime_S2C {

        /**
         * Constructs a new PushCardTime_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IPushCardTime_S2C);

        /** PushCardTime_S2C roomData. */
        public roomData?: (msg.IRoomData|null);

        /**
         * Creates a new PushCardTime_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PushCardTime_S2C instance
         */
        public static create(properties?: msg.IPushCardTime_S2C): msg.PushCardTime_S2C;

        /**
         * Encodes the specified PushCardTime_S2C message. Does not implicitly {@link msg.PushCardTime_S2C.verify|verify} messages.
         * @param message PushCardTime_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IPushCardTime_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PushCardTime_S2C message, length delimited. Does not implicitly {@link msg.PushCardTime_S2C.verify|verify} messages.
         * @param message PushCardTime_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IPushCardTime_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PushCardTime_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PushCardTime_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.PushCardTime_S2C;

        /**
         * Decodes a PushCardTime_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PushCardTime_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.PushCardTime_S2C;

        /**
         * Verifies a PushCardTime_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PushCardTime_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PushCardTime_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.PushCardTime_S2C;

        /**
         * Creates a plain object from a PushCardTime_S2C message. Also converts values to other types if specified.
         * @param message PushCardTime_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.PushCardTime_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PushCardTime_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomStatus_C2S. */
    interface IRoomStatus_C2S {

        /** RoomStatus_C2S cfgId */
        cfgId?: (string|null);
    }

    /** Represents a RoomStatus_C2S. */
    class RoomStatus_C2S implements IRoomStatus_C2S {

        /**
         * Constructs a new RoomStatus_C2S.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IRoomStatus_C2S);

        /** RoomStatus_C2S cfgId. */
        public cfgId: string;

        /**
         * Creates a new RoomStatus_C2S instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomStatus_C2S instance
         */
        public static create(properties?: msg.IRoomStatus_C2S): msg.RoomStatus_C2S;

        /**
         * Encodes the specified RoomStatus_C2S message. Does not implicitly {@link msg.RoomStatus_C2S.verify|verify} messages.
         * @param message RoomStatus_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IRoomStatus_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomStatus_C2S message, length delimited. Does not implicitly {@link msg.RoomStatus_C2S.verify|verify} messages.
         * @param message RoomStatus_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IRoomStatus_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomStatus_C2S message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomStatus_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.RoomStatus_C2S;

        /**
         * Decodes a RoomStatus_C2S message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomStatus_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.RoomStatus_C2S;

        /**
         * Verifies a RoomStatus_C2S message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomStatus_C2S message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomStatus_C2S
         */
        public static fromObject(object: { [k: string]: any }): msg.RoomStatus_C2S;

        /**
         * Creates a plain object from a RoomStatus_C2S message. Also converts values to other types if specified.
         * @param message RoomStatus_C2S
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.RoomStatus_C2S, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomStatus_C2S to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomStatus_S2C. */
    interface IRoomStatus_S2C {

        /** RoomStatus_S2C cfgId */
        cfgId?: (string|null);

        /** RoomStatus_S2C RoomIdNow */
        RoomIdNow?: (string|null);
    }

    /** Represents a RoomStatus_S2C. */
    class RoomStatus_S2C implements IRoomStatus_S2C {

        /**
         * Constructs a new RoomStatus_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IRoomStatus_S2C);

        /** RoomStatus_S2C cfgId. */
        public cfgId: string;

        /** RoomStatus_S2C RoomIdNow. */
        public RoomIdNow: string;

        /**
         * Creates a new RoomStatus_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomStatus_S2C instance
         */
        public static create(properties?: msg.IRoomStatus_S2C): msg.RoomStatus_S2C;

        /**
         * Encodes the specified RoomStatus_S2C message. Does not implicitly {@link msg.RoomStatus_S2C.verify|verify} messages.
         * @param message RoomStatus_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IRoomStatus_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomStatus_S2C message, length delimited. Does not implicitly {@link msg.RoomStatus_S2C.verify|verify} messages.
         * @param message RoomStatus_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IRoomStatus_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomStatus_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomStatus_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.RoomStatus_S2C;

        /**
         * Decodes a RoomStatus_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomStatus_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.RoomStatus_S2C;

        /**
         * Verifies a RoomStatus_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomStatus_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomStatus_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.RoomStatus_S2C;

        /**
         * Creates a plain object from a RoomStatus_S2C message. Also converts values to other types if specified.
         * @param message RoomStatus_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.RoomStatus_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomStatus_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EmojiChat_C2S. */
    interface IEmojiChat_C2S {

        /** EmojiChat_C2S actNum */
        actNum?: (number|null);

        /** EmojiChat_C2S goalChair */
        goalChair?: (number|null);
    }

    /** Represents an EmojiChat_C2S. */
    class EmojiChat_C2S implements IEmojiChat_C2S {

        /**
         * Constructs a new EmojiChat_C2S.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IEmojiChat_C2S);

        /** EmojiChat_C2S actNum. */
        public actNum: number;

        /** EmojiChat_C2S goalChair. */
        public goalChair: number;

        /**
         * Creates a new EmojiChat_C2S instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EmojiChat_C2S instance
         */
        public static create(properties?: msg.IEmojiChat_C2S): msg.EmojiChat_C2S;

        /**
         * Encodes the specified EmojiChat_C2S message. Does not implicitly {@link msg.EmojiChat_C2S.verify|verify} messages.
         * @param message EmojiChat_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IEmojiChat_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EmojiChat_C2S message, length delimited. Does not implicitly {@link msg.EmojiChat_C2S.verify|verify} messages.
         * @param message EmojiChat_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IEmojiChat_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EmojiChat_C2S message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EmojiChat_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.EmojiChat_C2S;

        /**
         * Decodes an EmojiChat_C2S message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EmojiChat_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.EmojiChat_C2S;

        /**
         * Verifies an EmojiChat_C2S message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EmojiChat_C2S message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EmojiChat_C2S
         */
        public static fromObject(object: { [k: string]: any }): msg.EmojiChat_C2S;

        /**
         * Creates a plain object from an EmojiChat_C2S message. Also converts values to other types if specified.
         * @param message EmojiChat_C2S
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.EmojiChat_C2S, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EmojiChat_C2S to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EmojiChat_S2C. */
    interface IEmojiChat_S2C {

        /** EmojiChat_S2C actNum */
        actNum?: (number|null);

        /** EmojiChat_S2C actChair */
        actChair?: (number|null);

        /** EmojiChat_S2C goalChair */
        goalChair?: (number|null);
    }

    /** Represents an EmojiChat_S2C. */
    class EmojiChat_S2C implements IEmojiChat_S2C {

        /**
         * Constructs a new EmojiChat_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IEmojiChat_S2C);

        /** EmojiChat_S2C actNum. */
        public actNum: number;

        /** EmojiChat_S2C actChair. */
        public actChair: number;

        /** EmojiChat_S2C goalChair. */
        public goalChair: number;

        /**
         * Creates a new EmojiChat_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EmojiChat_S2C instance
         */
        public static create(properties?: msg.IEmojiChat_S2C): msg.EmojiChat_S2C;

        /**
         * Encodes the specified EmojiChat_S2C message. Does not implicitly {@link msg.EmojiChat_S2C.verify|verify} messages.
         * @param message EmojiChat_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IEmojiChat_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EmojiChat_S2C message, length delimited. Does not implicitly {@link msg.EmojiChat_S2C.verify|verify} messages.
         * @param message EmojiChat_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IEmojiChat_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EmojiChat_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EmojiChat_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.EmojiChat_S2C;

        /**
         * Decodes an EmojiChat_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EmojiChat_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.EmojiChat_S2C;

        /**
         * Verifies an EmojiChat_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EmojiChat_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EmojiChat_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.EmojiChat_S2C;

        /**
         * Creates a plain object from an EmojiChat_S2C message. Also converts values to other types if specified.
         * @param message EmojiChat_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.EmojiChat_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EmojiChat_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PiPeiPlayer_S2C. */
    interface IPiPeiPlayer_S2C {
    }

    /** Represents a PiPeiPlayer_S2C. */
    class PiPeiPlayer_S2C implements IPiPeiPlayer_S2C {

        /**
         * Constructs a new PiPeiPlayer_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IPiPeiPlayer_S2C);

        /**
         * Creates a new PiPeiPlayer_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PiPeiPlayer_S2C instance
         */
        public static create(properties?: msg.IPiPeiPlayer_S2C): msg.PiPeiPlayer_S2C;

        /**
         * Encodes the specified PiPeiPlayer_S2C message. Does not implicitly {@link msg.PiPeiPlayer_S2C.verify|verify} messages.
         * @param message PiPeiPlayer_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IPiPeiPlayer_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PiPeiPlayer_S2C message, length delimited. Does not implicitly {@link msg.PiPeiPlayer_S2C.verify|verify} messages.
         * @param message PiPeiPlayer_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IPiPeiPlayer_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PiPeiPlayer_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PiPeiPlayer_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.PiPeiPlayer_S2C;

        /**
         * Decodes a PiPeiPlayer_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PiPeiPlayer_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.PiPeiPlayer_S2C;

        /**
         * Verifies a PiPeiPlayer_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PiPeiPlayer_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PiPeiPlayer_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.PiPeiPlayer_S2C;

        /**
         * Creates a plain object from a PiPeiPlayer_S2C message. Also converts values to other types if specified.
         * @param message PiPeiPlayer_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.PiPeiPlayer_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PiPeiPlayer_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PiPeiData_S2C. */
    interface IPiPeiData_S2C {

        /** PiPeiData_S2C roomData */
        roomData?: (msg.IRoomData|null);
    }

    /** Represents a PiPeiData_S2C. */
    class PiPeiData_S2C implements IPiPeiData_S2C {

        /**
         * Constructs a new PiPeiData_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IPiPeiData_S2C);

        /** PiPeiData_S2C roomData. */
        public roomData?: (msg.IRoomData|null);

        /**
         * Creates a new PiPeiData_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PiPeiData_S2C instance
         */
        public static create(properties?: msg.IPiPeiData_S2C): msg.PiPeiData_S2C;

        /**
         * Encodes the specified PiPeiData_S2C message. Does not implicitly {@link msg.PiPeiData_S2C.verify|verify} messages.
         * @param message PiPeiData_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IPiPeiData_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PiPeiData_S2C message, length delimited. Does not implicitly {@link msg.PiPeiData_S2C.verify|verify} messages.
         * @param message PiPeiData_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IPiPeiData_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PiPeiData_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PiPeiData_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.PiPeiData_S2C;

        /**
         * Decodes a PiPeiData_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PiPeiData_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.PiPeiData_S2C;

        /**
         * Verifies a PiPeiData_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PiPeiData_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PiPeiData_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.PiPeiData_S2C;

        /**
         * Creates a plain object from a PiPeiData_S2C message. Also converts values to other types if specified.
         * @param message PiPeiData_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.PiPeiData_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PiPeiData_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SendActTimer_S2C. */
    interface ISendActTimer_S2C {

        /** SendActTimer_S2C actChair */
        actChair?: (number|null);

        /** SendActTimer_S2C timer */
        timer?: (number|null);
    }

    /** Represents a SendActTimer_S2C. */
    class SendActTimer_S2C implements ISendActTimer_S2C {

        /**
         * Constructs a new SendActTimer_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.ISendActTimer_S2C);

        /** SendActTimer_S2C actChair. */
        public actChair: number;

        /** SendActTimer_S2C timer. */
        public timer: number;

        /**
         * Creates a new SendActTimer_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendActTimer_S2C instance
         */
        public static create(properties?: msg.ISendActTimer_S2C): msg.SendActTimer_S2C;

        /**
         * Encodes the specified SendActTimer_S2C message. Does not implicitly {@link msg.SendActTimer_S2C.verify|verify} messages.
         * @param message SendActTimer_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.ISendActTimer_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendActTimer_S2C message, length delimited. Does not implicitly {@link msg.SendActTimer_S2C.verify|verify} messages.
         * @param message SendActTimer_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.ISendActTimer_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendActTimer_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendActTimer_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.SendActTimer_S2C;

        /**
         * Decodes a SendActTimer_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendActTimer_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.SendActTimer_S2C;

        /**
         * Verifies a SendActTimer_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SendActTimer_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SendActTimer_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.SendActTimer_S2C;

        /**
         * Creates a plain object from a SendActTimer_S2C message. Also converts values to other types if specified.
         * @param message SendActTimer_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.SendActTimer_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendActTimer_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SendRoomData_S2C. */
    interface ISendRoomData_S2C {

        /** SendRoomData_S2C roomData */
        roomData?: (msg.IRoomData|null);
    }

    /** Represents a SendRoomData_S2C. */
    class SendRoomData_S2C implements ISendRoomData_S2C {

        /**
         * Constructs a new SendRoomData_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.ISendRoomData_S2C);

        /** SendRoomData_S2C roomData. */
        public roomData?: (msg.IRoomData|null);

        /**
         * Creates a new SendRoomData_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendRoomData_S2C instance
         */
        public static create(properties?: msg.ISendRoomData_S2C): msg.SendRoomData_S2C;

        /**
         * Encodes the specified SendRoomData_S2C message. Does not implicitly {@link msg.SendRoomData_S2C.verify|verify} messages.
         * @param message SendRoomData_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.ISendRoomData_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendRoomData_S2C message, length delimited. Does not implicitly {@link msg.SendRoomData_S2C.verify|verify} messages.
         * @param message SendRoomData_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.ISendRoomData_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendRoomData_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendRoomData_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.SendRoomData_S2C;

        /**
         * Decodes a SendRoomData_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendRoomData_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.SendRoomData_S2C;

        /**
         * Verifies a SendRoomData_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SendRoomData_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SendRoomData_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.SendRoomData_S2C;

        /**
         * Creates a plain object from a SendRoomData_S2C message. Also converts values to other types if specified.
         * @param message SendRoomData_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.SendRoomData_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendRoomData_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a WaitPlayerList_C2S. */
    interface IWaitPlayerList_C2S {

        /** WaitPlayerList_C2S WaitStatus */
        WaitStatus?: (number|null);

        /** WaitPlayerList_C2S cfgId */
        cfgId?: (string|null);
    }

    /** Represents a WaitPlayerList_C2S. */
    class WaitPlayerList_C2S implements IWaitPlayerList_C2S {

        /**
         * Constructs a new WaitPlayerList_C2S.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IWaitPlayerList_C2S);

        /** WaitPlayerList_C2S WaitStatus. */
        public WaitStatus: number;

        /** WaitPlayerList_C2S cfgId. */
        public cfgId: string;

        /**
         * Creates a new WaitPlayerList_C2S instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WaitPlayerList_C2S instance
         */
        public static create(properties?: msg.IWaitPlayerList_C2S): msg.WaitPlayerList_C2S;

        /**
         * Encodes the specified WaitPlayerList_C2S message. Does not implicitly {@link msg.WaitPlayerList_C2S.verify|verify} messages.
         * @param message WaitPlayerList_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IWaitPlayerList_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WaitPlayerList_C2S message, length delimited. Does not implicitly {@link msg.WaitPlayerList_C2S.verify|verify} messages.
         * @param message WaitPlayerList_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IWaitPlayerList_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WaitPlayerList_C2S message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WaitPlayerList_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.WaitPlayerList_C2S;

        /**
         * Decodes a WaitPlayerList_C2S message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WaitPlayerList_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.WaitPlayerList_C2S;

        /**
         * Verifies a WaitPlayerList_C2S message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WaitPlayerList_C2S message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WaitPlayerList_C2S
         */
        public static fromObject(object: { [k: string]: any }): msg.WaitPlayerList_C2S;

        /**
         * Creates a plain object from a WaitPlayerList_C2S message. Also converts values to other types if specified.
         * @param message WaitPlayerList_C2S
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.WaitPlayerList_C2S, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WaitPlayerList_C2S to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a WaitPlayerList_S2C. */
    interface IWaitPlayerList_S2C {

        /** WaitPlayerList_S2C WaitStatus */
        WaitStatus?: (number|null);
    }

    /** Represents a WaitPlayerList_S2C. */
    class WaitPlayerList_S2C implements IWaitPlayerList_S2C {

        /**
         * Constructs a new WaitPlayerList_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IWaitPlayerList_S2C);

        /** WaitPlayerList_S2C WaitStatus. */
        public WaitStatus: number;

        /**
         * Creates a new WaitPlayerList_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WaitPlayerList_S2C instance
         */
        public static create(properties?: msg.IWaitPlayerList_S2C): msg.WaitPlayerList_S2C;

        /**
         * Encodes the specified WaitPlayerList_S2C message. Does not implicitly {@link msg.WaitPlayerList_S2C.verify|verify} messages.
         * @param message WaitPlayerList_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IWaitPlayerList_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WaitPlayerList_S2C message, length delimited. Does not implicitly {@link msg.WaitPlayerList_S2C.verify|verify} messages.
         * @param message WaitPlayerList_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IWaitPlayerList_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WaitPlayerList_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WaitPlayerList_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.WaitPlayerList_S2C;

        /**
         * Decodes a WaitPlayerList_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WaitPlayerList_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.WaitPlayerList_S2C;

        /**
         * Verifies a WaitPlayerList_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WaitPlayerList_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WaitPlayerList_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.WaitPlayerList_S2C;

        /**
         * Creates a plain object from a WaitPlayerList_S2C message. Also converts values to other types if specified.
         * @param message WaitPlayerList_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.WaitPlayerList_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WaitPlayerList_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ShowRoomInfo_C2S. */
    interface IShowRoomInfo_C2S {
    }

    /** Represents a ShowRoomInfo_C2S. */
    class ShowRoomInfo_C2S implements IShowRoomInfo_C2S {

        /**
         * Constructs a new ShowRoomInfo_C2S.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IShowRoomInfo_C2S);

        /**
         * Creates a new ShowRoomInfo_C2S instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ShowRoomInfo_C2S instance
         */
        public static create(properties?: msg.IShowRoomInfo_C2S): msg.ShowRoomInfo_C2S;

        /**
         * Encodes the specified ShowRoomInfo_C2S message. Does not implicitly {@link msg.ShowRoomInfo_C2S.verify|verify} messages.
         * @param message ShowRoomInfo_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IShowRoomInfo_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ShowRoomInfo_C2S message, length delimited. Does not implicitly {@link msg.ShowRoomInfo_C2S.verify|verify} messages.
         * @param message ShowRoomInfo_C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IShowRoomInfo_C2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ShowRoomInfo_C2S message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ShowRoomInfo_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.ShowRoomInfo_C2S;

        /**
         * Decodes a ShowRoomInfo_C2S message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ShowRoomInfo_C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.ShowRoomInfo_C2S;

        /**
         * Verifies a ShowRoomInfo_C2S message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ShowRoomInfo_C2S message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ShowRoomInfo_C2S
         */
        public static fromObject(object: { [k: string]: any }): msg.ShowRoomInfo_C2S;

        /**
         * Creates a plain object from a ShowRoomInfo_C2S message. Also converts values to other types if specified.
         * @param message ShowRoomInfo_C2S
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.ShowRoomInfo_C2S, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ShowRoomInfo_C2S to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ShowRoomInfo_S2C. */
    interface IShowRoomInfo_S2C {

        /** ShowRoomInfo_S2C roomData */
        roomData?: (msg.IRoomData|null);
    }

    /** Represents a ShowRoomInfo_S2C. */
    class ShowRoomInfo_S2C implements IShowRoomInfo_S2C {

        /**
         * Constructs a new ShowRoomInfo_S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: msg.IShowRoomInfo_S2C);

        /** ShowRoomInfo_S2C roomData. */
        public roomData?: (msg.IRoomData|null);

        /**
         * Creates a new ShowRoomInfo_S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ShowRoomInfo_S2C instance
         */
        public static create(properties?: msg.IShowRoomInfo_S2C): msg.ShowRoomInfo_S2C;

        /**
         * Encodes the specified ShowRoomInfo_S2C message. Does not implicitly {@link msg.ShowRoomInfo_S2C.verify|verify} messages.
         * @param message ShowRoomInfo_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: msg.IShowRoomInfo_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ShowRoomInfo_S2C message, length delimited. Does not implicitly {@link msg.ShowRoomInfo_S2C.verify|verify} messages.
         * @param message ShowRoomInfo_S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: msg.IShowRoomInfo_S2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ShowRoomInfo_S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ShowRoomInfo_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): msg.ShowRoomInfo_S2C;

        /**
         * Decodes a ShowRoomInfo_S2C message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ShowRoomInfo_S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): msg.ShowRoomInfo_S2C;

        /**
         * Verifies a ShowRoomInfo_S2C message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ShowRoomInfo_S2C message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ShowRoomInfo_S2C
         */
        public static fromObject(object: { [k: string]: any }): msg.ShowRoomInfo_S2C;

        /**
         * Creates a plain object from a ShowRoomInfo_S2C message. Also converts values to other types if specified.
         * @param message ShowRoomInfo_S2C
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: msg.ShowRoomInfo_S2C, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ShowRoomInfo_S2C to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
