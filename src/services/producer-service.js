import amqp from 'amqplib';

class ProducerService {
    async sendMessage(queue, message) {
        const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, {
            durable: true,
        });

        channel.sendToQueue(queue, Buffer.from(message));

        await channel.close();
        await connection.close();
    }
}

export default ProducerService;
