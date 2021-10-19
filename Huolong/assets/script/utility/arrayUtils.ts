export default {
    find<T>(array:T[], value:T) {
        for (let i in array) {
            if (array[i] == value) {
                return i
            }
        }
        return -1
    }
}