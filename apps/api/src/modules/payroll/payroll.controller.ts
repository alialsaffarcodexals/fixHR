import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard, Roles } from '../auth/auth.guard';
import { Response } from 'express';

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private service: PayrollService) {}

  @Post('run')
  @Roles('Admin','PayrollClerk')
  run(@Body() body: { runDate?: string }, @Body('actorId') actorId?: string) {
    const date = body.runDate || new Date().toISOString();
    return this.service.run(date, actorId || 'system');
  }

  @Get(':runId/report')
  @Roles('Admin','PayrollClerk','HRManager','DeptHead')
  async download(@Param('runId') runId: string, @Res() res: Response) {
    const { content } = await this.service.getReport(runId);
    res.setHeader('Content-Type', 'text/plain');
    res.send(content);
  }
}

