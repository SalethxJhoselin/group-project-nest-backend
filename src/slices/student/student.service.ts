import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicInfo } from '../academic_info/academic_info.entity';
import { Certification } from '../certification/certification.entity';
import { Project } from '../project/project.entity';
import { StudentSkill } from '../skill/entity/student-skill.entity.dto';
import { CreateStudentDto, UpdateStudentDto } from './dto/create-student.dto';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepo: Repository<Student>,
        @InjectRepository(AcademicInfo)
        private academicInfoRepo: Repository<AcademicInfo>,
        @InjectRepository(Certification)
        private certificationRepo: Repository<Certification>,
        @InjectRepository(Project)
        private projectRepo: Repository<Project>,
        @InjectRepository(StudentSkill)
        private studentSkillRepo: Repository<StudentSkill>,
    ) { }

    async create(createStudentDto: CreateStudentDto & { id: string }): Promise<Student> {
        // Verificar si ya existe el CI o registration_number
        const existingCI = await this.studentRepo.findOne({
            where: { CI: createStudentDto.CI }
        });
        if (existingCI) {
            throw new ConflictException('El CI ya está registrado');
        }

        const existingRegistration = await this.studentRepo.findOne({
            where: { registration_number: createStudentDto.registration_number }
        });
        if (existingRegistration) {
            throw new ConflictException('El número de matrícula ya está registrado');
        }

        const student = this.studentRepo.create(createStudentDto);
        return await this.studentRepo.save(student);
    }

    async findAll(): Promise<Student[]> {
        return await this.studentRepo.find({
            order: { created_at: 'DESC' }
        });
    }

    async findOne(id: string): Promise<Student> {
        const student = await this.studentRepo.findOne({ where: { id } });
        if (!student) {
            throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
        }
        return student;
    }

    async findByEmail(email: string): Promise<Student | null> {
        return await this.studentRepo.findOne({ where: { email } });
    }

    async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
        const student = await this.findOne(id);

        Object.assign(student, updateStudentDto);
        return await this.studentRepo.save(student);
    }

    async remove(id: string): Promise<void> {
        const student = await this.findOne(id);
        await this.studentRepo.remove(student);
    }

    async getProfile(id: string): Promise<Student> {
        return await this.findOne(id);
    }

    async getCompleteCVData(studentId: string): Promise<any> {
        // Verificar que el estudiante existe
        const student = await this.studentRepo.findOne({
            where: { id: studentId }
        });

        if (!student) {
            throw new NotFoundException(`Estudiante con ID ${studentId} no encontrado`);
        }

        // Obtener todas las relaciones en paralelo
        const [
            academicInfo,
            certifications,
            projects,
            studentSkills
        ] = await Promise.all([
            // Información académica
            this.academicInfoRepo.find({
                where: { student_id: studentId },
                order: { start_year: 'DESC' }
            }),

            // Certificaciones
            this.certificationRepo.find({
                where: { student_id: studentId },
                order: { issue_date: 'DESC' }
            }),

            // Proyectos con tecnologías
            this.projectRepo.find({
                where: { student_id: studentId },
                relations: ['projectTechnologies', 'projectTechnologies.technology'],
                order: { start_date: 'DESC' }
            }),

            // Skills con información del skill
            this.studentSkillRepo.find({
                where: { student_id: studentId },
                relations: ['skill'],
                order: { years_experience: 'DESC' }
            })
        ]);

        // Transformar proyectos para incluir nombres de tecnologías
        const transformedProjects = projects.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            start_date: project.start_date,
            end_date: project.end_date,
            project_url: project.project_url,
            technologies: project.projectTechnologies
                .map(pt => pt.technology?.name)
                .filter(Boolean)
        }));

        // Transformar skills
        const transformedSkills = studentSkills.map(ss => ({
            id: ss.skill.id,
            name: ss.skill.name,
            level: ss.level,
            years_experience: ss.years_experience
        }));

        return {
            student,
            academic_info: academicInfo,
            certifications,
            projects: transformedProjects,
            skills: transformedSkills
        };
    }
}