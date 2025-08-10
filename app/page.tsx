"use client"

import Link from "next/link"
import { Cpu, Gauge, Bell, Film, Droplets, Wrench, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { materials, machines, logs } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ColorSwatch } from "@/components/color-swatch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function DashboardPage() {
  const lowStock = materials.filter((m) => m.remaining < 300)
  const activeMachines = machines.filter((m) => m.status === "Printing")
  const maintenanceMachines = machines.filter((m) => m.status === "Maintenance")
  const filamentCount = materials.filter((m) => m.type !== "Resin").length
  const resinCount = materials.filter((m) => m.type === "Resin").length
  const recentLogs = logs.slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Printing":
        return "bg-poly-blue text-white"
      case "Idle":
        return "bg-green-500 text-white"
      case "Maintenance":
        return "bg-orange-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <TooltipProvider>
      <div>
        <PageHeader title="Dashboard" subtitle="At-a-glance overview of your print farm operations." icon={Gauge} />

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Machines Active</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeMachines.length} / {machines.length}
              </div>
              <p className="text-xs text-muted-foreground">Currently printing</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStock.length} items</div>
              <p className="text-xs text-muted-foreground">Below 300g/mL threshold</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Needs Maintenance</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maintenanceMachines.length} machines</div>
              <p className="text-xs text-muted-foreground">Currently in maintenance</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filament Spools</CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filamentCount}</div>
              <p className="text-xs text-muted-foreground">Total spools in inventory</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resin Bottles</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resinCount}</div>
              <p className="text-xs text-muted-foreground">Total bottles in inventory</p>
            </CardContent>
          </Card>
        </div>

        {/* Machine Fleet Overview */}
        <Card className="rounded-2xl shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Machine Fleet Overview</CardTitle>
            <CardDescription>Live status of all printers in the farm.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {machines.map((machine) => (
                <Link href={`/machines/${machine.id}`} key={machine.id}>
                  <Card className="rounded-lg h-full flex flex-col hover:border-poly-blue transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex justify-between items-center">
                        {machine.name}
                        <Badge className={getStatusColor(machine.status)}>{machine.status}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 truncate">
                          {machine.currentPrint ? machine.currentPrint.file : "No active print"}
                        </div>
                        <Progress value={machine.currentPrint?.progress || 0} />
                      </div>
                      <div className="flex items-center gap-1.5 h-6">
                        {machine.loadedMaterials.length > 0 ? (
                          machine.loadedMaterials.map((loaded) => {
                            const materialInfo = materials.find((m) => m.id === loaded.materialId)
                            if (!materialInfo) return null
                            return (
                              <Tooltip key={materialInfo.id} delayDuration={100}>
                                <TooltipTrigger>
                                  <ColorSwatch color={materialInfo.color} />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{materialInfo.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            )
                          })
                        ) : (
                          <p className="text-xs text-muted-foreground">Empty</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Inventory Alerts */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Inventory Alerts</CardTitle>
                <CardDescription>Materials that are running low.</CardDescription>
              </div>
              <Link href="/inventory">
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStock.length > 0 ? (
                    lowStock.slice(0, 5).map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <ColorSwatch color={material.color} />
                          {material.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">{material.remaining}g</Badge>
                        </TableCell>
                        <TableCell>{material.location}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No low stock alerts.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest material usage logs.</CardDescription>
              </div>
              <Link href="/logs">
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.material}</TableCell>
                      <TableCell>{log.machine}</TableCell>
                      <TableCell className="font-mono">{log.amount}g</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
