import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseRepository } from '@libs/common';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async getUserBy(field: string, value: any, relations = [], withDeleted = false): Promise<UserEntity> {
    const option = {};
    option[field] = value;

    return await this.userRepository.findOne({
      where: option,
      relations,
      withDeleted,
    });
  }
  async getUsersBy(field: string, value: any, relations = [], withDeleted = false): Promise<UserEntity[]> {
    const option = {};
    option[field] = value;

    return await this.userRepository.find({
      where: option,
      relations,
      withDeleted,
    });
  }
}
