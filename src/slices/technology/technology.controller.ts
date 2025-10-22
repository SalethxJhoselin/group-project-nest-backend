import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import {
  AddTechnologyToProjectDto,
  CreateTechnologyDto,
  ProjectTechnologyResponseDto,
  ProjectWithTechnologiesResponseDto,
  TechnologyResponseDto,
  UpdateTechnologyDto
} from './dto/technology.dto';
import { TechnologyService } from './technology.service';

@ApiTags('Technologies')
@Controller('technologies')
export class TechnologyController {
  constructor(private readonly technologyService: TechnologyService) { }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tecnología' })
  @ApiBody({ type: CreateTechnologyDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tecnología creada exitosamente',
    type: TechnologyResponseDto
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'La tecnología ya existe' })
  async create(@Body() dto: CreateTechnologyDto) {
    return await this.technologyService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tecnologías disponibles' })
  @ApiQuery({ name: 'category', required: false, description: 'Filtrar por categoría' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de todas las tecnologías',
    type: [TechnologyResponseDto]
  })
  async findAll(@Query('category') category?: string) {
    if (category) {
      return await this.technologyService.findByCategory(category);
    }
    return await this.technologyService.findAll();
  }

  @Post('/project/:projectId')
  @ApiOperation({ summary: 'Agregar tecnología a un proyecto' })
  @ApiParam({ name: 'projectId', description: 'ID del proyecto' })
  @ApiBody({ type: AddTechnologyToProjectDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tecnología agregada al proyecto exitosamente',
    type: ProjectTechnologyResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Proyecto o tecnología no encontrado' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'El proyecto ya tiene esta tecnología' })
  async addTechnologyToProject(
    @Param('projectId') projectId: string,
    @Body() dto: AddTechnologyToProjectDto,
  ) {
    return await this.technologyService.addTechnologyToProject(projectId, dto);
  }

  @Get('/project/:projectId')
  @ApiOperation({ summary: 'Obtener todas las tecnologías de un proyecto' })
  @ApiParam({ name: 'projectId', description: 'ID del proyecto' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de tecnologías del proyecto',
    type: [ProjectTechnologyResponseDto]
  })
  async getProjectTechnologies(@Param('projectId') projectId: string) {
    return await this.technologyService.getProjectTechnologies(projectId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar tecnología' })
  @ApiParam({ name: 'id', description: 'ID de la tecnología' })
  @ApiBody({ type: UpdateTechnologyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tecnología actualizada exitosamente',
    type: TechnologyResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tecnología no encontrada' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTechnologyDto,
  ) {
    return await this.technologyService.update(id, dto);
  }

  @Delete('/project-technology/:id')
  @ApiOperation({ summary: 'Remover tecnología de un proyecto' })
  @ApiParam({ name: 'id', description: 'ID de la relación proyecto-tecnología' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tecnología removida exitosamente' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Relación no encontrada' })
  async removeTechnologyFromProject(@Param('id') id: string) {
    await this.technologyService.removeTechnologyFromProject(id);
    return { message: 'Tecnología removida del proyecto exitosamente' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tecnología' })
  @ApiParam({ name: 'id', description: 'ID de la tecnología' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tecnología eliminada exitosamente' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tecnología no encontrada' })
  async delete(@Param('id') id: string) {
    await this.technologyService.delete(id);
    return { message: 'Tecnología eliminada exitosamente' };
  }

  @Get('/project-with-technologies/:projectId')
  @ApiOperation({ summary: 'Obtener proyecto completo con todas sus tecnologías' })
  @ApiParam({ name: 'projectId', description: 'ID del proyecto' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Proyecto con todos sus datos incluyendo tecnologías',
    type: ProjectWithTechnologiesResponseDto
  })
  async getProjectWithTechnologies(@Param('projectId') projectId: string) {
    return await this.technologyService.getProjectWithTechnologies(projectId);
  }
}