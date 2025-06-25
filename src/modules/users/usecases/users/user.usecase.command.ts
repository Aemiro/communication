import { FileDto, CurrentUserDto } from '@libs/common';
import { UserEntity } from '../../persistence/users/user.entity';
import { UserRepository } from '../../persistence/users/user.repository';
import {
  ArchiveUserCommand,
  CreateUserCommand,
  UpdateUserCommand,
} from './user.commands';
import { UserResponse } from './user.response';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import {
  CreateBulkUserRoleCommand,
  CreateUserRoleCommand,
  RemoveUserRoleCommand,
  UpdateUserRoleCommand,
} from './user-role.command';
import { UserRoleEntity } from '../../persistence/users/user-role.entity';
import { Util } from '@libs/util';
import { CreateUserContactCommand, RemoveUserContactCommand, UpdateUserContactCommand } from './user-contact.command';
@Injectable()
export class UserCommand implements OnModuleInit {
  constructor(private readonly userRepository: UserRepository) {}
  async onModuleInit() {
    const existingAdmin = await this.userRepository.getUserBy(
      'email',
      'admin@gmail.com',
      [],
      true,
    );
    if (!existingAdmin) {
      const defaultAdmin = new UserEntity();
      defaultAdmin.firstName = 'Supper';
      defaultAdmin.middleName = 'Admin';

      defaultAdmin.email = 'admin@gmail.com';
      defaultAdmin.phone = '+251911111111';
      defaultAdmin.password = Util.hashPassword('P@ssw0rd');
      defaultAdmin.isActive = true;
      defaultAdmin.jobTitle = 'Admin';
      defaultAdmin.gender = 'Male';
      const user = await this.userRepository.insert(defaultAdmin);
      console.log('Inserted User ', user);
    }
  }
  async createUser(command: CreateUserCommand): Promise<UserResponse> {
    if (await this.userRepository.getOneBy('phone', command.phone, [], true)) {
      throw new BadRequestException(
        `User already exist with this phone number`,
      );
    }
    if (
      command.email &&
      (await this.userRepository.getOneBy('email', command.email, [], true))
    ) {
      throw new BadRequestException(
        `User already exist with this email Address`,
      );
    }
    const userDomain = CreateUserCommand.toEntity(command);
    userDomain.password = Util.hashPassword(command.password);
    userDomain.createdBy = command.currentUser.id;
    userDomain.updatedBy = command.currentUser.id;

    const user = await this.userRepository.insert(userDomain);
    if (command.roleIds && command.roleIds.length > 0) {
      for (const roleId of command.roleIds) {
        const userRole = new UserRoleEntity();
        userRole.roleId = roleId;
        userRole.createdBy = command?.currentUser?.id;
        userRole.updatedBy = command?.currentUser?.id;

        userRole.userId = user.id;
        user.addUserRole(userRole);
      }
    }
    const result = await this.userRepository.save(user);
    return UserResponse.toResponse(result);
  }
  async updateUser(command: UpdateUserCommand): Promise<UserResponse> {
    const userDomain = await this.userRepository.getById(command.id);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${command.id}`);
    }
    if (userDomain.phone !== command.phone) {
      const user = await this.userRepository.getOneBy(
        'phone',
        command.phone,
        ['userRoles'],
        true,
      );
      if (user) {
        throw new BadRequestException(
          `User already exist with this phone number`,
        );
      }
    }
    if (
      command.email &&
      userDomain.email !== command.email &&
      (await this.userRepository.getOneBy('email', command.email, [], true))
    ) {
      throw new BadRequestException(
        `User already exist with this email Address`,
      );
    }
    userDomain.email = command.email;
    userDomain.firstName = command.firstName;
    userDomain.middleName = command.middleName;
    userDomain.lastName = command.lastName;
    userDomain.isActive = command.isActive;
    userDomain.phone = command.phone;
    userDomain.gender = command.gender;
    userDomain.jobTitle = command.jobTitle;
    userDomain.dateOfBirth = command.dateOfBirth;
    userDomain.startDate = command.startDate;
    userDomain.endDate = command.endDate;
    userDomain.tin = command.tin;
    userDomain.employeeNumber = command.employeeNumber;
    userDomain.departmentId = command.departmentId;
    userDomain.address = command.address;
    userDomain.updatedBy = command?.currentUser?.id;
    userDomain.userRoles = [];
    if (command.roleIds && command.roleIds.length > 0) {
      for (const roleId of command.roleIds) {
        const userRole = new UserRoleEntity();
        userRole.roleId = roleId;
        userRole.createdBy = command?.currentUser?.id;
        userRole.updatedBy = command?.currentUser?.id;
        userRole.userId = userDomain.id;
        userDomain.addUserRole(userRole);
      }
    }
    const user = await this.userRepository.save(userDomain);
    return UserResponse.toResponse(user);
  }
  async archiveUser(command: ArchiveUserCommand): Promise<UserResponse> {
    const userDomain = await this.userRepository.getById(command.id);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${command.id}`);
    }
    userDomain.deletedAt = new Date();
    userDomain.deletedBy = command.currentUser.id;
    const result = await this.userRepository.save(userDomain);

    return UserResponse.toResponse(result);
  }
  async restoreUser(
    id: string,
    currentUser: CurrentUserDto,
  ): Promise<UserResponse> {
    const userDomain = await this.userRepository.getById(id, [], true);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${id}`);
    }
    await this.userRepository.restore(id);
    userDomain.deletedAt = null;
    return UserResponse.toResponse(userDomain);
  }
  async deleteUser(id: string, currentUser: CurrentUserDto): Promise<boolean> {
    const userDomain = await this.userRepository.getById(id, [], true);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${id}`);
    }
    const result = await this.userRepository.delete(id);
    return result;
  }
  async activateOrBlockUser(
    id: string,
    currentUser: CurrentUserDto,
  ): Promise<UserResponse> {
    const userDomain = await this.userRepository.getById(id);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${id}`);
    }
    userDomain.isActive = !userDomain.isActive;
    const result = await this.userRepository.save(userDomain);

    return UserResponse.toResponse(result);
  }
  async updateUserProfile(
    userId: string,
    currentUser: CurrentUserDto,
    profileImage: FileDto,
  ): Promise<UserResponse> {
    const userDomain = await this.userRepository.getById(userId);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${userId}`);
    }
    userDomain.updatedBy = currentUser?.id;
    userDomain.profilePicture = profileImage;
    const result = await this.userRepository.save(userDomain);

    return UserResponse.toResponse(result);
  }

  // userRoles
  async addBulkUserRole(payload: CreateBulkUserRoleCommand) {
    const user = await this.userRepository.getById(payload.userId, [], true);

    if (!user) throw new NotFoundException('User not found');

    const userRoleEntities = payload.roleIds.map((roleId) =>
      CreateUserRoleCommand.toEntity({ userId: payload.userId, roleId }),
    );

    user.userRoles = userRoleEntities;

    const updatedUser = await this.userRepository.save(user);
    return UserResponse.toResponse(updatedUser);
  }
  async addUserRole(payload: CreateUserRoleCommand) {
    const user = await this.userRepository.getById(
      payload.userId,
      ['userRoles'],
      true,
    );
    if (!user) throw new NotFoundException('User not found');
    const userRoleEntity = CreateUserRoleCommand.toEntity(payload);
    user.addUserRole(userRoleEntity);
    const updatedUser = await this.userRepository.save(user);
    return UserResponse.toResponse(updatedUser);
  }
  async updateUserRole(payload: UpdateUserRoleCommand) {
    const user = await this.userRepository.getById(
      payload.userId,
      ['userRoles'],
      true,
    );
    if (!user) throw new NotFoundException('User not found');
    let userRole = user.userRoles.find(
      (userRole) => userRole.id === payload.id,
    );
    if (!userRole) throw new NotFoundException('Role not found');
    userRole = { ...userRole, ...payload };
    userRole.updatedBy = payload?.currentUser?.id;
    user.updateUserRole(userRole);
    const updatedUser = await this.userRepository.save(user);
    return UserResponse.toResponse(updatedUser);
  }
  async removeUserRole(payload: RemoveUserRoleCommand) {
    const user = await this.userRepository.getById(
      payload.userId,
      ['userRoles'],
      true,
    );
    if (!user) throw new NotFoundException('User not found');
    const userRole = user.userRoles.find(
      (userRole) => userRole.id === payload.id,
    );
    if (!userRole) throw new NotFoundException('Role not found');
    user.removeUserRole(userRole.id);
    const result = await this.userRepository.save(user);
    return UserResponse.toResponse(result);
  }
  // contacts
  async addUserContact(payload: CreateUserContactCommand) {
    const user = await this.userRepository.getById(
      payload.userId,
      ['userContacts'],
      true,
    );
    if (!user) throw new NotFoundException('User not found');
    const contactEntity = CreateUserContactCommand.toEntity(payload);
    user.addUserContact(contactEntity);
    const updatedUser = await this.userRepository.save(user);
    return UserResponse.toResponse(updatedUser);
  }
  async updateUserContact(payload: UpdateUserContactCommand) {
    const user = await this.userRepository.getById(
      payload.userId,
      ['userContacts'],
      true,
    );
    if (!user) throw new NotFoundException('User not found');
    let userContact = user.userContacts.find(
      (userContact) => userContact.id === payload.id,
    );
    if (!userContact) throw new NotFoundException('Contact not found');
    userContact = { ...userContact, ...payload };
    userContact.updatedBy = payload?.currentUser?.id;
    user.updateUserContact(userContact);
    const updatedUser = await this.userRepository.save(user);
    return UserResponse.toResponse(updatedUser);
  }
  async removeUserContact(payload: RemoveUserContactCommand) {
    const user = await this.userRepository.getById(
      payload.userId,
      ['userContacts'],
      true,
    );
    if (!user) throw new NotFoundException('User not found');
    const userContact = user.userContacts.find(
      (userContact) => userContact.id === payload.id,
    );
    if (!userContact) throw new NotFoundException('Contact not found');
    user.removeUserContact(userContact.id);
    const result = await this.userRepository.save(user);
    return UserResponse.toResponse(result);
  }
}
