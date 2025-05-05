import { Router } from "express";
import { postItemEndpoint } from "./post";

export const itemRouter = Router();

itemRouter.post('/', postItemEndpoint)