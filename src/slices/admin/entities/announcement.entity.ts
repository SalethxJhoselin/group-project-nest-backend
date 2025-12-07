import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AnnouncementType, AnnouncementTarget } from '../dto/announcement.dto';

@Entity('announcements')
export class Announcement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    message: string;

    @Column({
        type: 'enum',
        enum: AnnouncementType,
        default: AnnouncementType.INFO,
    })
    type: AnnouncementType;

    @Column({
        type: 'enum',
        enum: AnnouncementTarget,
        default: AnnouncementTarget.ALL,
    })
    target: AnnouncementTarget;

    @Column({ type: 'varchar', length: 500, nullable: true })
    link: string;

    @Column({ type: 'uuid' })
    created_by: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
