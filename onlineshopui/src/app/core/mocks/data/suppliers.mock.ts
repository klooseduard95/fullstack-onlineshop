import { SupplierDto } from '../../types/dtos/supplier.dto';

export const MOCK_SUPPLIERS: SupplierDto[] = [
    {
        id: 'sup-1',
        name: 'Acme Electronics Co.',
        contactEmail: 'contact@acme-electronics.com',
        phone: '+1-555-0100',
        address: '123 Circuit Ave, Austin, TX'
    },
    {
        id: 'sup-2',
        name: 'Fashion Forward Textiles',
        contactEmail: 'sales@fashionforward.com',
        phone: '+1-555-0200',
        address: '45 Garment District, New York, NY'
    },
    {
        id: 'sup-3',
        name: 'GreenThumb Home & Garden Supplies',
        contactEmail: 'info@greenthumbsupplies.com',
        phone: '+1-555-0300',
        address: '789 Orchard Rd, Portland, OR'
    },
    {
        id: 'sup-4',
        name: 'Peak Performance Sports Gear',
        contactEmail: 'orders@peakperformance.com',
        phone: '+1-555-0400',
        address: '10 Stadium Way, Denver, CO'
    }
];
