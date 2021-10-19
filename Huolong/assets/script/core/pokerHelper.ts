import { CardColor, PlayerSeatPosition, PlayerSeatRelation } from "./enumerator";

let pokerHelper = {
    getRelation(myseat: PlayerSeatPosition, heseat: PlayerSeatPosition): PlayerSeatRelation {
        let ret: PlayerSeatRelation = heseat - myseat
        if (ret < PlayerSeatRelation.self) {
            ret += PlayerSeatRelation.unknown
        }
        if (ret >= PlayerSeatRelation.unknown) {
            ret -= PlayerSeatRelation.unknown
        }
        return ret
    },

    getPosition(myseat: PlayerSeatPosition, relation: PlayerSeatRelation): PlayerSeatPosition {
        let ret: PlayerSeatPosition = myseat + relation
        if (ret >= PlayerSeatPosition.unknown) {
            ret -= PlayerSeatPosition.unknown
        }
        return ret
    },

    positionToString(seat: PlayerSeatPosition) {
        switch (seat) {
            case PlayerSeatPosition.north:
                return "【北】"
            case PlayerSeatPosition.east:
                return "【东】"
            case PlayerSeatPosition.south:
                return "【南】"
            case PlayerSeatPosition.west:
                return "【西】"
        }
    }
}

export default pokerHelper
