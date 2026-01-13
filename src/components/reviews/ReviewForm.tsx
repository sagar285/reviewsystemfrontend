
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Need to check if Textarea exists, if not use Input or create one
import { Star } from "lucide-react";
import { useState } from "react";

interface ReviewFormProps {
  companyId: string;
  onReviewAdded: (review: any) => void;
}

export default function ReviewForm({ companyId, onReviewAdded }: ReviewFormProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const formik = useFormik({
    initialValues: {
      userName: "",
      rating: 0,
      text: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("Name is required"),
      rating: Yup.number().min(1, "Please select a rating").required("Rating is required"),
      text: Yup.string().required("Review text is required").min(10, "Review must be at least 10 characters"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await fetch(`https://reviewsystembackend-yndf.onrender.com/api/reviews/${companyId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, companyId }),
        });
        if (res.ok) {
          const newReview = await res.json();
          onReviewAdded(newReview);
          resetForm();
          setHoverRating(0);
        }
      } catch (error) {
        console.error("Error adding review:", error);
      }
    },
  });

  return (
    <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 shadow-2xl">
      <h3 className="text-xl font-semibold text-card-foreground mb-6">Write a Review</h3>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Your Name</label>
          <Input
            placeholder="John Doe"
            name="userName"
            value={formik.values.userName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
          />
          {formik.touched.userName && formik.errors.userName && (
            <p className="text-destructive text-sm">{formik.errors.userName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => formik.setFieldValue("rating", star)}
              >
                <Star 
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || formik.values.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`} 
                />
              </button>
            ))}
          </div>
          {formik.touched.rating && formik.errors.rating && (
            <p className="text-destructive text-sm">{formik.errors.rating}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Review</label>
          <Textarea       
            placeholder="Share your experience..."
            name="text"
            value={formik.values.text}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring min-h-[120px]"
          />
          {formik.touched.text && formik.errors.text && (
            <p className="text-destructive text-sm">{formik.errors.text}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold py-6 text-lg shadow-lg hover:shadow-xl"
        >
          Submit Review
        </Button>
      </form>
    </div>
  );
}
