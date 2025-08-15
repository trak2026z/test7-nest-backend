import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'test_db'),
        autoLoadEntities: true,
        synchronize: config.get<string>('TYPEORM_SYNC') === 'true',
        logging:
          config.get<string>('TYPEORM_LOGGING') === 'true' ||
          config.get<string>('NODE_ENV') !== 'production',
      }),
    }),

    UserModule,
  ],
})
export class AppModule {}