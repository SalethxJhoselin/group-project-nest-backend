// company/company.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private companyRepo: Repository<Company>,
    ) {}

    async create(createCompanyDto: CreateCompanyDto & { id: string }): Promise<Company> {
        // Verificar si ya existe el email
        const existingEmail = await this.companyRepo.findOne({ 
            where: { email: createCompanyDto.email } 
        });
        if (existingEmail) {
            throw new ConflictException('El email ya está registrado');
        }

        const company = this.companyRepo.create(createCompanyDto);
        return await this.companyRepo.save(company);
    }

    async findAll(): Promise<Company[]> {
        return await this.companyRepo.find({
            order: { created_at: 'DESC' }
        });
    }

    async findOne(id: string): Promise<Company> {
        const company = await this.companyRepo.findOne({ where: { id } });
        if (!company) {
            throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
        }
        return company;
    }

    async findByEmail(email: string): Promise<Company | null> {
        return await this.companyRepo.findOne({ where: { email } });
    }

    async findByName(name: string): Promise<Company[]> {
        return await this.companyRepo
            .createQueryBuilder('company')
            .where('LOWER(company.name) LIKE LOWER(:name)', { name: `%${name}%` })
            .getMany();
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        const company = await this.findOne(id);
        
        Object.assign(company, updateCompanyDto);
        return await this.companyRepo.save(company);
    }

    async remove(id: string): Promise<void> {
        const company = await this.findOne(id);
        await this.companyRepo.remove(company);
    }

    async getProfile(id: string): Promise<Company> {
        return await this.findOne(id);
    }
}