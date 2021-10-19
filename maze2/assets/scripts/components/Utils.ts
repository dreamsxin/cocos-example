/**
 * 将秒转为分钟显示
 * @param second 秒
 * @param ismm 分钟是否补0
 * @returns m:ss || mm:ss
 */
export function getSecondToMinute(second: number, ismm: boolean = false): string {
    let m = Math.floor(second / 60);
    let s = second % 60;
    let ss = s < 10 ? "0" + s.toString() : s.toString();

    let mm: string = m.toString();
    if (ismm) {
        mm = m < 10 ? "0" + m.toString() : m.toString();
    }

    return mm + ':' + ss
}

/**
 * 前导0
 */
export function getNumberToZero(value: number, count: number = 1) {
    let ss = value < 10 ? "0".repeat(count) + value.toString() : value.toString();
    return ss;
}