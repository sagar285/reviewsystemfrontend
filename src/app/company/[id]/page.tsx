"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Star, Building2, Globe, Tag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Company, Review, ReviewsResponse } from "@/types";
import { apiUrl, fetchApi } from "@/lib/api";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewListWithReplies from "@/components/reviews/ReviewListWithReplies";
import { ThemeToggle } from "@/components/ThemeToggle";

const PAGE_SIZE = 10;

export default function CompanyProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [company, setCompany] = useState<Company | null>(null);
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [ownerToken, setOwnerToken] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search).get("token");
      const stored = id ? localStorage.getItem(`claim_${id}`) : null;
      setOwnerToken(q || stored || "");
    }
  }, [id]);

  const loadCompany = useCallback(async () => {
    if (!id) return;
    try {
      const data = await fetchApi<Company>(`/api/companies/${id}`);
      setCompany(data);
    } catch (e) {
      toast.error("Company not found");
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadReviews = useCallback(
    async (page = 1) => {
      if (!id) return;
      try {
        const data = await fetchApi<ReviewsResponse>(`/api/reviews/${id}`, {
          params: { page: String(page), limit: String(PAGE_SIZE) },
        });
        setReviewsData(data);
      } catch {
        setReviewsData({ reviews: [], total: 0, page: 1, limit: PAGE_SIZE, totalPages: 0 });
      }
    },
    [id]
  );

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    loadCompany();
  }, [id, loadCompany]);

  useEffect(() => {
    if (id) loadReviews(1);
  }, [id, loadReviews]);

  const handleReviewAdded = useCallback(
    (newReview: Review) => {
      setReviewsData((prev) =>
        prev
          ? {
              ...prev,
              reviews: [newReview, ...prev.reviews],
              total: prev.total + 1,
            }
          : { reviews: [newReview], total: 1, page: 1, limit: PAGE_SIZE, totalPages: 1 }
      );
      loadCompany();
    },
    [loadCompany]
  );

  const handleOwnerReplyAdded = useCallback((reviewId: string, reply: { text: string; createdAt: string }) => {
    setReviewsData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        reviews: prev.reviews.map((r) =>
          r._id === reviewId ? { ...r, ownerReply: reply } : r
        ),
      };
    });
  }, []);

  const saveOwnerToken = () => {
    if (id && ownerToken) {
      localStorage.setItem(`claim_${id}`, ownerToken);
      toast.success("Owner token saved. You can now reply to reviews.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="animate-pulse rounded-xl bg-muted h-48 w-full max-w-2xl" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">Company not found.</p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const avg = company.averageRating ?? 0;
  const count = company.reviewCount ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Search</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Company profile card */}
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-md p-6 sm:p-8 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-border"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-muted flex items-center justify-center border border-border">
                  <Building2 className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">{company.name}</h1>
              {(company.category || company.website) && (
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                  {company.category && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {company.category}
                    </span>
                  )}
                  {company.website && (
                    <a
                      href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold text-foreground">{avg.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground text-sm">{count} reviews</span>
              </div>
              {company.description && (
                <p className="mt-4 text-muted-foreground leading-relaxed">{company.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Owner token (claim) section */}
        {!ownerToken ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Are you the company owner? Enter your claim token to reply to reviews.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Paste claim token from email or add-company confirmation"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={ownerToken}
                onChange={(e) => setOwnerToken(e.target.value)}
              />
              <Button size="sm" onClick={saveOwnerToken} disabled={!ownerToken.trim()}>
                Save token
              </Button>
            </div>
          </div>
        ) : null}

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24">
              <ReviewForm companyId={company._id} onReviewAdded={handleReviewAdded} />
            </div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Recent Reviews {reviewsData ? `(${reviewsData.total})` : ""}
            </h2>
            <ReviewListWithReplies
              reviews={reviewsData?.reviews ?? []}
              totalPages={reviewsData?.totalPages ?? 0}
              currentPage={reviewsData?.page ?? 1}
              onPageChange={loadReviews}
              companyId={company._id}
              ownerToken={ownerToken}
              onReplyAdded={handleOwnerReplyAdded}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
