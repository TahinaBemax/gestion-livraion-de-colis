import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PrestataireModule } from './modules/prestataire/prestataire.module';
import { LivreurModule } from './modules/livreur/livreur.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './core/auth/auth.module';
import { GlobalJwtGuard } from './common/guards/global-jwt.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PointLivraisonModule } from './modules/point-livraison/point-livraison.module';
import { ExistsInDatabase, ExistsInDatabaseConstraint } from './common/validators/is-exist-in-database.validator';
import { IsPrestataireExistsInDatabaseConstraint } from './common/validators/is-existing-prestataire';
import { SharedModule } from './common/validators/sharded-module';
import { CsvImportModule } from './modules/csv-import/csv-import.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: parseInt(config.get('DATABASE_PORT').toString()),        
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: false, 
      })
    }),
    UserModule,
    RoleModule,
    PrestataireModule,
    LivreurModule,
    AuthModule,
    PointLivraisonModule,
    CsvImportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    GlobalJwtGuard, 
    RolesGuard,
  ],
  exports:[]
})
export class AppModule {}
