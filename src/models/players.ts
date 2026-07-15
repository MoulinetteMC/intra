import { Schema, Types, model } from "mongoose";

interface IPlayer {
  _id: Types.ObjectId;
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
