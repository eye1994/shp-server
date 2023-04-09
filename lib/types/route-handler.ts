import { Request } from "./../request";
import { Response } from "../response";

export type RouteHandler = (request: Request) => Response | Promise<Response>;
