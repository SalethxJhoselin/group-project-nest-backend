import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// company.entity.ts  
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
}