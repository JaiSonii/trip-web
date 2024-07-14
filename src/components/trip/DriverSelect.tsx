import React, { useState } from 'react';
import { IDriver } from '@/utils/interface';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  drivers: IDriver[];
  formData: any; // Adjust type as per your formData structure
  setFormData : any
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const DriverSelect: React.FC<Props> = ({ drivers, formData, handleChange }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleOptionSelect = (value: string) => {
    const event = {
      target: {
        name: 'driver',
        value: value,
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    handleChange(event);
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <label className="block w-full">
        <span className="text-gray-700">Driver</span>
        <Select name="driver" value={formData.driver} onValueChange={handleOptionSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Driver" />
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
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((driver) => (
                <SelectItem key={driver.driver_id} value={driver.driver_id}>
                  <span>{driver.name}</span>
                  <span
                    className={`ml-2 p-1 rounded ${driver.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {driver.status}
                  </span>
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-gray-500">No drivers found</div>
            )}
          </SelectContent>
        </Select>
      </label>
    </div>
  );
};

export default DriverSelect;
