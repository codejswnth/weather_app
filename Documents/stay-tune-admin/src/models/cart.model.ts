import {Entity, model, property} from '@loopback/repository';

@model()
export class Cart extends Entity {
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
  productPrice?: string;

  constructor(data?: Partial<Cart>) {
    super(data);
  }
}

export interface CartRelations {
  // describe navigational properties here
}

export type CartWithRelations = Cart & CartRelations;
