const { WebSocketServer } = require("ws");
const Message = require("../models/Message/Message"); 
const clients = new Map(); 

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server }); // Dùng server Express

  wss.on("connection", (ws) => {
    console.log("New WS connection");

    ws.on("message", async (message) => {
    const msgStr = message.toString(); // chuyển Buffer sang string
    console.log("Received string:", msgStr);

    try {
        const data = JSON.parse(msgStr);

        // Khi user login WS
        if (data.type === "login") {
        clients.set(data.userId, ws);
        console.log(`User ${data.userId} connected`);
        }

        // Khi user gửi tin nhắn
        if (data.type === "message") {
        const { from, to, text, timestamp } = data;

        let msgDoc;
        try {
            msgDoc = await Message.create({
            from,
            to,
            text,
            timestamp: timestamp ? new Date(timestamp) : new Date(),
            });
        } catch (dbErr) {
            console.error("MongoDB save error:", dbErr);
            return; // Không gửi nếu lưu DB fail
        }

        const msgPayload = {
            from,
            to,
            text,
            timestamp: msgDoc.timestamp
        };

        // Gửi đến người nhận nếu online
        if (clients.has(to)) {
            clients.get(to).send(JSON.stringify(msgPayload));
        }

        // Gửi lại cho người gửi
        ws.send(JSON.stringify(msgPayload));
        }

    } catch (err) {
        console.error("WS message error:", err);
    }
    });


    ws.on("close", () => {
      for (const [userId, client] of clients.entries()) {
        if (client === ws) clients.delete(userId);
      }
    });
  });
}

module.exports = { setupWebSocket };
