import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import { cities } from '@/utils/cities';

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
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [highlightedSuggestion, setHighlightedSuggestion] = useState<string | null>(null);

    const getSuggestions = (value: string) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : cities.filter(city =>
            city.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
        setSuggestions(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const renderSuggestion = (suggestion: string) => {
        const isHighlighted = suggestion === highlightedSuggestion;
        return (
            <div className={`p-2 cursor-pointer ${isHighlighted ? 'bg-gray-200' : ''}`}
                 onMouseEnter={() => setHighlightedSuggestion(suggestion)}
                 onMouseLeave={() => setHighlightedSuggestion(null)}>
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
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                        getSuggestionValue={(suggestion) => suggestion}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps("Enter city", formData.route.origin, (event, { newValue }) => handleChange({ ...event, target: { ...event.target, name: 'route.origin', value: newValue } }))}
                        shouldRenderSuggestions={(value) => value.trim().length > 0}
                    />
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">To</label>
                <div className="w-full p-2 border border-gray-300 rounded-md">
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                        getSuggestionValue={(suggestion) => suggestion}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps("Enter city", formData.route.destination, (event, { newValue }) => handleChange({ ...event, target: { ...event.target, name: 'route.destination', value: newValue } }))}
                        shouldRenderSuggestions={(value) => value.trim().length > 0}
                    />
                </div>
            </div>
        </div>
    );
};

export default RouteInputs;
