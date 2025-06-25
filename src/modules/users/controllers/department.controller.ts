import { IncludeQuery, CollectionQuery } from '@libs/collection-query';
import { CurrentUserDto, CurrentUser } from '@libs/common';
import {
  ApiPaginatedResponse,
  DataResponseFormat,
} from '@libs/response-format';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateDepartmentCommand,
  UpdateDepartmentCommand,
  ArchiveDepartmentCommand,
} from '../usecases/departments/department.commands';
import { DepartmentResponse } from '../usecases/departments/department.response';
import { DepartmentCommand } from '../usecases/departments/department.usecase.command';
import { DepartmentQuery } from '../usecases/departments/department.usecase.query';

@Controller('departments')
@ApiTags('departments')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class DepartmentController {
  constructor(
    private command: DepartmentCommand,
    private departmentQuery: DepartmentQuery,
  ) {}
  @Get('get-department/:id')
  @ApiOkResponse({ type: DepartmentResponse })
  async getDepartment(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.departmentQuery.getDepartment(id, includeQuery.includes, true);
  }
  @Get('get-archived-department/:id')
  @ApiOkResponse({ type: DepartmentResponse })
  async getArchivedDepartment(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.departmentQuery.getDepartment(id, includeQuery.includes, true);
  }
  @Get('get-departments')
  @ApiPaginatedResponse(DepartmentResponse)
  async getDepartments(
    @Query() query: CollectionQuery,
    @CurrentUser() currentUser: CurrentUserDto,
  ) {
    return this.departmentQuery.getDepartments(query, currentUser);
  }
  @Post('create-department')
  @ApiOkResponse({ type: DepartmentResponse })
  async createDepartment(
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() createDepartmentCommand: CreateDepartmentCommand,
  ) {
    createDepartmentCommand.currentUser = currentUser;
    return this.command.createDepartment(createDepartmentCommand);
  }
  @Put('update-department')
  @ApiOkResponse({ type: DepartmentResponse })
  async updateDepartment(
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() updateDepartmentCommand: UpdateDepartmentCommand,
  ) {
    updateDepartmentCommand.currentUser = currentUser;
    return this.command.updateDepartment(updateDepartmentCommand);
  }
  @Delete('archive-department')
  @ApiOkResponse({ type: DepartmentResponse })
  async archiveDepartment(
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() archiveCommand: ArchiveDepartmentCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveDepartment(archiveCommand);
  }
  @Delete('delete-department/:id')
  @ApiOkResponse({ type: Boolean })
  async deleteDepartment(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('id') id: string,
  ) {
    return this.command.deleteDepartment(id, currentUser);
  }
  @Post('restore-department/:id')
  @ApiOkResponse({ type: DepartmentResponse })
  async restoreDepartment(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('id') id: string,
  ) {
    return this.command.restoreDepartment(id, currentUser);
  }
  @Get('get-archived-departments')
  @ApiPaginatedResponse(DepartmentResponse)
  async getArchivedDepartments(
    @Query() query: CollectionQuery,
    @CurrentUser() currentUser: CurrentUserDto,
  ) {
    return this.departmentQuery.getArchivedDepartments(query, currentUser);
  }
}
