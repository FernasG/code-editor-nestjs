import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Users, Roles, UsersRoles } from '@database';
import { CreateUserDto, ENCRYPT_SALT_ROUNDS } from './users.interface';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { Role } from '@guards';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    private readonly datasource: DataSource  
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { email, username, password: pass } = createUserDto;

    const emailAlreadyTaken = await this.usersRepository.findOne({ where: { email } });

    if (emailAlreadyTaken) throw new BadRequestException();

    const password = bcrypt.hashSync(pass, ENCRYPT_SALT_ROUNDS);

    const user = await this.usersRepository.save({ email, username, password });

    if (!user) throw new InternalServerErrorException();

    const role = await this.datasource.getRepository(Roles).findOne({ where: { name: Role.User } });

    if (!role) throw new BadRequestException();

    const userRole = await this.datasource.getRepository(UsersRoles).save({ user_id: user.id, role_id: role.id });

    if (!userRole) throw new InternalServerErrorException();

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
