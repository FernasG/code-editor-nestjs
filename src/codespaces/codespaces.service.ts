import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HackerEarthService, RequestService, StorageService, UtilsService } from '@libraries';
import { Codespaces, HackerearthRequests, UsersCodespaces } from '@database';
import {
  CreateCodespaceDto,
  HackerEarthRequestCodes,
  HackerEarthResponse,
  UpdateCodespaceDto,
  SaveCodespaceDto,
  CODE_TEMPLATE,
  User
} from './codespaces.interface';

@Injectable()
export class CodespacesService {
  constructor(
    @InjectRepository(Codespaces) private readonly codespacesRepository: Repository<Codespaces>,
    private readonly hackarEarthApi: HackerEarthService,
    private readonly requestService: RequestService,
    private readonly storageService: StorageService,
    private readonly utilsService: UtilsService,
    private readonly datasource: DataSource
  ) { }

  public async create(user: User, createCodespaceDto: CreateCodespaceDto) {
    const { name, description, language } = createCodespaceDto;

    const randomHash = this.utilsService.generateRandomString();
    const ext = language === 'python' ? 'py' : 'js';
    const filename = `${randomHash}.${ext}`;
    const code = CODE_TEMPLATE[language];

    await this.storageService.upload(filename, code);

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

    const code = await this.storageService.get(codespace.filename);

    const response = { ...codespace, code };

    return response;
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

    const source = await this.storageService.get(codespace.filename);

    if (!source) throw new InternalServerErrorException();

    const response = await this.hackarEarthApi.run(requestId, codespace.language, source);

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
      const { result: { run_status: { output, exit_code, stderr } } } = apiResponse;

      const code_output = (exit_code === "0") ? await this.requestService.get(output) : stderr;

      await this.datasource.getRepository(HackerearthRequests).update(hackerearthRequest.id, { code_output });
    }

    return { message: 'OK' };
  }

  public async remove(id: string) {
    const codespace = await this.codespacesRepository.findOne({ where: { id } });

    if (!codespace) throw new NotFoundException();

    const usersCodespaces = await this.datasource.getRepository(UsersCodespaces).find({
      where: { codespace_id: codespace.id }
    });

    await this.storageService.delete(codespace.filename);
    await this.datasource.getRepository(UsersCodespaces).remove(usersCodespaces);
    const deleteResult = await this.codespacesRepository.softDelete(id);

    if (!deleteResult) throw new InternalServerErrorException();

    return {};
  }

  public async request(id: string, request_id: string) {
    const codespace = await this.codespacesRepository.findOne({ where: { id } });

    if (!codespace) throw new NotFoundException();

    const request = await this.datasource.getRepository(HackerearthRequests).findOneBy({ id: request_id });

    if (!request) throw new NotFoundException();

    return request;
  }

  public async save(saveCodespaceDto: SaveCodespaceDto) {
    const { id, code } = saveCodespaceDto;

    const codespace = await this.codespacesRepository.findOneBy({ id });

    if (!codespace) throw new NotFoundException();

    await this.storageService.upload(codespace.filename, code);

    return {};
  }
}