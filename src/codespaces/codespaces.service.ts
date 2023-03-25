import { Codespaces, UsersCodespaces } from '@database';
import { UtilsService } from '@libraries';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { CreateCodespaceDto, UpdateCodespaceDto, User } from './codespaces.interface';

@Injectable()
export class CodespacesService {
  constructor(
    @InjectRepository(Codespaces) private readonly codespacesRepository: Repository<Codespaces>,
    private readonly utilsService: UtilsService,
    private readonly datasource: DataSource
  ) { }

  async create(user: User, createCodespaceDto: CreateCodespaceDto) {
    const { name, description, language } = createCodespaceDto;

    const randomHash = this.utilsService.generateRandomString();
    const filename = `${randomHash}.py`;

    const codespace = await this.codespacesRepository.save({ name, description, language, filename });

    if (!codespace) throw new InternalServerErrorException();

    const insertResult = await this.datasource.getRepository(UsersCodespaces).insert({
      codespace_id: codespace.id, user_id: user.id, codespace_owner: true
    });

    if (!insertResult) throw new InternalServerErrorException();

    return codespace;
  }

  async findAll(user: User) {
    const userCodespaces = await this.datasource.getRepository(UsersCodespaces).find({
      where: { user_id: user.id }, select: ['codespace_id']
    });

    if (!userCodespaces) return [];

    const codespacesIds = userCodespaces.map(userCodespace => userCodespace.codespace_id);
    const codespaces = await this.codespacesRepository.find({ where: { id: In(codespacesIds) } });

    return codespaces;
  }

  async findOne(id: string) {
    const codespace = await this.codespacesRepository.findOne({ where: { id } });

    if (!codespace) throw new NotFoundException();

    return codespace
  }

  async update(id: string, updateCodespaceDto: UpdateCodespaceDto) {
    const codespace = await this.codespacesRepository.findOne({ where: { id } });

    if (!codespace) throw new NotFoundException();

    const { name, description } = updateCodespaceDto;

    if (name) codespace.name = name;
    if (description) codespace.description = description;

    const updateResult = await this.codespacesRepository.save(codespace);
  
    if (!updateResult) throw new InternalServerErrorException();

    return {};
  }

  async remove(id: string) {
    const codespace = await this.codespacesRepository.findOne({ where: { id } });

    if (!codespace) throw new NotFoundException();

    const deleteResult = await this.codespacesRepository.softDelete(id);

    return {};
  }
}
