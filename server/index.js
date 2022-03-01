const { fastify } = require("fastify");

const app = fastify();

require("./deepstream-client");

app.post("/api/auth", async (request, reply) => {
  const { authData } = request.body;
  const { username, type } = authData;
  return reply.send({
    username: "Admin adward",
    clientData: {
      user: {
        username,
        user_id: type === "admin" ? 0 : 1,
      },
    },
    serverData: {
      role: type === "admin" ? "admin" : "user",
      username,
      user_id: type === "admin" ? 0 : 1,
    },
  });
});

app.listen(4000, (err, address) => {
  console.log(`Server listening on ${address}`);
});
