import { PartialType } from '@nestjs/swagger';
import { CreateGroupPolicyDto } from './create-group-policy.dto';

export class UpdateGroupPolicyDto extends PartialType(CreateGroupPolicyDto) {}
