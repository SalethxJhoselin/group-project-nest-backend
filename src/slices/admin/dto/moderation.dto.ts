import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum UserStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    SUSPENDED = 'suspended',
}

export class UpdateUserStatusDto {
    @IsEnum(UserStatus)
    @IsNotEmpty()
    status: UserStatus;

    @IsString()
    @IsOptional()
    reason?: string;
}

export class ModerationUserDto {
    id: string;
    email: string;
    name: string;
    user_type: 'student' | 'company';
    status: UserStatus;
    created_at: Date;
    reported_count: number;
    last_report_reason?: string;
    profile_complete?: boolean;
}
