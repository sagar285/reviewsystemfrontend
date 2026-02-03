"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Company } from "@/types";
import { apiUrl, fetchApi } from "@/lib/api";
import CompanyList from "./reviews/CompanyList";
import AddCompanyForm from "./reviews/AddCompanyForm";
import { ThemeToggle } from "./ThemeToggle";

export default function ReviewSystem() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormName, setAddFormName] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const list = await fetchApi<string[]>("/api/companies/categories");
        setCategories(Array.isArray(list) ? list : []);
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (query) params.q = query;
        if (selectedCategory) params.category = selectedCategory;
        const url = apiUrl("/api/companies", params);
        const res = await fetch(url);
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load companies");
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchCompanies, 300);
    return () => clearTimeout(t);
  }, [query, selectedCategory]);

  const handleAddCompanyClick = () => {
    setAddFormName(query);
    setShowAddForm(true);
  };

  const handleAddCompanySuccess = (company: Company) => {
    setShowAddForm(false);
    setQuery("");
    setCompanies([company]);
    const token = company.claimToken;
    if (token) {
      toast.success(
        <span>
          Company added. Use this token to reply as owner: <code className="text-xs bg-muted px-1 rounded">{token.slice(0, 12)}...</code>
        </span>,
        { duration: 8000 }
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(`claim_${company._id}`, token);
      }
    }
    router.push(`/company/${company._id}?token=${company.claimToken || ""}`);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4 sm:p-6 md:p-8 overflow-x-hidden transition-colors duration-300 relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <header className="text-center space-y-3 sm:space-y-4 py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 drop-shadow-lg">
            Company Reviews
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
            Discover transparent reviews from real employees and customers.
          </p>
        </header>

        {!showAddForm && (
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-500" />
            <div className="relative flex items-center bg-background/50 backdrop-blur-xl border border-border rounded-full px-4 sm:px-6 py-2 shadow-xl">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground mr-2 sm:mr-3 flex-shrink-0" />
              <Input
                placeholder="Search for a company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-base sm:text-lg py-5 sm:py-6"
              />
            </div>
          </div>
        )}

        <section className="transition-all duration-500 ease-in-out">
          {showAddForm ? (
            <AddCompanyForm
              initialName={addFormName}
              onSuccess={handleAddCompanySuccess}
              onCancel={() => setShowAddForm(false)}
            />
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground px-1">
                {query || selectedCategory ? "Search Results" : "Trending Companies"}
              </h2>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-36 sm:h-40 rounded-xl bg-muted/50 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <CompanyList
                  companies={companies}
                  query={query}
                  showAddOption={!!query.trim() && companies.length === 0}
                  onAddCompany={handleAddCompanyClick}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
