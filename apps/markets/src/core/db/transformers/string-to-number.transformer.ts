export class StringToNumberTransformer {
  public to(entityValue: number): number {
    return entityValue;
  }

  public from(databaseValue: string | null): number | null {
    if (databaseValue === null) return null;

    return parseInt(databaseValue, 10);
  }
}
