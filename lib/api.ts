import { LiftData } from './types';
import { getMergedLiftData } from './actions';

export async function getLiftData(): Promise<LiftData[]> {
  try {
    // เรียกใช้ Server Action โดยตรง (ไม่ต้องใช้ Absolute URL)
    const rawData = await getMergedLiftData();
    let data: LiftData[] = Array.isArray(rawData) ? rawData : [];

    // --- Logic: Fill Zero สำหรับวันนี้ ---
    const now = new Date();
    const dd = String(now.getUTCDate()).padStart(2, '0');
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = now.getUTCFullYear();
    const todayKey = `displayCount_${dd}/${mm}/${yyyy}`;

    data = data.map((item) => {
      if (!(todayKey in item)) {
        return {
          ...item,
          [todayKey]: "0"
        };
      }
      return item;
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching data via server action:', error);
    return [];
  }
}
