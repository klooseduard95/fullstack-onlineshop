package msg.onlineshopapi.dto.mapper;

import msg.onlineshopapi.dto.AddressDto;
import msg.onlineshopapi.model.Address;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AddressMapperTest {

    private final AddressMapper mapper = new AddressMapper();

    @Test
    void toEntity_mapsAllAddressFields() {
        AddressDto dto = AddressDto.builder()
                .country("Romania")
                .city("Cluj-Napoca")
                .county("Cluj")
                .streetAddress("Strada Memorandumului 1")
                .build();

        Address result = mapper.toEntity(dto);

        assertThat(result.getCountry()).isEqualTo(dto.getCountry());
        assertThat(result.getCity()).isEqualTo(dto.getCity());
        assertThat(result.getCounty()).isEqualTo(dto.getCounty());
        assertThat(result.getStreetAddress()).isEqualTo(dto.getStreetAddress());
    }

    @Test
    void toDto_mapsAllAddressFields() {
        Address address = Address.builder()
                .country("Romania")
                .city("Cluj-Napoca")
                .county("Cluj")
                .streetAddress("Strada Memorandumului 1")
                .build();

        AddressDto result = mapper.toDto(address);

        assertThat(result.getCountry()).isEqualTo(address.getCountry());
        assertThat(result.getCity()).isEqualTo(address.getCity());
        assertThat(result.getCounty()).isEqualTo(address.getCounty());
        assertThat(result.getStreetAddress()).isEqualTo(address.getStreetAddress());
    }
}
