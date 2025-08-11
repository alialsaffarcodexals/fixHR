import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
// Import paths should be extensionless so that TypeScript can resolve them
// both during compilation and when running tests with ts-jest. The TypeScript
// compiler will append the appropriate `.js` extension in the emitted output.
import { EmployeesModule } from './modules/employees/employees.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { MetricsModule } from './modules/metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    EmployeesModule,
    DepartmentsModule,
    PayrollModule,
    HealthModule,
    AuthModule,
    MetricsModule,
  ],
})
export class AppModule {}

