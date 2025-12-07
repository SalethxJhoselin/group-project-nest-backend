// company/company.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../job/entity/job.entity';
import { CompanyController } from './company.controller';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyProfileView } from './entity/company-profile-view.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Company, Job, CompanyProfileView])],
    providers: [CompanyService],
    controllers: [CompanyController],
    exports: [CompanyService],
})
export class CompanyModule { }