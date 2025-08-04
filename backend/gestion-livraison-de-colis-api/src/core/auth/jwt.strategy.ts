// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     private readonly configService: ConfigService,
//   )
//   {
//     const jwtSecret = configService.get<string>('JWT_SECRET');
    
//     if (!jwtSecret) {
//       throw new Error('JWT_SECRET environment variable is not set');
//     }
//     super(
//         {
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             secretOrKey: jwtSecret, // or a direct secret key
//         });
//   }

//   async validate(payload: any) {
//     return { userId: payload.sub, username: payload.username, role: payload.role };
//   }
// }
