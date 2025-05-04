import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private async validateUser(userName: string, pass: string) {
    const user = await this.prisma.user.findFirst({
      where: { userName: userName, deletedAt: null },
    });
    if (user && (await bcrypt.compare(pass, user.password))) return user;
    throw new UnauthorizedException('Wrong credentials');
  }

  async login(userName: string, pass: string): Promise<AuthResponseDto> {
    const user = await this.validateUser(userName, pass);
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwt.sign(payload),
    };
  }

  async register(user: RegisterDto): Promise<AuthResponseDto> {
    const hash = await bcrypt.hash(user.password, 10);
    const existingUserName = await this.prisma.user.findFirst({
      where: { userName: user.userName },
    });
    if (existingUserName) {
      throw new BadRequestException('User already exists');
    }
    if (new Date(user.birthDate) > new Date()) {
      throw new BadRequestException('Birth date must be in the past');
    }
    const newUser = await this.prisma.user.create({
      data: { ...user, password: hash },
    });
    return {
      access_token: this.jwt.sign({ sub: newUser.id, role: newUser.role }),
    };
  }
}
