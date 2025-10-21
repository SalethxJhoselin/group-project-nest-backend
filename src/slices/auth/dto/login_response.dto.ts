import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

class BaseUserDto {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty({ enum: ['student', 'company'] })
    @IsEnum(['student', 'company'])
    user_type: 'student' | 'company';

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone_number?: string;

    @ApiProperty()
    @IsDate()
    created_at: Date;

    @ApiProperty()
    @IsDate()
    updated_at: Date;
}

class StudentResponseDto extends BaseUserDto {
    @ApiProperty()
    @IsNumber()
    CI: number;

    @ApiProperty()
    @IsNumber()
    registration_number: number;

    @ApiProperty()
    @IsString()
    first_name: string;

    @ApiProperty()
    @IsString()
    last_name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    profile_photo_url?: string;

    @ApiProperty()
    @IsDate()
    birthDate: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    bio?: string;
}

class CompanyResponseDto extends BaseUserDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    website?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    logo_url?: string;
}

// DTO principal que usa unión de tipos
export class LoginResponseDto {
    @ApiProperty({
        description: 'User data, structure varies by user_type',
        oneOf: [
            { $ref: getSchemaPath(StudentResponseDto) },
            { $ref: getSchemaPath(CompanyResponseDto) }
        ]
    })
    user: StudentResponseDto | CompanyResponseDto;

    @ApiProperty({ description: 'JWT access token for authentication' })
    @IsString()
    access_token: string;

    @ApiProperty({ description: 'JWT refresh token for getting new access tokens' })
    @IsString()
    refresh_token: string;
}