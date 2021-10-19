const util = require('util');
const ws = require('ws');
const EventEmitter = require('events');
const { PacketWrapper } = require('./com/wrappers');
const protoCodes = require('./defs/proto.codes');

class ServeEmitter extends EventEmitter {}

class SessionMgr
{
    constructor()
    {
        this.session_ = {};
    }

    verify(conn)
    {
        return ('openid' in conn && 'uuid' in conn);
    }

    add(conn, openid, uuid)
    {
        conn.openid = openid;
        conn.uuid = uuid;

        if ("undefined" !== typeof uuid) {
            if (this.session_[conn.uuid]) {
                this.session_[conn.uuid].terminate(); // old connection we must disconnect.
                delete this.session_[conn.uuid];
            }

            this.session_[conn.uuid] = conn;
        }
    }

    del(conn)
    {
        delete this.session_[conn.uuid];

        return [conn.openid, conn.uuid];
    }

    openid(conn)
    {
        return conn.openid;
    }

    uuid(conn)
    {
        return conn.uuid;
    }

    conn(uuid)
    {
        return this.session_[uuid] ? this.session_[uuid] : null;
    }

    sessions()
    {
        return this.session_;
    }
}

class Server
{
    constructor(config, logger)
    {
        this.logger_ = logger;
        this.serve_ = new ws.Server({ 
            port: config.port, 
            maxPayload: config.maxPayload 
        });
        this.session_mgr_ = new SessionMgr();

        this._doHeartBeat(config.keepAlive);
    }

    _doHeartBeat(keepAlive) 
    {
        this.heartbeat_interval_ = setInterval(() => {
            this.serve_.clients.forEach(conn => {
                if (conn.isAlive === false) return conn.terminate();
                conn.isAlive = false;
                conn.ping(() => {  /** noop */ });
            });
        }, keepAlive * 1000);
    }

    _doBroadcast()
    {
        this.broadcast_emitter_ = new ServeEmitter();
        this.broadcast_emitter_.on('broadcast', (players, bytes) => {
            setImmediate(() => {
                this.logger_.Debug("broadcast", players, bytes);
                /*this.serve_.clients.forEach(conn => {
                    if ("undefined" !== typeof players[conn.uuid]) {
                        conn.send(bytes);
                    }
                });*/

                for (let uuid of players) {
                    var conn = this.session_mgr_.conn(uuid);
                    if (conn) {
                        conn.send(bytes);
                    }
                }
            });
        });
    }

    broadcast(players, bytes)
    {
        this.broadcast_emitter_.emit('broadcast', players, bytes);
    }

    getSession()
    {
        return this.session_mgr_;
    }

    servInfo()
    {
        this.logger_.Debug("sessions count: %d", this.serve_.clients.size);
        this.logger_.Debug("clients {")
        this.serve_.clients.forEach(conn => {
            this.logger_.Debug("\t%s => %s", conn.openid, conn.uuid);
        });
        this.logger_.Debug("}");
        this.logger_.Debug("sessions {")
        let sessions = this.session_mgr_.sessions();
        let uuids = Object.keys(sessions);
        for (let uuid of uuids) {
            this.logger_.Debug("\t%s", uuid);
        }
        this.logger_.Debug("}");
    }

    run(router)
    {
        this.serve_.on('connection', conn => {
            conn.logintime = new Date();
            conn.isAlive = true;
            conn.on('pong', () => { /** heart beat */ conn.isAlive = true; })
        
            conn.on('message', bytes => {
                PacketWrapper.unpack(bytes).then(req => {
                    this.logger_.Debug("Request:", JSON.stringify(req));
                    if (!this.session_mgr_.verify(conn) &&
                            !(req.code === protoCodes.PC_PLAYER_SIGNIN || req.code === protoCodes.PC_PLAYER_CREATE)) {
                        // player is not login unauthorized operation, we must to terminate this connection.
                        this.logger_.Debug("Player not login unauthorized operation: code=%d", req.code);
                        this.session_mgr_.del(conn);
                        conn.terminate();
                    } else {
                        // route dispatch
                        req.openid = this.session_mgr_.openid(conn);
                        req.uuid = this.session_mgr_.uuid(conn);
                        router.dispatch(req, conn);
                    }
                }).catch(err => { 
                    this.logger_.Error(err);
                }); 
            })
        
            conn.on('close', (code, reason) => {
                var online = Math.floor((new Date() - conn.logintime) / 1000) // seconds;
                
                var [openid, uuid] = this.session_mgr_.del(conn);
                this.servInfo();
                this.logger_.Info(util.format("client logout: openid=%s, uuid=%s, online=%d(s)", 
                    openid, uuid, online));
            })
        
            conn.on('error', (res, err) => {
                this.logger_.Error(res, err);
            })

            // 广播事件
            this._doBroadcast();
        })

        this.serve_.on('close', () => {
            clearInterval(this.heartbeat_interval_);
        })
    }

    shutdown()
    {
        this.serve_.close();
    }
}

module.exports = Server;