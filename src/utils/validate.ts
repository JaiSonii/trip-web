export const isValidGSTNumber = (gstNumber: string): boolean => {
    // GST number format validation logic (client-side)
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber);
};

export const isValidPhone = (phone: string): boolean => {
    return /^[789]\d{9}$/.test(phone); // Phone number validation logic for India
};

export const validateTruckNo = (truckNo: string): boolean => {
    // Regular expression to validate Indian truck number format
    const truckNoPattern = /^[A-Z]{2}\d{2}[A-Z]{0,2}\d{4}$/;
    return truckNoPattern.test(truckNo);
}