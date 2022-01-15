import { IsOptional, IsString } from 'class-validator';


export class CreatePhoneDto {
  
  @IsString()
  type: string;

  @IsString()
  serial: string;

  @IsString()
  color: string;

  @IsString()
  @IsOptional()
  metadata: string;
}