import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthPayload {
    userId: number | null; // null for guest
    userType: 'guest' | 'registered' | 'admin';
}

declare module 'express-serve-static-core' {
    interface Request {
        auth?: AuthPayload;
    }
}

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev-secret';

export function signToken(payload: AuthPayload, expiresIn: SignOptions['expiresIn'] = '7d' as unknown as SignOptions['expiresIn']) {
    const options: SignOptions = { expiresIn } as SignOptions;
    return jwt.sign(payload as object, JWT_SECRET, options);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'Unauthorized' });
    const token = header.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        req.auth = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (header) {
        const token = header.replace('Bearer ', '');
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
            req.auth = decoded;
        } catch {
            // ignore
        }
    }
    next();
}

export function requireRegistered(req: Request, res: Response, next: NextFunction) {
    if (!req.auth) return res.status(401).json({ error: 'Unauthorized' });
    if (req.auth.userType !== 'registered' && req.auth.userType !== 'admin') {
        return res.status(403).json({ error: 'Registered users only' });
    }
    next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.auth || req.auth.userType !== 'admin') return res.status(403).json({ error: 'Admin only' });
    next();
}


