import { HttpResponse } from '@angular/common/http';
import { MOCK_SUPPLIERS } from '../../data/suppliers.mock';

type SuppliersHandlerContext = {
    method: string;
    path: string;
    body: unknown;
};

export function handleSuppliersFeature(
    context: SuppliersHandlerContext
): HttpResponse<unknown> | null {
    const { method, path } = context;

    if (method === 'GET' && path === '/suppliers') {
        return handleGetSuppliers();
    }

    return null;
}

function handleGetSuppliers(): HttpResponse<unknown> {
    return new HttpResponse({
        status: 200,
        body: MOCK_SUPPLIERS
    });
}
