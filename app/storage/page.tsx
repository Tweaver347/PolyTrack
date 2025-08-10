'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Archive } from 'lucide-react'

interface StorageLocation {
  id: string
  name: string
  notes: string | null
}

export default function StoragePage() {
  const { data: locations, isLoading } = useQuery<StorageLocation[]>({
    queryKey: ['storage_locations'],
    queryFn: async () => {
      const { data, error } = await supabase.from('storage_locations').select('*')
      if (error) throw error
      return data as StorageLocation[]
    },
  })

  return (
    <div>
      <PageHeader title="Storage" subtitle="View and manage storage locations" icon={Archive} />
      {isLoading ? (
        <p>Loading…</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {locations?.map((loc) => (
            <Card key={loc.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{loc.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {loc.notes ? (
                  <p className="text-sm text-muted-foreground">{loc.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No notes</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}