import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { GlobalJwtGuard } from './common/guards/global-jwt.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the GlobalJwtGuard from the app context
  const globalJwtGuard = app.get(GlobalJwtGuard);
  const rolesGuard = app.get(RolesGuard);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalGuards(globalJwtGuard, rolesGuard);

  const config = new DocumentBuilder()
    .setTitle('Gestion de livraison de colis')
    .setDescription('Projet de stage pour obtenir le diplôme licence en developpement web et design.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' is the path where the docs will be accessible

  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
