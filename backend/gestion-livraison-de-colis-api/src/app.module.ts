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

import { CsvImportModule } from './modules/csv-import/csv-import.module';
import { EvenementLocalModule } from './modules/evenement-local/evenement-local.module';
import { ContrainteEvenementModule } from './modules/contrainte-evenement/contrainte-evenement.module';
import { CreneauLivraisonModule } from './modules/creneau-livraison/creneau-livraison.module';
import { ContrainteLivraisonModule } from './modules/contrainte-livraison/contrainte-livraison.module';
import { ContrainteJourModule } from './modules/contrainte-jour/contrainte-jour.module';
import { FileCleanUpHandlerModule } from './common/file-clean-up-handler/file-clean-up-handler.module';
import { ImageUploadModule } from './modules/image-upload/image-upload.module';

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
    ContrainteEvenementModule,
    EvenementLocalModule,
    ContrainteEvenementModule,
    CreneauLivraisonModule,
    ContrainteLivraisonModule,
    ContrainteJourModule,
    FileCleanUpHandlerModule,
    ImageUploadModule,
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
