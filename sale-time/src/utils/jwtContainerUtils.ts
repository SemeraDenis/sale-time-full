import { User } from "../entity/user.entity";
import { signJWT } from "./jwt.utils";
import { Request, Response } from "express";

const tokenContainerName = "token";

export class JwtContainerUtils {
  static getToken(req: Request):string {
    const token = req.headers?.[tokenContainerName];

    return Array.isArray(token) ? token[0] : token || "";
  }
}