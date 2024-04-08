import express from "express"
import { userControler } from "../controller/user-controller"
import { authMiddleware } from "../middleware/auth-middleware"
import { ContactController } from "../controller/contact-controller"
import { AddressController } from "../controller/address-controller"

export const apiRouter = express.Router()
apiRouter.use(authMiddleware)

// User API
apiRouter.get("/api/users/current", userControler.get)
apiRouter.patch("/api/users/current", userControler.update)
apiRouter.delete("/api/users/current", userControler.logout)

// Contact API
apiRouter.post("/api/contacts", ContactController.create)
apiRouter.get("/api/contacts/:contactId", ContactController.get)
apiRouter.put("/api/contacts/:contactId", ContactController.update)
apiRouter.delete("/api/contacts/:contactId", ContactController.delete)
apiRouter.get("/api/contacts", ContactController.search)

// Address API
apiRouter.post("/api/contacts/:contactId/addresses", AddressController.create)
apiRouter.get("/api/contacts/:contactId/addresses", AddressController.list)
apiRouter.get("/api/contacts/:contactId/addresses/:addressId", AddressController.get)
apiRouter.put("/api/contacts/:contactId/addresses/:addressId", AddressController.update)
apiRouter.delete("/api/contacts/:contactId/addresses/:addressId", AddressController.delete)
