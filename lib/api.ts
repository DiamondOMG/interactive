import { LiftData } from './types';

export async function getLiftData(): Promise<LiftData[]> {
  const url = 'https://script.google.com/macros/s/AKfycbyZRJ4yoRWuvatmpEzZyc8hQFHdpfMHgPia7ZMN1gzLxByLL_rDo8CCr19qG8pgidGC/exec?action=getall';
  
  try {
    const res = await fetch(url, {
      next: { revalidate: 600 },
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch data from API');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
