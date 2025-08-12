import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { GlobalJwtGuard } from './common/guards/global-jwt.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const clientOrigin = configService.get<string>('CLIENT_ORIGIN');

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // allow non-browser tools
      if (clientOrigin && origin === clientOrigin) return cb(null, true);
      try {
        const o = new URL(origin);
        const a = new URL(clientOrigin ?? '');
        if (a.hostname && o.hostname === a.hostname && o.port === a.port && o.protocol === a.protocol) {
          return cb(null, true);
        }
      } catch {}
      return cb(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
  });

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
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();