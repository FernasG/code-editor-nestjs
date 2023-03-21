import { Users } from '@database';
import { Repository } from 'typeorm';
import { CreateUserDto, ENCRYPT_SALT_ROUNDS } from './users.interface';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private readonly usersRepository: Repository<Users>) { }

  async create(createUserDto: CreateUserDto) {
    const { email, username, password: pass } = createUserDto;

    const emailAlreadyTaken = await this.usersRepository.findOne({ where: { email } });

    if (emailAlreadyTaken) throw new BadRequestException();

    const password = bcrypt.hashSync(pass, ENCRYPT_SALT_ROUNDS);

    const user = await this.usersRepository.save({ email, username, password });

    if (!user) throw new InternalServerErrorException();

    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: object) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
