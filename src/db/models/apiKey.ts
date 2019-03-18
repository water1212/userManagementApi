import {Entity, Column, PrimaryGeneratedColumn, getRepository, Repository} from "typeorm";
import * as crypto from 'crypto';

@Entity()
export class ApiKey {
  /**
   * @brief The id in the database
   */
  @PrimaryGeneratedColumn()
  public id: number;

  /**
   * @brief The actual 256 bit hex encoded key
   */
  @Column()
  public key: string;
  
  /**
   * @brief Is the key currently active, or has it been disabled
   */
  @Column()
  public isActive: boolean;

  /**
   * @brief UTC timestamp
   */
  @Column()
  public created: number;

  /**
   * @brief Checks to see if a given string is a valid api key
   * @param key Api Key to check for validity
   * @returns If the key is valid or not
   */
  public static async isKeyValid(key: string): Promise<boolean> {
    let foundKey = await ApiKey.findByKey(key);

    //if we found the key in the database, AND the key is active, we have a valid key
    return foundKey && foundKey.isActive;
  }

  /**
   * @brief Finds a record in the database associated with the given api key
   * @param key Api key to look for
   * @returns Found ApiKey or undefined
   */
  public static async findByKey(key: string): Promise<ApiKey | undefined> {
    let repo: Repository<ApiKey> = getRepository(ApiKey);
    return await repo.findOne({key: key});
  }

  /**
   * @brief Saves an api key object into the ApiKey table in the database
   * @param key Key to save
   */
  public static async saveToDB(key: ApiKey) {
    let repo: Repository<ApiKey> = getRepository(ApiKey);
    await repo.save(key);
  }

  /**
   * @brief Deletes a key from the database
   * @param key Key to delete
   */
  public static async deleteFromDB(key: ApiKey) {
    let repo: Repository<ApiKey> = getRepository(ApiKey);
    await repo.delete(key);
  }

  /**
   * @brief Creates a new ApiKey
   * @returns Newly created ApiKey
   */
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