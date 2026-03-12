import { create } from 'zustand';
import { LiftData } from './types';

interface GlobalState {
  liftData: LiftData[];
  setLiftData: (data: LiftData[]) => void;
  selectedSection: string;
  setSelectedSection: (section: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<GlobalState>((set) => ({
  liftData: [],
  setLiftData: (data) => set({ liftData: data }),
  selectedSection: 'all',
  setSelectedSection: (section) => set({ selectedSection: section }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
