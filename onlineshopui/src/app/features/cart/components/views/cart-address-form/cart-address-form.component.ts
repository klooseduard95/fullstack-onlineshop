import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../../../../clib/components/card/card.component';
import { ErrorMessageComponent } from '../../../../../clib/components/error-message/error-message.component';
import { createAddressForm } from '../../../utils/address-form.utils';

@Component({
    selector: 'app-cart-address-form',
    imports: [ReactiveFormsModule, CardComponent, ErrorMessageComponent],
    templateUrl: './cart-address-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartAddressFormComponent implements OnInit {
    readonly form = createAddressForm();
    readonly validityChange = output<boolean>();

    private readonly destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.emitValidity();
        this.form.statusChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.emitValidity());
    }

    private emitValidity(): void {
        this.validityChange.emit(this.form.valid);
    }
}
