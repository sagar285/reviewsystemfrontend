
import { Company } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CompanyListProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  query: string;
  showAddOption: boolean;
  onAddCompany: () => void;
}

export default function CompanyList({ 
  companies, 
  onSelectCompany, 
  query, 
  showAddOption, 
  onAddCompany 
}: CompanyListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {companies.map((company) => (
        <Card 
          key={company._id} 
          className="cursor-pointer group hover:scale-105 transition-all duration-300 border-border bg-card/50 backdrop-blur-md shadow-xl hover:shadow-2xl hover:bg-card/80"
          onClick={() => onSelectCompany(company)}
        >
          <CardHeader>
            <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
              {company.name}
            </CardTitle>
            <CardDescription className="text-muted-foreground line-clamp-2">
              {company.description}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
      
      {showAddOption && (
        <div className="col-span-full text-center p-8 rounded-xl border border-dashed border-border bg-card/30 backdrop-blur-sm">
          <p className="mb-4 text-lg text-foreground">No company found named "{query}"</p>
          <Button 
            onClick={onAddCompany}
            variant="secondary"
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            Add "{query}" to Database
          </Button>
        </div>
      )}
    </div>
  );
}
