package msg.onlineshopapi.dto.mapper;

import msg.onlineshopapi.dto.AddressDto;
import msg.onlineshopapi.model.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    public Address toEntity(AddressDto address) {
        return Address.builder()
                .country(address.getCountry())
                .city(address.getCity())
                .county(address.getCounty())
                .streetAddress(address.getStreetAddress())
                .build();
    }

    public AddressDto toDto(Address address) {
        return AddressDto.builder()
                .country(address.getCountry())
                .city(address.getCity())
                .county(address.getCounty())
                .streetAddress(address.getStreetAddress())
                .build();
    }
}
