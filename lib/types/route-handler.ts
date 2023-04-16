import { Context } from "../context";
import { Response } from "../response";
import { Request } from "./request";

export type RouteHandler = (request: Request, context: Context) => Response | Promise<Response>;
