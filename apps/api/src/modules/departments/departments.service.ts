import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async list() {
    return this.prisma.department.findMany({});
  }

  async get(id: string) {
    const d = await this.prisma.department.findUnique({ where: { id } });
    if (!d) throw new NotFoundException('Department not found');
    return d;
  }

  async create(dto: CreateDepartmentDto) {
    const departmentId = `D-${Date.now().toString(36)}-${Math.floor(Math.random()*1000)}`;
    return this.prisma.department.create({ data: { ...dto, departmentId } });
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    // optimistic lock
    if (dto.version == null) throw new ConflictException('Missing version for update');
    const r = await this.prisma.department.updateMany({ where: { id, version: dto.version }, data: { ...dto, version: { increment: 1 } } });
    if (r.count === 0) throw new ConflictException('Version conflict; reload and retry');
    return this.get(id);
  }

  async delete(id: string) {
    const count = await this.prisma.employee.count({ where: { departmentId: id, deletedAt: null } });
    if (count > 0) throw new ConflictException('Cannot delete department with employees; reassign them first.');
    await this.prisma.department.delete({ where: { id } });
    return { ok: true };
  }

  async employees(id: string) {
    await this.get(id);
    return this.prisma.employee.findMany({ where: { departmentId: id, deletedAt: null } });
  }

  async assign(id: string, employeeId: string) {
    const emp = await this.prisma.employee.findUnique({ where: { id: employeeId } });
    if (!emp) throw new BadRequestException('Employee not found');
    if (emp.isHead) throw new ConflictException('Head cannot be reassigned; transfer headship first.');
    await this.prisma.employee.update({ where: { id: employeeId }, data: { departmentId: id } });
    return { ok: true };
  }

  async setHead(id: string, employeeId: string) {
    const emp = await this.prisma.employee.findUnique({ where: { id: employeeId } });
    if (!emp || emp.departmentId !== id) throw new BadRequestException('Head must belong to department');
    // reset previous head
    await this.prisma.$transaction([
      this.prisma.employee.updateMany({ where: { departmentId: id, isHead: true }, data: { isHead: false } }),
      this.prisma.employee.update({ where: { id: employeeId }, data: { isHead: true } }),
      this.prisma.department.update({ where: { id }, data: { headEmployeeId: employeeId } }),
    ]);
    return { ok: true };
  }
}

