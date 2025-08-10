"use client"

import type React from "react"

import Link from "next/link"
import { notFound } from "next/navigation"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ColorSwatch } from "@/components/color-swatch"
import { storageBins, materials } from "@/lib/data"
import { Archive, ArrowLeft, Boxes, Thermometer, Wind, Share2, ShieldCheck } from "lucide-react"

const chartConfig = {
  temp: {
    label: "Temperature (°C)",
    color: "hsl(var(--destructive))",
  },
  humidity: {
    label: "Humidity (%)",
    color: "hsl(var(--primary))",
  },
}

const featureIcons: { [key: string]: React.ElementType } = {
  "Active Drying": Wind,
  "Direct Feed": Share2,
  "UV Protection": ShieldCheck,
}

export default function StorageBinPage({ params }: { params: { id: string } }) {
  const bin = storageBins.find((b) => b.id === params.id)

  if (!bin) {
    notFound()
  }

  const binMaterials = materials.filter((m) => m.location === bin.name)

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Link href="/storage">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader title={bin.name} subtitle="Detailed view of storage container." icon={Archive} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Environment History</CardTitle>
              <CardDescription>Temperature and humidity over the last 5 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ResponsiveContainer>
                  <LineChart data={bin.history} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temp"
                      stroke="var(--color-temp)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="humidity"
                      stroke="var(--color-humidity)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Boxes className="h-5 w-5" />
                Materials in this Container
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {binMaterials.length > 0 ? (
                    binMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium flex items-center gap-3">
                          <ColorSwatch color={material.color} />
                          {material.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{material.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">{material.remaining}g</span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        This container is empty.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Bin Features</CardTitle>
            </CardHeader>
            <CardContent>
              {bin.features.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {bin.features.map((feature) => {
                    const Icon = featureIcons[feature] || Thermometer
                    return (
                      <Badge key={feature} variant="secondary" className="p-2 justify-start">
                        <Icon className="h-4 w-4 mr-2" />
                        {feature}
                      </Badge>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No special features.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
