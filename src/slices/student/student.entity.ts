// student.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { AcademicInfo } from '../academic_info/academic_info.entity';

@Entity('students')
export class Student {
    @ApiProperty({ description: 'ID único del estudiante (de Supabase)' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 12345678, description: 'Cédula de identidad' })
    @Column()
    CI: number;

    @ApiProperty({ example: 20230001, description: 'Número de matrícula' })
    @Column()
    registration_number: number;

    @ApiProperty({ example: 'Juan', description: 'Nombre del estudiante' })
    @Column()
    first_name: string;

    @ApiProperty({ example: 'Perez', description: 'Apellido del estudiante' })
    @Column()
    last_name: string;

    @ApiProperty({ example: '+584123456789', description: 'Número de teléfono', required: false })
    @Column({ nullable: true })
    phone_number: string;

    @ApiProperty({ example: 'https://example.com/photo.jpg', description: 'URL de la foto de perfil', required: false })
    @Column({ nullable: true })
    profile_photo_url: string;

    @ApiProperty({ example: '2000-05-15T00:00:00.000Z', description: 'Fecha de nacimiento' })
    @Column()
    birthDate: Date;

    @ApiProperty({ example: 'estudiante@universidad.edu', description: 'Email del estudiante' })
    @Column()
    email: string;

    @ApiProperty({ example: 'Estudiante de Ingeniería en Sistemas', description: 'Biografía del estudiante', required: false })
    @Column({ nullable: true })
    bio: string;

    @ApiProperty({ description: 'Fecha de creación del registro' })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({ description: 'Fecha de última actualización' })
    @UpdateDateColumn()
    updated_at: Date;

    @ApiProperty({ type: () => [AcademicInfo], description: 'Información académica del estudiante' })
    @OneToMany(() => AcademicInfo, (academicInfo) => academicInfo.student)
    academicInfo: AcademicInfo[];
}