import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Job } from '../job/entity/job.entity';

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string;  // ID de Supabase

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    website: string;

    @Column({ nullable: true })
    logo_url: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    phone_number: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ApiProperty({ type: () => [Job], description: 'Vacantes publicadas por la empresa' })
    @OneToMany(() => Job, (job) => job.company)
    jobs: Job[];
}