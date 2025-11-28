//Middleware auth y autenticacion
export function requireAuth(req, res, next) {
    if( req.session?.user) return next();
    return res.status(401).json({ message: 'Unauthorized' });
}

export function requireRole(role) {
    return (req, res, next) => {
        const user = req.session?.user;
        if (user && ( user.role === role || user.role === 'admin')) return next();
        return res.status(403).json({ message: 'Forbidden' });
    };
}