import React, { useState, useEffect } from 'react';
import { PartySelect } from './PartySelect';
import TruckSelect  from './TruckSelect';
import DriverSelect from './DriverSelect';
import RouteInputs from './RouteInputs';
import { BillingInfo } from './BillingInfo';
import {DateInputs} from './DateInputs';
import { IDriver, IParty, TruckModel } from '@/utils/interface';
type Props = {
    parties: IParty[];
    trucks: TruckModel[];
    drivers: IDriver[];
    lr: string;
    onSubmit: (trip: any) => void;
};

const TripForm: React.FC<Props> = ({ parties, trucks, drivers, onSubmit, lr}) => {
    const [formData, setFormData] = useState({
        party: '',
        truck: '',
        driver: '',
        supplierId: '',
        route: {
            origin: '',
            destination: ''
        },
        billingType: 'Fixed',
        perUnit: 0,
        totalUnits: 0,
        amount: 0,
        startDate: new Date(),
        truckHireCost: 0,
        LR: lr,
        material: '',
        notes: ''
    });

    const [showDetails, setShowDetails] = useState(false);
    const [selectedTruck, setSelectedTruck] = useState<TruckModel | undefined>(undefined);
    const [hasSupplier, setHasSupplier] = useState(false);

    useEffect(() => {
        const updatedTruck = trucks.find(truck => truck.truckNo === formData.truck);
        setSelectedTruck(updatedTruck);
        setHasSupplier(!!updatedTruck?.supplier);
    }, [formData.truck, trucks]);

    useEffect(() => {
        if (formData.billingType !== 'Fixed') {
            const newAmount = parseFloat(formData.perUnit as any) * parseFloat(formData.totalUnits as any);
            setFormData(prevFormData => ({
                ...prevFormData,
                amount: newAmount
            }));
        }
    }, [formData.billingType, formData.perUnit, formData.totalUnits]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name.includes('route.')) {
            const routeField = name.split('.')[1];
            setFormData(prevState => ({
                ...prevState,
                route: {
                    ...prevState.route,
                    [routeField]: value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white text-black p-4 max-w-3xl mx-auto shadow-md rounded-md">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <PartySelect
                        parties={parties}
                        formData={formData}
                        handleChange={handleChange}
                    />
                    <TruckSelect
                        trucks={trucks}
                        formData={formData}
                        handleChange={handleChange}
                        selectedTruck={selectedTruck}
                        hasSupplier={hasSupplier}
                        setFormData={setFormData}
                    />
                </div>

                <DriverSelect
                    drivers={drivers}
                    formData={formData}
                    handleChange={handleChange}
                    setFormData={setFormData}
                />
                <RouteInputs
                    formData={formData}
                    handleChange={handleChange}
                />
                <BillingInfo
                    formData={formData}
                    handleChange={handleChange}
                    setFormData={setFormData}
                />
                <DateInputs
                    formData={formData}
                    handleChange={handleChange}
                />

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">LR No</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        name="LR"
                        value={formData.LR}
                        placeholder="LR No"
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={showDetails}
                            onChange={() => setShowDetails(!showDetails)}
                        />
                        Add More Details
                    </label>
                </div>

                {showDetails && (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Material Name</label>
                            <input
                                type='text'
                                className="w-full p-2 border border-gray-300 rounded-md"
                                name="material"
                                value={formData.material}
                                placeholder="Material Name"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Notes</label>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md"
                                name="notes"
                                value={formData.notes}
                                placeholder="Notes"
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                {hasSupplier && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Truck Hire Cost</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            name="truckHireCost"
                            value={formData.truckHireCost}
                            placeholder="Truck Hire Cost"
                            onChange={handleChange}
                        />
                    </div>
                )}
    
                <button
                    className="w-full p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default TripForm;
