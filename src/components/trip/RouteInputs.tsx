export const RouteInputs: React.FC<{ formData: any; handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; }> = ({ formData, handleChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="block">
        <span className="text-gray-700">Origin</span>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          type="text"
          name="route.origin"
          value={formData.route.origin}
          placeholder="Origin"
          onChange={handleChange}
          required
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Destination</span>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          type="text"
          name="route.destination"
          value={formData.route.destination}
          placeholder="Destination"
          onChange={handleChange}
          required
        />
      </label>
    </div>
  );
  