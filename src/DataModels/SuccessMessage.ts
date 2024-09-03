import { z } from "zod";

export const MessageSchema = z.string({ message: "Message cannot be empty!" });