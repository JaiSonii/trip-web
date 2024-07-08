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
        // Fetch suggestions for origin when formData.route.origin changes
        fetchSuggestions(formData.route.origin, setSuggestionsOrigin);
    }, [formData.route.origin]);

    useEffect(() => {
        // Fetch suggestions for destination when formData.route.destination changes
        fetchSuggestions(formData.route.destination, setSuggestionsDestination);
    }, [formData.route.destination]);

    const fetchSuggestions = async (value: string, setSuggestions: React.Dispatch<React.SetStateAction<string[]>>) => {
        try {
            const username = 'fragtos'; // Replace with your GeoNames username
            const response = await axios.get(`http://api.geonames.org/searchJSON?name_startsWith=${value}&maxRows=7&country=IN&username=${username}`);
            const data = response.data;
            setSuggestions(data.geonames.map((city: any) => city.name));
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
        onChange
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">From</label>
                <div className="w-full p-2 border border-gray-300 rounded-md">
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
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">To</label>
                <div className="w-full p-2 border border-gray-300 rounded-md">
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
        </div>
    );
};

export default RouteInputs;
