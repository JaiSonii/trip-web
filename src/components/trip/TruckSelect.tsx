import React, { useState, useEffect } from 'react';
import { TruckModel } from '@/utils/interface';

type Props = {
  trucks: TruckModel[];
  formData: any; // Adjust type as per your formData structure
  selectedTruck : any
  hasSupplier : boolean
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

export const TruckSelect: React.FC<Props> = ({ trucks, formData, handleChange, setFormData }) => {
  const [supplierName, setSupplierName] = useState<string>('');
  const [selectedTruck, setSelectedTruck] = useState<TruckModel | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Function to fetch supplier name asynchronously
  const fetchSupplierName = async (supplierId: string) => {
    try {
      const response = await fetch(`/api/suppliers/${supplierId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch supplier details');
      }
      const data = await response.json();
      setSupplierName(data.supplier.name);
      setFormData((prev: any) => ({
        ...prev,
        supplierId: data.supplier.supplier_id // Assuming your formData structure has a 'supplierId' field
      }));
    } catch (error) {
      console.error('Error fetching supplier details:', error);
      // Handle error as needed
    }
  };

  useEffect(() => {
    // Fetch supplier name if a truck with a supplier is selected
    const selectedTruck = trucks.find(truck => truck.truckNo === formData.truck);
    setSelectedTruck(selectedTruck || null);
    if (selectedTruck?.supplier) {
      fetchSupplierName(selectedTruck.supplier);
    } else {
      setSupplierName(''); // Reset supplier name if no supplier is selected
      setFormData((prev: any) => ({
        ...prev,
        supplierId: null // Reset supplier ID if no supplier is selected
      }));
    }
  }, [trucks, formData.truck, setFormData]);  // Dependency array ensures effect runs on truck or form data change

  const handleOptionSelect = (truck: TruckModel) => {
    setFormData((prev: any) => ({
      ...prev,
      truck: truck.truckNo
    }));
    
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <label className="block">
        <span className="text-gray-700">Truck</span>
        <div
          className="w-full p-2 border border-gray-300 rounded-md bg-white cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {formData.truck || 'Select Truck'}
        </div>
      </label>
      {dropdownOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
          {trucks.map((truck) => (
            <li
              key={truck.truckNo}
              className={`p-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center ${formData.truck === truck.truckNo ? 'bg-gray-200' : ''}`}
              onClick={() => handleOptionSelect(truck)}
            >
              <span>{truck.truckNo}</span>
              <span
                className={`ml-2 p-1 rounded ${truck.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {truck.status}
              </span>
            </li>
          ))}
        </ul>
      )}
      {selectedTruck && (
        <div className={`mt-2 p-1 rounded ${selectedTruck.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          Status: {selectedTruck.status}
        </div>
      )}
      {supplierName && (
        <div className="mt-2 text-sm text-gray-600">
          Supplier: {supplierName}
        </div>
      )}
    </div>
  );
};

export default TruckSelect;
