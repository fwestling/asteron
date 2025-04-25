import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface IAppConfigurationService {
  connectionString: string;
  dbName: string;
  firebaseParams: object;
}

@Injectable()
export class AppConfigurationService implements IAppConfigurationService {
  private readonly _connectionString: string;
  private readonly _dbName: string;
  private readonly _firebaseParams: object;
  // private readonly _cloudStorageProjectId: string;

  get connectionString(): string {
    return this._connectionString;
  }
  get dbName(): string {
    return this._dbName;
  }
  get firebaseParams(): object {
    return this._firebaseParams;
  }
  // get cloudStorageProjectId(): string {
  //   return this._cloudStorageProjectId;
  // }

  constructor(private readonly _configService: ConfigService) {
    this._connectionString = this._getConnectionStringFromEnv();
    this._dbName = this._getDbNameFromEnv();
    this._firebaseParams = this._getFirebaseParamsFromEnv();
    // this._cloudStorageProjectId = this._getCloudStorageProjectIdFromEnv();
  }

  private _getConnectionStringFromEnv(): string {
    const connectionString = this._configService.get<string>('MONGO_URI');
    if (!connectionString)
      throw new Error(
        'No connection string has been provided in the environment',
      );
    return connectionString;
  }
  private _getDbNameFromEnv(): string {
    const dbName = this._configService.get<string>('MONGO_DB');
    if (!dbName)
      throw new Error('No database name been provided in the environment');
    return dbName;
  }
  private _getFirebaseParamsFromEnv(): object {
    const firebaseParamsString = this._configService.get<string>(
      'GOOGLE_APPLICATION_CREDENTIALS',
    );
    if (!firebaseParamsString)
      throw new Error('No firebase config been provided in the environment');
    return JSON.parse(firebaseParamsString);
  }

  private _getCloudStorageProjectIdFromEnv(): string {
    const cloudStorageProjectId = this._configService.get<string>(
      'CLOUD_STORAGE_PROJECT_ID',
    );
    if (!cloudStorageProjectId)
      throw new Error(
        'No cloud storage project id been provided in the environment',
      );
    return cloudStorageProjectId;
  }
}
