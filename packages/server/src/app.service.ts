import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(/*private configService: AppConfigurationService*/) {
    // admin.initializeApp({
    //   credential: admin.credential.cert(configService.firebase_params),
    // });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
