import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { GlobalJwtGuard } from './common/guards/global-jwt.guard';
import { RolesGuard } from './common/guards/roles.guard';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the GlobalJwtGuard from the app context
  const globalJwtGuard = app.get(GlobalJwtGuard);
  const rolesGuard = app.get(RolesGuard);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalGuards(globalJwtGuard, rolesGuard);
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
