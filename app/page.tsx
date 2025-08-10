'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { AlertCircle, BarChart2, Layers, Package } from "lucide-react";

// A simple dashboard that pulls aggregated information from Supabase
export default function DashboardPage() {
  // Fetch low stock spools (threshold logic is handled in the view)
  const { data: lowStock, isLoading: loadingLowStock } = useQuery({
    queryKey: ['v_low_stock_spools'],
    queryFn: async () => {
      const { data, error } = await supabase.from('v_low_stock_spools').select('*')
      if (error) throw error
      return data
    },
  })

  // Fetch total inventory value
  const { data: inventoryValue, isLoading: loadingInventoryValue } = useQuery({
    queryKey: ['v_inventory_value'],
    queryFn: async () => {
      const { data, error } = await supabase.from('v_inventory_value').select('*').single()
      if (error) throw error
      return data
    },
  })

  // Fetch burn rates
  const { data: burnRate, isLoading: loadingBurnRate } = useQuery({
    queryKey: ['v_burn_rate'],
    queryFn: async () => {
      const { data, error } = await supabase.from('v_burn_rate').select('*')
      if (error) throw error
      return data
    },
  })

  // Fetch printers with loaded spools
  const { data: loadedPrinters, isLoading: loadingLoadedPrinters } = useQuery({
    queryKey: ['v_printer_loaded'],
    queryFn: async () => {
      const { data, error } = await supabase.from('v_printer_loaded').select('*')
      if (error) throw error
      return data
    },
  })

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your farm" icon={BarChart2} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Low Stock Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-poly-blue" /> Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingLowStock ? (
              <p>Loading…</p>
            ) : (
              <p className="text-3xl font-bold">{lowStock?.length ?? 0}</p>
            )}
          </CardContent>
        </Card>
        {/* Inventory Value Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-poly-blue" /> Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingInventoryValue ? (
              <p>Loading…</p>
            ) : (
              <p className="text-3xl font-bold">${(inventoryValue?.total_value ?? 0).toFixed(2)}</p>
            )}
          </CardContent>
        </Card>
        {/* Burn Rate Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-poly-blue" /> Burn Rate (7d/30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingBurnRate ? (
              <p>Loading…</p>
            ) : (
              <div className="space-y-1">
                <div>
                  <span className="font-bold">7d:</span> {burnRate?.find((r: any) => r.window_days === 7)?.burn_rate ?? 0}g
                </div>
                <div>
                  <span className="font-bold">30d:</span> {burnRate?.find((r: any) => r.window_days === 30)?.burn_rate ?? 0}g
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Loaded Printers Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-poly-blue" /> Loaded Printers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingLoadedPrinters ? (
              <p>Loading…</p>
            ) : (
              <p className="text-3xl font-bold">{loadedPrinters?.length ?? 0}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}