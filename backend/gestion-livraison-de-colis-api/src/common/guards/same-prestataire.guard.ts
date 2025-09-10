import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class SamePrestataireGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramId = parseInt(request.params.idPrestataire, 10);
    const prestataire = user.prestataire;

    if (!user) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    if (prestataire && prestataire === paramId) {
      return true;
    }

    throw new ForbiddenException("Vous ne pouvez pas accéder aux ressources d’un autre prestataire");
  }
}
