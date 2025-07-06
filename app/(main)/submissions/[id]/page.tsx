import { getSubmissionById } from "@/actions/get-submission";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Image as ImageIcon } from "lucide-react";
import SingleDownload from "../_components/single-download";
import MultipleDownload from "../_components/multiple-download";
import { imageTypes } from "@/lib/image-types";


export default async function SubmissionPage({ params }: any) {
  const id = await params.id;
  const submission = await getSubmissionById(id);

  if (!submission) return notFound();

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Submission Details</h1>
        <p className="text-muted-foreground mt-1">
          Here are your generated AI creatives and details for <span className="font-semibold">{submission.productName}</span>
        </p>
      </div>
      <div className="space-y-8">
        <Card className="border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <CardTitle>Generated AI Creatives</CardTitle>
            </div>
            <CardDescription>
              <div className="flex flex-col gap-2">
                <div>
                  Product: <span className="font-semibold">{submission.productName}</span>
                </div>
                <div>
                  Product Category: <span className="font-semibold">{submission.productCategory}</span>
                </div>
                <div>
                  Product Tagline: <span className="font-semibold">{submission.productTagline}</span>
                </div>
                <div>
                  Product Description: <span className="font-semibold">{submission.productDescription}</span>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              Social Media Creatives
            </h3>
            <MultipleDownload submission={submission} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageTypes.map((img, idx) => {
              const url = submission[img.key as keyof typeof submission] as string;
              if (!url) return null;
              return (
                <Card key={idx} className="overflow-hidden group hover:shadow-lg transition-all border-muted/60">
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-50">
                    <img 
                      src={url} 
                      alt={img.label} 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center">
                      <SingleDownload
                        url={url}
                        filename={`${img.label.replace(/\s+/g, '_').toLowerCase()}.png`}
                        img={img}
                      />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-slate-100">
                          {/* You can add an icon here if needed */}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{img.label}</h4>
                          <p className="text-xs text-muted-foreground">{img.dimensions}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-slate-50 text-xs">
                        {img.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
