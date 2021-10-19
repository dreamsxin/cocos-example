import scheduler from "./scheduler"

class MessageData {
    event: number
    data: any[]
}

class ListenerData {
    event: number
    id: number
    callback: Function
    data: any[]
}

export default class EventManager {
    private _messageQueue: MessageData[] = null
    private _listenerMap: Map<number, ListenerData[]> = null
    private _stopFlag: boolean[] = null
    private _handler: Promise<number> = null

    public constructor() {
        this._messageQueue = []
        this._listenerMap = new Map<number, ListenerData[]>()
        this.resume()
    }

    public async pause(): Promise<number> {
        if (this._handler != null) {
            this._stopFlag[0] = true
            let _handler = this._handler
            this._handler = null
            return _handler
        }
        return null
    }

    public async resume() {
        if (this._handler == null) {
            this._stopFlag = [false]
            this._handler = this.update(this._stopFlag, 0.01)
        }
    }

    public listen(event: number, callback: Function, listenerData: any = null): number {
        if (callback != null) {
            let ld = new ListenerData()
            ld.event = event
            ld.callback = callback
            ld.data = listenerData
            if (!this._listenerMap.has(event)) {
                this._listenerMap.set(event, [])
            }
            let list = this._listenerMap.get(event)
            let index = 1
            while (true) {
                let found = false
                for (let listener of list) {
                    if (listener.id == index) {
                        found = true
                        break
                    }
                }
                if (found) {
                    ++index
                } else {
                    break
                }
            }
            ld.id = index
            list.push(ld)
            return index
        }
        return 0
    }

    public unlisten(event: number, id: number): boolean {
        if (this._listenerMap.has(event)) {
            let list = this._listenerMap.get(event)
            for (let i = 0; i < list.length; ++i) {
                if (list[i].id == id) {
                    list.splice(i, 1)
                    return true
                }
            }
        }
        return false
    }

    public notify(event: number, ...data: any[]): void {
        let md = new MessageData()
        md.event = event
        md.data = data
        this._messageQueue.push(md)
    }

    private async update(stopFlag: boolean[], dt: number): Promise<number> {
        while (!stopFlag[0]) {
            if (this._messageQueue.length > 0) {
                let message = this._messageQueue.shift()
                if (this._listenerMap.has(message.event)) {
                    let list = this._listenerMap.get(message.event)
                    for (let listener of list) {
                        listener.callback(message.event, listener.data, ...message.data)
                    }
                }
            }
            await scheduler.waitFor(dt)
        }
        return 0
    }
}