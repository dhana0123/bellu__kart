import { create } from 'zustand';

interface LocationState {
  address: string;
  estimatedTime: string;
  setAddress: (address: string) => void;
  setEstimatedTime: (time: string) => void;
}

export const useLocation = create<LocationState>()((set) => ({
  address: "HSR Layout, Bangalore",
  estimatedTime: "8-10 mins",
  setAddress: (address: string) => {
    // Calculate estimated time based on location
    const time = calculateEstimatedTime(address);
    set({ address, estimatedTime: time });
  },
  setEstimatedTime: (estimatedTime: string) => set({ estimatedTime }),
}));

function calculateEstimatedTime(address: string): string {
  // Simple logic to estimate delivery time based on location
  const location = address.toLowerCase();
  
  if (location.includes('hsr') || location.includes('koramangala')) {
    return "8-10 mins";
  } else if (location.includes('indiranagar') || location.includes('marathahalli')) {
    return "12-15 mins";
  } else if (location.includes('whitefield') || location.includes('electronic city')) {
    return "15-20 mins";
  } else if (location.includes('current location')) {
    return "8-10 mins";
  } else {
    return "10-15 mins";
  }
}