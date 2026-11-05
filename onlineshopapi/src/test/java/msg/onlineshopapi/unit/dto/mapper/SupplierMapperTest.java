package msg.onlineshopapi.unit.dto.mapper;

import msg.onlineshopapi.dto.SupplierDto;
import msg.onlineshopapi.dto.mapper.SupplierMapper;
import msg.onlineshopapi.model.Supplier;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class SupplierMapperTest {

    private final SupplierMapper supplierMapper = new SupplierMapper();

    @Test
    void toDto_mapsAllFields() {
        UUID id = UUID.randomUUID();
        Supplier supplier = Supplier.builder()
                .id(id)
                .name("TechSource Distributors")
                .contactEmail("sales@techsource.example.com")
                .phone("+40 264 100 100")
                .address("Strada Fabricii 20, Cluj-Napoca, Romania")
                .build();

        SupplierDto dto = supplierMapper.toDto(supplier);

        assertThat(dto.getId()).isEqualTo(id);
        assertThat(dto.getName()).isEqualTo("TechSource Distributors");
        assertThat(dto.getContactEmail()).isEqualTo("sales@techsource.example.com");
        assertThat(dto.getPhone()).isEqualTo("+40 264 100 100");
        assertThat(dto.getAddress()).isEqualTo("Strada Fabricii 20, Cluj-Napoca, Romania");
    }
}
