import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

export default function VideoSection() {
  return (
    <section id="video" className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Zobacz jak pracujemy</h2>
          <p className="text-lg text-muted-foreground">
            Przekonaj się o jakości naszych usług
          </p>
        </div>
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-muted">
              <iframe
                src="https://www.youtube.com/embed/5MS_COp6CnA"
                title="Zobacz jak pracujemy - SprzątanieMieszkań.com"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                data-testid="video-youtube"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}