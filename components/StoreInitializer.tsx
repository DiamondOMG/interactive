'use client';

import { useEffect } from "react"
import { useStore } from '@/lib/store';
import { LiftData } from '@/lib/types';

export default function StoreInitializer({ data }: { data: LiftData[] }) {
    useEffect(() => {
    useStore.setState({ liftData: data })
  }, [data])

  return null
}
