import { Model, Document } from "mongoose"

interface User {
  firstName: string
  email: string
  password: string
}

export interface UserDocument extends User, Document {}

export interface UsersModel extends Model<UserDocument> {
  checkCredentials(email: string, plainPW: string): Promise<UserDocument | null>
}
