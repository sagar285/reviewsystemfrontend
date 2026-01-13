
import { Review } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground bg-card/30 backdrop-blur-md rounded-xl border border-border">
        <p className="text-lg">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
      {reviews.map((review) => (
        <Card 
          key={review._id} 
          className="border-border bg-card/50 backdrop-blur-md shadow-lg transition-all hover:bg-card/70"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-card-foreground">{review.userName}</CardTitle>
              <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full backdrop-blur-sm">
                <span className="text-yellow-400 font-bold">{review.rating}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
            <CardDescription className="text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground/90 leading-relaxed">{review.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
