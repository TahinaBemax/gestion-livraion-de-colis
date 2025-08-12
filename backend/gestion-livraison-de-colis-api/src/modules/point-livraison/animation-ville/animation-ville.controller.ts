import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AnimationVilleService } from './animation-ville.service';
import { UserRole } from 'src/common/enum/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AnimationVille } from './animation-ville.entity';
import { AnimationVilleDto } from 'src/common/dto/animation-ville/animation-ville-dto';
import { UpdateAnimationVilleDto } from 'src/common/dto/animation-ville/update-animation-ville-dto';

@Controller('animations-villes')
@ApiTags('Animation Ville')
@Roles(UserRole.Admin, UserRole.ResponsableExploitation)
export class AnimationVilleController {
    constructor(private readonly animationService: AnimationVilleService){}

    @Get()
    getAll(): Promise<AnimationVille[]>{
        return this.animationService.findAll();
    }

    @Get("/:id")
    getById(@Param("id", ParseIntPipe) id:number): Promise<AnimationVille> {
        return this.animationService.findById(id);
    } 

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: AnimationVilleDto})
    @ApiCreatedResponse()
    save(@Body() dto: AnimationVilleDto): Promise<AnimationVille> {
        return this.animationService.save(dto);
    }

    @Put("/:id")
    @ApiBody({type: UpdateAnimationVilleDto})
    @ApiCreatedResponse()
    update(@Param("id", ParseIntPipe) id:number, @Body() dto: UpdateAnimationVilleDto): Promise<AnimationVille> {
        return this.animationService.update(id, dto);
    }
}
