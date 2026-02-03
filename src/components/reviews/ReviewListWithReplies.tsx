"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare } from "lucide-react";
import { Review } from "@/types";
import { apiUrl } from "@/lib/api";

interface ReviewListWithRepliesProps {
  reviews: Review[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  companyId: string;
  ownerToken: string;
  onReplyAdded: (reviewId: string, reply: { text: string; createdAt: string }) => void;
}

export default function ReviewListWithReplies({
  reviews,
  totalPages,
  currentPage,
  onPageChange,
  companyId,
  ownerToken,
  onReplyAdded,
}: ReviewListWithRepliesProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card/30 backdrop-blur-md p-8 text-center text-muted-foreground">
        <p>No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 max-h-[none]">
        {reviews.map((review) => (
          <ReviewCardWithReply
            key={review._id}
            review={review}
            companyId={companyId}
            ownerToken={ownerToken}
            onReplyAdded={onReplyAdded}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function ReviewCardWithReply({
  review,
  companyId,
  ownerToken,
  onReplyAdded,
}: {
  review: Review;
  companyId: string;
  ownerToken: string;
  onReplyAdded: (reviewId: string, reply: { text: string; createdAt: string }) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmitReply = async () => {
    const text = replyText.trim();
    if (!text || !ownerToken) return;
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl(`/api/reviews/${review._id}/reply`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimToken: ownerToken, text }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to post reply");
        return;
      }
      onReplyAdded(review._id, data.ownerReply);
      setReplyText("");
      setShowForm(false);
      toast.success("Reply posted");
    } catch {
      toast.error("Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur-md shadow-lg overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <CardTitle className="text-base sm:text-lg font-semibold text-card-foreground">
            {review.userName}
          </CardTitle>
          <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-sm">{review.rating}</span>
          </div>
        </div>
        <CardDescription className="text-muted-foreground text-sm">
          {new Date(review.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-card-foreground/90 leading-relaxed text-sm sm:text-base">{review.text}</p>

        {review.ownerReply && (
          <div className="rounded-lg bg-primary/5 border border-border pl-4 pr-4 py-3 border-l-4 border-l-primary">
            <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              Company response
            </p>
            <p className="text-sm text-foreground/90">{review.ownerReply.text}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(review.ownerReply.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {ownerToken && !review.ownerReply && (
          <div className="pt-2">
            {!showForm ? (
              <Button variant="ghost" size="sm" onClick={() => setShowForm(true)} className="text-primary">
                Reply as company owner
              </Button>
            ) : (
              <div className="space-y-2">
                <textarea
                  placeholder="Write your response..."
                  className="w-full min-h-[80px] rounded-lg border border-border bg-background px-3 py-2 text-sm resize-y"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  maxLength={2000}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSubmitReply} disabled={!replyText.trim() || submitting}>
                    {submitting ? "Posting..." : "Post reply"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowForm(false)} disabled={submitting}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
