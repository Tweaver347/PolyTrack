'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Table, TableHead, TableHeadCell, TableRow, TableBody, TableCell } from '../../components/ui/table'
import { Badge } from '../../components/ui/badge'
import ColorSwatch from '../../components/color-swatch'
import { Package } from 'lucide-react'

interface Spool {
  id: string
  material_name: string
  color: string
  brand: string | null
  weight_g_remaining: number
  storage_name: string | null
  status: string
}

export default function InventoryPage() {
  // Fetch spools from the enriched view. Each row includes the material and storage names.
  const { data: spools, isLoading } = useQuery<Spool[]>({
    queryKey: ['v_spools_enriched'],
    queryFn: async () => {
      const { data, error } = await supabase.from('v_spools_enriched').select('*')
      if (error) throw error
      return data as Spool[]
    },
  })

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('active')
  const [materialFilter, setMaterialFilter] = useState<string>('all')

  // Derive unique material names for the filter drop-down
  const materials = useMemo(() => {
    const names = new Set(spools?.map((s) => s.material_name) || [])
    return ['all', ...Array.from(names).sort()]
  }, [spools])

  const filteredSpools = useMemo(() => {
    return (spools || [])
      .filter((s) => (statusFilter === 'all' ? true : s.status === statusFilter))
      .filter((s) => (materialFilter === 'all' ? true : s.material_name === materialFilter))
  }, [spools, statusFilter, materialFilter])

  return (
    <div>
      <PageHeader title="Inventory" subtitle="Manage and view your material spools." icon={Package} />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-800"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Material</label>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-800"
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value)}
              >
                {materials.map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Spool Inventory</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <p className="p-4">Loading…</p>
          ) : (
            <Table className="min-w-full">
              <TableHead>
                <TableRow>
                  <TableHeadCell>Material</TableHeadCell>
                  <TableHeadCell>Color</TableHeadCell>
                  <TableHeadCell>Brand</TableHeadCell>
                  <TableHeadCell>Remaining</TableHeadCell>
                  <TableHeadCell>Location</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSpools.map((spool) => (
                  <TableRow key={spool.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell>{spool.material_name}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <ColorSwatch color={spool.color} className="w-3 h-3" />
                      <span>{spool.color}</span>
                    </TableCell>
                    <TableCell>{spool.brand ?? '-'}</TableCell>
                    <TableCell>{spool.weight_g_remaining}g</TableCell>
                    <TableCell>{spool.storage_name ?? '-'}</TableCell>
                    <TableCell>
                      <Badge variant={spool.status === 'active' ? 'default' : 'secondary'}>
                        {spool.status.charAt(0).toUpperCase() + spool.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}