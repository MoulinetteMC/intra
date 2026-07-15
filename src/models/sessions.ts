import { Schema, Types, model } from "mongoose";

interface ISession {
  _id: Types.ObjectId;
  uuid: string;
  granted: boolean;
}

export default model<ISession>(
  "sessions",
  new Schema<ISession>(
    {
      uuid: { type: String, required: true },
      granted: { type: Boolean, default: false },
    },
    {
      timestamps: true,
    },
  ),
);
