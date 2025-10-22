import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
  });

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('FICCT Talent API')
    .setDescription('Documentación de la API para la plataforma FICCT Talent')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Backend corriendo en: http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/api`);
  console.log(`CORS habilitado para: http://localhost:5173`);
}

bootstrap();
