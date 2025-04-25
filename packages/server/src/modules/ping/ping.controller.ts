import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { FirebaseAuthGuard } from '~/modules/auth/firebase-auth.guard';

@ApiTags('Ping')
@Controller('ping')
export class PingController {
  @Get('')
  @ApiOkResponse({ type: String })
  ping(): string {
    return 'Pong!';
  }

  @Get('protected')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: String })
  protected(@Req() req: Request): string {
    return `Protected Pong}!`;
  }
}
