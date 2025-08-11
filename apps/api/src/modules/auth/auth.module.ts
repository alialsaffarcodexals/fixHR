import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { PrismaService } from '../../prisma.service';
import { AuthService } from './auth.service.js';

@Module({
  controllers: [AuthController],
  providers: [PrismaService, AuthService],
  exports: [AuthService],
})
export class AuthModule {}

