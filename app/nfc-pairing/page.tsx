"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { machines, materials } from "@/lib/data"
import type { Machine, Material } from "@/lib/types"
import { ScanLine, Loader, CheckCircle, XCircle, ArrowRight, Cpu } from "lucide-react"
import { ColorSwatch } from "@/components/color-swatch"
import { Badge } from "@/components/ui/badge"

type WorkflowState =
  | "idle"
  | "pairing-printer"
  | "printer-paired"
  | "scanning-existing"
  | "awaiting-new"
  | "scanning-new"
  | "load-complete"
  | "error"

export default function NfcPairingPage() {
  const [workflowState, setWorkflowState] = useState<WorkflowState>("idle")
  const [pairedPrinter, setPairedPrinter] = useState<Machine | null>(null)
  const [unloadedMaterial, setUnloadedMaterial] = useState<Material | null>(null)
  const [newlyLoadedMaterial, setNewlyLoadedMaterial] = useState<Material | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const { toast } = useToast()

  const handlePairPrinter = () => {
    setWorkflowState("pairing-printer")
    setTimeout(() => {
      const randomPrinter = machines.find((m) => m.loadedMaterials.length > 0 && m.type !== "Resin") || machines[0]
      setPairedPrinter(randomPrinter)
      setWorkflowState("printer-paired")
      toast({ title: "Printer Paired", description: `Successfully paired with ${randomPrinter.name}.` })
    }, 2000)
  }

  const handleScanExisting = () => {
    setWorkflowState("scanning-existing")
    setTimeout(() => {
      if (!pairedPrinter || pairedPrinter.loadedMaterials.length === 0) {
        setErrorMessage("Paired printer has no materials to unload.")
        setWorkflowState("error")
        return
      }
      const shouldFail = Math.random() < 0.1 // 10% chance of error
      if (shouldFail) {
        const wrongMaterial = materials.find((m) => !pairedPrinter.loadedMaterials.some((lm) => lm.materialId === m.id))
        setErrorMessage(`Error: Scanned ${wrongMaterial?.name}, which is not loaded on this printer.`)
        setWorkflowState("error")
        toast({
          variant: "destructive",
          title: "Scan Error",
          description: `Scanned material not found on ${pairedPrinter.name}.`,
        })
      } else {
        const materialToUnload = pairedPrinter.loadedMaterials[0]
        const materialInfo = materials.find((m) => m.id === materialToUnload.materialId)
        setUnloadedMaterial(materialInfo || null)
        setWorkflowState("awaiting-new")
        toast({
          title: "Filament Verified",
          description: `Verified ${materialInfo?.name}. Ready to load new filament.`,
        })
      }
    }, 2000)
  }

  const handleScanNew = () => {
    setWorkflowState("scanning-new")
    setTimeout(() => {
      const newMaterial = materials.find(
        (m) => m.type !== "Resin" && !pairedPrinter?.loadedMaterials.some((lm) => lm.materialId === m.id),
      )
      if (!newMaterial || !pairedPrinter) {
        setErrorMessage("Could not find a suitable new material to load.")
        setWorkflowState("error")
        return
      }
      const slotToLoad = pairedPrinter.loadedMaterials.find((lm) => lm.materialId === unloadedMaterial?.id)?.slot || 1
      const updatedMaterials = pairedPrinter.loadedMaterials.filter((lm) => lm.materialId !== unloadedMaterial?.id)
      updatedMaterials.push({ slot: slotToLoad, materialId: newMaterial.id, remaining: 1000 })

      setPairedPrinter({ ...pairedPrinter, loadedMaterials: updatedMaterials.sort((a, b) => a.slot - b.slot) })
      setNewlyLoadedMaterial(newMaterial)
      setWorkflowState("load-complete")
      toast({
        title: "Load Complete",
        description: `Successfully loaded ${newMaterial.name} onto ${pairedPrinter.name}.`,
      })
    }, 2000)
  }

  const handleReset = () => {
    setWorkflowState("idle")
    setPairedPrinter(null)
    setUnloadedMaterial(null)
    setNewlyLoadedMaterial(null)
    setErrorMessage("")
  }

  const renderContent = () => {
    switch (workflowState) {
      case "idle":
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Pair</h2>
            <p className="text-muted-foreground mb-8">
              Press the button below and hold your device near the printer's NFC tag.
            </p>
            <Button
              size="lg"
              className="h-24 w-64 text-xl bg-poly-blue hover:bg-poly-blue/90"
              onClick={handlePairPrinter}
            >
              <ScanLine className="mr-4 h-8 w-8" /> Pair with Printer
            </Button>
          </div>
        )
      case "pairing-printer":
      case "scanning-existing":
      case "scanning-new":
        return (
          <div className="text-center">
            <Loader className="h-16 w-16 animate-spin mx-auto text-poly-blue mb-6" />
            <h2 className="text-2xl font-bold animate-pulse">Scanning...</h2>
            <p className="text-muted-foreground">Please hold your device steady.</p>
          </div>
        )
      case "printer-paired":
        return (
          pairedPrinter && (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Printer Paired: {pairedPrinter.name}</h2>
              <p className="text-muted-foreground mb-6">
                Now, scan an existing filament spool on this printer to continue.
              </p>
              <Button size="lg" onClick={handleScanExisting}>
                Scan Existing Filament <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )
        )
      case "awaiting-new":
        return (
          unloadedMaterial && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Filament Verified</h2>
              <p className="text-muted-foreground mb-6">
                You are about to replace <span className="font-semibold text-primary">{unloadedMaterial.name}</span>.
              </p>
              <p className="text-muted-foreground mb-6">Scan the new filament spool you wish to load.</p>
              <Button size="lg" onClick={handleScanNew}>
                Scan New Filament <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )
        )
      case "load-complete":
        return (
          pairedPrinter &&
          newlyLoadedMaterial && (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Load Complete!</h2>
              <p className="text-muted-foreground mb-6">
                Successfully loaded <span className="font-semibold text-primary">{newlyLoadedMaterial.name}</span> onto{" "}
                <span className="font-semibold text-primary">{pairedPrinter.name}</span>.
              </p>
              <Button size="lg" onClick={handleReset}>
                Pair Another Printer
              </Button>
            </div>
          )
        )
      case "error":
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
            <p className="text-muted-foreground mb-6">{errorMessage}</p>
            <Button size="lg" variant="destructive" onClick={handleReset}>
              Try Again
            </Button>
          </div>
        )
    }
  }

  return (
    <div>
      <PageHeader
        title="NFC Pairing & Loading"
        subtitle="A streamlined workflow for managing materials."
        icon={ScanLine}
      />
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-2xl shadow-sm min-h-[400px] flex items-center justify-center">
          <CardContent className="p-6">{renderContent()}</CardContent>
        </Card>
        <Card className="lg:col-span-1 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Printer Status
            </CardTitle>
            <CardDescription>Details of the currently paired printer.</CardDescription>
          </CardHeader>
          <CardContent>
            {pairedPrinter ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{pairedPrinter.name}</h3>
                  <p className="text-sm text-muted-foreground">{pairedPrinter.status}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Loaded Materials</h4>
                  <ul className="space-y-2">
                    {pairedPrinter.loadedMaterials.map((m) => {
                      const matInfo = materials.find((mat) => mat.id === m.materialId)
                      return (
                        <li key={m.slot} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Slot {m.slot}</Badge>
                            <ColorSwatch color={matInfo?.color || "#FFF"} />
                            <span>{matInfo?.name}</span>
                          </div>
                          <span className="font-mono text-muted-foreground">{m.remaining}g</span>
                        </li>
                      )
                    })}
                    {pairedPrinter.loadedMaterials.length === 0 && (
                      <p className="text-sm text-muted-foreground">No materials loaded.</p>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-10">
                <p>Waiting to pair with a printer...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
