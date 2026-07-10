import { Schema, model } from "mongoose";

interface ISession {
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
