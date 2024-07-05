import React, { useState } from 'react';
import { IDriver } from '@/utils/interface';

type Props = {
  drivers: IDriver[];
  formData: any; // Adjust type as per your formData structure
  setFormData : any
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const DriverSelect: React.FC<Props> = ({ drivers, formData, handleChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const renderDriverStatus = (driverId: string) => {
    const driver = drivers.find(driver => driver.driver_id === driverId);
    if (driver) {
      return (
        <span className={`ml-2 p-1 rounded ${driver.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {driver.status}
        </span>
      );
    }
    return null;
  };

  const handleOptionSelect = (driver: IDriver) => {
    handleChange({
      target: {
        name: 'driver',
        value: driver.driver_id
      }
    } as React.ChangeEvent<HTMLSelectElement>);
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <label className="block">
        <span className="text-gray-700">Driver</span>
        <div
          className="w-full p-2 border border-gray-300 rounded-md bg-white cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {formData.driver ? drivers.find(driver => driver.driver_id === formData.driver)?.name : 'Select Driver'}
        </div>
      </label>
      {dropdownOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
          {drivers.map((driver) => (
            <li
              key={driver.driver_id}
              className={`p-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center ${formData.driver === driver.driver_id ? 'bg-gray-200' : ''}`}
              onClick={() => handleOptionSelect(driver)}
            >
              <span>{driver.name}</span>
              {renderDriverStatus(driver.driver_id)}
            </li>
          ))}
        </ul>
      )}
      {formData.driver && (
        <div className="mt-2">
          {renderDriverStatus(formData.driver)}
        </div>
      )}
    </div>
  );
};

export default DriverSelect;
