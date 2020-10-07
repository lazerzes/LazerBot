export class Bucket {

  private shouldPersist: boolean;
  private bucket: {[key: string]: any};
  private onAddHandler?: (key: string, data: any) => void;

  constructor(data: {[key: string]: any}, shouldPersist: boolean, onAddHandler?: (key: string, data: any) => void) {
    this.shouldPersist = shouldPersist;
    this.bucket = data;
    this.onAddHandler = onAddHandler;
  }

  public toPersist(): any | undefined {
    return this.shouldPersist ? this.bucket : undefined;
  }

  public loadFromPersist(persistData: any): void {
    if (this.shouldPersist) {
      Object.keys(persistData).forEach((key: string) => {
        this.set(key, persistData[key]);
      });
    }
  }

  public set(key: string, data: any): void {

    if (this.onAddHandler) {
      this.onAddHandler(key, data);
    } else {
      this.bucket[key] = data;
    }

  }

  public get(key: string): any | undefined{
    return this.bucket[key] ?? undefined;
  }

  public has(key: string): boolean {
    return this.get(key) !== undefined;
  }


}
