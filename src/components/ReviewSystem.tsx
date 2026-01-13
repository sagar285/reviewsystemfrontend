
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";  
import { Search } from "lucide-react";
import { Company, Review } from "@/types";
import CompanyList from "./reviews/CompanyList";
import ReviewList from "./reviews/ReviewList";
import ReviewForm from "./reviews/ReviewForm"; 
import { ThemeToggle } from "./ThemeToggle";

export default function ReviewSystem() {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  // Initial fetch and search
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        // If query is empty, it fetches top companies (handled by backend optimization)
        const url = `https://reviewsystembackend-yndf.onrender.com/api/companies?q=${query}`;
        const res = await fetch(url);
        const data = await res.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchCompanies, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // Fetch Reviews when company selected
  useEffect(() => {
    if (selectedCompany) {
      fetch(`https://reviewsystembackend-yndf.onrender.com/api/reviews/${selectedCompany._id}`)
        .then((res) => res.json())
        .then((data) => setReviews(data))
        .catch((err) => console.error(err));
    }
  }, [selectedCompany]);

  const handleAddCompany = async () => {
    try {
      const res = await fetch('https://reviewsystembackend-yndf.onrender.com/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: query, description: 'Community added company' })
      });
      if (res.ok) {
        const newCompany = await res.json();
        setCompanies([newCompany]);
        setSelectedCompany(newCompany);
      }
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  const handleReviewAdded = (newReview: Review) => {
    setReviews([newReview, ...reviews]);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4 md:p-8 overflow-x-hidden transition-colors duration-300 relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 drop-shadow-lg">
            Company Reviews
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover transparent reviews from real employees and customers.
          </p>
        </div>

        {/* Search Bar - Only show when no company selected */}
        {!selectedCompany && (
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-background/50 backdrop-blur-xl border border-border rounded-full px-6 py-2 shadow-2xl">
              <Search className="w-6 h-6 text-muted-foreground mr-3" />
              <Input
                placeholder="Search for a company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-lg py-6"
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="transition-all duration-500 ease-in-out">
          {!selectedCompany ? (
            <div className="space-y-6">
               <div className="flex items-center justify-between px-4">
                  <h2 className="text-2xl font-bold text-white">
                    {query ? 'Search Results' : 'Trending Companies'}
                  </h2>
               </div>
               
               {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[1,2,3].map(i => (
                     <div key={i} className="h-40 rounded-xl bg-white/5 animate-pulse" />
                   ))}
                 </div>
               ) : (
                 <CompanyList 
                   companies={companies}
                   onSelectCompany={setSelectedCompany}
                   query={query}
                   showAddOption={!!query && companies.length === 0}
                   onAddCompany={handleAddCompany}
                 />
               )}
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-10 fade-in duration-500">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCompany(null)}
                className="mb-6 text-white hover:bg-white/10 hover:text-white"
              >
                ← Back to Search
              </Button>
              
              <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column: Company Info & Review Form */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-3xl font-bold text-white mb-4">{selectedCompany.name}</h2>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedCompany.description || "No description available for this company."}
                    </p>
                  </div>
                  
                  <div className="sticky top-8">
                    <ReviewForm 
                      companyId={selectedCompany._id} 
                      onReviewAdded={handleReviewAdded} 
                    />
                  </div>
                </div>

                {/* Right Column: Reviews List */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white">
                      Recent Reviews ({reviews.length})
                    </h3>
                  </div>
                  <ReviewList reviews={reviews} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
