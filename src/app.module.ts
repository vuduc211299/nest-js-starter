import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './users/user.controller';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BookmarksModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, AuthService, UsersService],
})
export class AppModule {}
