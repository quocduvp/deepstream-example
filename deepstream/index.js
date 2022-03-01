const { Deepstream } = require("@deepstream/server");

const server = new Deepstream('./conf/config-v2.yml')
server.on("message", (message, client) => {
    console.log(message)
})
// server.on('stopped', () => process.exit(0))

server.start();