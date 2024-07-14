import React, { useState, useEffect } from 'react';
import { TruckModel } from '@/utils/interface';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  trucks: TruckModel[];
  formData: any; // Adjust type as per your formData structure
  selectedTruck : any
  hasSupplier : boolean
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

const TruckSelect: React.FC<Props> = ({ trucks, formData, handleChange, setFormData }) => {
  const [supplierName, setSupplierName] = useState<string>('');
  const [selectedTruck, setSelectedTruck] = useState<TruckModel | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

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
        supplierId: data.supplier.supplier_id
      }));
    } catch (error) {
      console.error('Error fetching supplier details:', error);
    }
  };

  useEffect(() => {
    const selectedTruck = trucks.find(truck => truck.truckNo === formData.truck);
    setSelectedTruck(selectedTruck || null);
    if (selectedTruck?.supplier) {
      fetchSupplierName(selectedTruck.supplier);
    } else {
      setSupplierName('');
      setFormData((prev: any) => ({
        ...prev,
        supplierId: null
      }));
    }
  }, [trucks, formData.truck, setFormData]);

  const handleOptionSelect = (value: string) => {
    const truck = trucks.find(truck => truck.truckNo === value);
    setFormData((prev: any) => ({
      ...prev,
      truck: value
    }));
  };

  const filteredTrucks = trucks.filter(truck =>
    truck.truckNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <label className="block w-full">
        <span className="text-gray-700">Truck</span>
        <Select name="truck" value={formData.truck} onValueChange={handleOptionSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Truck" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {filteredTrucks.length > 0 ? (
              filteredTrucks.map((truck) => (
                <SelectItem key={truck.truckNo} value={truck.truckNo}>
                  <span>{truck.truckNo}</span>
                  <span
                    className={`ml-2 p-1 rounded ${truck.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {truck.status}
                  </span>
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-gray-500">No trucks found</div>
            )}
          </SelectContent>
        </Select>
      </label>
      {supplierName && (
        <div className="mt-2 text-sm text-gray-600">
          Supplier: {supplierName}
        </div>
      )}
    </div>
  );
};

export default TruckSelect;
