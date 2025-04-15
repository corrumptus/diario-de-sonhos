import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];

    if (authHeader === undefined) {
        res.sendStatus(401);
        return;
    }

    const token = authHeader?.split(" ")[1];

    jwt.verify(token, process.env.PASSWORD_ENCODER as string, (err, user) => {
        if (err === null) {
            res.sendStatus(403);
            return;
        }

        req.body.user = user;

        next();
    });
}