import React, { useState, useEffect } from 'react';
import Autosuggest, { SuggestionsFetchRequestedParams } from 'react-autosuggest';
import axios from 'axios';

interface RouteInputsProps {
    formData: {
        route: {
            origin: string;
            destination: string;
        };
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const RouteInputs: React.FC<RouteInputsProps> = ({ formData, handleChange }) => {
    const [suggestionsOrigin, setSuggestionsOrigin] = useState<string[]>([]);
    const [suggestionsDestination, setSuggestionsDestination] = useState<string[]>([]);
    const [highlightedSuggestion, setHighlightedSuggestion] = useState<string | null>(null);

    useEffect(() => {
        fetchSuggestions(formData.route.origin, setSuggestionsOrigin);
    }, [formData.route.origin]);

    useEffect(() => {
        fetchSuggestions(formData.route.destination, setSuggestionsDestination);
    }, [formData.route.destination]);

    const fetchSuggestions = async (value: string, setSuggestions: React.Dispatch<React.SetStateAction<string[]>>) => {
        try {
            const username = 'fragtos'; // Replace with your GeoNames username
            const response = await axios.get(`https://secure.geonames.org/searchJSON?name_startsWith=${value}&maxRows=7&country=IN&username=${username}`);
            const data = response.data;
            
            const uniqueSuggestions = Array.from(new Set(data.geonames.map((city: any) => city.name + ", " + city.adminName1)));
            setSuggestions(uniqueSuggestions as any);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleOriginChange = (event: React.ChangeEvent<HTMLInputElement>, { newValue }: { newValue: string }) => {
        handleChange({ ...event, target: { ...event.target, name: 'route.origin', value: newValue } });
    };

    const handleDestinationChange = (event: React.ChangeEvent<HTMLInputElement>, { newValue }: { newValue: string }) => {
        handleChange({ ...event, target: { ...event.target, name: 'route.destination', value: newValue } });
    };

    const renderSuggestion = (suggestion: string) => {
        const isHighlighted = suggestion === highlightedSuggestion;
        return (
            <div
                className={`p-2 cursor-pointer ${isHighlighted ? 'bg-gray-200' : ''}`}
                onMouseEnter={() => setHighlightedSuggestion(suggestion)}
                onMouseLeave={() => setHighlightedSuggestion(null)}
            >
                {suggestion}
            </div>
        );
    };

    const inputProps = (placeholder: string, value: string, onChange: (event: any, { newValue }: any) => void) => ({
        placeholder,
        value,
        onChange,
        className: 'w-full p-2 border border-gray-300 rounded-md'
    });

    return (
        <div className="flex flex-wrap flex-row justify-between">
            <div className="w-full md:w-1/2 mb-4 pr-1">
                <label className="block text-sm font-medium text-gray-700">From</label>
                <Autosuggest
                    suggestions={suggestionsOrigin}
                    onSuggestionsFetchRequested={(params: SuggestionsFetchRequestedParams) => fetchSuggestions(params.value, setSuggestionsOrigin)}
                    onSuggestionsClearRequested={() => setSuggestionsOrigin([])}
                    getSuggestionValue={(suggestion) => suggestion}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps("Enter city", formData.route.origin, handleOriginChange)}
                    shouldRenderSuggestions={(value) => value.trim().length > 0}
                />
            </div>
            <div className="w-full md:w-1/2 mb-4 pl-1">
                <label className="block text-sm font-medium text-gray-700">To</label>
                <Autosuggest
                    suggestions={suggestionsDestination}
                    onSuggestionsFetchRequested={(params: SuggestionsFetchRequestedParams) => fetchSuggestions(params.value, setSuggestionsDestination)}
                    onSuggestionsClearRequested={() => setSuggestionsDestination([])}
                    getSuggestionValue={(suggestion) => suggestion}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps("Enter city", formData.route.destination, handleDestinationChange)}
                    shouldRenderSuggestions={(value) => value.trim().length > 0}
                />
            </div>
        </div>
    );
};

export default RouteInputs;
