"use client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ScanLine } from "lucide-react"

export function NfcButton() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "NFC Scan",
          description: "Ready to scan NFC tag...",
        })
      }}
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-poly-green text-black shadow-lg hover:bg-poly-green/90"
    >
      <ScanLine className="h-8 w-8" />
      <span className="sr-only">Scan NFC Tag</span>
    </Button>
  )
}
