import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class SameLivreurGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramId = parseInt(request.params.idLivreur, 10);

    if (user.idLivreur && user.idLivreur === paramId) {
      return true;
    }
    throw new ForbiddenException("Vous ne pouvez pas accéder aux ressources des autres livreurs");
  }
}
