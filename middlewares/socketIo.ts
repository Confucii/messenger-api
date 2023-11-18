import { IncomingMessage, Server, ServerResponse } from "http";
import { Server as CreateIOServer } from "socket.io";

function getIo(server: Server<typeof IncomingMessage, typeof ServerResponse>) {
  const io = new CreateIOServer(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("authorize", (auth) => {
      socket.join(auth);
      io.to(auth).emit("sendConfirmation");
    });
  });

  return io;
}

export default getIo;
