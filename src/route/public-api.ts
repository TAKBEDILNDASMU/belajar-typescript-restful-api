import express from "express"
import { userControler } from "../controller/user-controller"

export const publicRouter = express.Router()
publicRouter.post("/api/users", userControler.register)
publicRouter.post("/api/users/login", userControler.login)
