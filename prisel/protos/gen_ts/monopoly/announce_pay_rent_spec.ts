// @generated by protobuf-ts 1.0.12 with parameters disable_service_client
// @generated from protobuf file "monopoly/announce_pay_rent_spec.proto" (package "monopoly", syntax proto3)
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
import { Payment } from "./payment";
/**
 * type : "announce_pay_rent",
 * packet_type : DEFAULT
 *
 * @generated from protobuf message monopoly.AnnouncePayRentPayload
 */
export interface AnnouncePayRentPayload {
    /**
     * @generated from protobuf field: string payer = 1;
     */
    payer: string;
    /**
     * @generated from protobuf field: repeated monopoly.Payment payments = 2;
     */
    payments: Payment[];
    /**
     * the updated money of the current player. This normally only affect payer
     * and payee. All other players will receive an unchanged amount.
     *
     * @generated from protobuf field: int32 my_current_money = 3;
     */
    myCurrentMoney: number;
}
/**
 * Type for protobuf message monopoly.AnnouncePayRentPayload
 */
class AnnouncePayRentPayload$Type extends MessageType<AnnouncePayRentPayload> {
    constructor() {
        super("monopoly.AnnouncePayRentPayload", [
            { no: 1, name: "payer", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "payments", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Payment },
            { no: 3, name: "my_current_money", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<AnnouncePayRentPayload>): AnnouncePayRentPayload {
        const message = { payer: "", payments: [], myCurrentMoney: 0 };
        if (value !== undefined)
            reflectionMergePartial<AnnouncePayRentPayload>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AnnouncePayRentPayload): AnnouncePayRentPayload {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string payer */ 1:
                    message.payer = reader.string();
                    break;
                case /* repeated monopoly.Payment payments */ 2:
                    message.payments.push(Payment.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* int32 my_current_money */ 3:
                    message.myCurrentMoney = reader.int32();
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
    internalBinaryWrite(message: AnnouncePayRentPayload, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string payer = 1; */
        if (message.payer !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.payer);
        /* repeated monopoly.Payment payments = 2; */
        for (let i = 0; i < message.payments.length; i++)
            Payment.internalBinaryWrite(message.payments[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* int32 my_current_money = 3; */
        if (message.myCurrentMoney !== 0)
            writer.tag(3, WireType.Varint).int32(message.myCurrentMoney);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
export const AnnouncePayRentPayload = new AnnouncePayRentPayload$Type();
