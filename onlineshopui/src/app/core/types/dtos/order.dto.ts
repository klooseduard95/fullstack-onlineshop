import { AddressDto, LocationDto } from './location.dto';
import { ProductDto } from './product.dto';

export type OrderDto = {
    id: string;
    userId: string;
    createdAt: string;
    // Historical orders may have been created before delivery addresses were required.
    address: AddressDto | null;
    details?: OrderDetailsDto[];
};

export type OrderDetailsDto = {
    orderId: string;
    product: ProductDto;
    shippedFrom: LocationDto;
    quantity: number;
};

export type CreateOrderItemDto = {
    productId: string;
    quantity: number;
};

export type CreateOrderDto = {
    items: CreateOrderItemDto[];
    address: AddressDto;
};
