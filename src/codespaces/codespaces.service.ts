import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Codespaces, HackerearthRequests, UsersCodespaces } from '@database';
import { CreateCodespaceDto, HackerEarthRequestCodes, HackerEarthResponse, UpdateCodespaceDto, User } from './codespaces.interface';
import { RequestService, UtilsService } from '@libraries';

@Injectable()
export class CodespacesService {
  constructor(
    @InjectRepository(HackerearthRequests) private readonly hackerearthRequestsRepository: Repository<HackerearthRequests>,
    @InjectRepository(Codespaces) private readonly codespacesRepository: Repository<Codespaces>,
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

    const hackerearthRequest = await this.datasource.getRepository(HackerearthRequests).save({});

    if (!hackerearthRequest) throw new InternalServerErrorException();

    const url = 'partner/code-evaluation/submissions/';
    const callback = this.configService.get<string>('hackerearth_callback_url');
    const lang = codespace.language.toUpperCase();
    const { id: requestId } = hackerearthRequest;

    const response: HackerEarthResponse = await this.requestService.post(url, {
      lang, source: 'print("Hello World!")', time_limit: 15, context: requestId, callback
    });

    if (!response) throw new InternalServerErrorException();

    const { request_status: { code } } = response;

    if (code !== HackerEarthRequestCodes.QUEUED) throw new InternalServerErrorException();

    await this.datasource.getRepository(HackerearthRequests).update(requestId, { queue_response: response });



    return {};
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

    return {};
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

  public async save(id: string, code: string) {
    const codespace = await this.codespacesRepository.findOneBy({ id });

    if (!codespace) throw new NotFoundException();
  }

  private async waitHackerEarth() {

  }
}
