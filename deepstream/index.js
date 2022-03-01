const { Deepstream } = require("@deepstream/server");
const fastifyServer = require("./fastify-server");

const server = new Deepstream('./conf/config-v2.yml')

const main = async () => {
    try {
        server.on("message", (message, client) => {
            console.log(message)
        })
        server.start();
        fastifyServer.listen(8081, (err, address) => {
            console.log(`server listening on ${address}`)
        });
    } catch (error) {
        console.log(error)
        process.exit(0);
    }
}

main();