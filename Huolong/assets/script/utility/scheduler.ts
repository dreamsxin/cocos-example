export default {
    callAfterDelay(func: any, dt: number) {
        return setTimeout(func, dt * 1000)
    },

    async waitFor(seconds: number): Promise<void> {
        return new Promise<void>(resolve => {
            setTimeout(resolve, seconds * 1000)
        })
    },
}
