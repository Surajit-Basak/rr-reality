'use client';

import { useState, useMemo } from 'react';
import type { Property } from '@/lib/types';
import { SearchFilters } from '@/components/search-filters';
import { PropertyCard } from '@/components/property-card';
import { AnimatePresence, motion } from 'framer-motion';

interface PropertiesClientPageProps {
  allProperties: Property[];
}

export function PropertiesClientPage({ allProperties }: PropertiesClientPageProps) {
  const [keyword, setKeyword] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [status, setStatus] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const filteredProperties = useMemo(() => {
    return allProperties.filter(p => {
      const keywordMatch = keyword === '' || 
        p.title.toLowerCase().includes(keyword.toLowerCase()) || 
        p.location.toLowerCase().includes(keyword.toLowerCase()) ||
        p.description.toLowerCase().includes(keyword.toLowerCase());

      const typeMatch = propertyType === 'all' || p.type === propertyType;
      const statusMatch = status === 'all' || p.status === status;
      const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
      
      const bedroomsMatch = bedrooms === 'any' || p.bedrooms >= parseInt(bedrooms, 10);
      const bathroomsMatch = bathrooms === 'any' || p.bathrooms >= parseInt(bathrooms, 10);
      
      const amenitiesMatch = selectedAmenities.length === 0 || selectedAmenities.every(a => p.amenities.includes(a));

      return keywordMatch && typeMatch && statusMatch && priceMatch && bedroomsMatch && bathroomsMatch && amenitiesMatch;
    });
  }, [allProperties, keyword, propertyType, status, priceRange, bedrooms, bathrooms, selectedAmenities]);

  const resetFilters = () => {
    setKeyword('');
    setPropertyType('all');
    setStatus('all');
    setPriceRange([0, 2000000]);
    setBedrooms('any');
    setBathrooms('any');
    setSelectedAmenities([]);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <SearchFilters
            keyword={keyword} setKeyword={setKeyword}
            propertyType={propertyType} setPropertyType={setPropertyType}
            status={status} setStatus={setStatus}
            priceRange={priceRange} setPriceRange={setPriceRange}
            bedrooms={bedrooms} setBedrooms={setBedrooms}
            bathrooms={bathrooms} setBathrooms={setBathrooms}
            selectedAmenities={selectedAmenities} setSelectedAmenities={setSelectedAmenities}
            resetFilters={resetFilters}
          />
        </div>
        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold text-primary mb-2">Property Listings</h1>
          <p className="text-muted-foreground mb-6">
            Showing {filteredProperties.length} of {allProperties.length} properties.
          </p>
          {filteredProperties.length > 0 ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProperties.map((property, i) => (
                  <motion.div
                    key={property.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
              <h2 className="text-2xl font-semibold text-primary">No Properties Found</h2>
              <p className="mt-2 text-muted-foreground">Try adjusting your search filters to find what you're looking for.</p>
              <Button onClick={resetFilters} className="mt-4" variant="outline">Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
