"use client";

import Link from "next/link";
import { Company } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Building2, Tag } from "lucide-react";

interface CompanyListProps {
  companies: Company[];
  query: string;
  showAddOption: boolean;
  onAddCompany: () => void;
  categories?: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function CompanyList({
  companies,
  query,
  showAddOption,
  onAddCompany,
  categories = [],
  selectedCategory,
  onCategoryChange,
}: CompanyListProps) {
  return (
    <div className="space-y-6">
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Category:</span>
          <Button
            variant={selectedCategory === "" ? "secondary" : "outline"}
            size="sm"
            onClick={() => onCategoryChange("")}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "secondary" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-in fade-in duration-500">
        {companies.map((company) => (
          <Link key={company._id} href={`/company/${company._id}`}>
            <Card className="h-full cursor-pointer group hover:scale-[1.02] transition-all duration-300 border-border bg-card/50 backdrop-blur-md shadow-xl hover:shadow-2xl hover:bg-card/80">
              <CardHeader className="pb-2">
                <div className="flex gap-3">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border border-border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-muted flex items-center justify-center border border-border flex-shrink-0">
                      <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl font-bold text-card-foreground group-hover:text-primary transition-colors truncate">
                      {company.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">
                          {(company.averageRating ?? 0).toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {company.reviewCount ?? 0} reviews
                      </span>
                      {company.category && (
                        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <Tag className="w-3 h-3" />
                          {company.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground line-clamp-2 mt-2 text-sm">
                  {company.description || "No description"}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {showAddOption && (
        <div className="col-span-full text-center p-6 sm:p-8 rounded-xl border border-dashed border-border bg-card/30 backdrop-blur-sm">
          <p className="mb-4 text-base sm:text-lg text-foreground">
            No company found named &quot;{query}&quot;
          </p>
          <Button
            onClick={onAddCompany}
            variant="secondary"
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            Add &quot;{query}&quot; to Database
          </Button>
        </div>
      )}
    </div>
  );
}
