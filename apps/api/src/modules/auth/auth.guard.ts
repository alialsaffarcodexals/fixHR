import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers['authorization'];
    if (!auth) throw new UnauthorizedException('Missing Authorization header');
    const token = auth.replace('Bearer ', '');
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev') as any;
      req.user = payload;
      const roles = Reflect.getMetadata('roles', ctx.getHandler()) || [];
      if (roles.length && !roles.includes(payload.role)) {
        throw new ForbiddenException('Insufficient role');
      }
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

