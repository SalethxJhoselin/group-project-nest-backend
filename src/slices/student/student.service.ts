import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto, UpdateStudentDto } from './dto/create-student.dto';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepo: Repository<Student>,
    ) {}

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
}