// SupplierSelect.tsx

import React from 'react';
import { ISupplier } from '@/utils/interface';

type Props = {
    suppliers: ISupplier[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const SupplierSelect: React.FC<Props> = ({ suppliers, value, onChange }) => (
    <select
        className="w-full p-2 border border-gray-300 rounded-md"
        name='supplier'
        value={value}
        onChange={onChange}
    >
        <option value='' disabled>Select Supplier</option>
        {suppliers.map((supplier) => (
            <option key={supplier.supplier_id} value={supplier.supplier_id}>{supplier.name}</option>
        ))}
    </select>
);

export default SupplierSelect;
