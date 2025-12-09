import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TestsService } from './tests.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tests')
@Controller('tests')
// @UseGuards(JwtAuthGuard) // Descomentar cuando tengas el guard
export class TestsController {
    constructor(private readonly testsService: TestsService) { }

    @Post('generate')
    @ApiOperation({ summary: 'Generate a new test for an application' })
    @ApiResponse({ status: 201, description: 'Test generated successfully' })
    async generateTest(
        @Body() body: { applicationId: number },
        @Request() req: any
    ) {
        // const userId = req.user.id; // Del JWT
        const userId = 1; // Mock mientras implementas auth

        return this.testsService.generateTest(body.applicationId, userId);
    }

    @Post(':testId/submit')
    @ApiOperation({ summary: 'Submit test answers' })
    @ApiResponse({ status: 200, description: 'Test submitted successfully' })
    async submitTest(
        @Param('testId') testId: string,
        @Body() body: { answers: any[] },
        @Request() req: any
    ) {
        // const userId = req.user.id;
        const userId = 1; // Mock

        return this.testsService.submitTest(testId, body.answers, userId);
    }

    @Get('available/:studentId')
    @ApiOperation({ summary: 'Get available tests for a student' })
    @ApiResponse({ status: 200, description: 'Available tests retrieved' })
    async getAvailableTests(@Param('studentId') studentId: string) {
        return this.testsService.getAvailableTests(parseInt(studentId));
    }

    @Get('history/:studentId')
    @ApiOperation({ summary: 'Get test history for a student' })
    @ApiResponse({ status: 200, description: 'Test history retrieved' })
    async getTestHistory(@Param('studentId') studentId: string) {
        return this.testsService.getTestHistory(parseInt(studentId));
    }
}
