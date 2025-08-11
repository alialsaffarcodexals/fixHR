import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateEmployeeDto {
  @IsString() @IsNotEmpty() firstName!: string;
  @IsString() @IsNotEmpty() lastName!: string;
  @IsString() @IsIn(['M','F']) gender!: string;
  @IsString() @IsNotEmpty() address!: string;
  @IsInt() @Min(1) @Max(8) payScale!: number;
  @IsString() @IsNotEmpty() departmentId!: string;
}

export class UpdateEmployeeDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() @IsIn(['M','F']) gender?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsInt() @Min(1) @Max(8) payScale?: number;
  @IsOptional() @IsString() departmentId?: string;
  @IsOptional() @IsInt() version?: number; // optimistic locking
}

