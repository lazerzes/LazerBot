import { Bucket } from './bucket';

/**
 * Manages Buckets For The Bot
 *
 * @attr buckets all the buckets being managed by the bot, stored as key-value pairs
 */
export class BucketManager {

  private buckets: {[key: string]: Bucket};

  constructor() {
    this.buckets = {};
  }

  /**
   * Adds multiple buckets, shorthand, uses the addBucket method.
   * @param buckets buckets to add
   * @throws An Error if a duplicate ID is found.
   */
  public addBuckets(buckets: {bucketId: string, bucket: Bucket}[]): void {
    buckets.forEach(bucket => this.addBucket(bucket.bucketId, bucket.bucket));
  }

  /**
   * Adds a bucket to the bucket manager.
   * @param bucketId the id of the bucket to add
   * @param bucket the bucket to add
   *
   * @throws An Error if a duplicate ID is being added.
   */
  public addBucket(bucketId: string, bucket: Bucket): void {

    if (this.hasBucket(bucketId)) {
      throw new Error(`Unable to add bucket(${bucketId}), duplicate id`);
    }

    this.buckets[bucketId] = bucket;

  }

  /**
   * Checks if a bucketId is being managed by the bucket manager.
   * @param bucketId the id to check
   */
  public hasBucket(bucketId: string): boolean {
    return this.getBucket(bucketId) !== undefined;
  }

  /**
   * Gets the bucket with the passed id
   * @param bucketId the id of the bucket you want to get
   *
   * @returns the bucket or undefined if no bucket is found
   */
  public getBucket(bucketId: string): Bucket | undefined {
    return this.buckets[bucketId] ?? undefined;
  }

  /**
   * Adds data to the specified bucket with the specified dataId, uses the buckets set method.
   * @param bucketId the id of the bucket you want to add to
   * @param dataId the id of the data you want to add
   * @param data the data you want to add
   */
  public addDataToBucket(bucketId: string, dataId: string, data: any): void {
    this.getBucket(bucketId)?.set(dataId, data);
  }

  /**
   * Gets a master object of all data to be persisted, respects the bucket's persist method.
   *
   * @returns the data to be persisted.
   */
  public getPersistData(): {[key: string]: any} {

    return Object.keys(this.buckets)
      .map(key => {
        const persist = this.getBucket(key)?.toPersist() ?? undefined;
        return persist !== undefined ? ({[key]: persist}) : undefined;
      }).reduce((prev, curr) => curr ? Object.assign(prev, {...prev, ...curr}) : prev, {}) ?? {};

  }

  /**
   * Loads data into the buckets, respects the bucket's persist method.
   *
   * @param persist the data to load
   */
  public loadPersistData(persist: any): void {
    Object.keys(persist).forEach((key: string) => {
      this.getBucket(key)?.loadFromPersist(persist[key]);
    });
  }

}
