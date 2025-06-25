import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCommand } from './usecases/users/user.usecase.command';
import { UserRepository } from './persistence/users/user.repository';
import { UserController } from './controllers/user.controller';
import { Module } from '@nestjs/common';
import { UserQuery } from './usecases/users/user.usecase.query';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RoleEntity } from './persistence/roles/role.entity';
import { RoleController } from './controllers/role.controller';
import { RoleRepository } from './persistence/roles/role.repository';
import { RoleCommand } from './usecases/roles/role.usecase.command';
import { RoleQuery } from './usecases/roles/role.usecase.query';
import { UserEntity } from './persistence/users/user.entity';
import { MinioService } from '@libs/common';
import { UserRoleEntity } from './persistence/users/user-role.entity';
import { DepartmentController } from './controllers/department.controller';
import { UserContactEntity } from './persistence/users/user-contact.entity';
import { DepartmentEntity } from './persistence/departments/department.entity';
import { DepartmentRepository } from './persistence/departments/department.repository';
import { DepartmentCommand } from './usecases/departments/department.usecase.command';
import { DepartmentQuery } from './usecases/departments/department.usecase.query';

@Module({
  controllers: [
    UserController,
    AuthController,
    RoleController,
    DepartmentController,
  ],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RoleEntity,
      UserRoleEntity,
      UserContactEntity,
      DepartmentEntity,
    ]),
    PassportModule,
  ],
  providers: [
    UserRepository,
    UserCommand,
    UserQuery,
    RoleRepository,
    RoleCommand,
    RoleQuery,
    DepartmentRepository,
    DepartmentCommand,
    DepartmentQuery,
    AuthService,
    JwtStrategy,
    MinioService,
  ],
})
export class UserModule {}
