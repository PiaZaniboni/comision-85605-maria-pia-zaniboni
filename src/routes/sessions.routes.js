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

        const user = await User.create({
            first_name,
            last_name,
            email: normEmail,
            age,
            password,
            cart
        });
        res.status(201).json({ ok: true, id: user._id });

    } catch (err) {
        if (err?.code === 11000) return res.status(409).json({ message: 'Email already registered' });
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

        const user = await User.findOne({ email: normEmail });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        //Previene sesion fixation
        req.session.regenerate(err => {
            if (err) return next(err);
        });

        req.session.user = {
            id: user._id.toString(),
            email: user.email,
            first_name: user.first_name,
            role: user.role || 'user'
        };
        return res.json({ ok: true });

    } catch (e) { next(e); }
});

//Rutas privadas
function isAuthenticated(req, res, next) {
  if (req.session?.user) {
    console.log('[AUTH] ok', { email: req.session.user.email });
    return next();
  }
  console.log('[AUTH] 401');
  return res.status(401).json({ message: 'Unauthorized' });
}
// Get me - privada
sessionRoutes.get('/me', isAuthenticated, (req, res) => {
    res.json({ user: req.session.user });
});

//Log out
sessionRoutes.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.json({ ok: true, message: 'Logged out' });
    });
});
