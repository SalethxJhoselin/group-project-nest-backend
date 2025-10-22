import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { CreateProjectDto, ProjectResponseDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post('/student/:studentId')
  @ApiOperation({ summary: 'Crear proyecto para un estudiante' })
  @ApiParam({ name: 'studentId', description: 'ID del estudiante' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Proyecto creado exitosamente',
    type: ProjectResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Estudiante no encontrado' })
  async create(
    @Param('studentId') studentId: string,
    @Body() dto: CreateProjectDto,
  ) {
    return await this.projectService.create(studentId, dto);
  }

  @Get('/student/:studentId')
  @ApiOperation({ summary: 'Obtener todos los proyectos de un estudiante' })
  @ApiParam({ name: 'studentId', description: 'ID del estudiante' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de proyectos del estudiante',
    type: [ProjectResponseDto]
  })
  async findByStudent(@Param('studentId') studentId: string) {
    return await this.projectService.findByStudentId(studentId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar proyecto' })
  @ApiParam({ name: 'id', description: 'ID del proyecto' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Proyecto actualizado exitosamente',
    type: ProjectResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Proyecto no encontrado' })
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return await this.projectService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar proyecto' })
  @ApiParam({ name: 'id', description: 'ID del proyecto' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Proyecto eliminado exitosamente' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Proyecto no encontrado' })
  async delete(@Param('id') id: string) {
    await this.projectService.delete(id);
    return { message: 'Proyecto eliminado exitosamente' };
  }
}