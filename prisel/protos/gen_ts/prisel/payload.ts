// @generated by protobuf-ts 1.0.12 with parameters disable_service_client
// @generated from protobuf file "prisel/payload.proto" (package "prisel", syntax proto3)
// tslint:disable
import { BinaryWriteOptions } from "@protobuf-ts/runtime";
import { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import { BinaryReadOptions } from "@protobuf-ts/runtime";
import { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Any } from "../google/protobuf/any";
import { RoomStateChangePayload } from "./room_state_change_spec";
import { LoginResponse } from "./login_spec";
import { LoginRequest } from "./login_spec";
import { JoinResponse } from "./join_spec";
import { JoinRequest } from "./join_spec";
import { GetRoomStateResponse } from "./get_room_state_spec";
import { GetLobbyStateResponse } from "./get_lobby_state_spec";
import { ErrorPayload } from "./error_spec";
import { CreateRoomResponse } from "./create_room_spec";
import { CreateRoomRequest } from "./create_room_spec";
import { BroadcastPayload } from "./broadcast_spec";
import { ChatPayload } from "./chat_spec";
/**
 * @generated from protobuf message prisel.Payload
 */
export interface Payload {
    /**
     * @generated from protobuf oneof: payload
     */
    payload: {
        oneofKind: "chatPayload";
        /**
         * @generated from protobuf field: prisel.ChatPayload chat_payload = 1;
         */
        chatPayload: ChatPayload;
    } | {
        oneofKind: "broadcastPayload";
        /**
         * @generated from protobuf field: prisel.BroadcastPayload broadcast_payload = 2;
         */
        broadcastPayload: BroadcastPayload;
    } | {
        oneofKind: "createRoomRequest";
        /**
         * @generated from protobuf field: prisel.CreateRoomRequest create_room_request = 3;
         */
        createRoomRequest: CreateRoomRequest;
    } | {
        oneofKind: "createRoomResponse";
        /**
         * @generated from protobuf field: prisel.CreateRoomResponse create_room_response = 4;
         */
        createRoomResponse: CreateRoomResponse;
    } | {
        oneofKind: "errorPayload";
        /**
         * @generated from protobuf field: prisel.ErrorPayload error_payload = 5;
         */
        errorPayload: ErrorPayload;
    } | {
        oneofKind: "getLobbyStateResponse";
        /**
         * @generated from protobuf field: prisel.GetLobbyStateResponse get_lobby_state_response = 6;
         */
        getLobbyStateResponse: GetLobbyStateResponse;
    } | {
        oneofKind: "getRoomStateResponse";
        /**
         * @generated from protobuf field: prisel.GetRoomStateResponse get_room_state_response = 7;
         */
        getRoomStateResponse: GetRoomStateResponse;
    } | {
        oneofKind: "joinRequest";
        /**
         * @generated from protobuf field: prisel.JoinRequest join_request = 8;
         */
        joinRequest: JoinRequest;
    } | {
        oneofKind: "joinResponse";
        /**
         * @generated from protobuf field: prisel.JoinResponse join_response = 9;
         */
        joinResponse: JoinResponse;
    } | {
        oneofKind: "loginRequest";
        /**
         * @generated from protobuf field: prisel.LoginRequest login_request = 10;
         */
        loginRequest: LoginRequest;
    } | {
        oneofKind: "loginResponse";
        /**
         * @generated from protobuf field: prisel.LoginResponse login_response = 11;
         */
        loginResponse: LoginResponse;
    } | {
        oneofKind: "roomStateChangePayload";
        /**
         * @generated from protobuf field: prisel.RoomStateChangePayload room_state_change_payload = 12;
         */
        roomStateChangePayload: RoomStateChangePayload;
    } | {
        oneofKind: "actionPayload";
        /**
         * @generated from protobuf field: google.protobuf.Any action_payload = 15;
         */
        actionPayload: Any;
    } | {
        oneofKind: undefined;
    };
}
/**
 * Type for protobuf message prisel.Payload
 */
class Payload$Type extends MessageType<Payload> {
    constructor() {
        super("prisel.Payload", [
            { no: 1, name: "chat_payload", kind: "message", oneof: "payload", T: () => ChatPayload },
            { no: 2, name: "broadcast_payload", kind: "message", oneof: "payload", T: () => BroadcastPayload },
            { no: 3, name: "create_room_request", kind: "message", oneof: "payload", T: () => CreateRoomRequest },
            { no: 4, name: "create_room_response", kind: "message", oneof: "payload", T: () => CreateRoomResponse },
            { no: 5, name: "error_payload", kind: "message", oneof: "payload", T: () => ErrorPayload },
            { no: 6, name: "get_lobby_state_response", kind: "message", oneof: "payload", T: () => GetLobbyStateResponse },
            { no: 7, name: "get_room_state_response", kind: "message", oneof: "payload", T: () => GetRoomStateResponse },
            { no: 8, name: "join_request", kind: "message", oneof: "payload", T: () => JoinRequest },
            { no: 9, name: "join_response", kind: "message", oneof: "payload", T: () => JoinResponse },
            { no: 10, name: "login_request", kind: "message", oneof: "payload", T: () => LoginRequest },
            { no: 11, name: "login_response", kind: "message", oneof: "payload", T: () => LoginResponse },
            { no: 12, name: "room_state_change_payload", kind: "message", oneof: "payload", T: () => RoomStateChangePayload },
            { no: 15, name: "action_payload", kind: "message", oneof: "payload", T: () => Any }
        ]);
    }
    create(value?: PartialMessage<Payload>): Payload {
        const message = { payload: { oneofKind: undefined } };
        if (value !== undefined)
            reflectionMergePartial<Payload>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Payload): Payload {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* prisel.ChatPayload chat_payload */ 1:
                    message.payload = {
                        oneofKind: "chatPayload",
                        chatPayload: ChatPayload.internalBinaryRead(reader, reader.uint32(), options, (message.payload as any).chatPayload)
                    };
                    break;
                case /* prisel.BroadcastPayload broadcast_payload */ 2:
                    message.payload = {
                        oneofKind: "broadcastPayload",
                        broadcastPayload: BroadcastPayload.internalBinaryRead(reader, reader.uint32(), options, (message.payload as any).broadcastPayload)
                    };
                    break;
                case /* prisel.CreateRoomRequest create_room_request */ 3:
                    message.payload = {
                        oneofKind: "createRoomRequest",
                        createRoomRequest: CreateRoomRequest.internalBinaryRead(reader, reader.uint32(), options, (message.payload as any).createRoomRequest)
                    };
                    break;
                case /* prisel.CreateRoomResponse create_room_response */ 4:
                    message.payload = {
                        oneofKind: "createRoomResponse",
                        createRoomResponse: CreateRoomResponse.internalBinaryRead(reader, reader.uint32(), options, (message.payload as any).createRoomResponse)
                    };
                    break;
                case /* prisel.ErrorPayload error_payload */ 5:
                    message.payload = {
                        oneofKind: "errorPayload",
                        errorPayload: ErrorPayload.internalBinaryRead(reader, reader.uint32(), options, (message.payload as any).errorPayload)
                    };
                    break;
                case /* prisel.GetLobbyStateResponse get_lobby_state_response */ 6:
                    message.payload = {
                        oneofKind: "getLobbyStateResponse",
                        getLobbyStateResponse: GetLobbyStateResponse.internalBinaryRead(reader, reader.uint32(), options, (message.payload as any).getLobbyStateResponse)
                    };
                    break;
                case /* prisel.GetRoomStateResponse get_room_state_response */ 7:
                    message.payload = {
                        oneofKind: "getRoomStateResponse",
                        getRoomStateResponse: GetRoomStateResponse.internalBinaryRead(reader, reader.uint32(), options, (message.payload as any).getRoomStateResponse)
                    };
                    break;
                case /* prisel.JoinRequest join_request */ 8:
                    message.payload = {
                        oneofKind: "joinRequest",
                        joinRequest: JoinRequest.internalBinaryRead(reader, reader.uint32(), options, (message.payload as any).joinRequest)
                    };
                    break;
                case /* prisel.JoinResponse join_response */ 9:
                    message.payload = {
                        oneofKind: "joinResponse",
                        joinResponse: JoinResponse.internalBinaryRead(reader, reader.uint32(), options, (message.payload as any).joinResponse)
                    };
                    break;
                case /* prisel.LoginRequest login_request */ 10:
                    message.payload = {
                        oneofKind: "loginRequest",
                        loginRequest: LoginRequest.internalBinaryRead(reader, reader.uint32(), options, (message.payload as any).loginRequest)
                    };
                    break;
                case /* prisel.LoginResponse login_response */ 11:
                    message.payload = {
                        oneofKind: "loginResponse",
                        loginResponse: LoginResponse.internalBinaryRead(reader, reader.uint32(), options, (message.payload as any).loginResponse)
                    };
                    break;
                case /* prisel.RoomStateChangePayload room_state_change_payload */ 12:
                    message.payload = {
                        oneofKind: "roomStateChangePayload",
                        roomStateChangePayload: RoomStateChangePayload.internalBinaryRead(reader, reader.uint32(), options, (message.payload as any).roomStateChangePayload)
                    };
                    break;
                case /* google.protobuf.Any action_payload */ 15:
                    message.payload = {
                        oneofKind: "actionPayload",
                        actionPayload: Any.internalBinaryRead(reader, reader.uint32(), options, (message.payload as any).actionPayload)
                    };
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Payload, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* prisel.ChatPayload chat_payload = 1; */
        if (message.payload.oneofKind === "chatPayload")
            ChatPayload.internalBinaryWrite(message.payload.chatPayload, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* prisel.BroadcastPayload broadcast_payload = 2; */
        if (message.payload.oneofKind === "broadcastPayload")
            BroadcastPayload.internalBinaryWrite(message.payload.broadcastPayload, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* prisel.CreateRoomRequest create_room_request = 3; */
        if (message.payload.oneofKind === "createRoomRequest")
            CreateRoomRequest.internalBinaryWrite(message.payload.createRoomRequest, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* prisel.CreateRoomResponse create_room_response = 4; */
        if (message.payload.oneofKind === "createRoomResponse")
            CreateRoomResponse.internalBinaryWrite(message.payload.createRoomResponse, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* prisel.ErrorPayload error_payload = 5; */
        if (message.payload.oneofKind === "errorPayload")
            ErrorPayload.internalBinaryWrite(message.payload.errorPayload, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* prisel.GetLobbyStateResponse get_lobby_state_response = 6; */
        if (message.payload.oneofKind === "getLobbyStateResponse")
            GetLobbyStateResponse.internalBinaryWrite(message.payload.getLobbyStateResponse, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* prisel.GetRoomStateResponse get_room_state_response = 7; */
        if (message.payload.oneofKind === "getRoomStateResponse")
            GetRoomStateResponse.internalBinaryWrite(message.payload.getRoomStateResponse, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* prisel.JoinRequest join_request = 8; */
        if (message.payload.oneofKind === "joinRequest")
            JoinRequest.internalBinaryWrite(message.payload.joinRequest, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
        /* prisel.JoinResponse join_response = 9; */
        if (message.payload.oneofKind === "joinResponse")
            JoinResponse.internalBinaryWrite(message.payload.joinResponse, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
        /* prisel.LoginRequest login_request = 10; */
        if (message.payload.oneofKind === "loginRequest")
            LoginRequest.internalBinaryWrite(message.payload.loginRequest, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
        /* prisel.LoginResponse login_response = 11; */
        if (message.payload.oneofKind === "loginResponse")
            LoginResponse.internalBinaryWrite(message.payload.loginResponse, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
        /* prisel.RoomStateChangePayload room_state_change_payload = 12; */
        if (message.payload.oneofKind === "roomStateChangePayload")
            RoomStateChangePayload.internalBinaryWrite(message.payload.roomStateChangePayload, writer.tag(12, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.Any action_payload = 15; */
        if (message.payload.oneofKind === "actionPayload")
            Any.internalBinaryWrite(message.payload.actionPayload, writer.tag(15, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
export const Payload = new Payload$Type();
