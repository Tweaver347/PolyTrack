"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cpu, Power, Wrench, ChevronRight, Filter, X, ChevronDown } from "lucide-react"
import { machines, materials } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ColorSwatch } from "@/components/color-swatch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import type { Machine } from "@/lib/types"

export default function MachinesPage() {
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>(machines)

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])

  const unique = useMemo(() => {
    const types = [...new Set(machines.map((m) => m.name.replace(/ #\d+$/, "")))].sort()
    const allMaterials = materials.sort((a, b) => a.name.localeCompare(b.name))
    return { types, allMaterials }
  }, [])

  const resetFilters = () => {
    setStatusFilter("All")
    setSelectedTypes([])
    setSelectedMaterials([])
  }

  useEffect(() => {
    const newFilteredMachines = machines
      .filter((m) => (statusFilter === "All" ? true : m.status === statusFilter))
      .filter((m) => (selectedTypes.length === 0 ? true : selectedTypes.includes(m.name.replace(/ #\d+$/, ""))))
      .filter((m) =>
        selectedMaterials.length === 0
          ? true
          : m.loadedMaterials.some((lm) => selectedMaterials.includes(lm.materialId)),
      )

    setFilteredMachines(newFilteredMachines)
  }, [statusFilter, selectedTypes, selectedMaterials])

  const handleMultiSelect = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    currentValues: string[],
    value: string,
  ) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    setter(newValues)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Printing":
        return "bg-poly-blue"
      case "Idle":
        return "bg-green-500"
      case "Maintenance":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <TooltipProvider>
      <div>
        <PageHeader title="Machines" subtitle="Monitor and manage your 3D printers." icon={Cpu} />

        <Card className="rounded-2xl shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                {["All", "Printing", "Idle", "Maintenance"].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "ghost"}
                    onClick={() => setStatusFilter(status)}
                    className={`flex-1 ${statusFilter === status ? getStatusColor(status) + " text-white hover:opacity-90" : ""}`}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <Label>Machine Type</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    <span>{selectedTypes.length > 0 ? `${selectedTypes.length} selected` : "Select Types"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {unique.types.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => handleMultiSelect(setSelectedTypes, selectedTypes, type)}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Loaded Material Filter */}
            <div className="space-y-2">
              <Label>Loaded Material</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    <span>
                      {selectedMaterials.length > 0 ? `${selectedMaterials.length} selected` : "Select Materials"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto">
                  <DropdownMenuLabel>Filter by Loaded Material</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {unique.allMaterials.map((material) => (
                    <DropdownMenuCheckboxItem
                      key={material.id}
                      checked={selectedMaterials.includes(material.id)}
                      onCheckedChange={() => handleMultiSelect(setSelectedMaterials, selectedMaterials, material.id)}
                    >
                      <div className="flex items-center gap-2">
                        <ColorSwatch color={material.color} className="h-4 w-4" />
                        <span>{material.name}</span>
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={resetFilters} variant="ghost">
              <X className="mr-2 h-4 w-4" /> Clear All Filters
            </Button>
          </CardFooter>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMachines.length > 0 ? (
            filteredMachines.map((machine) => {
              return (
                <Link href={`/machines/${machine.id}`} key={machine.id}>
                  <Card className="rounded-2xl shadow-sm flex flex-col h-full hover:shadow-lg hover:border-poly-blue transition-all">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        {machine.name}
                        <Badge className={`${getStatusColor(machine.status)} text-white`}>{machine.status}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="text-sm text-muted-foreground">Currently Loaded</div>
                      <div className="flex items-center gap-1.5 mt-1 h-6">
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
                          <p className="text-sm text-muted-foreground">None</p>
                        )}
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-muted-foreground mb-1">Print Progress</div>
                        <Progress
                          value={machine.status === "Printing" ? machine.currentPrint?.progress || 0 : 0}
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="bg-transparent pointer-events-none">
                          <Power className="mr-2 h-4 w-4" /> Load
                        </Button>
                        <Button size="sm" variant="ghost" className="pointer-events-none">
                          <Wrench className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        View Details <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No machines match the current filters.
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
