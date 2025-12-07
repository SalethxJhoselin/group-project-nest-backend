import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { Announcement } from './entities/announcement.entity';
import { Admin } from './admin.entity';
import { Student } from '../student/student.entity';
import { Company } from '../company/company.entity';
import { Job } from '../job/entity/job.entity';
import { JobApplication } from '../job/entity/job-application.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Announcement,
            Admin,
            Student,
            Company,
            Job,
            JobApplication,
        ]),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'super-secret-key-dev-only',
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [AdminController, AdminAuthController],
    providers: [AdminService, AdminAuthService],
    exports: [AdminService, AdminAuthService],
})
export class AdminModule { }
