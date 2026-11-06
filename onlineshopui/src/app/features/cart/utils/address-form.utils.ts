import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressDto } from '../../../core/types/dtos/location.dto';

export function createAddressForm(): FormGroup {
    return new FormGroup({
        country: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        city: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        county: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        streetAddress: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required]
        })
    });
}

export function toAddressDto(form: FormGroup): AddressDto {
    return form.getRawValue() as AddressDto;
}
