import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/common/enum/user-role.enum';
import { TypeUtilisateur } from '../enum/type-utilisateur.enum';

export const ROLES_KEY = 'roles';
export const USER_TYPES_KEY = 'user_types';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
export const UserTypes = (...types: TypeUtilisateur[]) => SetMetadata(USER_TYPES_KEY, types);