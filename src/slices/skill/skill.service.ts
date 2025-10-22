import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../student/student.entity';
import { AddSkillToStudentDto, CreateSkillDto, UpdateStudentSkillDto } from './dto/skill.dto';
import { Skill } from './entity/skill.entity';
import { StudentSkill } from './entity/student-skill.entity.dto';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepo: Repository<Skill>,
    @InjectRepository(StudentSkill)
    private studentSkillRepo: Repository<StudentSkill>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) { }

  // Crear un nuevo skill
  async create(dto: CreateSkillDto): Promise<Skill> {
    const existingSkill = await this.skillRepo.findOne({
      where: { name: dto.name.toLowerCase() }
    });

    if (existingSkill) {
      throw new ConflictException('Este skill ya existe');
    }

    const skill = this.skillRepo.create({
      name: dto.name.toLowerCase(),
    });

    return await this.skillRepo.save(skill);
  }

  // Obtener todos los skills
  async findAll(): Promise<Skill[]> {
    return await this.skillRepo.find({
      order: { name: 'ASC' },
    });
  }

  // Agregar skill a un estudiante
  async addSkillToStudent(studentId: string, dto: AddSkillToStudentDto): Promise<StudentSkill> {
    const student = await this.studentRepo.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    const skill = await this.skillRepo.findOne({ where: { id: dto.skill_id } });
    if (!skill) {
      throw new NotFoundException('Skill no encontrado');
    }

    // Verificar si ya existe la relación
    const existingRelation = await this.studentSkillRepo.findOne({
      where: { student_id: studentId, skill_id: dto.skill_id },
    });

    if (existingRelation) {
      throw new ConflictException('El estudiante ya tiene este skill');
    }

    const studentSkill = this.studentSkillRepo.create({
      level: dto.level,
      years_experience: dto.years_experience,
      student,
      skill,
      student_id: studentId,
      skill_id: dto.skill_id,
    });

    return await this.studentSkillRepo.save(studentSkill);
  }

  // Obtener skills de un estudiante
  async getStudentSkills(studentId: string): Promise<StudentSkill[]> {
    const student = await this.studentRepo.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    return await this.studentSkillRepo.find({
      where: { student_id: studentId },
      relations: ['skill'],
      order: { created_at: 'DESC' },
    });
  }

  // Actualizar skill de un estudiante
  async updateStudentSkill(id: string, dto: UpdateStudentSkillDto): Promise<StudentSkill> {
    const studentSkill = await this.studentSkillRepo.findOne({
      where: { id },
      relations: ['skill']
    });

    if (!studentSkill) {
      throw new NotFoundException('Relación estudiante-skill no encontrada');
    }

    Object.assign(studentSkill, dto);
    return await this.studentSkillRepo.save(studentSkill);
  }

  // Remover skill de un estudiante
  async removeSkillFromStudent(id: string): Promise<void> {
    const result = await this.studentSkillRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Relación estudiante-skill no encontrada');
    }
  }

  // Obtener estudiante con skills (para responses)
  async getStudentWithSkills(studentId: string): Promise<any> {
    const student = await this.studentRepo.findOne({
      where: { id: studentId },
      relations: [
        'studentSkills',
        'studentSkills.skill',
        'academicInfo',
        'certifications',
        'projects'
      ],
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    return student;
  }
}