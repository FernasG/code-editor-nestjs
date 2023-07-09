import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateCodespaceDto, HackerEarthRequestCodes, HackerEarthResponse, SaveCodespaceDto, UpdateCodespaceDto, User } from './codespaces.interface';
import { HackerEarthService, RequestService, UtilsService } from '@libraries';
import { Codespaces, HackerearthRequests, UsersCodespaces } from '@database';

@Injectable()
export class CodespacesService {
  constructor(
    @InjectRepository(Codespaces) private readonly codespacesRepository: Repository<Codespaces>,
    private readonly hackarEarthApi: HackerEarthService,
    private readonly requestService: RequestService,
    private readonly configService: ConfigService,
    private readonly utilsService: UtilsService,
    private readonly datasource: DataSource
  ) { }

  public async create(user: User, createCodespaceDto: CreateCodespaceDto) {
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

  public async findAll(user: User) {
    const userCodespaces = await this.datasource.getRepository(UsersCodespaces).find({
      where: { user_id: user.id }, select: ['codespace_id']
    });

    if (!userCodespaces) return [];

    const codespacesIds = userCodespaces.map(userCodespace => userCodespace.codespace_id);
    const codespaces = await this.codespacesRepository.find({ where: { id: In(codespacesIds) } });

    return codespaces;
  }

  public async findOne(id: string) {
    const codespace = await this.codespacesRepository.findOne({ where: { id } });

    if (!codespace) throw new NotFoundException();

    return codespace;
  }

  public async update(id: string, updateCodespaceDto: UpdateCodespaceDto) {
    const codespace = await this.codespacesRepository.findOne({ where: { id } });

    if (!codespace) throw new NotFoundException();

    const { name, description } = updateCodespaceDto;

    if (name) codespace.name = name;
    if (description) codespace.description = description;

    const updateResult = await this.codespacesRepository.save(codespace);

    if (!updateResult) throw new InternalServerErrorException();

    return {};
  }

  public async run(id: string) {
    const codespace = await this.codespacesRepository.findOne({ where: { id } });

    if (!codespace) throw new NotFoundException();

    const hackerEarthRequest = await this.datasource.getRepository(HackerearthRequests).save({ codespace_id: codespace.id });

    if (!hackerEarthRequest) throw new InternalServerErrorException();

    const { id: requestId } = hackerEarthRequest;

    const response = await this.hackarEarthApi.run(requestId, codespace.language, 'print("Hello World!")');

    if (!response) throw new InternalServerErrorException();

    const { request_status: { code } } = response;

    if (code !== HackerEarthRequestCodes.QUEUED) throw new InternalServerErrorException();

    await this.datasource.getRepository(HackerearthRequests).update(requestId, { queue_response: response });

    return { request: hackerEarthRequest };
  }

  public async callback(apiResponse: HackerEarthResponse) {
    const { context, request_status: { code } } = apiResponse;

    const heRequestsRepository = this.datasource.getRepository(HackerearthRequests);

    const hackerearthRequest = await heRequestsRepository.findOneBy({ id: context });

    if (!hackerearthRequest) throw new NotFoundException();

    const { COMPILED, COMPLETED } = HackerEarthRequestCodes;

    if (![COMPILED, COMPLETED].includes(code as HackerEarthRequestCodes)) throw new InternalServerErrorException();

    const fieldName = (code === COMPILED) ? 'compilation_response' : 'execution_response';

    await heRequestsRepository.update(hackerearthRequest.id, { [fieldName]: apiResponse });

    if (code === COMPLETED) {
      const { result: { run_status: { output } } } = apiResponse;

      const response = await this.requestService.get(output);

      await this.datasource.getRepository(HackerearthRequests).update(hackerearthRequest.id, { code_output: response });
    }

    return { message: 'OK' };
  }

  public async remove(id: string) {
    const codespace = await this.codespacesRepository.findOne({ where: { id } });

    if (!codespace) throw new NotFoundException();

    const usersCodespaces = await this.datasource.getRepository(UsersCodespaces).find({
      where: { codespace_id: codespace.id }
    });

    await this.datasource.getRepository(UsersCodespaces).remove(usersCodespaces);
    const deleteResult = await this.codespacesRepository.softDelete(id);

    if (!deleteResult) throw new InternalServerErrorException();

    return {};
  }

  public async save(saveCodespaceDto: SaveCodespaceDto) {
    const { id, code } = saveCodespaceDto;

    const codespace = await this.codespacesRepository.findOneBy({ id });

    if (!codespace) throw new NotFoundException();
  }
}