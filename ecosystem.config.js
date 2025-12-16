// PM2 config file
module.exports = {
	apps: [
		{
			name: "MoulinetteMC Intra",
			script: "./home.js",
			watch: true,
			restart_delay: 3000,
			ignore_watch: ["node_modules", ".env", "start.sh", "logs"],
			time: true,
		},
	],
};
