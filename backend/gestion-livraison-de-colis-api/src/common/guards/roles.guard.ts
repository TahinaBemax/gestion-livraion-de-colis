import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/common/enum/user-role.enum';
import { TypeUtilisateur } from '../enum/type-utilisateur.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user } = context.switchToHttp().getRequest();

    //verification des routes publiques
    const isPublic = this.reflector.getAllAndOverride<UserRole[]>('IS_PUBLIC_KEY', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isPublic || request.method === 'OPTIONS') {
      return true;
    }

    //verification des roles
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // 🔹 Vérification des types utilisateur
    const requiredUserTypes = this.reflector.getAllAndOverride<TypeUtilisateur[]>('user_types', [
      context.getHandler(),
      context.getClass(),
    ]);
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!requiredRoles) {
      return true;
    }
    
    if (!user) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }
    
    if (!hasRole) {
      throw new ForbiddenException('Accès refusé: permissions insuffisantes');
    }

    if (requiredUserTypes && !requiredUserTypes.includes(user.typeUtilisateur)) {
      throw new ForbiddenException('Accès refusé: type utilisateur invalide');
    }

    return true;
  }
}