import { Controller, Get, Res } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NoAuth } from 'src/guards/no-auth.guard';
import { AppHelpers } from 'src/helpers/app.helpers';
import { AuthService } from '../auth/auth.service';

@Controller()
@ApiBearerAuth()
export class AppController {
  constructor(private authService: AuthService) {}

  @NoAuth()
  @Get()
  getHello(@Res() res) {
    res.redirect('/api');
  }

  @Get('current-time')
  currentTime(): string {
    return AppHelpers.getCurrentDateTime();
  }
}
