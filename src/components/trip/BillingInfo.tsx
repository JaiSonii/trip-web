import React, { useEffect } from "react";

interface BillingInfoProps {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>; // Adding setFormData prop
}

export const BillingInfo: React.FC<BillingInfoProps> = ({ formData, handleChange, setFormData }) => {
  useEffect(() => {
    if (formData.billingType !== 'Fixed') {
      const newAmount = parseFloat(formData.perUnit as any) * parseFloat(formData.totalUnits as any);
      setFormData((prevFormData : any) => ({
        ...prevFormData,
        amount: newAmount
      }));
    }
  }, [formData.billingType, formData.perUnit, formData.totalUnits, setFormData]);

  return (
    <div className="billing-info">
      <h2 className="text-xl font-bold mb-2">Billing Information</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {['Fixed', 'Per Tonne', 'Per Kg', 'Per Trip', 'Per Day', 'Per Hour', 'Per Litre', 'Per Bag'].map((type) => (
          <button
            key={type}
            type="button"
            className={`p-2 rounded-md ${formData.billingType === type ? ' bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => handleChange({ target: { name: 'billingType', value: type } } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}
          >
            {type}
          </button>
        ))}
      </div>
      {formData.billingType === 'Fixed' ? (
        <label className="block">
          <span className="text-gray-700">Freight Amount</span>
          <input
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            type="number"
            name="amount"
            value={formData.amount}
            placeholder="Freight Amount"
            onChange={handleChange}
            required
          />
        </label>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <label className="block">
              <span className="text-gray-700">{formData.billingType}</span>
              <input
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                type="number"
                name="perUnit"
                value={formData.perUnit}
                placeholder="Per Unit"
                onChange={handleChange}
                required
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Total {formData.billingType.split(' ')[1]}s</span>
              <input
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                type="number"
                name="totalUnits"
                value={formData.totalUnits}
                placeholder="Total Units"
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <label className="block">
            <span className="text-gray-700">Freight Amount</span>
            <input
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              type="number"
              name="amount"
              value={formData.amount}
              placeholder="Freight Amount"
              readOnly
            />
          </label>
        </>
      )}
      {formData.hasSupplier && (
        <label className="block">
          <span className="text-gray-700">Truck Hire Cost</span>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type="number"
            name="truckHireCost"
            value={formData.truckHireCost}
            placeholder="Truck Hire Cost"
            onChange={handleChange}
          />
        </label>
      )}
    </div>
  );
};
