const amqp = require('amqplib');

class RabbitMQ
{
    constructor(config, logger)
    {
        this.enabled_ = true;
        this.logger_ = logger;
        this.config_ = config;
        this.index_ = 0;
        try {
            this.open = amqp.connect(this.config_.hosts[this.index_]);
            this.config_.hosts.forEach(uri => {
                (() => {
                    var temps = uri.split(':');
                    temps[2] = temps[2].slice(temps[2].indexOf('@'), temps[2].length);
                    uri = temps[0] + ":" + temps[1] + "" + temps[2] + ":" + temps[3];
                })();
                this.logger_.Info("RabbitMQ connect success:", uri);
            });
        } catch (e) {
            this.logger_.Error(e);
            process.exit(-1);
        }
    }

    async send(msg)
    {
        try {
            const channel = await (await this.open).createChannel();
            await channel.assertExchange(this.config_.exchangeName, this.config_.exchangeType, { durable: this.config_.durable });
            await channel.publish(this.config_.exchangeName, this.config_.routingKey, Buffer.from(msg), {
                persistent: this.config_.persistent,
                mandatory: this.config_.mandatory
            });
            await channel.close();
        } catch (e) {
            this.logger_.Error(e);
        }
    }

    async read(recvCallback)
    {
        try {
            const channel = await (await this.open).createChannel();
            await channel.assertExchange(this.config_.exchangeName, this.config_.exchangeType, { durable: this.config_.durable });
            await channel.assertQueue(this.config_.queueName);
            await channel.bindQueue(this.config_.queueName, this.config_.exchangeName, this.config_.bindingKey);
            if (this.config_.limit.enabled) {
                await channel.prefetch(this.config_.limit.count, this.config_.limit.flag); // count：每次推送给消费端 N 条消息数目，如果这 N 条消息没有被ack，生产端将不会再次推送直到这 N 条消息被消费。global：在哪个级别上做限制，ture 为 channel 上做限制，false 为消费端上做限制，默认为 false
            }
            
            await channel.consume(this.config_.queueName, (msg) => { 
                recvCallback(channel, msg);
             }, { noAck: false });
        } catch (e) {
            this.logger_.Error(e);
        }
    }
}

module.exports = RabbitMQ;