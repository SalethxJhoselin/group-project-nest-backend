import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AcademicInfo } from 'src/slices/academic_info/academic_info.entity';
import { Certification } from 'src/slices/certification/certification.entity';
import { Company } from 'src/slices/company/company.entity';
import { Project } from 'src/slices/project/project.entity';
import { Student } from 'src/slices/student/student.entity';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get('DATABASE_USERNAME'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [Student, Company, AcademicInfo, Certification, Project],
    synchronize: true,
    ssl: { rejectUnauthorized: false },
});
