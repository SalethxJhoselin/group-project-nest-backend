import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// student.entity.ts
@Entity('students')
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string;  // ID de Supabase

    @Column()
    CI: number;

    @Column()
    registration_number: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ nullable: true })
    phone_number: string;

    @Column({ nullable: true })
    profile_photo_url: string;

    @Column()
    birthDate: Date;

    @Column()
    email: string;

    @Column({ nullable: true })
    bio: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
