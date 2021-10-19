let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@#$%^&*()_-+={[}]|\\:;"\'<,>.?/'
let end_symbol = 95
let end_nosymbol = 62
let end_nocase = 36

export default {
    getRandomString(minLen = 6, maxLen = 16){
        if(minLen > maxLen){
            return null
        }
        let len = Math.floor(Math.random() * (minLen - maxLen)) + minLen
        let ret = ""
        for(let i=0; i<len; ++i){
            ret += chars[Math.floor(Math.random() * (end_nocase - 1))]
        }
        return ret
    }
}