export class CreateProductDto {
  readonly name: string;
  readonly description?: string;
  readonly price: number;
  readonly rating?: number;
  readonly quantity: number;
  readonly category: string;
  imageUrl: string;
  readonly store: string;
}
