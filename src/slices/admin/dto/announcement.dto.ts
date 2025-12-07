import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum AnnouncementType {
    INFO = 'info',
    WARNING = 'warning',
    SUCCESS = 'success',
    ERROR = 'error',
}

export enum AnnouncementTarget {
    ALL = 'all',
    STUDENTS = 'students',
    COMPANIES = 'companies',
}

export class CreateAnnouncementDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsEnum(AnnouncementType)
    @IsNotEmpty()
    type: AnnouncementType;

    @IsEnum(AnnouncementTarget)
    @IsNotEmpty()
    target: AnnouncementTarget;

    @IsString()
    @IsOptional()
    link?: string;
}

export class AnnouncementDto {
    id: string;
    title: string;
    message: string;
    type: AnnouncementType;
    target: AnnouncementTarget;
    link?: string;
    created_at: Date;
    created_by: string;
    is_active: boolean;
}
