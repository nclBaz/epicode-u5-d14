import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import { httpServer, expressServer } from "./server"

const port = process.env.PORT || 3001

if (process.env.MONGO_URL) mongoose.connect(process.env.MONGO_URL)
// alternative method mongoose.connect(process.env.MONGO_URL!)
else throw new Error("Mongo url missing!")

mongoose.connection.on("connected", () =>
  httpServer.listen(port, () => {
    // DO NOT FORGET TO LISTEN WITH HTTPSERVER HERE NOT EXPRESS SERVER!!
    console.table(listEndpoints(expressServer))
    console.log(`Server is running on port ${port}`)
  })
)
