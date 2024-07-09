export class CreateStoreDto {
  readonly name: string;
  readonly location?: string;
  readonly following: number;
  readonly like: number;
}
