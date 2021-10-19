
import { Component, _decorator } from 'cc';
import Colyseus from 'db://colyseus-sdk/colyseus.js';

const { ccclass, property } = _decorator;

@ccclass('SocketConnection')
export class SocketConnection extends Component {

    playerName: string;
    isConnected: boolean;

    @property hostname = "localhost";
    @property port = 2567;
    @property useSSL = false;

    client!: Colyseus.Client;
    room!: Colyseus.Room;

    start() {
        // Instantiate Colyseus Client
        // connects into (ws|wss)://hostname[:port]

        /* let domain = window.location.href.split('/')[2];
        let url = "ws://" + domain.split(':')[0] + ':2567'; */

        let url = `${this.useSSL ? "wss" : "ws"}://${this.hostname}${([443, 80].includes(this.port) || this.useSSL) ? "" : `:${this.port}`}`;
        this.client = new Colyseus.Client(`${this.useSSL ? "wss" : "ws"}://${this.hostname}${([443, 80].includes(this.port) || this.useSSL) ? "" : `:${this.port}`}`);

        console.log(`Connecting server to ${url}`);
        this.connect();
    }


    async connect() {
        try {
            this.room = await this.client.joinOrCreate("SumoRoom");


            console.log("Room joined successfully!");
            console.log("user's sessionId:", this.room.sessionId);

            this.room.onStateChange((state) => {
                console.log("onStateChange: ", state);
            });

            this.room.onLeave((code) => {
                console.log("onLeave:", code);
            });

        } catch (e) {
            console.error(e);
        }
    }
}
