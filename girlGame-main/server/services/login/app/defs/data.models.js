const { DateTime } = require('./../com/utility');

module.exports = {
    "accounts": () => {
        return {
            account_id: "0",
            openid: "",
            created_at: new DateTime().toDateTimeString(),
            updated_at: new DateTime().toDateTimeString(),
            status: 1
        }
    }
}