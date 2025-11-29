import { Router } from "express";
import { User } from "../models/User.model.js";
import passport from '../config/passport.js'; 

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

/* LOGIN (Passport + logs) */
sessionRoutes.post('/login', (req, res, next) => {

  passport.authenticate('local', (err, user, _info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }

    // Seguridad: evitar session fixation → regenerar el id de sesión
    req.session.regenerate(err2 => {
      if (err2) {
        return next(err2);
      }

      // Integracion Passport ↔ Sesion (crea req.user)
      req.login(user, err3 => {
        if (err3) {
          return next(err3);
        }
        
        req.session.user = {
          id:    user._id.toString(),
          email: user.email,
          name:  user.first_name + ' ' + user.last_name,
          role:  user.role || 'user'
        };
        
        return res.json({ ok: true });
      });
    });
  })(req, res, next);
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
