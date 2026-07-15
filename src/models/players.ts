import { Schema, model, type InferSchemaType } from "mongoose";

const playerSchema = new Schema(
  {
    playername: { type: String, required: true },
    userid: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

type playerSchemaType = InferSchemaType<typeof playerSchema>;

export default model<playerSchemaType>("players", playerSchema);
