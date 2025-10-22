import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/project.entity';
import { ProjectTechnology } from './entity/project-technology.entity';
import { Technology } from './entity/technology.entity';
import { TechnologyController } from './technology.controller';
import { TechnologyService } from './technology.service';

@Module({
  imports: [TypeOrmModule.forFeature([Technology, ProjectTechnology, Project])],
  providers: [TechnologyService],
  controllers: [TechnologyController],
  exports: [TechnologyService],
})
export class TechnologyModule { }