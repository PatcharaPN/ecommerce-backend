import { User } from 'src/user/schemas/user.schema';

export class CreateStoreDto {
  readonly name: string;
  readonly location?: string;
  readonly following: number;
  readonly like: number;
  owner: string;
}
