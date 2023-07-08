import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Users, Roles, UsersRoles } from '@database';
import { CreateUserDto, ENCRYPT_SALT_ROUNDS, UpdateUserDto } from './users.interface';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { Role } from '@guards';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    private readonly datasource: DataSource
  ) { }

  public async create(createUserDto: CreateUserDto) {
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

  public async findAll() {
    return this.usersRepository.find();
  }

  public async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException();

    return user;
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException();

    const { username, password: pass } = updateUserDto;

    const password = bcrypt.hashSync(pass, ENCRYPT_SALT_ROUNDS);

    const updateResult = await this.usersRepository.update(id, { username, password });

    if (!updateResult) throw new InternalServerErrorException();

    return user;
  }

  public async remove(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException();

    const deleteResult = await this.usersRepository.softDelete(id);

    if (!deleteResult) throw new InternalServerErrorException();

    return;
  }
}
