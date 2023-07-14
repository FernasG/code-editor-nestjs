import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CreateCodespaceDto, HackerEarthResponse, SaveCodespaceDto, UpdateCodespaceDto } from './codespaces.interface';
import { CodespacesService } from './codespaces.service';
import { Public } from '@guards';

@Controller('codespaces')
export class CodespacesController {
  constructor(private readonly codespacesService: CodespacesService) { }

  @Post()
  create(@Req() req: any, @Body() createCodespaceDto: CreateCodespaceDto) {
    return this.codespacesService.create(req.user, createCodespaceDto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.codespacesService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.codespacesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCodespaceDto: UpdateCodespaceDto) {
    return this.codespacesService.update(id, updateCodespaceDto);
  }

  @Patch('run/:id')
  run(@Param('id') id: string) {
    return this.codespacesService.run(id);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('callback')
  callback(@Body() apiResponse: HackerEarthResponse) {
    return this.codespacesService.callback(apiResponse);
  }

  @HttpCode(HttpStatus.OK)
  @Post('save')
  save(@Body() saveCodespaceDto: SaveCodespaceDto) {
    return this.codespacesService.save(saveCodespaceDto);
  }

  @Get('request/:id')
  request(@Param('id') id: string, @Query('request_id') request_id: string) {
    return this.codespacesService.request(id, request_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.codespacesService.remove(id);
  }
}
