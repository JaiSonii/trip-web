// AdditionalDetails.tsx

import React from 'react';

type Props = {
    formdata: {
        truckType: string;
        model: string;
        bodyLength: number | null;
        capacity: string;
    };
    renderModelOptions: () => string[];
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

const AdditionalDetails: React.FC<Props> = ({ formdata, renderModelOptions, handleInputChange }) => (
    <>
        <select
            className="w-full p-2 border border-gray-300 rounded-md"
            name="model"
            value={formdata.model}
            onChange={handleInputChange}
        >
            <option value='' disabled>Select Model</option>
            {renderModelOptions().map((model, index) => (
                <option key={index} value={model}>{model}</option>
            ))}
        </select>
        {formdata.truckType !== 'Tanker' && (
            <input
                className="w-full p-2 border border-gray-300 rounded-md"
                type='text'
                name='bodyLength'
                value={formdata.bodyLength || ''}
                placeholder='Enter the Body Length(ft)'
                onChange={handleInputChange}
            />
        )}
        <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type='text'
            name='capacity'
            value={formdata.capacity}
            placeholder='Enter the Capacity'
            onChange={handleInputChange}
        />
    </>
);

export default AdditionalDetails;
