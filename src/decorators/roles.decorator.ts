import { SetMetadata } from '@nestjs/common';
import { UserRolesEnum } from 'src/enums/userRole.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRolesEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
