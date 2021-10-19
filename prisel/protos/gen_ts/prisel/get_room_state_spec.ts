// @generated by protobuf-ts 1.0.12 with parameters disable_service_client
// @generated from protobuf file "prisel/get_room_state_spec.proto" (package "prisel", syntax proto3)
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
import { PlayerInfo } from "./player_info";
/**
 * type : GET_ROOM_STATE,
 * packet_type : RESPONSE
 *
 * @generated from protobuf message prisel.GetRoomStateResponse
 */
export interface GetRoomStateResponse {
    /**
     * @generated from protobuf field: repeated prisel.PlayerInfo players = 1;
     */
    players: PlayerInfo[];
    /**
     * @generated from protobuf field: optional string host_id = 2;
     */
    hostId?: string;
    /**
     * @generated from protobuf field: string token = 3;
     */
    token: string;
}
/**
 * Type for protobuf message prisel.GetRoomStateResponse
 */
class GetRoomStateResponse$Type extends MessageType<GetRoomStateResponse> {
    constructor() {
        super("prisel.GetRoomStateResponse", [
            { no: 1, name: "players", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => PlayerInfo },
            { no: 2, name: "host_id", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "token", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<GetRoomStateResponse>): GetRoomStateResponse {
        const message = { players: [], token: "" };
        if (value !== undefined)
            reflectionMergePartial<GetRoomStateResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetRoomStateResponse): GetRoomStateResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated prisel.PlayerInfo players */ 1:
                    message.players.push(PlayerInfo.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* optional string host_id */ 2:
                    message.hostId = reader.string();
                    break;
                case /* string token */ 3:
                    message.token = reader.string();
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
    internalBinaryWrite(message: GetRoomStateResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated prisel.PlayerInfo players = 1; */
        for (let i = 0; i < message.players.length; i++)
            PlayerInfo.internalBinaryWrite(message.players[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* optional string host_id = 2; */
        if (message.hostId !== undefined)
            writer.tag(2, WireType.LengthDelimited).string(message.hostId);
        /* string token = 3; */
        if (message.token !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.token);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
export const GetRoomStateResponse = new GetRoomStateResponse$Type();
