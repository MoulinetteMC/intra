const express = require("express");
const app = express();
const port = 3005;

module.exports = async (client) => {
	app.get("/", async (req, res) => {
		console.log(`◊ / : ${req.socket.remoteAddress.split(":").pop()}`);
		res.status(200);
		res.json({ status: "OK" });
	});

	app.use("/login", require("./login")(client));
	app.use("/session", require("./session"));

	app.listen(port, () => console.log(`✔ ExpressJS server online !`.magenta));
};
