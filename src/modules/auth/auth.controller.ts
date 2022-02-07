import { Body, Controller, Get, Post, Req, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoAuth } from 'src/guards/no-auth.guard';
import { AuthService } from '../auth/auth.service';
import { SignInDto } from './dto/signIn.dto';

@ApiBearerAuth()
@ApiTags("Authentication")
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @NoAuth()
  @Post('auth/login')
  async login(@Body() body:SignInDto) {
    return this.authService.login(body);
  }



  @ApiBearerAuth()
  @ApiOperation({ summary: 'get id of user' })
  @Get('me')
  async me(@Request() req) {
    return this.authService.getLoggedUserDetails(req.user)
  }
}
