import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentResponse } from './department.response';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from '@libs/collection-query';
import { DataResponseFormat } from '@libs/response-format';
import { DepartmentEntity } from '../../persistence/departments/department.entity';
import { CurrentUserDto } from '@libs/common';
@Injectable()
export class DepartmentQuery {
  constructor(
    @InjectRepository(DepartmentEntity)
    private departmentRepository: Repository<DepartmentEntity>,
  ) {}
  async getDepartment(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<DepartmentResponse> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!department) {
      throw new NotFoundException(`Department not found with id ${id}`);
    }
    return DepartmentResponse.toResponse(department);
  }
  async getDepartments(
    query: CollectionQuery,
    currentUser: CurrentUserDto,
  ): Promise<DataResponseFormat<DepartmentResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<DepartmentEntity>(
      this.departmentRepository,
      query,
    );
    const d = new DataResponseFormat<DepartmentResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => DepartmentResponse.toResponse(entity));
      d.count = total;
    }
    return d;
  }
  async getArchivedDepartments(
    query: CollectionQuery,
    currentUser: CurrentUserDto,
  ): Promise<DataResponseFormat<DepartmentResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<DepartmentEntity>(
      this.departmentRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<DepartmentResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => DepartmentResponse.toResponse(entity));
      d.count = total;
    }
    return d;
  }
}
