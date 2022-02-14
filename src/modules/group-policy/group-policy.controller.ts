import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { GroupPolicyService } from './group-policy.service';
import { CreateGroupPolicyDto } from './dto/create-group-policy.dto';
import { UpdateGroupPolicyDto } from './dto/update-group-policy.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags("Group Policy")
@Controller('group-policy')
export class GroupPolicyController {
  constructor(private readonly groupPolicyService: GroupPolicyService) {}

  @Post()
  create(@Body() data: CreateGroupPolicyDto,@Req() req) {
    return this.groupPolicyService.create(data,req);
  }

  @Get()
  findAll() {
    return this.groupPolicyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupPolicyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupPolicyDto: UpdateGroupPolicyDto) {
    return this.groupPolicyService.update(+id, updateGroupPolicyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupPolicyService.remove(+id);
  }
}
