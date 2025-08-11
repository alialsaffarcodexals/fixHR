import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import Redis from 'ioredis';

@Controller()
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get('healthz')
  liveness() { return { ok: true }; }

  @Get('readyz')
  async readiness() {
    await this.prisma.$queryRaw`SELECT 1`;
    const r = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    await r.ping();
    await r.quit();
    return { ok: true };
  }
}

