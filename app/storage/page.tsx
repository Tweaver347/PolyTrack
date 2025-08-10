import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Archive, Wind, ChevronRight } from "lucide-react"
import { storageBins } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function StoragePage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader title="Storage" subtitle="Visualize your material storage locations." icon={Package} />
        <div className="flex gap-2">
          <Button variant="outline">
            <Wind className="mr-2 h-4 w-4" /> Filter: Dry Only
          </Button>
          <Button variant="outline">
            <Archive className="mr-2 h-4 w-4" /> Filter: Needs Drying
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {storageBins.map((bin) => (
          <Link href={`/storage/${bin.id}`} key={bin.id}>
            <Card className="rounded-2xl shadow-sm hover:shadow-lg hover:border-poly-blue transition-all h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Archive className="h-5 w-5 text-muted-foreground" />
                    {bin.name}
                  </div>
                  <Badge
                    variant={bin.status === "Empty" ? "secondary" : "default"}
                    className={bin.status === "Dry" ? "bg-poly-blue" : ""}
                  >
                    {bin.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                {bin.contents.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {bin.contents.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Empty</p>
                )}
              </CardContent>
              <div className="p-4 pt-0 text-xs text-muted-foreground flex justify-end items-center">
                View Details <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
