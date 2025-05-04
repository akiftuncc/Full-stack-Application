import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(id: string): Promise<UserResponseDto> {
    const profile = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        name: true,
        surname: true,
        userName: true,
        birthDate: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return profile;
  }

  private async checkUserName(id: string, updateProfileDto: UpdateProfileDto) {
    if (updateProfileDto.userName) {
      const user = await this.prisma.user.findFirst({
        where: { id },
      });

      if (!(user?.userName === updateProfileDto.userName)) {
        const isUserNameTaken = await this.prisma.user.findFirst({
          where: { userName: updateProfileDto.userName, deletedAt: null },
        });

        if (isUserNameTaken) {
          throw new BadRequestException(
            'This username is already taken, please choose another one',
          );
        }
      }
    }
  }

  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    await this.getProfile(id);

    await this.checkUserName(id, updateProfileDto);

    if (updateProfileDto.birthDate) {
      if (new Date(updateProfileDto.birthDate) > new Date()) {
        throw new BadRequestException('Birth date cannot be in the future');
      }
    }

    if (updateProfileDto.password) {
      updateProfileDto.password = await bcrypt.hash(
        updateProfileDto.password,
        10,
      );
    }

    const updatedProfile = await this.prisma.user.update({
      where: { id },
      data: updateProfileDto,
      select: {
        id: true,
        name: true,
        surname: true,
        birthDate: true,
        userName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedProfile;
  }
}
