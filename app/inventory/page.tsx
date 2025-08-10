"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Boxes, MoreHorizontal, Droplet, Weight, Edit, Trash2, Cpu, Filter, X, ChevronDown } from "lucide-react"
import { materials as initialMaterials } from "@/lib/data"
import { ColorSwatch } from "@/components/color-swatch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AddMaterialDialog } from "@/components/add-material-dialog"

type Material = (typeof initialMaterials)[0]

export default function InventoryPage() {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials)
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>(materials)

  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [gramsRange, setGramsRange] = useState<[number, number]>([0, 1000])
  const [costRange, setCostRange] = useState<[number, number]>([0, 50])
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  const unique = useMemo(() => {
    const types = [...new Set(materials.map((m) => m.type))]
    const suppliers = [...new Set(materials.map((m) => m.supplier))]
    const locations = [...new Set(materials.map((m) => m.location))]
    const maxGrams = Math.max(...materials.map((m) => m.remaining), 1000)
    const maxCost = Math.max(...materials.map((m) => m.cost), 50)
    return { types, suppliers, locations, maxGrams, maxCost }
  }, [materials])

  const resetFilters = () => {
    setSelectedTypes([])
    setGramsRange([0, unique.maxGrams])
    setCostRange([0, unique.maxCost])
    setSelectedSuppliers([])
    setSelectedLocations([])
  }

  useEffect(() => {
    const newFilteredMaterials = materials
      .filter((m) => (selectedTypes.length === 0 ? true : selectedTypes.includes(m.type)))
      .filter((m) => m.remaining >= gramsRange[0] && m.remaining <= gramsRange[1])
      .filter((m) => m.cost >= costRange[0] && m.cost <= costRange[1])
      .filter((m) => (selectedSuppliers.length === 0 ? true : selectedSuppliers.includes(m.supplier)))
      .filter((m) => (selectedLocations.length === 0 ? true : selectedLocations.includes(m.location)))

    setFilteredMaterials(newFilteredMaterials)
  }, [selectedTypes, gramsRange, costRange, selectedSuppliers, selectedLocations, materials])

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

  const handleAddNewMaterial = (newMaterialData: Omit<Material, "id">) => {
    const newMaterial: Material = {
      id: `${newMaterialData.type}-${newMaterialData.name.replace(/\s+/g, "")}-${Date.now()}`,
      ...newMaterialData,
    }
    setMaterials([newMaterial, ...materials])
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <PageHeader title="Inventory" subtitle="Manage your filament and resin stock." icon={Boxes} />
        <AddMaterialDialog onAddMaterial={handleAddNewMaterial} />
      </div>

      <Card className="rounded-2xl shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* Type Filter */}
          <div className="space-y-2">
            <Label>Material Type</Label>
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

          {/* Grams Filter */}
          <div className="space-y-2">
            <Label>Grams Remaining</Label>
            <Slider
              value={gramsRange}
              onValueChange={(value) => setGramsRange(value as [number, number])}
              max={unique.maxGrams}
              step={10}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{gramsRange[0]}g</span>
              <span>{gramsRange[1]}g</span>
            </div>
          </div>

          {/* Cost Filter */}
          <div className="space-y-2">
            <Label>Cost / Unit</Label>
            <Slider
              value={costRange}
              onValueChange={(value) => setCostRange(value as [number, number])}
              max={unique.maxCost}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${costRange[0]}</span>
              <span>${costRange[1]}</span>
            </div>
          </div>

          {/* Supplier Filter */}
          <div className="space-y-2">
            <Label>Supplier</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-transparent">
                  <span>
                    {selectedSuppliers.length > 0 ? `${selectedSuppliers.length} selected` : "Select Suppliers"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Supplier</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {unique.suppliers.map((supplier) => (
                  <DropdownMenuCheckboxItem
                    key={supplier}
                    checked={selectedSuppliers.includes(supplier)}
                    onCheckedChange={() => handleMultiSelect(setSelectedSuppliers, selectedSuppliers, supplier)}
                  >
                    {supplier}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <Label>Location</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-transparent">
                  <span>
                    {selectedLocations.length > 0 ? `${selectedLocations.length} selected` : "Select Locations"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Location</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {unique.locations.map((location) => (
                  <DropdownMenuCheckboxItem
                    key={location}
                    checked={selectedLocations.includes(location)}
                    onCheckedChange={() => handleMultiSelect(setSelectedLocations, selectedLocations, location)}
                  >
                    {location}
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

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Cost/Unit</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => (
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
                    <TableCell>${material.cost.toFixed(2)}</TableCell>
                    <TableCell>{material.supplier}</TableCell>
                    <TableCell>{material.location}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Cpu className="mr-2 h-4 w-4" /> Assign to Machine
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Weight className="mr-2 h-4 w-4" /> Mark as Low
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Droplet className="mr-2 h-4 w-4" /> Mark for Drying
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No materials match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
