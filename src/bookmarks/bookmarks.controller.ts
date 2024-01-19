import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { BookmarksService } from './bookmarks.service';
import { BookmarkDto } from 'src/auth/dto/bookmark.dto';
import { GetUser } from 'src/auth/decorator';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@UseGuards(JwtGuard, RoleGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private bookmarkService: BookmarksService) {}
  @Post('create')
  createBookmarks(
    @GetUser('id') userId: number,
    @Body() dto: BookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }
  @Get()
  getBookmarksByUser(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarksByUser(userId);
  }
  @Get(':id')
  getBookmarkById(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
    @GetUser('id') userId: number,
  ) {
    return this.bookmarkService.getBookmarkById(id, userId);
  }
  @Patch('edit/:id')
  editBookmar(
    @GetUser('id') userId: number,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    bookmarkId: number,
    @Body() dto: BookmarkDto,
  ) {
    return this.bookmarkService.editBookmark(
      userId,
      bookmarkId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:id')
  deleteBookmar(
    @GetUser('id') userId: number,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmark(
      userId,
      bookmarkId,
    );
  }

  // @UsePipes(new ValidationPipe({ transform: false }))
  @Get('search')
  searchByKeyword(
    @GetUser('id', new ParseIntPipe()) userId: number,
    @Query('q') query: string,
  ) {
    console.log(userId, query);
    return this.bookmarkService.searchByKeyword(
      userId,
      query,
    );
  }

  @Roles(['ADMIN'])
  @Get('get/all')
  getAllBookmarks() {
    return this.bookmarkService.getAllBookmarks();
  }
}
