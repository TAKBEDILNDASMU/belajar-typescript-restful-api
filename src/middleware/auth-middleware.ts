import { NextFunction, Request, Response } from "express"
import { prismaClient } from "../app/db"
import { UserRequest } from "../type/user-request"

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
  const token = req.get("X-API-TOKEN")

  if (token) {
    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    })

    if (user) {
      req.user = user
      next()
      return
    }
  }

  res
    .status(401)
    .json({
      errors: "Unauthorized",
    })
    .end()
}
