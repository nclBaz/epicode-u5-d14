import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { UserDocument, UsersModel } from "./types/users"

const { Schema, model } = mongoose

const UsersSchema = new Schema({
  firstName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
})

UsersSchema.pre("save", async function (next) {
  const currentUser = this
  const plainPW = this.password

  if (currentUser.isModified("password")) {
    const hash = await bcrypt.hash(plainPW, 11)
    currentUser.password = hash
  }

  next()
})

UsersSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

UsersSchema.static("checkCredentials", async function (email, plainPassword) {
  // my own custom method attached to the UsersModel
  // Given email, plainPassword this method should search in db if the user exists (by email), then compare the given password with the hashed one coming from the db. Then return a useful response.

  // 1. Find the user by email
  const user = await this.findOne({ email }) // "this" here represents the UsersModel

  if (user) {
    // 2. If the email is found --> compare plainPassword with the hashed one
    const isMatch = await bcrypt.compare(plainPassword, user.password)

    if (isMatch) {
      // 3. If passwords they do match --> return the user
      return user
    } else {
      return null
    }
  } else {
    // 4. In case of either email not found or password not correct --> return null
    return null
  }
})

export default model<UserDocument, UsersModel>("User", UsersSchema)
