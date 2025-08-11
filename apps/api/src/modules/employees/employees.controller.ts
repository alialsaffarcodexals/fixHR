import { Controller, Get, Post, Param, Body, Query, Patch, Delete, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';
import { JwtAuthGuard, Roles } from '../auth/auth.guard';

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeesController {
  constructor(private readonly service: EmployeesService) {}

  @Get()
  @Roles('Admin','HRManager','DeptHead','PayrollClerk')
  list(@Query('query') query = '', @Query('page') page = 1, @Query('sort') sort = 'lastName') {
    return this.service.list(query, Number(page), sort);
  }

  @Get(':id')
  @Roles('Admin','HRManager','DeptHead','PayrollClerk','Employee')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  @Roles('Admin','HRManager')
  create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('Admin','HRManager')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('Admin','HRManager')
  remove(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
