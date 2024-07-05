import { IParty } from "@/utils/interface";

export const PartySelect: React.FC<{ parties: IParty[]; formData: any; handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; }> = ({ parties, formData, handleChange }) => (
    <div >
      <label className="block">
        <span className="text-gray-700">Party</span>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          name="party"
          value={formData.party}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select Party</option>
          {parties.map((party) => (
            <option key={party.party_id} value={party.party_id}>{party.name}</option>
          ))}
        </select>
      </label>
    </div>
  );
  