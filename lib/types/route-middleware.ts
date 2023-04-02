import { Request } from "./../request";
import { Response } from "../response";

export type RouteMiddleware = (request: Request) => Response | undefined;