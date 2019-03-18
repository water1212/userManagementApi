import {Entity, Column, PrimaryGeneratedColumn, getRepository, Repository} from "typeorm";
import * as crypto from 'crypto';

@Entity()
export class ApiKey {
  //let the db create this for us
  @PrimaryGeneratedColumn()
  public id: number;

  //key to give to users of API
  @Column()
  public key: string;
  
  //is this key active
  @Column()
  public isActive: boolean;

  //when was it created in UTC format
  @Column()
  public created: number;

  public static async saveToDB(key: ApiKey) {
    let repo: Repository<ApiKey> = getRepository(ApiKey);
    await repo.save(key);
  }

  public static async deleteFromDB(key: ApiKey) {
    let repo: Repository<ApiKey> = getRepository(ApiKey);
    await repo.delete(key);
  }

  public static generateApiKey(): ApiKey {
    let apiKey = new ApiKey();

    //utc timestamp
    let timestamp = Math.floor(Date.now() / 1000);
    apiKey.created = timestamp;

    //generate a 256 bit hex encoded key
    apiKey.key = crypto.randomBytes(32).toString('hex');

    //by default, we want api keys to be off until we explicitly turn them on
    apiKey.isActive = false;

    return apiKey;
  }
}