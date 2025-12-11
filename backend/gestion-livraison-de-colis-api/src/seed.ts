import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedModule } from './core/seed/seed.module';
import { SeedService } from './core/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.select(SeedModule).get(SeedService, { strict: true });
  await seedService.run();
  await app.close();
}

bootstrap();
