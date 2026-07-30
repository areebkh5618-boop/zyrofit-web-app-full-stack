import { Schema, models, model } from "mongoose";

export interface IMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Message || model<IMessage>("Message", MessageSchema);
