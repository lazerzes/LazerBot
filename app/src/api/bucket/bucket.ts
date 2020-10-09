/**
 * Used for creating a storage bucket that the bot will keep track of.
 * @attr shouldPersist A boolean that tells the bot if it should save this bucket between sessions.
 *
 * @attr bucket A key-value pair object to store data in. Persistent Buckets must be compatible with JSON.stringify
 *
 * @optional onAddHandler A function that will handle adding data to the bucket. Default is basic assign.
 *
 * @public
 */
export class Bucket {

  private shouldPersist: boolean;
  private bucket: { [key: string]: unknown };
  private onAddHandler?: (key: string, data: unknown) => void;

  constructor(data: { [key: string]: unknown }, shouldPersist: boolean, onAddHandler?: (key: string, data: unknown) => void) {
    this.shouldPersist = shouldPersist;
    this.bucket = data;
    this.onAddHandler = onAddHandler;
  }

  /**
   * Get the persist object of this bucket.
   *
   * @returns the bucket or undefined if the bucket should not persist
   */
  public toPersist(): unknown | undefined {
    return this.shouldPersist ? this.bucket : undefined;
  }

  /**
   * Loads data into the bucket if the bucket persists
   * @param persistData the data to load
   */
  public loadFromPersist(persistData: {[key: string]: unknown}): void {
    if (this.shouldPersist) {
      Object.keys(persistData).forEach((key: string) => {
        this.set(key, persistData[key]);
      });
    }
  }

  /**
   * Adds a key-value pair to the bucket, uses the onAddHandler if provided
   * @param key the key to add the data at
   * @param data the data to add
   */
  public set(key: string, data: unknown): void {

    if (this.onAddHandler) {
      this.onAddHandler(key, data);
    } else {
      this.bucket[key] = data;
    }

  }

  /**
   * Gets a value for a passed key
   * @param key the key we are trying to get the value of
   *
   * @returns the value at the key or undefined if no value is found
   */
  public get(key: string): unknown | undefined {
    return this.bucket[key] ?? undefined;
  }

  /**
   * Checks if the bucket contains the passed key
   * @param key the key we are checking
   */
  public has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Removes the key-value pair with the passed key
   * @param key the key to remove
   */
  public remove(key: string): void {
    if (this.has(key)) {
      delete this.bucket[key];
    }
  }


  /**
   * Gets all the keys in the bucket.
   *
   * @returns an array of all keys(string) in the bucket
   */
  public keys(): string[] {
    return Object.keys(this.bucket);
  }

}
