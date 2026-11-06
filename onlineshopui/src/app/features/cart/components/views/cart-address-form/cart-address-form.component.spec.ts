import { TestBed, ComponentFixture } from '@angular/core/testing';
import { vi } from 'vitest';
import { CartAddressFormComponent } from './cart-address-form.component';
import { ValidationMessages } from '../../../../../core/types/providers/validation-messages';
import { DefaultValidationMessages } from '../../../../../core/config/constants/validation.constants';

describe('CartAddressFormComponent', () => {
    let component: CartAddressFormComponent;
    let fixture: ComponentFixture<CartAddressFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CartAddressFormComponent],
            providers: [{ provide: ValidationMessages, useValue: DefaultValidationMessages }]
        });

        fixture = TestBed.createComponent(CartAddressFormComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        // Prepare
        // (component created in beforeEach)

        // Action
        // (no action needed)

        // Verify
        expect(component).toBeTruthy();
    });

    it('should build a form with four required, empty fields', () => {
        // Prepare
        // (component created in beforeEach)

        // Action
        fixture.detectChanges();

        // Verify
        expect(component.form.value).toEqual({
            country: '',
            city: '',
            county: '',
            streetAddress: ''
        });
        expect(component.form.invalid).toBe(true);
    });

    it('should emit validityChange(false) on init when fields are empty', () => {
        // Prepare
        const emitSpy = vi.spyOn(component.validityChange, 'emit');

        // Action
        fixture.detectChanges();

        // Verify
        expect(emitSpy).toHaveBeenCalledWith(false);
    });

    it('should emit validityChange(true) once all required fields are filled', () => {
        // Prepare
        fixture.detectChanges();
        const emitSpy = vi.spyOn(component.validityChange, 'emit');

        // Action
        component.form.setValue({
            country: 'Romania',
            city: 'Cluj-Napoca',
            county: 'Cluj',
            streetAddress: 'Strada Mihai Eminescu 5'
        });

        // Verify
        expect(emitSpy).toHaveBeenCalledWith(true);
        expect(component.form.valid).toBe(true);
    });

    it('should emit validityChange(false) again when a required field is cleared', () => {
        // Prepare
        fixture.detectChanges();
        component.form.setValue({
            country: 'Romania',
            city: 'Cluj-Napoca',
            county: 'Cluj',
            streetAddress: 'Strada Mihai Eminescu 5'
        });
        const emitSpy = vi.spyOn(component.validityChange, 'emit');

        // Action
        component.form.controls['city'].setValue('');

        // Verify
        expect(emitSpy).toHaveBeenCalledWith(false);
        expect(component.form.invalid).toBe(true);
    });
});
