import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { take } from 'rxjs';
import { SupplierService } from './supplier.service';
import { EnvironmentConfig } from '../types/providers/environment-config';
import { MOCK_SUPPLIERS } from '../mocks/data/suppliers.mock';
import { MOCK_ENVIRONMENT_CONFIG } from '../mocks/data/environment.mock';

describe('SupplierService', () => {
    let service: SupplierService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SupplierService,
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: EnvironmentConfig,
                    useValue: MOCK_ENVIRONMENT_CONFIG
                }
            ]
        });

        service = TestBed.inject(SupplierService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('Initialization', () => {
        it('should be created', () => {
            // Prepare
            // (service created in beforeEach)

            // Action
            // (no action needed)

            // Verify
            expect(service).toBeTruthy();
        });

        it('should initialize with empty signals', () => {
            // Prepare
            // (service created in beforeEach)

            // Action
            // (no action needed)

            // Verify
            expect(service.suppliers()).toEqual([]);
            expect(service.loading()).toBe(false);
            expect(service.error()).toBeNull();
        });
    });

    describe('loadAll()', () => {
        it('should load all suppliers successfully', () => {
            // Prepare
            // (service created in beforeEach)

            // Action
            service.loadAll().pipe(take(1)).subscribe();

            const req = httpMock.expectOne(`${MOCK_ENVIRONMENT_CONFIG.apiUrl}/suppliers`);
            expect(req.request.method).toBe('GET');
            req.flush(MOCK_SUPPLIERS);

            // Verify
            expect(service.suppliers()).toEqual(MOCK_SUPPLIERS);
            expect(service.loading()).toBe(false);
            expect(service.error()).toBeNull();
        });

        it('should set loading to true while loading suppliers', () => {
            // Prepare
            // (service created in beforeEach)

            // Action
            service.loadAll().subscribe();

            // Verify
            expect(service.loading()).toBe(true);

            const req = httpMock.expectOne(`${MOCK_ENVIRONMENT_CONFIG.apiUrl}/suppliers`);
            req.flush(MOCK_SUPPLIERS);

            expect(service.loading()).toBe(false);
        });

        it('should handle error when loading suppliers fails', () => {
            // Prepare
            // (service created in beforeEach)

            // Action
            service.loadAll().pipe(take(1)).subscribe();

            const req = httpMock.expectOne(`${MOCK_ENVIRONMENT_CONFIG.apiUrl}/suppliers`);
            req.flush('Error', { status: 500, statusText: 'Server Error' });

            // Verify
            expect(service.suppliers()).toEqual([]);
            expect(service.error()).toBe('Failed to load suppliers');
            expect(service.loading()).toBe(false);
        });

        it('should clear previous error when loading suppliers', () => {
            // Prepare
            // Set initial error state
            service.loadAll().subscribe();
            const req1 = httpMock.expectOne(`${MOCK_ENVIRONMENT_CONFIG.apiUrl}/suppliers`);
            req1.flush('Error', { status: 500, statusText: 'Server Error' });

            expect(service.error()).toBe('Failed to load suppliers');

            // Action
            // Load again successfully
            service.loadAll().subscribe();

            // Verify
            // Error should be cleared immediately
            expect(service.error()).toBeNull();

            const req2 = httpMock.expectOne(`${MOCK_ENVIRONMENT_CONFIG.apiUrl}/suppliers`);
            req2.flush(MOCK_SUPPLIERS);
        });

        it('should handle empty suppliers array', () => {
            // Prepare
            // (service created in beforeEach)

            // Action
            service.loadAll().pipe(take(1)).subscribe();

            const req = httpMock.expectOne(`${MOCK_ENVIRONMENT_CONFIG.apiUrl}/suppliers`);
            req.flush([]);

            // Verify
            expect(service.suppliers()).toEqual([]);
            expect(service.error()).toBeNull();
        });
    });
});
