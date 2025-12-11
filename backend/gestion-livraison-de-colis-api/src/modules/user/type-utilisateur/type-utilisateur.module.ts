import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeUtilisateur } from './type-utilisateur.entity';

@Module({
    providers: [],
    imports: [TypeUtilisateurModule,TypeOrmModule.forFeature([TypeUtilisateur])]
})
export class TypeUtilisateurModule {}
