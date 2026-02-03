"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Company } from "@/types";
import { apiUrl } from "@/lib/api";

interface AddCompanyFormProps {
  initialName: string;
  onSuccess: (company: Company) => void;
  onCancel: () => void;
}

export default function AddCompanyForm({ initialName, onSuccess, onCancel }: AddCompanyFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: initialName,
      description: "",
      logo: "",
      website: "",
      category: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Company name is required").trim(),
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const res = await fetch(apiUrl("/api/companies"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name.trim(),
            description: values.description.trim() || undefined,
            logo: values.logo.trim() || undefined,
            website: values.website.trim() || undefined,
            category: values.category.trim() || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Failed to add company");
          setSubmitting(false);
          return;
        }
        toast.success("Company added! Save your owner token to reply to reviews.");
        onSuccess(data);
      } catch {
        toast.error("Failed to add company. Please try again.");
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-md p-4 sm:p-6 shadow-lg max-w-lg mx-auto">
      <h3 className="text-lg font-semibold text-foreground mb-4">Add company</h3>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Name *</label>
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Company name"
            className="mt-1"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-destructive text-sm mt-1">{formik.errors.name}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Description</label>
          <Textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            placeholder="Short description"
            className="mt-1 min-h-[80px]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Logo URL</label>
          <Input
            name="logo"
            value={formik.values.logo}
            onChange={formik.handleChange}
            placeholder="https://..."
            type="url"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Website</label>
          <Input
            name="website"
            value={formik.values.website}
            onChange={formik.handleChange}
            placeholder="https://..."
            type="url"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Category</label>
          <Input
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            placeholder="e.g. E-commerce, Tech"
            className="mt-1"
          />
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add company"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
