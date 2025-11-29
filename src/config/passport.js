import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from "../models/User.model.js";

/**
 * Estrategia Local:
 * - usernameField: 'email' (Passport toma req.body.email)
 * - passwordField: 'password' (Passport toma req.body.password)
 * Hace: findOne + comparePassword. Devuelve (err, user|false).
 */
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const normEmail = String(email).toLowerCase().trim();

        const user = await User.findOne({ email: normEmail });
        if (!user) {
          return done(null, false);
        }

        const ok = await user.comparePassword(password);
        if (!ok) {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

/**
 * Integración con la sesión:
 * - serializeUser: qué guarda Passport en la sesión → solo el id (string)
 * - deserializeUser: con ese id, carga un usuario liviano y lo deja en req.user
 */
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const u = await User.findById(id).select('first_name email role').lean();
    done(null, u || false);
  } catch (err) {
    done(err);
  }
});

export default passport;