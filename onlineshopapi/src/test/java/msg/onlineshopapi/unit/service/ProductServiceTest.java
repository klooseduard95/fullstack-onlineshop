package msg.onlineshopapi.unit.service;

import msg.onlineshopapi.exception.ResourceNotFoundException;
import msg.onlineshopapi.model.Product;
import msg.onlineshopapi.model.Supplier;
import msg.onlineshopapi.repository.OrderDetailRepository;
import msg.onlineshopapi.repository.ProductRepository;
import msg.onlineshopapi.repository.SupplierRepository;
import msg.onlineshopapi.service.ProductService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderDetailRepository orderDetailRepository;

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private ProductService productService;

    private final UUID supplierId = UUID.randomUUID();

    @Test
    void save_persistsProduct_whenSupplierExists() {
        Supplier supplier = Supplier.builder()
                .id(supplierId)
                .name("TechSource")
                .contactEmail("sales@techsource.example.com")
                .build();
        Product product = Product.builder()
                .name("Laptop")
                .supplier(Supplier.builder().id(supplierId).build())
                .build();

        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(productRepository.save(product)).thenReturn(product);

        Product result = productService.save(product);

        assertThat(result).isEqualTo(product);
        assertThat(result.getSupplier()).isSameAs(supplier);
    }

    @Test
    void save_throwsResourceNotFound_whenSupplierDoesNotExist() {
        Product product = Product.builder()
                .name("Laptop")
                .supplier(Supplier.builder().id(supplierId).build())
                .build();

        when(supplierRepository.findById(supplierId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.save(product))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(supplierId.toString());
    }

    @Test
    void update_throwsResourceNotFound_whenSupplierDoesNotExist() {
        UUID productId = UUID.randomUUID();
        Product existing = Product.builder().id(productId).name("Laptop").build();
        Product update = Product.builder()
                .name("Updated Laptop")
                .supplier(Supplier.builder().id(supplierId).build())
                .build();

        when(productRepository.findById(productId)).thenReturn(Optional.of(existing));
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.update(productId, update))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(supplierId.toString());
    }

    @Test
    void update_persistsProduct_whenSupplierExists() {
        UUID productId = UUID.randomUUID();
        Product existing = Product.builder().id(productId).name("Laptop").build();
        Product update = Product.builder()
                .name("Updated Laptop")
                .supplier(Supplier.builder().id(supplierId).build())
                .build();
        Supplier supplier = Supplier.builder()
                .id(supplierId)
                .name("TechSource")
                .contactEmail("sales@techsource.example.com")
                .build();

        when(productRepository.findById(productId)).thenReturn(Optional.of(existing));
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Product result = productService.update(productId, update);

        assertThat(result.getName()).isEqualTo("Updated Laptop");
        assertThat(result.getSupplier()).isSameAs(supplier);
    }
}
