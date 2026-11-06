import { describe, it, expect } from 'vitest';
import { calculateCartSubtotal, toCreateOrderDto } from './cart.utils';
import { ProductDto } from '../../../core/types/dtos/product.dto';
import { CartItem } from '../types/cart-item.type';

function buildProduct(overrides: Partial<ProductDto> = {}): ProductDto {
    return {
        id: 'product-1',
        name: 'Product',
        description: 'Description',
        price: 10,
        weight: 1,
        category: { id: 'cat-1', name: 'Category', description: 'Category description' },
        supplier: {
            id: 'sup-1',
            name: 'Supplier',
            contactEmail: 'supplier@example.com',
            phone: '+1-555-0000',
            address: '1 Supplier Way'
        },
        imageUrl: 'image.png',
        ...overrides
    };
}

describe('calculateCartSubtotal', () => {
    it('calculateCartSubtotal_returnsSummedTotal_whenAllItemsMatchProducts', () => {
        // Arrange
        const products = [
            buildProduct({ id: 'p1', price: 10 }),
            buildProduct({ id: 'p2', price: 5.5 })
        ];
        const productsById = new Map(products.map(product => [product.id, product]));
        const items: CartItem[] = [
            { productId: 'p1', quantity: 2 },
            { productId: 'p2', quantity: 3 }
        ];

        // Act
        const result = calculateCartSubtotal(items, productsById);

        // Assert
        expect(result).toBe('36.50');
    });

    describe('toCreateOrderDto', () => {
        it('toCreateOrderDto_returnsItemsAndAddress_whenCartHasItems', () => {
            const address = {
                country: 'Romania',
                city: 'Cluj-Napoca',
                county: 'Cluj',
                streetAddress: 'Strada Memorandumului 1'
            };
            const items: CartItem[] = [{ productId: 'p1', quantity: 2 }];

            const result = toCreateOrderDto(items, address);

            expect(result).toEqual({ items, address });
        });

        it('toCreateOrderDto_returnsNull_whenCartIsEmpty', () => {
            const address = {
                country: 'Romania',
                city: 'Cluj-Napoca',
                county: 'Cluj',
                streetAddress: 'Strada Memorandumului 1'
            };

            expect(toCreateOrderDto([], address)).toBeNull();
        });
    });

    it('calculateCartSubtotal_returnsZero_whenItemsIsEmpty', () => {
        // Arrange
        const productsById = new Map<string, ProductDto>();

        // Act
        const result = calculateCartSubtotal([], productsById);

        // Assert
        expect(result).toBe('0.00');
    });

    it('calculateCartSubtotal_skipsItem_whenProductIsMissingFromMap', () => {
        // Arrange
        const product = buildProduct({ id: 'p1', price: 10 });
        const productsById = new Map([[product.id, product]]);
        const items: CartItem[] = [
            { productId: 'p1', quantity: 1 },
            { productId: 'missing', quantity: 5 }
        ];

        // Act
        const result = calculateCartSubtotal(items, productsById);

        // Assert
        expect(result).toBe('10.00');
    });

    it('calculateCartSubtotal_returnsZero_whenNoProductsMatchAnyItem', () => {
        // Arrange
        const productsById = new Map<string, ProductDto>();
        const items: CartItem[] = [{ productId: 'unknown', quantity: 2 }];

        // Act
        const result = calculateCartSubtotal(items, productsById);

        // Assert
        expect(result).toBe('0.00');
    });

    it('calculateCartSubtotal_roundsToTwoDecimals_whenTotalHasMorePrecision', () => {
        // Arrange
        const product = buildProduct({ id: 'p1', price: 0.1 });
        const productsById = new Map([[product.id, product]]);
        const items: CartItem[] = [{ productId: 'p1', quantity: 3 }];

        // Act
        const result = calculateCartSubtotal(items, productsById);

        // Assert
        expect(result).toBe('0.30');
    });
});
