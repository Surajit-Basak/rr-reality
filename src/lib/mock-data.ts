import type { Property, Amenity } from "@/lib/types";
import { Armchair, Car, Dumbbell, PawPrint, Waves, Trees, UtensilsCrossed, Wifi, Wind } from "lucide-react";

export const allAmenities: Amenity[] = [
    { id: 'Pool', label: 'Pool', icon: Waves },
    { id: 'Garage', label: 'Garage', icon: Car },
    { id: 'Garden', label: 'Garden', icon: Trees },
    { id: 'Air Conditioning', label: 'Air Conditioning', icon: Wind },
    { id: 'Gym', label: 'Gym', icon: Dumbbell },
    { id: 'Pet Friendly', label: 'Pet Friendly', icon: PawPrint },
    { id: 'Wifi', label: 'Wifi', icon: Wifi },
    { id: 'Furnished', label: 'Furnished', icon: Armchair },
    { id: 'Kitchen', label: 'Kitchen', icon: UtensilsCrossed },
];
