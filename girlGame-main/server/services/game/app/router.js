const { PacketWrapper } = require('./com/wrappers');

class Router
{
    constructor(routes, logger)
    {
        this.logger_ = logger;
        this.routes_ = routes;
    }

    dispatch(req, res) {
        try {
            if ('function' === typeof this.routes_[req.code]) {
                this.logger_.Time('api-time-cost');
                this.routes_[req.code](req, res);
                this.logger_.TimeEnd('api-time-cost')
            } else {
                this.logger_.Warn("Cannot find dispatch function code:", req.code);
                PacketWrapper.pack({ code: req.code, body: null }).then(packet => { res.send(packet); });
            }
        } catch (e) {
            this.logger_.Error(e, req);
        }
    }
}

module.exports = Router;
