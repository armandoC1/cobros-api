import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // Módulo para manejar variables de entorno
import { AuthModule } from './auth/auth.module'; // Módulo de autenticación
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './Users/user.module';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Hace las variables accesibles en todo el proyecto
    }),

    // Configuración de TypeORM
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true, // Carga automática de entidades
      synchronize: true, // Sincronización automática de esquemas (desactiva en producción)
    }),

    // Importar módulos de funcionalidad
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
