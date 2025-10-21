// company/dto/create-company.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCompanyDto {
    @ApiProperty({ example: 'Tech Solutions SA' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Empresa dedicada al desarrollo de software...', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'https://techsolutions.com', required: false })
    @IsOptional()
    @IsUrl()
    website?: string;

    @ApiProperty({ example: 'https://techsolutions.com/logo.png', required: false })
    @IsOptional()
    @IsString()
    logo_url?: string;

    @ApiProperty({ example: 'contacto@techsolutions.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '+1234567890', required: false })
    @IsOptional()
    @IsString()
    phone_number?: string;
}

export class UpdateCompanyDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUrl()
    website?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    logo_url?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone_number?: string;
}