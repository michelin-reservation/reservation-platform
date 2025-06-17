import { Request, Response, NextFunction } from 'express';

interface User {
    role?: string;
    userType?: string;
}

interface RequestWithUser extends Request {
    user?: User;
}

const role = (requiredRole: string) => {
    return (req: RequestWithUser, res: Response, next: NextFunction) => {
        const userRole = req.user?.role || req.user?.userType;
        if (!userRole || userRole !== requiredRole) {
            return res.status(403).json({ message: `${requiredRole} 권한이 필요합니다.` });
        }
        next();
    };
};

export default role;
