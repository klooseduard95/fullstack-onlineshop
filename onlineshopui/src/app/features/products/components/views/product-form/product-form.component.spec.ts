import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProductFormComponent } from './product-form.component';
import { createProductForm } from '../../../utils/product-form.utils';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../../../../core/mocks/data/products.mock';
import { MOCK_SUPPLIERS } from '../../../../../core/mocks/data/suppliers.mock';
import { ValidationMessages } from '../../../../../core/types/providers/validation-messages';
import { DefaultValidationMessages } from '../../../../../core/config/constants/validation.constants';

describe('ProductFormComponent', () => {
    let fixture: ComponentFixture<ProductFormComponent>;
    let component: ProductFormComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProductFormComponent],
            providers: [{ provide: ValidationMessages, useValue: DefaultValidationMessages }]
        });

        fixture = TestBed.createComponent(ProductFormComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('form', createProductForm());
        fixture.componentRef.setInput('categories', MOCK_CATEGORIES);
        fixture.componentRef.setInput('suppliers', MOCK_SUPPLIERS);
        fixture.detectChanges();
    });

    describe('Rendering', () => {
        it('should create', () => {
            // Prepare
            // (component created in beforeEach)

            // Action
            // (no action needed)

            // Verify
            expect(component).toBeTruthy();
        });

        it('should render an option for each supplier', () => {
            // Prepare
            // (component created in beforeEach)

            // Action
            const select = fixture.debugElement.query(By.css('#supplierId'));
            const options = select.queryAll(By.css('option'));

            // Verify
            // +1 for the "Select a supplier" placeholder option
            expect(options.length).toBe(MOCK_SUPPLIERS.length + 1);
            expect(options[1].nativeElement.value).toBe(MOCK_SUPPLIERS[0].id);
            expect(options[1].nativeElement.textContent.trim()).toBe(MOCK_SUPPLIERS[0].name);
        });
    });

    describe('supplierId validation', () => {
        it('should be invalid when no supplier is selected', () => {
            // Prepare
            // (form created with empty supplierId in beforeEach)

            // Action
            const control = component.form().get('supplierId');

            // Verify
            expect(control?.valid).toBe(false);
            expect(control?.errors).toEqual({ required: true });
        });

        it('should be valid once a supplier is selected', () => {
            // Prepare
            const control = component.form().get('supplierId');

            // Action
            control?.setValue(MOCK_SUPPLIERS[0].id);

            // Verify
            expect(control?.valid).toBe(true);
        });

        it('should initialize supplierId from the provided product', () => {
            // Prepare
            const product = MOCK_PRODUCTS[0];

            // Action
            fixture.componentRef.setInput('form', createProductForm(product));
            fixture.detectChanges();

            // Verify
            expect(component.form().get('supplierId')?.value).toBe(product.supplier.id);
        });
    });
});
