import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Products extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  productName?: string;

  @property({
    type: 'string',
  })
  productId?: string;

  @property({
    type: 'string',
    required: true,
  })
  productCategory?: string;

  @property({
    type: 'string',
    required: true,
  })
  productImage?: string;

  @property({
    type: 'string',
    required: true,
  })
  productDescription?: string;

  @property({
    type: 'string',
    required: true,
  })
  productPrice?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Products>) {
    super(data);
  }
}

export interface ProductsRelations {
  // describe navigational properties here
}

export type ProductsWithRelations = Products & ProductsRelations;
