import { Router } from "express";
import { User } from "../models/User.model.js";
//import passport from '../config/passport.js'; 

export const sessionRoutes = Router();

// POST REGISTER, crear nuevo usuario
sessionRoutes.post('/register', async (req, res, next) => {
    try {
        const { first_name, last_name, email, age, password, cart, role } = req.body || {};

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const normEmail = String(email).toLowerCase().trim();

        //Fijo demo
        const isAdmin = (normEmail === 'adminCoder@coder.com' && password === 'adminCod3r123');

        //Usuario normal
        const user = await User.create({
            first_name,
            last_name,
            email: normEmail,
            age,
            password,
            cart,
            role: isAdmin ? 'admin' : 'user'
        });
        res.status(201).json({ ok: true, id: user._id });

    } catch (err) {
        return next(err);
    }
});

// POST LOGIN, verificar credenciales y crear session
sessionRoutes.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ message: 'Missing credentials' });
        }

        const normEmail = String(email).toLowerCase().trim();

        if (normEmail === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            req.session.user = { email: normEmail, name: 'Admin Coder', role: 'admin' };
            return res.json({ ok: true });
        }

        //Usuario normal
        const user = await User.findOne({ email: normEmail });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.session.user = {
            id: user._id.toString(),
            email: user.email,
            first_name: user.first_name,
            role: user.role || 'user'
        };
        return res.json({ ok: true });

    } catch (e) { next(e); }
});