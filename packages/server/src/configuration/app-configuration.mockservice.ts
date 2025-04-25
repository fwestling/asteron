import { IAppConfigurationService } from './app-configuration.service';

export const mockConfigService: IAppConfigurationService = {
  connectionString: 'mongodb://localhost:27017',
  dbName: 'second',
  firebaseParams: {},
};
