import express from "express"
import cors from "cors"
import { Server } from "socket.io"
import { createServer } from "http" // CORE MODULE
import { newConnectionHandler } from "./socket"
import usersRouter from "./api/users"

const expressServer = express()

// ************************ SOCKETIO **********************

const httpServer = createServer(expressServer)
const io = new Server(httpServer)
io.on("connection", newConnectionHandler) // NOT a custom event! this is triggered every time a new client connects here

// *********************** MIDDLEWARES ********************
expressServer.use(express.json())

// ************************* ENDPOINTS ********************
expressServer.use("/users", usersRouter)

// *********************** ERROR HANDLERS *****************

export { httpServer, expressServer }
