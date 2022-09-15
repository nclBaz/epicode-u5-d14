import { ObjectId } from "mongoose"

export type TokenPayload = {
  _id: ObjectId
  role: "User" | "Admin"
}
