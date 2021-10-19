import WXApi from "./Lib/WXApi";
import PlatformUtility from "./Lib/PlatformUtility";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
// Date.prototype["format"] = function (fmt) { //author: meizz   
//     var o = {
//         "M+": this.getMonth() + 1,                 //月份   
//         "d+": this.getDate(),                    //日   
//         "h+": this.getHours(),                   //小时   
//         "m+": this.getMinutes(),                 //分   
//         "s+": this.getSeconds(),                 //秒   
//         "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
//         "S": this.getMilliseconds()             //毫秒   
//     };
//     if (/(y+)/.test(fmt))
//         fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
//     for (var k in o)
//         if (new RegExp("(" + k + ")").test(fmt))
//             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
//     return fmt;
// }
Date.prototype["Format"] = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds() //秒 
    };
    if (/(y+)/.test(fmt)) { //根据y的长度来截取年
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
}
export class MD5 {

    public constructor() {

    }
    private hexcase = 0;   /* hex output format. 0 - lowercase; 1 - uppercase        */
    private b64pad = "";  /* base-64 pad character. "=" for strict RFC compliance   */

    /*
    * These are the privates you'll usually want to call
    * They take string arguments and return either hex or base-64 encoded strings
    */
    public hex_md5(s: string) { return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s))); }//这个函数就行了，
    public b64_md5(s: string) { return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(s))); }
    public any_md5(s: string, e: string) { return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(s)), e); }
    public hex_hmac_md5(k: string, d: string) { return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); }
    private b64_hmac_md5(k: string, d: string) { return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); }
    private any_hmac_md5(k: string, d: string, e: string) { return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e); }

    /*
    * Perform a simple self-test to see if the VM is working
    */
    public md5_vm_test() {
        return this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
    }

    /*
    * Calculate the MD5 of a raw string
    */
    public rstr_md5(s: string) {

        return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
    }

    /*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
    public rstr_hmac_md5(key: string, data: string) {
        var bkey = this.rstr2binl(key);
        if (bkey.length > 16) bkey = this.binl_md5(bkey, key.length * 8);

        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
        return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
    }

    /*
    * Convert a raw string to a hex string
    */
    public rstr2hex(input: string) {
        try { this.hexcase } catch (e) { this.hexcase = 0; }
        var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var output = "";
        var x;
        for (var i = 0; i < input.length; i++) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F)
                + hex_tab.charAt(x & 0x0F);
        }
        return output;
    }

    /*
    * Convert a raw string to a base-64 string
    */
    public rstr2b64(input: string) {
        try { this.b64pad } catch (e) { this.b64pad = ''; }
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var output = "";
        var len = input.length;
        for (var i = 0; i < len; i += 3) {
            var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > input.length * 8) output += this.b64pad;
                else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
            }
        }
        return output;
    }

    /*
    * Convert a raw string to an arbitrary string encoding
    */
    public rstr2any(input: string, encoding: string) {
        var divisor = encoding.length;
        var i, j, q, x, quotient;

        /* Convert to an array of 16-bit big-endian values, forming the dividend */
        var dividend = Array(Math.ceil(input.length / 2));
        for (i = 0; i < dividend.length; i++) {
            dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
        }

        /*
        * Repeatedly perform a long division. The binary array forms the dividend,
        * the length of the encoding is the divisor. Once computed, the quotient
        * forms the dividend for the next step. All remainders are stored for later
        * use.
        */
        var full_length = Math.ceil(input.length * 8 /
            (Math.log(encoding.length) / Math.log(2)));
        var remainders = Array(full_length);
        for (j = 0; j < full_length; j++) {
            quotient = Array();
            x = 0;
            for (i = 0; i < dividend.length; i++) {
                x = (x << 16) + dividend[i];
                q = Math.floor(x / divisor);
                x -= q * divisor;
                if (quotient.length > 0 || q > 0)
                    quotient[quotient.length] = q;
            }
            remainders[j] = x;
            dividend = quotient;
        }

        /* Convert the remainders to the output string */
        var output = "";
        for (i = remainders.length - 1; i >= 0; i--)
            output += encoding.charAt(remainders[i]);

        return output;
    }

    /*
    * Encode a string as utf-8.
    * For efficiency, this assumes the input is valid utf-16.
    */
    public str2rstr_utf8(input: string) {
        var output = "";
        var i = -1;
        var x, y;

        while (++i < input.length) {
            /* Decode utf-16 surrogate pairs */
            x = input.charCodeAt(i);
            y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
            if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                i++;
            }

            /* Encode output as utf-8 */
            if (x <= 0x7F)
                output += String.fromCharCode(x);
            else if (x <= 0x7FF)
                output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F),
                    0x80 | (x & 0x3F));
            else if (x <= 0xFFFF)
                output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                    0x80 | ((x >>> 6) & 0x3F),
                    0x80 | (x & 0x3F));
            else if (x <= 0x1FFFFF)
                output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                    0x80 | ((x >>> 12) & 0x3F),
                    0x80 | ((x >>> 6) & 0x3F),
                    0x80 | (x & 0x3F));
        }
        return output;
    }

    /*
    * Encode a string as utf-16
    */
    public str2rstr_utf16le(input: string) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode(input.charCodeAt(i) & 0xFF,
                (input.charCodeAt(i) >>> 8) & 0xFF);
        return output;
    }

    public str2rstr_utf16be(input: string) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                input.charCodeAt(i) & 0xFF);
        return output;
    }

    /*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
    public rstr2binl(input: string) {
        var output = Array(input.length >> 2);
        for (var i = 0; i < output.length; i++)
            output[i] = 0;
        for (var i = 0; i < input.length * 8; i += 8)
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        return output;
    }

    /*
    * Convert an array of little-endian words to a string
    */
    public binl2rstr(input: number[]) {
        var output = "";
        for (var i = 0; i < input.length * 32; i += 8)
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        return output;
    }

    /*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
    public binl_md5(x: number[], len: number) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
        }
        return [a, b, c, d];
    }

    /*
    * These privates implement the four basic operations the algorithm uses.
    */
    public md5_cmn(q: any, a: any, b: any, x: any, s: any, t: any) {
        return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
    }
    public md5_ff(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
        return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    public md5_gg(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
        return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    public md5_hh(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
        return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    public md5_ii(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
        return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
    public safe_add(x: any, y: any) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
    * Bitwise rotate a 32-bit number to the left.
    */
    public bit_rol(num: any, cnt: any) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
}

@ccclass
export default class Logger {

    public static Logintime: number = 0

    public static Appid: string = "cd65e2476fa3a4c8afc57ec69d3bc202"

    public static Secret: string = "2807d7dbda0beb929eec32184869d455113e2c36"

    public static RecordTime: number[] = []


    public static Login(openid: string) {
        let mins: number[] = [5, 10, 15, 20, 25, 30, 40, 50, 60]
        for (let i = 0; i < mins.length; i++) {
            Logger.RecordTime.push(mins[i] * 60)
        }
        if (CC_PREVIEW) {
            return
        }

        let timestamp = Number((new Date().getTime() / 1000).toFixed(0))
        let asc = `appId=${Logger.Appid}&timestamp=${timestamp}&userId=${openid}`
        asc += Logger.Secret
        let params = { timestamp: timestamp, appId: Logger.Appid, userId: openid, sign: new MD5().hex_md5(asc).toLocaleLowerCase() }
        WXApi.HttpPost("/logger/apiClient/login", params, "https://game.xunyi.online")
        Logger.Logintime = timestamp
    }

    public static updateMsg(openid, name, pic) {
        if (!CC_WECHATGAME) {
            return
        }
        let timestamp = Number((new Date().getTime() / 1000).toFixed(0))
        let params = { timestamp: timestamp, userId: openid, name: name, pic: pic }
        WXApi.HttpPost("/logger/apiClient/updateMsg", params, "https://game.xunyi.online")
    }

    public static exportWXData(str: string) {
        if (!CC_WECHATGAME) return
        let mark: string = 'fkzs_site'
        let aid: string = '950100171001'
        let key: string = 'cbd6454f765998f70e54fc79c4755f96'
        let time: string = new Date(new Date().getTime())["Format"]('yyyy-MM-dd hh:mm:ss')
        let sign: string = new MD5().hex_md5(mark + time + "gmApi" + key)

        let param: any = { mark: mark, aid: aid, openid: WXApi.OpenId, time: time, sign: sign }
        param = JSON.stringify(param)
        let url: string = 'https://sdk.tshy178.com/minigameapi/' + str + "?"
            + "mark=" + mark + "&aid=" + aid + "&openid=" + WXApi.OpenId + "&time=" + time + "&sign=" + sign + "&channel_aid=" + WXApi.channel_aid
            + "&is_share=" + WXApi.is_share

        this.xmlhttpReq(url)
    }

    public static getAdData(vals: string) {
        if (!CC_WECHATGAME) return
        let mark: string = 'fkzs_site'
        let aid: string = '950100171001'
        let key: string = 'cbd6454f765998f70e54fc79c4755f96'
        let time: string = new Date(new Date().getTime())["Format"]('yyyy-MM-dd hh:mm:ss')
        let sign: string = new MD5().hex_md5(mark + time + "gmApi" + key)

        let param: any = { mark: mark, aid: aid, openid: WXApi.OpenId, time: time, sign: sign, vals: vals }
        param = JSON.stringify(param)
        let url: string = 'https://sdk.tshy178.com/minigameapi/getAdvertiserInfo' + "?"
            + "mark=" + mark + "&aid=" + aid + "&openid=" + WXApi.OpenId + "&time=" + time + "&sign=" + sign + "&vals=" + vals

        this.xmlhttpReq(url, (reqData) => {
            if (vals == 'icon') {
                WXApi.iconData = JSON.parse(reqData).data
                console.log('WXApi.iconData:', WXApi.iconData)
            } else if (vals == 'drawer') {
                WXApi.drawerData = JSON.parse(reqData).data
                console.log('WXApi.drawerData:', WXApi.drawerData)
            }

        })
    }

    public static exportAdType(type: string, vals: string, ad_id: string) {
        if (!CC_WECHATGAME) return
        let mark: string = 'fkzs_site'
        let aid: string = '950100171001'
        let key: string = 'cbd6454f765998f70e54fc79c4755f96'
        let time: string = new Date(new Date().getTime())["Format"]('yyyy-MM-dd hh:mm:ss')
        let sign: string = new MD5().hex_md5(mark + time + "gmApi" + key)

        let param: any = { mark: mark, aid: aid, openid: WXApi.OpenId, time: time, sign: sign, vals: vals, advertiser_id: ad_id }
        param = JSON.stringify(param)
        let url: string = 'https://sdk.tshy178.com/minigameapi/' + type + "?"
            + "mark=" + mark + "&aid=" + aid + "&openid=" + WXApi.OpenId + "&time=" + time + "&sign=" + sign + "&vals=" + vals + "&advertiser_id=" + ad_id

        this.xmlhttpReq(url)
    }

    public static xmlhttpReq(url: string, CB?: Function) {
        let req: XMLHttpRequest = new XMLHttpRequest();
        req.open("GET", url, true);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        req.onreadystatechange = () => {
            console.log("req:", req)
            if (req.readyState == 4 && req.status == 200) {
                if (CB)
                    CB(req.responseText)
            } else if (req.readyState == 4) {
                //cc.log("http error:", req.status, `${WXApi.Url}${url}`)
            }
        }
        req.onerror = () => {
            cc.log("web request error,try again")
            this.xmlhttpReq(url, CB)
        }
        req.send()
    }

    /*
        id: 从1开始
    */
    public static recordTS(id: number) {
        let tsSign: any[] = [
            "5b5da3ce82ac332d", "d30aade97d1ad8ee", "9f6482e42558cfa3", "fefd0e6dee7d1bb3", "c71dfdcfe15156c8",
            "0fb5befa51d59d96", "d8710ce15a2ea163", "ddd455340430fec7", "5d2e574718359589", "3916f776e67bb4b6",
            "0dede20ef6cb2329", "d200af93149c5df6", "987b1d3345d4b835", "1032276f07432e1b", "eab7155b069460df",
            "e44ed6e24eb92e84", "d7136fba95692202", "fa3857f3f64861c6", "97d7172e388687c6", "e9c4d53a36fdd386",
            "d63af577f4b6d582", "9171a68910d30f25", "c8ccc5d9483ba692", "0f8b14cbe65e51d9", "4e01cd6a661b047a",
            "f40aed74aef3b20d", "60f5311fa84cb9ba", "a26f209492be943f", "4e39e38101b2ead4", "ecd8e2e7cdbdca06",
            "c28df9b13e68f1c0", "74bd28f140d80ae7", "25697d36a050be46", "6fca99b7715ae558", "97c258b98687c44b",
            "53c0f98a74feb1ab", "e99d5a78a0a2e85b"]
        let flag: string = tsSign[id - 1];
        let params = {
            timestamp: Math.floor(new Date().getTime() / 1000).toString(),
            userId: WXApi.sign,
            flag: flag
        }
        if (CC_WECHATGAME) {
            WXApi.HttpPost('/logger/apiClient/gameFlag', params, "https://game.xunyi.online");
        }
    }


    //游戏打点   id从 0 开始
    public static record(id: number) {
        return
        let flag = this.recordSign[id];
        if (WXApi.channelID == 1) flag = this.recordSign1[id]
        if (WXApi.channelID == 2) flag = this.recordSign2[id]
        if (PlatformUtility.IsAndroid()) flag = this.recordSign3[id]
        if (WXApi.isTaptap) flag = this.recordSign4[id]

        let params = {
            timestamp: Math.floor(new Date().getTime() / 1000),
            userId: WXApi.sign,
            flag: flag
        }
        if (CC_WECHATGAME || PlatformUtility.IsAndroid()) {
            WXApi.HttpPost('/logger/apiClient/gameFlag', params, "https://game.xunyi.online");

            let difftime = Logger.Logintime - Math.round(new Date().getTime() / 1000)
            let idx = -1
            for (let i = 0; i < Logger.RecordTime.length; i++) {
                if (difftime >= Logger.RecordTime[i]) {
                    idx = i
                }
            }
            if (idx > -1) {
                Logger.record(idx + 22)
            }
        }

    }
    //微信
    public static recordSign: string[] = [
        "00031df00f50b6bb", "1d39c72f8c402afa", "2e71f41c38fda98e",
        "94be0faf276776e1", "9b1a9b3e0003d3f6", "76165a37aa93f391",
        "c082f82253c3d69c", "f4cc62253d7c8763", "9314d879c9407a37",
        "d96f99db7ede2dbf", "e6a779270f32c1e2", "c09387b57ee26cf4",
        "120a202d1e8b834d", "a1701cb70d60733f", "959b14900fe319ba",
        "2698b97706d810a2", "6ff6e379d6603b5a", "2a6d850f2b19f557",
        "ce4aa16b453527da", "99b5f45be70f3ad9", "907d1dda97c17d1f",
        "34bbf61d1f3bd6cc", "ea7453f46c77fc09", "79b6a5ead32a6595",
        "286e4b0838e8315f", "c2586de2e8efb047", "7d9cfef332f3001f",
        "ad2bd1d33d079098", "7e5d525f73476447", "bc20ff704c880da9",
        "8d22d3d9cfb198c9", "22507f97e2c2a051", "2b8e1498cfcf844e"]
    //QQ
    public static recordSign1: string[] = [
        "684fc6f70070d694", "b6cacc878dd22715", "deef98def7692237",
        "e66ee65c26542bef", "1e849c718b1a6a60", "470429453192c652",
        "598b647ea33dae5c", "a096b3c6356bf3c0", "54bbdc418f42fbe1",
        "0cf7e30c454201ba", "44e876aa28b8f688", "cf1e54e7bfc716d4",
        "eb61f0e7ddd978cc", "66b228ab648b9108", "952ee817622cceae",
        "1d0291e838317d32", "add9bad2b74750ef", "20ad95b5bb0a72a4",
        "350eb891eb9e8938", "5acf784eb6af32ea", "bdd35bf99825f6a0",
        "f8fbcdb3041508dc", "467413fa2c485694", "92c0a12b588d961b",
        "a673bebc3d82ef20", "44deb0edf9f9eca7", "269ac5eb4c4c0df1",
        "fc627e4d1c508688", "861b2158791ab169", "56e71d21c215a61c",
        "4a7a05b5732987d5", "0848b450097fb4f0", "86e972c26282d683"]
    //TT
    public static recordSign2: string[] = [
        "5b91da193e659c88", "c350af0232653593", "828d36c18653dd25",
        "85db135d304e1f85", "46f4f0dd34e23013", "283c339704dfd962",
        "08d46b6f5fa2f2b8", "6369f1f4925a5fa4", "3e456b839826ad20",
        "1f7cac087f00dd96", "e25214def3261f82", "76511a03837adb12",
        "e69682a10bafeec0", "52bbdb91f88053b8", "b5574958dd947bbd",
        "58ef8b3b0e85483c", "7bcde60fe54a3478", "e62f96a106b9d7eb",
        "944f2fed5694f640", "f074be6b323531f1", "837f4d4acff8816a",
        "050bf900fa602c7c", "78f47ced90435e99", "284c74c98642f5e2",
        "b8630f950541a7e2", "ad92c97fe2d0a189", "0f2a0004d85d35e4",
        "74ac95385a677d89", "3e3583997a3c74ad", "de63f7e63d290d1e",
        "8d8bc28121a5e2e7", "9073d84607fef2b5", "eb35aa1ad8c5ed60"]
    //android
    public static recordSign3: string[] = [
        "5ffc326d5a93abdb", "ab3baa8a87d2fcd4", "71a91f0d76d00fc3",
        "4a2b3044faa14ef2", "57a98af2df728d9b", "1ce0d95e3ca2d9d8",
        "1f536868b4a552cb", "13dd9f21f085a146", "ad39e10ff1187347",
        "a1fa4f1969289a23", "4c57238094666ad5", "9a4d3ffdb1ea90d6",
        "6f116cbe70f54880", "37aca20b011fa67b", "850c5f68c9c0d8be",
        "2ee16e1181d96952", "3c54df782a8a87cd", "72f4b4b6325ee6cd",
        "081b35f1a15a9e33", "45f271adc88b3458", "c70cbd9d84055bda",
        "952bc8302b4aca42", "8ccc96f66f5d341c", "4710fb73dd87ff6e",
        "3f9697037d3ce35d", "1c2eff622b846803", "c2791431b33b4a60",
        "7e3fa6c45cf897aa", "0814755a6cafe3e2", "8142b49774a903dc",
        "cc522d9b54e195e7", "0790a6f6054ff630", "0a1d94cf238c8555"]
    //taptap
    public static recordSign4: string[] = [
        "4d35bf66edcedfb8", "82f230eb3a8cbd36", "f43d1b823d57809e",
        "68c224dbcfadeab8", "b4c49bb064ae180c", "40ad4e1d6fd369d2",
        "3ae21782bb72611c", "d8b3dce0f384c005", "a5bf2ae3e966e45a",
        "46e716b94eb152a4", "8756639822e1e436", "e63f17406bb401d5",
        "2199ec8b5cb7d06d", "7874e70ed2ed9d81", "481487e904cd1385",
        "9c3d74999a74b26b", "93a1d336d5e0ddef", "a92273dc97e7af1c",
        "675b8a2f36a79274", "e5de0e3349dee89a", "a1b84a317d5d2b60",
        "efa38ed0c40e014f", "5353fcc2c8c9ee1a", "0f783edd84d5a811",
        "e4737ebfb9c6c483", "c903019c85a1cab8", "cab6fbcabe23bcf5",
        "6914d98bc7108749", "e32f520308a6df91", "3fb5ae973e7b0ead",
        "6f2c9f6a91b1a1bd", "f83b67095725aa47", "c0567890d262a776"]
}
