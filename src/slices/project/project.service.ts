import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../student/student.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) { }

  async create(studentId: string, dto: CreateProjectDto): Promise<Project> {
    const student = await this.studentRepo.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    const project = this.projectRepo.create({
      ...dto,
      student,
      student_id: studentId,
    });

    return await this.projectRepo.save(project);
  }

  async findByStudentId(studentId: string): Promise<Project[]> {
    const projects = await this.projectRepo.find({
      where: { student_id: studentId },
      order: { start_date: 'DESC' },
    });

    if (!projects || projects.length === 0) {
      throw new NotFoundException('No se encontraron proyectos para este estudiante');
    }

    return projects;
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    return project;
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, dto);
    return await this.projectRepo.save(project);
  }

  async delete(id: string): Promise<void> {
    const result = await this.projectRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Proyecto no encontrado');
    }
  }
}