const jwt = require('jsonwebtoken');
const { serverConfig, errCodes, logger } = require('./../app');
const { ResponseWrapper } = require('../com/wrappers');
const { ServerListController, Account } = require('./controllers');

/**
 * @api {post} /auth 登录验证
 * @apiName Auth
 * @apiGroup Login
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 * @apiParam {String} openid 用户唯一码
 * 
 * @apiError {Number} errcode
 * @apiSuccess {String} token
 * @apiSuccess {String} ip
 * @apiSuccess {Number} port 
 */
function LoginAuth(req, res)
{
    let responseData = new ResponseWrapper(logger);

    if ('openid' in req.body && 
            'string' === typeof req.body.openid && 
                req.body.openid.length > 0) {
        let token = jwt.sign({
            openid: req.body.openid
        }, serverConfig.token.secretKey, {
            expiresIn: serverConfig.token.expiresIn
        });

        var account = new Account(req.body.openid);
        account.load(() => {
            let serverInfo = ServerListController.getServerInfo();
            responseData.setData({
                token: token,
                ip: serverInfo.ip,
                port: serverInfo.port
            });
            res.json(responseData.toJSON());
        });
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        res.json(responseData.toJSON());
    }
}

module.exports = {
    LoginAuth
}