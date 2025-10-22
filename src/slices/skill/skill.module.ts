import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../student/student.entity';
import { Skill } from './entity/skill.entity';
import { StudentSkill } from './entity/student-skill.entity.dto';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, StudentSkill, Student])],
  providers: [SkillService],
  controllers: [SkillController],
  exports: [SkillService],
})
export class SkillModule { }