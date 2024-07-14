import React, { useState } from "react";
import { IParty } from "@/utils/interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PartySelectProps {
  parties: IParty[];
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PartySelect: React.FC<PartySelectProps> = ({ parties, formData, handleChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectChange = (value: string) => {
    const event = {
      target: {
        name: 'party',
        value: value,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  const filteredParties = parties.filter(party =>
    party.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <label className="block w-full">
        <span className="text-gray-700">Party</span>
        <Select name="party" defaultValue={formData.party} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Party" />
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
            {filteredParties.length > 0 ? (
              filteredParties.map((party) => (
                <SelectItem key={party.party_id} value={party.party_id}>{party.name}</SelectItem>
              ))
            ) : (
              <div className="p-2 text-gray-500">No parties found</div>
            )}
          </SelectContent>
        </Select>
      </label>
    </div>
  );
};

export {PartySelect};
