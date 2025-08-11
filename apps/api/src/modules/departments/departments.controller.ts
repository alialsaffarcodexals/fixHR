import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';
import { JwtAuthGuard, Roles } from '../auth/auth.guard';

@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(private service: DepartmentsService) {}

  @Get()
  @Roles('Admin','HRManager','DeptHead','PayrollClerk','Employee')
  list() { return this.service.list(); }

  @Get(':id')
  @Roles('Admin','HRManager','DeptHead','PayrollClerk','Employee')
  get(@Param('id') id: string) { return this.service.get(id); }

  @Post()
  @Roles('Admin','HRManager')
  create(@Body() dto: CreateDepartmentDto) { return this.service.create(dto); }

  @Patch(':id')
  @Roles('Admin','HRManager')
  update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @Roles('Admin')
  delete(@Param('id') id: string) { return this.service.delete(id); }

  @Get(':id/employees')
  @Roles('Admin','HRManager','DeptHead','PayrollClerk','Employee')
  employees(@Param('id') id: string) { return this.service.employees(id); }

  @Post(':id/assign')
  @Roles('Admin','HRManager')
  assign(@Param('id') id: string, @Body() body: { employeeId: string }) { return this.service.assign(id, body.employeeId); }

  @Post(':id/set-head')
  @Roles('Admin','HRManager')
  setHead(@Param('id') id: string, @Body() body: { employeeId: string }) { return this.service.setHead(id, body.employeeId); }
}

