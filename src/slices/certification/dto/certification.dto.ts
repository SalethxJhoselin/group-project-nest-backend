// certification.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCertificationDto {
  @ApiProperty({ example: 'AWS Certified Solutions Architect', description: 'Nombre de la certificación' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Amazon Web Services', description: 'Organización que emite la certificación' })
  @IsString()
  issuing_organization: string;

  @ApiProperty({ example: '2023-05-15T00:00:00.000Z', description: 'Fecha de emisión' })
  @IsDate()
  issue_date: Date;

  @ApiPropertyOptional({ example: '2025-05-15T00:00:00.000Z', description: 'Fecha de expiración' })
  @IsOptional()
  @IsDate()
  expiration_date?: Date;

  @ApiPropertyOptional({ example: 'https://www.credly.com/cert/abc123', description: 'URL del certificado' })
  @IsOptional()
  @IsUrl()
  credential_url?: string;
}

export class UpdateCertificationDto {
  @ApiPropertyOptional({ example: 'Google Cloud Professional Architect', description: 'Nombre de la certificación' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Google Cloud', description: 'Organización que emite la certificación' })
  @IsOptional()
  @IsString()
  issuing_organization?: string;

  @ApiPropertyOptional({ example: '2023-06-20T00:00:00.000Z', description: 'Fecha de emisión' })
  @IsOptional()
  @IsDate()
  issue_date?: Date;

  @ApiPropertyOptional({ example: '2025-06-20T00:00:00.000Z', description: 'Fecha de expiración' })
  @IsOptional()
  @IsDate()
  expiration_date?: Date;

  @ApiPropertyOptional({ example: 'https://www.credential.net/xyz789', description: 'URL del certificado' })
  @IsOptional()
  @IsUrl()
  credential_url?: string;
}

export class CertificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  issuing_organization: string;

  @ApiProperty()
  issue_date: Date;

  @ApiPropertyOptional()
  expiration_date?: Date;

  @ApiPropertyOptional()
  credential_url?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  student_id: string;
}