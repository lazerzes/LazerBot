import { Bucket } from './bucket';
export class BucketManager {

  private buckets: {[key: string]: Bucket};

  constructor() {
    this.buckets = {};
  }

  public addBuckets(buckets: {bucketId: string, bucket: Bucket}[]): void {
    buckets.forEach(bucket => this.addBucket(bucket.bucketId, bucket.bucket));
  }

  public addBucket(bucketId: string, bucket: Bucket): void {

    if (this.hasBucket(bucketId)) {
      console.log(this.buckets);
      throw new Error(`Unable to add bucket(${bucketId}), duplicate id`);
    }

    this.buckets[bucketId] = bucket;

  }

  public hasBucket(bucketId: string): boolean {
    return this.getBucket(bucketId) !== undefined;
  }

  public getBucket(bucketId: string): Bucket | undefined {
    return this.buckets[bucketId] ?? undefined;
  }

  public addDataToBucket(bucketId: string, dataId: string, data: any): void {
    this.getBucket(bucketId)?.set(dataId, data);
  }

  public getPersistData(): {[key: string]: any} {

    return Object.keys(this.buckets)
      .map(key => {
        const persist = this.getBucket(key)?.toPersist() ?? undefined;
        return persist !== undefined ? ({[key]: persist}) : undefined;
      }).reduce((prev, curr) => curr ? Object.assign(prev, {...prev, ...curr}) : prev, {}) ?? {};

  }

  public loadPersistData(persist: any): void {
    Object.keys(persist).forEach((key: string) => {
      this.getBucket(key)?.loadFromPersist(persist[key]);
    });
  }

}
