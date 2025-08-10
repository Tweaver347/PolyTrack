"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Camera } from "lucide-react"
import type { materials } from "@/lib/data"

type Material = (typeof materials)[0]

interface AddMaterialDialogProps {
  onAddMaterial: (newMaterial: Omit<Material, "id">) => void
}

export function AddMaterialDialog({ onAddMaterial }: AddMaterialDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [color, setColor] = useState("#FFFFFF")
  const [remaining, setRemaining] = useState(1000)
  const [cost, setCost] = useState(20)
  const [supplier, setSupplier] = useState("")
  const [location, setLocation] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const rgbToHex = (r: number, g: number, b: number) =>
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? "0" + hex : hex
      })
      .join("")

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, img.width, img.height)

        // Get color from the center pixel
        const pixelData = ctx.getImageData(Math.floor(img.width / 2), Math.floor(img.height / 2), 1, 1).data
        const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2])
        setColor(hexColor)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!name || !type || !supplier || !location) {
      // Basic validation
      alert("Please fill out all required fields.")
      return
    }
    onAddMaterial({
      name,
      type,
      color,
      remaining,
      cost,
      supplier,
      location,
    })
    // Reset form and close dialog
    setName("")
    setType("")
    setColor("#FFFFFF")
    setRemaining(1000)
    setCost(20)
    setSupplier("")
    setLocation("")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-poly-blue hover:bg-poly-blue/90">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Material
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Material</DialogTitle>
          <DialogDescription>Enter the details for the new filament or resin spool/bottle.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select onValueChange={setType} value={type}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLA">PLA</SelectItem>
                <SelectItem value="PETG">PETG</SelectItem>
                <SelectItem value="ABS">ABS</SelectItem>
                <SelectItem value="TPU">TPU</SelectItem>
                <SelectItem value="Resin">Resin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="p-1 h-10 w-16"
              />
              <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
                <Camera className="h-4 w-4" />
                <span className="sr-only">Use Camera to set color</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageCapture}
                accept="image/*"
                capture="environment"
                className="hidden"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remaining" className="text-right">
              Remaining (g)
            </Label>
            <Input
              id="remaining"
              type="number"
              value={remaining}
              onChange={(e) => setRemaining(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cost" className="text-right">
              Cost ($)
            </Label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">
              Supplier
            </Label>
            <Input
              id="supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-poly-blue hover:bg-poly-blue/90">
            Save Material
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
