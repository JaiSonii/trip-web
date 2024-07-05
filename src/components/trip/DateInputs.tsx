export const DateInputs: React.FC<{ formData: any; handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; }> = ({ formData, handleChange }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Start Date</label>
      <input
        type="date"
        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        value={formData.startDate.toISOString().substr(0, 10)}
        onChange={(e) => handleChange({ target: { name: 'startDate', value: new Date(e.target.value) } } as any)}
        required
      />
    </div>
  );
  