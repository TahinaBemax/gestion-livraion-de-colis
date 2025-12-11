import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class SameUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramId = parseInt(request.params.id, 10);

    if (user.sub && user.sub === paramId) {
      return true;
    }
    throw new ForbiddenException("Vous ne pouvez pas accéder aux ressources des autres utilisateurs");
  }
}
