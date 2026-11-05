package msg.onlineshopapi.unit.service;

import msg.onlineshopapi.model.Supplier;
import msg.onlineshopapi.repository.SupplierRepository;
import msg.onlineshopapi.service.SupplierService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SupplierServiceTest {

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private SupplierService supplierService;

    @Test
    void findAll_returnsAllSuppliers() {
        Supplier supplier = Supplier.builder().id(UUID.randomUUID()).name("TechSource Distributors").build();
        when(supplierRepository.findAll()).thenReturn(List.of(supplier));

        List<Supplier> result = supplierService.findAll();

        assertThat(result).containsExactly(supplier);
    }

    @Test
    void findById_returnsSupplier_whenFound() {
        UUID supplierId = UUID.randomUUID();
        Supplier supplier = Supplier.builder().id(supplierId).name("TechSource Distributors").build();
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));

        Optional<Supplier> result = supplierService.findById(supplierId);

        assertThat(result).contains(supplier);
    }

    @Test
    void findById_returnsEmpty_whenNotFound() {
        UUID supplierId = UUID.randomUUID();
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.empty());

        Optional<Supplier> result = supplierService.findById(supplierId);

        assertThat(result).isEmpty();
    }
}
