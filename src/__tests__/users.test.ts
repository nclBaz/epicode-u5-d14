import supertest from "supertest"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { expressServer } from "../server"
import UsersModel from "../models/users"

dotenv.config()

const client = supertest(expressServer)

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST!)
})

afterAll(async () => {
  await UsersModel.deleteMany()
  await mongoose.connection.close()
})

const validUser = {
  firstName: "Alice",
  email: "alice@wonderlands.com",
  password: "1234",
}

let accessToken: string

describe("test user endpoints", () => {
  it("should check that POST /users returns 201 and a valid _id", async () => {
    const response = await client.post("/users").send(validUser)
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("_id")
  })

  it("should check that POST /users/login with right credentials gives us back an accessToken", async () => {
    const response = await client.post("/users/login").send(validUser)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("accessToken")
    accessToken = response.body.accessToken
  })

  it("should check that GET /users returns users and that they are without the password", async () => {
    const response = await client
      .get("/users")
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.status).toBe(200)
    expect(response.body[0].firstName).toBe("Alice")
    expect(response.body[0].password).not.toBeDefined()
  })

  it("should check that we cannot retrieve the list of users without a valid token (expect 401)", async () => {
    const response = await client.get("/users")
    expect(response.status).toBe(401)
  })
})
