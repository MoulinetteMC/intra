import { Schema, model, type InferSchemaType } from "mongoose";

const sessionSchema = new Schema(
  {
    uuid: { type: String, required: true },
    granted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

type sessionSchemaType = InferSchemaType<typeof sessionSchema>;

export default model<sessionSchemaType>("sessions", sessionSchema);
