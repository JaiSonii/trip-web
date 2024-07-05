import React from 'react';

interface PODViewerProps {
  podUrl: string;
}

const PODViewer: React.FC<PODViewerProps> = ({ podUrl }) => {
  return (
    <div className="mt-6 bg-gray-100 p-4 rounded-md">
      <h3 className="text-lg font-semibold mb-2">POD Viewer</h3>
      <div className="flex justify-center items-center">
        <img src={podUrl} alt="POD" className="max-w-full h-auto" />
      </div>
    </div>
  );
};

export default PODViewer;
