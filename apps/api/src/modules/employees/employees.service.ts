import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async list(query = '', page = 1, sort = 'lastName') {
    const take = 20;
    const skip = (page - 1) * take;

    const where: Prisma.EmployeeWhereInput = {
      deletedAt: null,
      OR: [
        { firstName: { contains: query, mode: 'insensitive' as Prisma.QueryMode } },
        { lastName:  { contains: query, mode: 'insensitive' as Prisma.QueryMode } },
        { employeeId:{ contains: query, mode: 'insensitive' as Prisma.QueryMode } },
      ],
    };

    const orderBy: any =
      sort === 'payScale' ? { payScale: 'asc' } :
      sort === 'department' ? { departmentId: 'asc' } :
      { lastName: 'asc' };

    const [items, total] = await Promise.all([
      this.prisma.employee.findMany({ where, skip, take, orderBy }),
      this.prisma.employee.count({ where }),
    ]);
    return { items, total, page, pageSize: take };
  }

  async get(id: string) {
    const emp = await this.prisma.employee.findFirst({ where: { id, deletedAt: null } });
    if (!emp) throw new NotFoundException('Employee not found');
    return emp;
  }

  async create(dto: CreateEmployeeDto) {
    const dept = await this.prisma.department.findUnique({ where: { id: dto.departmentId } });
    if (!dept) throw new BadRequestException('Department not found');
    const employeeId = `E-${Date.now().toString(36)}-${Math.floor(Math.random()*1000)}`;
    return this.prisma.employee.create({ data: { ...dto, employeeId } });
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const emp = await this.get(id);
    if (emp.isHead && dto.departmentId && dto.departmentId !== emp.departmentId) {
      throw new ConflictException('Head cannot be reassigned; transfer headship first.');
    }
    if (dto.version == null) throw new ConflictException('Missing version for update');
    const result = await this.prisma.employee.updateMany({
      where: { id, version: dto.version },
      data: { ...dto, version: { increment: 1 } },
    });
    if (result.count === 0) throw new ConflictException('Version conflict; reload and try again.');
    return this.get(id);
  }

  async softDelete(id: string) {
    const emp = await this.get(id);
    if (emp.isHead) throw new ConflictException('Cannot delete Head; transfer headship first.');
    await this.prisma.employee.update({ where: { id }, data: { deletedAt: new Date() } });
    return { ok: true };
  }
}
