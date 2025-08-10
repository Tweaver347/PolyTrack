'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/page-header'
import { Table, TableHead, TableHeadCell, TableRow, TableBody, TableCell } from '../../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { List } from 'lucide-react'

interface ActivityLog {
  id: string
  event_type: string
  printer_name: string | null
  spool_material: string | null
  color: string | null
  grams: number | null
  created_at: string
  note: string | null
}

export default function LogsPage() {
  const { data: logs, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ['v_activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_activity')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as ActivityLog[]
    },
  })

  return (
    <div>
      <PageHeader title="Usage Logs" subtitle="Review recent material usage and printer loading activity" icon={List} />
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <p className="p-4">Loading…</p>
          ) : logs && logs.length > 0 ? (
            <Table className="min-w-full">
              <TableHead>
                <TableRow>
                  <TableHeadCell>Event</TableHeadCell>
                  <TableHeadCell>Printer</TableHeadCell>
                  <TableHeadCell>Material</TableHeadCell>
                  <TableHeadCell>Amount</TableHeadCell>
                  <TableHeadCell>Date</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell className="capitalize">{log.event_type.replace('-', ' ')}</TableCell>
                    <TableCell>{log.printer_name ?? '-'}</TableCell>
                    <TableCell>
                      {log.color ? <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: log.color }} /> : null}
                      {log.spool_material ?? '-'}
                    </TableCell>
                    <TableCell>{log.grams ? `${log.grams}g` : '-'}</TableCell>
                    <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="p-4">No activity yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}