import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './user/user.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'test_db',
  entities: [User],
  migrations: ['dist/migrations/*.js'], // po buildzie
  synchronize: false,
  logging:
    process.env.TYPEORM_LOGGING === 'true' ||
    process.env.NODE_ENV !== 'production',
});
