'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import ColorSwatch from '../../components/color-swatch'
import { MonitorSmartphone } from 'lucide-react'

interface Printer {
  id: string
  name: string
  firmware: string | null
  notes?: string | null
}

interface LoadedSpool {
  printer_id: string
  filament_spool_id: string
  material_name: string
  color: string
  weight_g_remaining: number
}

export default function MachinesPage() {
  const { data: printers, isLoading: loadingPrinters } = useQuery<Printer[]>({
    queryKey: ['printers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('printers').select('*')
      if (error) throw error
      return data as Printer[]
    },
  })

  const { data: loaded, isLoading: loadingLoaded } = useQuery<LoadedSpool[]>({
    queryKey: ['v_printer_loaded'],
    queryFn: async () => {
      const { data, error } = await supabase.from('v_printer_loaded').select('*')
      if (error) throw error
      return data as LoadedSpool[]
    },
  })

  return (
    <div>
      <PageHeader
        title="Machines"
        subtitle="Monitor your 3D printers and see what materials are loaded."
        icon={MonitorSmartphone}
      />
      {loadingPrinters ? (
        <p>Loading…</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {printers?.map((printer) => {
            const loadedSpool = loaded?.find((l) => l.printer_id === printer.id)
            return (
              <Card key={printer.id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{printer.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {printer.firmware ?? ''}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-sm text-muted-foreground mb-1">Loaded Material</div>
                  {loadingLoaded ? (
                    <p>Loading…</p>
                  ) : loadedSpool ? (
                    <div className="flex items-center gap-2">
                      <ColorSwatch color={loadedSpool.color} />
                      <span>{loadedSpool.material_name}</span>
                      <span className="text-xs text-muted-foreground">{loadedSpool.weight_g_remaining}g</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">None</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}