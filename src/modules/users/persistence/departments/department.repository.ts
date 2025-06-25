import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentEntity } from './department.entity';
import { BaseRepository } from '@libs/common';

@Injectable()
export class DepartmentRepository extends BaseRepository<DepartmentEntity> {
  constructor(
    @InjectRepository(DepartmentEntity)
    repository: Repository<DepartmentEntity>,
  ) {
    super(repository);
  }
}
