import { PrismaService } from 'src/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookmarkDto } from 'src/auth/dto/bookmark.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async getBookmarksByUser(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });

    return bookmarks;
  }

  async getAllBookmarks() {
    const bookmarks = this.prisma.bookmark.findMany();
    return bookmarks;
  }

  async getBookmarkById(id: number, userId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id, userId },
    });

    if (!bookmark) {
      throw new NotFoundException();
    }

    delete bookmark.userId;
    return bookmark;
  }

  async createBookmark(
    userId: number,
    bookmarkDto: BookmarkDto,
  ) {
    try {
      const bookmark = await this.prisma.bookmark.create({
        data: {
          title: bookmarkDto.title,
          description: bookmarkDto.description,
          link: bookmarkDto.link,
          user: {
            connect: { id: userId },
          },
        },
        select: {
          title: true,
          description: true,
          link: true,
        },
      });
      return bookmark;
    } catch (error) {
      throw error;
    }
  }

  async editBookmark(
    userId: number,
    bookmarkId: number,
    dto: BookmarkDto,
  ) {
    try {
      const bookmark = await this.prisma.bookmark.update({
        data: {
          title: dto.title,
          description: dto.description,
          link: dto.link,
        },
        where: {
          id: bookmarkId,
          userId,
        },
      });

      return bookmark;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Bookmark not found');
        }
      }
    }
  }

  async deleteBookmark(userId: number, bookmarkId: number) {
    try {
      await this.prisma.bookmark.delete({
        where: {
          id: bookmarkId,
          userId,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Bookmark not found');
        }
      }
    }
  }

  async searchByKeyword(userId: number, keyword: string) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
        OR: [
          {
            title: {
              contains: keyword,
            },
          },
          {
            description: {
              contains: keyword,
            },
          },
        ],
      },
    });

    console.log(userId, keyword);

    return bookmarks;
  }
}
