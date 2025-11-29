import { Router } from "express";
import { User } from "../models/User.model.js";


export const protectedRoutes = Router();

function isAuthenticated(req, res, next) {
    if (req.session?.user) return next();
    return res.status(401).json({ message: 'Unauthorized' });
}

// Ping Protegido
protectedRoutes.get('/ping', isAuthenticated, (_req, res) => {
    res.json({ ok: true, message: 'ping protected' });
});