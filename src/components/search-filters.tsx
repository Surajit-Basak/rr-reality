'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { allAmenities } from "@/lib/mock-data";
import { RotateCcw } from "lucide-react";
import React from "react";

interface SearchFiltersProps {
  keyword: string;
  setKeyword: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  bedrooms: string;
  setBedrooms: (value: string) => void;
  bathrooms: string;
  setBathrooms: (value: string) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (value: string[]) => void;
  resetFilters: () => void;
}

export function SearchFilters({
  keyword, setKeyword,
  propertyType, setPropertyType,
  status, setStatus,
  priceRange, setPriceRange,
  bedrooms, setBedrooms,
  bathrooms, setBathrooms,
  selectedAmenities, setSelectedAmenities,
  resetFilters,
}: SearchFiltersProps) {

  const handleAmenityChange = (amenityId: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };
  
  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `$${(price / 1000)}k`;
    return `$${price}`;
  };

  return (
    <Card className="sticky top-20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="keyword">Keyword</Label>
          <Input id="keyword" placeholder="Title, location..." value={keyword} onChange={e => setKeyword(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Property Type</Label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Condo">Condo</SelectItem>
              <SelectItem value="Land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Status</SelectItem>
              <SelectItem value="For Sale">For Sale</SelectItem>
              <SelectItem value="For Rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Price Range</Label>
            <span className="text-sm text-muted-foreground">{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
          </div>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={2000000}
            step={50000}
            className="py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Select value={bathrooms} onValueChange={setBathrooms}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-3">
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {allAmenities.slice(0, 6).map(amenity => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`amenity-${amenity.id}`} 
                  checked={selectedAmenities.includes(amenity.id)}
                  onCheckedChange={() => handleAmenityChange(amenity.id)}
                />
                <Label htmlFor={`amenity-${amenity.id}`} className="text-sm font-normal">{amenity.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
