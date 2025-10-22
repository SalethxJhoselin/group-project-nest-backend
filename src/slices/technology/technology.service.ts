import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../project/project.entity';
import { AddTechnologyToProjectDto, CreateTechnologyDto, UpdateTechnologyDto } from './dto/technology.dto';
import { ProjectTechnology } from './entity/project-technology.entity';
import { Technology } from './entity/technology.entity';

@Injectable()
export class TechnologyService {
  constructor(
    @InjectRepository(Technology)
    private technologyRepo: Repository<Technology>,
    @InjectRepository(ProjectTechnology)
    private projectTechnologyRepo: Repository<ProjectTechnology>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) { }

  // Crear una nueva tecnología
  async create(dto: CreateTechnologyDto): Promise<Technology> {
    const existingTechnology = await this.technologyRepo.findOne({
      where: { name: dto.name.toLowerCase() }
    });

    if (existingTechnology) {
      throw new ConflictException('Esta tecnología ya existe');
    }

    const technology = this.technologyRepo.create({
      name: dto.name.toLowerCase(),
      category: dto.category,
    });

    return await this.technologyRepo.save(technology);
  }

  // Obtener todas las tecnologías
  async findAll(): Promise<Technology[]> {
    return await this.technologyRepo.find({
      order: { name: 'ASC' },
    });
  }

  // Obtener tecnologías por categoría
  async findByCategory(category: string): Promise<Technology[]> {
    return await this.technologyRepo.find({
      where: { category },
      order: { name: 'ASC' },
    });
  }

  // Agregar tecnología a un proyecto
  async addTechnologyToProject(projectId: string, dto: AddTechnologyToProjectDto): Promise<ProjectTechnology> {
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    const technology = await this.technologyRepo.findOne({ where: { id: dto.technology_id } });
    if (!technology) {
      throw new NotFoundException('Tecnología no encontrada');
    }

    // Verificar si ya existe la relación
    const existingRelation = await this.projectTechnologyRepo.findOne({
      where: { project_id: projectId, technology_id: dto.technology_id },
    });

    if (existingRelation) {
      throw new ConflictException('El proyecto ya tiene esta tecnología');
    }

    const projectTechnology = this.projectTechnologyRepo.create({
      project,
      technology,
      project_id: projectId,
      technology_id: dto.technology_id,
    });

    return await this.projectTechnologyRepo.save(projectTechnology);
  }

  // Obtener tecnologías de un proyecto
  async getProjectTechnologies(projectId: string): Promise<ProjectTechnology[]> {
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return await this.projectTechnologyRepo.find({
      where: { project_id: projectId },
      relations: ['technology'],
      order: { created_at: 'DESC' },
    });
  }

  // Remover tecnología de un proyecto
  async removeTechnologyFromProject(id: string): Promise<void> {
    const result = await this.projectTechnologyRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Relación proyecto-tecnología no encontrada');
    }
  }

  // Actualizar tecnología
  async update(id: string, dto: UpdateTechnologyDto): Promise<Technology> {
    const technology = await this.technologyRepo.findOne({ where: { id } });
    if (!technology) {
      throw new NotFoundException('Tecnología no encontrada');
    }

    Object.assign(technology, dto);
    return await this.technologyRepo.save(technology);
  }

  // Eliminar tecnología
  async delete(id: string): Promise<void> {
    const result = await this.technologyRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Tecnología no encontrada');
    }
  }

  // Obtener proyecto con tecnologías (para responses)
  async getProjectWithTechnologies(projectId: string): Promise<any> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: [
        'projectTechnologies',
        'projectTechnologies.technology',
        'student'
      ],
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return project;
  }
}