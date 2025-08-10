import { PageHeader } from "@/components/page-header"
import { Settings, Moon, Wifi, Thermometer } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure PolyTrack to your needs." icon={Settings} />
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the app.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                <span>Dark Mode</span>
              </Label>
              <Switch id="dark-mode" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>NFC Integration</CardTitle>
            <CardDescription>Setup your NFC reader connection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nfc-endpoint">Reader API Endpoint</Label>
              <Input id="nfc-endpoint" placeholder="http://localhost:8080/scan" />
            </div>
            <Button className="bg-poly-blue hover:bg-poly-blue/90">
              <Wifi className="mr-2 h-4 w-4" /> Test Connection
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle>Humidity Sensor Thresholds</CardTitle>
            <CardDescription>Set alerts for when materials become too wet to print.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Thermometer className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <Label>Max Relative Humidity (%)</Label>
                <Slider defaultValue={[55]} max={100} step={1} className="mt-2" />
              </div>
              <div className="font-mono text-lg p-2 bg-muted rounded-md">55%</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-100/50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">⚠️ PLA Red too wet to print, RH: 68%</p>
              <Button size="sm" variant="outline">
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
