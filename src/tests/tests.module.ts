import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { AiTestGeneratorService } from './ai-test-generator.service';

@Module({
    imports: [ConfigModule],
    controllers: [TestsController],
    providers: [TestsService, AiTestGeneratorService],
    exports: [TestsService]
})
export class TestsModule { }
