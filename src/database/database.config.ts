import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Admin } from 'src/slices/admin/admin.entity';
import { Announcement } from 'src/slices/admin/entities/announcement.entity';
import { AcademicInfo } from 'src/slices/academic_info/academic_info.entity';
import { Certification } from 'src/slices/certification/certification.entity';
import { Company } from 'src/slices/company/company.entity';
import { CompanyProfileView } from 'src/slices/company/entity/company-profile-view.entity';
import { ApplicationHistory } from 'src/slices/job/entity/application-history.entity';
import { JobApplication } from 'src/slices/job/entity/job-application.entity';
import { Job } from 'src/slices/job/entity/job.entity';
import { Project } from 'src/slices/project/project.entity';
import { Skill } from 'src/slices/skill/entity/skill.entity';
import { StudentSkill } from 'src/slices/skill/entity/student-skill.entity.dto';
import { Student } from 'src/slices/student/student.entity';
import { StudentProfileView } from 'src/slices/student/entity/student-profile-view.entity';
import { ProjectTechnology } from 'src/slices/technology/entity/project-technology.entity';
import { Technology } from 'src/slices/technology/entity/technology.entity';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get('DATABASE_USERNAME'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [Admin, Announcement, Student, Company, CompanyProfileView, StudentProfileView, AcademicInfo, Certification, Project, Skill, StudentSkill,
        Technology, ProjectTechnology, Job, JobApplication, ApplicationHistory],
    synchronize: true,
    ssl: { rejectUnauthorized: false },
});
