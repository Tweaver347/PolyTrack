import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { List, CheckCircle, XCircle } from "lucide-react"
import { logs } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

export default function LogsPage() {
  return (
    <div>
      <PageHeader title="Usage Logs" subtitle="Track all material usage across the farm." icon={List} />
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Machine</TableHead>
                <TableHead>Amount Used</TableHead>
                <TableHead>NFC Scan</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.material}</TableCell>
                  <TableCell>{log.machine}</TableCell>
                  <TableCell>
                    <span className="font-mono">{log.amount}g</span>
                  </TableCell>
                  <TableCell>
                    {log.nfc ? (
                      <Badge variant="secondary" className="text-green-600 border-green-600/50">
                        <CheckCircle className="mr-1 h-3 w-3" /> Yes
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-red-600 border-red-600/50">
                        <XCircle className="mr-1 h-3 w-3" /> No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
