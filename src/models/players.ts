import { Schema, model } from "mongoose";

interface IPlayer {
	playername: string;
	userid: string;
}

export default model<IPlayer>(
	"players",
	new Schema<IPlayer>(
		{
			playername: { type: String, required: true },
			userid: { type: String, required: true },
		},
		{
			timestamps: true,
		},
	),
);
