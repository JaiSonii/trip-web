import React from 'react';

interface PaymentItem {
  label: string;
  value: string;
}

interface PaymentsProps {
  payments: PaymentItem[];
  onAddPayment: () => void; // Function to handle adding payments
}

const Payments: React.FC<PaymentsProps> = ({ payments, onAddPayment }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Payments</h3>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white hover:bg-purple-600 focus:outline-none ml-4"
          onClick={onAddPayment}
          aria-label="Add Payment"
        >
          +
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
        {payments.map((payment, index) => (
          <div key={index} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{payment.label}</p>
              <p className="text-xs text-gray-600">{payment.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payments;
