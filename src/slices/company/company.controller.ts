import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/create-company.dto';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Post()
    @ApiOperation({ summary: 'Crear una nueva empresa' })
    @ApiResponse({ status: 201, description: 'Empresa creada', type: Company })
    @ApiResponse({ status: 409, description: 'Email ya registrado' })
    async create(@Body() createCompanyDto: CreateCompanyDto & { id: string }) {
        return await this.companyService.create(createCompanyDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las empresas' })
    @ApiResponse({ status: 200, description: 'Lista de empresas', type: [Company] })
    async findAll(): Promise<Company[]> {
        return await this.companyService.findAll();
    }

    @Get('search')
    @ApiOperation({ summary: 'Buscar empresas por nombre' })
    @ApiQuery({ name: 'name', required: true, description: 'Nombre de la empresa' })
    async findByName(@Query('name') name: string): Promise<Company[]> {
        return await this.companyService.findByName(name);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una empresa por ID' })
    @ApiResponse({ status: 200, description: 'Empresa encontrada', type: Company })
    @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
    async findOne(@Param('id') id: string): Promise<Company> {
        return await this.companyService.findOne(id);
    }

    @Get('email/:email')
    @ApiOperation({ summary: 'Obtener empresa por email' })
    async findByEmail(@Param('email') email: string): Promise<Company | null> {
        return await this.companyService.findByEmail(email);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar empresa' })
    @ApiResponse({ status: 200, description: 'Empresa actualizada', type: Company })
    async update(
        @Param('id') id: string,
        @Body() updateCompanyDto: UpdateCompanyDto,
    ): Promise<Company> {
        return await this.companyService.update(id, updateCompanyDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar empresa' })
    @ApiResponse({ status: 200, description: 'Empresa eliminada' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.companyService.remove(id);
    }

    @Get(':id/profile')
    @ApiOperation({ summary: 'Obtener perfil de la empresa' })
    async getProfile(@Param('id') id: string): Promise<Company> {
        return await this.companyService.getProfile(id);
    }
}