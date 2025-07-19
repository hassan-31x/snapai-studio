import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import ImageSlider from "./_components/image-slider";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";

export default async function SubmissionsPage() {
  const submissions = await db.submission.findMany({
    orderBy: { createdAt: "desc" },
  });

  const categories = [
    ...Array.from(new Set(submissions.map((s) => s.productCategory).filter(Boolean))),
  ];

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Submissions</h1>
        <p className="text-muted-foreground mt-1">
          Browse all generated AI creative submissions, filter by product category, and view details.
        </p>
      </div>
      <Tabs defaultValue={categories[0] || "all"} className="space-y-8">
        <TabsList className="flex flex-wrap gap-2 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <SubmissionsGrid submissions={submissions} />
        </TabsContent>
        {categories.map((cat) => (
          <TabsContent key={cat} value={cat}>
            <SubmissionsGrid submissions={submissions.filter((s) => s.productCategory === cat)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function SubmissionsGrid({ submissions }: { submissions: any[] }) {
  if (!submissions.length) return <div className="text-muted-foreground">No submissions found.</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {submissions.map((submission) => (
        <Card key={submission.id} className="overflow-hidden group hover:shadow-lg transition-all border-muted/60 relative">
          <div className="relative w-full aspect-[4/3] bg-slate-50 flex items-center justify-center">
            <ImageSlider submission={submission} />
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-lg truncate">{submission.productName}</h4>
              <Badge variant="outline" className="bg-slate-50 text-xs">
                {submission.productCategory}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mb-2 truncate">
              {submission.productTagline}
            </div>
            <div className="flex flex-wrap gap-1 text-xs">
              <span className="font-medium">Brand:</span> {submission.brandName}
            </div>
            <div className="flex flex-wrap gap-1 text-xs">
              <span className="font-medium">Submitted:</span> {new Date(submission.createdAt).toLocaleDateString()}
            </div>
            <div className="flex justify-end mt-4">
              <Link href={`/submissions/${submission.id}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline group/link">
                <span className="text-xs font-medium">View</span>
                <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


