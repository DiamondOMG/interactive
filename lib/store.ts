import { create } from 'zustand';
import { LiftData } from './types';

interface GlobalState {
  liftData: LiftData[];
  setLiftData: (data: LiftData[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<GlobalState>((set) => ({
  liftData: [],
  setLiftData: (data) => set({ liftData: data }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

// --- Shared filter logic ---
function hasAllFields(item: LiftData): boolean {
  return (
    item.Total?.toString().trim() !== "" &&
    item["libraryItem.label"]?.toString().trim() !== "" &&
    item.screenLabel?.toString().trim() !== "" &&
    item["screen.storeLocation"]?.toString().trim() !== "" &&
    item.itemId?.toString().trim() !== "" &&
    item.screenId?.toString().trim() !== "" &&
    item.libraryItemId?.toString().trim() !== ""
  );
}

/** Hook สำหรับดึง filteredData — ใช้ได้ทุกหน้า */
export function useFilteredData(): LiftData[] {
  const { liftData, searchQuery } = useStore();

  return liftData.filter((item) => {
    // search match
    const searchLower = searchQuery.toLowerCase();
    const searchMatch =
      item.screenLabel?.toLowerCase().includes(searchLower) ||
      item["screen.storeLocation"]?.toLowerCase().includes(searchLower) ||
      item["libraryItem.label"]?.toLowerCase().includes(searchLower);

    return hasAllFields(item) && searchMatch;
  });
}
