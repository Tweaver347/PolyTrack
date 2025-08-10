"use client"

import { Label } from "@/components/ui/label"

import Link from "next/link"
import { notFound } from "next/navigation"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ColorSwatch } from "@/components/color-swatch"
import { machines, materials } from "@/lib/data"
import { ArrowLeft, Cpu, FileText, Clock, Wrench, Layers, ExternalLink, Thermometer, Sprout } from "lucide-react"

const chartConfig = {
  hours: {
    label: "Print Hours",
    color: "hsl(var(--primary))",
  },
}

export default function MachineDetailPage({ params }: { params: { id: string } }) {
  const machine = machines.find((m) => m.id === params.id)

  if (!machine) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Link href="/machines">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader title={machine.name} subtitle="Detailed view of printer status and hardware." icon={Cpu} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Current Print Job */}
          {machine.currentPrint ? (
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Current Print Job</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-6">
                <img
                  src={machine.currentPrint.image || "/placeholder.svg"}
                  alt={machine.currentPrint.file}
                  className="w-full md:w-1/3 h-auto rounded-lg object-cover"
                />
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="font-mono">{machine.currentPrint.file}</span>
                  </div>
                  <div>
                    <Label>Progress</Label>
                    <Progress value={machine.currentPrint.progress} className="mt-1" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Elapsed: {machine.currentPrint.timeElapsed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Remaining: {machine.currentPrint.timeRemaining}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Status: Idle</CardTitle>
                <CardDescription>No active print job. Ready to start.</CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Loaded Materials */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Loaded Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {machine.loadedMaterials.length > 0 ? (
                machine.loadedMaterials.map((loaded) => {
                  const materialInfo = materials.find((m) => m.id === loaded.materialId)
                  if (!materialInfo) return null
                  const originalAmount = materialInfo.type === "Resin" ? 1000 : 1000
                  const percentage = (loaded.remaining / originalAmount) * 100
                  return (
                    <div key={loaded.slot}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{`Slot ${loaded.slot}`}</Badge>
                          <ColorSwatch color={materialInfo.color} />
                          <span className="font-medium">{materialInfo.name}</span>
                        </div>
                        <span className="font-mono text-sm">
                          {loaded.remaining}g / {originalAmount}g
                        </span>
                      </div>
                      <Progress value={percentage} />
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground">No materials loaded.</p>
              )}
            </CardContent>
          </Card>

          {/* Usage History */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Weekly Usage</CardTitle>
              <CardDescription>Total print hours per day for the last week.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <ResponsiveContainer>
                  <BarChart data={machine.usageHistory}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="hours" fill="var(--color-hours)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Stats & Maintenance */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Stats & Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Total Print Hours
                </Label>
                <span className="font-mono">{machine.printHours} hrs</span>
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" /> Predictive Maintenance
                </Label>
                <Progress value={(machine.maintenance.next / 200) * 100} className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1">Next service in {machine.maintenance.next} hours.</p>
              </div>
            </CardContent>
          </Card>

          {/* Hardware Details */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Hardware Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4" /> Bed Type
                </span>
                <span>{machine.bed.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Thermometer className="h-4 w-4" /> Current Nozzle
                </span>
                <span>{machine.nozzles.current}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Sprout className="h-4 w-4" /> Available Nozzles
                </span>
                <div className="flex gap-1">
                  {machine.nozzles.available.map((n) => (
                    <Badge key={n} variant="secondary">
                      {n}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button asChild variant="outline" className="w-full mt-4 bg-transparent">
                <a href={machine.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Manufacturer Website
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
