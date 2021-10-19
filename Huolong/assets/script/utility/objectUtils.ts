export default {
    dump: function (v: any) {
        let ret = "";
        if (v == null) {
            ret = 'undefined';
        } else switch (typeof v) {
            case 'object':
                ret += '{';
                for (let k in v) {
                    if (v.hasOwnProperty(k))
                        ret += k + ':' + this.dump(v[k]) + ',';
                }
                ret += '}';
                break;
            case 'string':
                ret = '"' + v + '"';
                break;
            case 'undefined':
                ret = 'undefined';
                break;
            default:
                ret = v.toString();
        }
        return ret;
    },
}