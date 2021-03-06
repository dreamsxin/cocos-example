// @generated by protobuf-ts 1.0.12 with parameters disable_service_client
// @generated from protobuf file "monopoly/announce_start_turn_spec.proto" (package "monopoly", syntax proto3)
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
/**
 * type : "announce_start_turn"
 * packet_type : DEFAULT
 *
 * @generated from protobuf message monopoly.AnnounceStartTurnPayload
 */
export interface AnnounceStartTurnPayload {
    /**
     * @generated from protobuf field: string player = 1;
     */
    player: string;
}
/**
 * Type for protobuf message monopoly.AnnounceStartTurnPayload
 */
class AnnounceStartTurnPayload$Type extends MessageType<AnnounceStartTurnPayload> {
    constructor() {
        super("monopoly.AnnounceStartTurnPayload", [
            { no: 1, name: "player", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<AnnounceStartTurnPayload>): AnnounceStartTurnPayload {
        const message = { player: "" };
        if (value !== undefined)
            reflectionMergePartial<AnnounceStartTurnPayload>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AnnounceStartTurnPayload): AnnounceStartTurnPayload {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string player */ 1:
                    message.player = reader.string();
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
    internalBinaryWrite(message: AnnounceStartTurnPayload, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string player = 1; */
        if (message.player !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.player);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
export const AnnounceStartTurnPayload = new AnnounceStartTurnPayload$Type();
