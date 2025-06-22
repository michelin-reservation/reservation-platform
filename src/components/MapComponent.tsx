import React, { useEffect, useRef } from 'react';
import { Restaurant } from '../types';

interface MapComponentProps {
  restaurants: Restaurant[];
  selectedId?: string;
  height?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  restaurants, 
  selectedId,
  height = '300px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // In a real implementation, you would initialize a map library here
    // For this example, we'll just create a placeholder
    if (mapRef.current) {
      const mapPlaceholder = document.createElement('div');
      mapPlaceholder.className = 'w-full h-full bg-gray-200 flex items-center justify-center';
      
      const mapContent = document.createElement('div');
      mapContent.className = 'text-center p-4';
      
      const mapTitle = document.createElement('h3');
      mapTitle.className = 'text-lg font-medium text-gray-700 mb-2';
      mapTitle.textContent = 'Interactive Map';
      
      const mapDescription = document.createElement('p');
      mapDescription.className = 'text-sm text-gray-500';
      mapDescription.textContent = `Showing ${restaurants.length} restaurants${selectedId ? ' with selected restaurant' : ''}`;
      
      mapContent.appendChild(mapTitle);
      mapContent.appendChild(mapDescription);
      mapPlaceholder.appendChild(mapContent);
      
      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(mapPlaceholder);
    }
  }, [restaurants, selectedId]);

  return (
    <div 
      ref={mapRef} 
      className="w-full rounded-lg overflow-hidden shadow-md" 
      style={{ height }}
    >
      {/* Map will be rendered here */}
    </div>
  );
};

export default MapComponent;