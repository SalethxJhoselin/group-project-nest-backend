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
import {
  AddSkillToStudentDto,
  CreateSkillDto,
  SkillResponseDto,
  StudentSkillResponseDto,
  StudentWithSkillsResponseDto, UpdateStudentSkillDto
} from './dto/skill.dto';
import { SkillService } from './skill.service';

@ApiTags('Skills')
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo skill' })
  @ApiBody({ type: CreateSkillDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Skill creado exitosamente',
    type: SkillResponseDto
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'El skill ya existe' })
  async create(@Body() dto: CreateSkillDto) {
    return await this.skillService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los skills disponibles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de todos los skills',
    type: [SkillResponseDto]
  })
  async findAll() {
    return await this.skillService.findAll();
  }

  @Post('/student/:studentId')
  @ApiOperation({ summary: 'Agregar skill a un estudiante' })
  @ApiParam({ name: 'studentId', description: 'ID del estudiante' })
  @ApiBody({ type: AddSkillToStudentDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Skill agregado al estudiante exitosamente',
    type: StudentSkillResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Estudiante o skill no encontrado' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'El estudiante ya tiene este skill' })
  async addSkillToStudent(
    @Param('studentId') studentId: string,
    @Body() dto: AddSkillToStudentDto,
  ) {
    return await this.skillService.addSkillToStudent(studentId, dto);
  }

  @Get('/student/:studentId')
  @ApiOperation({ summary: 'Obtener todos los skills de un estudiante' })
  @ApiParam({ name: 'studentId', description: 'ID del estudiante' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de skills del estudiante',
    type: [StudentSkillResponseDto]
  })
  async getStudentSkills(@Param('studentId') studentId: string) {
    return await this.skillService.getStudentSkills(studentId);
  }

  @Put('/student-skill/:id')
  @ApiOperation({ summary: 'Actualizar skill de un estudiante' })
  @ApiParam({ name: 'id', description: 'ID de la relación estudiante-skill' })
  @ApiBody({ type: UpdateStudentSkillDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill actualizado exitosamente',
    type: StudentSkillResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Relación no encontrada' })
  async updateStudentSkill(
    @Param('id') id: string,
    @Body() dto: UpdateStudentSkillDto,
  ) {
    return await this.skillService.updateStudentSkill(id, dto);
  }

  @Delete('/student-skill/:id')
  @ApiOperation({ summary: 'Remover skill de un estudiante' })
  @ApiParam({ name: 'id', description: 'ID de la relación estudiante-skill' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Skill removido exitosamente' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Relación no encontrada' })
  async removeSkillFromStudent(@Param('id') id: string) {
    await this.skillService.removeSkillFromStudent(id);
    return { message: 'Skill removido del estudiante exitosamente' };
  }

  @Get('/student-with-skills/:studentId')
  @ApiOperation({ summary: 'Obtener estudiante completo con todos sus skills' })
  @ApiParam({ name: 'studentId', description: 'ID del estudiante' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estudiante con todos sus datos incluyendo skills',
    type: StudentWithSkillsResponseDto
  })
  async getStudentWithSkills(@Param('studentId') studentId: string) {
    return await this.skillService.getStudentWithSkills(studentId);
  }
}