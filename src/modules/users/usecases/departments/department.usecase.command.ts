import {
  ArchiveDepartmentCommand,
  CreateDepartmentCommand,
  UpdateDepartmentCommand,
} from './department.commands';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DepartmentResponse } from './department.response';
import { DepartmentRepository } from '../../persistence/departments/department.repository';
import { CurrentUserDto } from '@libs/common';
@Injectable()
export class DepartmentCommand {
  constructor(private readonly departmentRepository: DepartmentRepository) {}
  async createDepartment(
    command: CreateDepartmentCommand,
  ): Promise<DepartmentResponse> {
    if (
      await this.departmentRepository.getOneBy('name', command.name, [], true)
    ) {
      throw new BadRequestException(`Department already exist with this name`);
    }
    const departmentDomain = CreateDepartmentCommand.toEntity(command);
    departmentDomain.createdBy = command.currentUser.id;
    departmentDomain.updatedBy = command.currentUser.id;

    const department = await this.departmentRepository.insert(departmentDomain);

    return DepartmentResponse.toResponse(department);
  }
  async updateDepartment(
    command: UpdateDepartmentCommand,
  ): Promise<DepartmentResponse> {
    const department = await this.departmentRepository.getById(command.id);
    if (!department) {
      throw new NotFoundException(`Department not found with id ${command.id}`);
    }
    if (department.name !== command.name) {
      const departmentByName = await this.departmentRepository.getOneBy(
        'name',
        command.name,
        [],
        true,
      );
      if (departmentByName) {
        throw new BadRequestException(
          `Department already exist with this name`,
        );
      }
    }
    department.name = command.name;
    department.description = command.description;
    department.updatedBy = command?.currentUser?.id;
    const result = await this.departmentRepository.save(department);
    return DepartmentResponse.toResponse(result);
  }
  async archiveDepartment(
    command: ArchiveDepartmentCommand,
  ): Promise<DepartmentResponse> {
    const departmentDomain = await this.departmentRepository.getById(
      command.id,
    );
    if (!departmentDomain) {
      throw new NotFoundException(`Department not found with id ${command.id}`);
    }
    departmentDomain.deletedAt = new Date();
    departmentDomain.deletedBy = command.currentUser.id;
    const result = await this.departmentRepository.save(departmentDomain);

    return DepartmentResponse.toResponse(result);
  }
  async restoreDepartment(
    id: string,
    currentUser: CurrentUserDto,
  ): Promise<DepartmentResponse> {
    const departmentDomain = await this.departmentRepository.getById(
      id,
      [],
      true,
    );
    if (!departmentDomain) {
      throw new NotFoundException(`Department not found with id ${id}`);
    }
    await this.departmentRepository.restore(id);
    departmentDomain.deletedAt = null;
    return DepartmentResponse.toResponse(departmentDomain);
  }
  async deleteDepartment(
    id: string,
    currentUser: CurrentUserDto,
  ): Promise<boolean> {
    const departmentDomain = await this.departmentRepository.getById(
      id,
      [],
      true,
    );
    if (!departmentDomain) {
      throw new NotFoundException(`Department not found with id ${id}`);
    }
    const result = await this.departmentRepository.delete(id);
    return result;
  }
}
