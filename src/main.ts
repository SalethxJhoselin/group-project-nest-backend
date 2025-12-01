import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración CORS
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',') ?? [
    'https://group-project-nest-backend-18gh.onrender.com',
    'https://ficct-talent.netlify.app',
    'http://127.0.0.1:5174',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://ficct-talent.vercel.app',
    'http://127.0.0.1:5172',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    
  ];

  app.enableCors({
    origin: allowedOrigins,
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

  console.log(`✅ Backend corriendo en: http://localhost:${port}`);
  console.log(`📘 Swagger disponible en: http://localhost:${port}/api`);
  console.log(`🌐 CORS habilitado para: ${allowedOrigins.join(', ')}`);
  console.log(`🔧 Entorno: ${process.env.NODE_ENV ?? 'desarrollo'}`);
}

bootstrap();
