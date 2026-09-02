"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  X,
  MapPin,
} from "lucide-react";
import { usePopup } from "@/components/ui/ModalProvider";

interface ReviewItem {
  id: string;
  authorName: string;
  authorLocation: string;
  rating: number;
  eventTitle: string;
  comment: string;
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("F-7, Islamabad");
  const [formRating, setFormRating] = useState(5);
  const [formEventTitle, setFormEventTitle] = useState("1st Birthday Party");
  const [formComment, setFormComment] = useState("");

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/reviews");
      const json = await res.json();
      if (json.success) setReviews(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: formName,
          authorLocation: formLocation,
          rating: formRating,
          eventTitle: formEventTitle,
          comment: formComment,
          isFeatured: true,
          isActive: true,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFeatured = async (review: ReviewItem) => {
    try {
      await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: review.id, isFeatured: !review.isFeatured }),
      });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const { confirm, toast } = usePopup();

  const handleDeleteReview = (id: string) => {
    confirm({
      title: "Delete Customer Review",
      message: "Are you sure you want to delete this customer review?",
      variant: "danger",
      confirmText: "Yes, Delete",
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
          toast("Review deleted successfully", "success");
          fetchReviews();
        } catch (err) {
          console.error(err);
        }
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-warm-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider font-semibold">
            <Star className="w-3.5 h-3.5" />
            <span>Marketing & Social Proof</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-navy-950 font-bold mt-1">
            Customer Reviews & Testimonials
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600 mt-1">
            Manage verified client reviews displayed across the homepage and public reviews page.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchReviews}
            className="p-2.5 rounded-xl border border-brand-warm-300 bg-white text-brand-navy-700 hover:bg-brand-warm-100 transition-colors text-xs font-medium flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-gold flex items-center space-x-2 text-xs py-2.5 px-4 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client Review</span>
          </button>
        </div>
      </div>

      {/* REVIEWS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white p-6 rounded-2xl border border-brand-warm-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-amber-500">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <button
                  onClick={() => toggleFeatured(r)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                    r.isFeatured
                      ? "bg-brand-gold-50 text-brand-gold-800 border border-brand-gold-300"
                      : "bg-brand-warm-100 text-brand-navy-600"
                  }`}
                >
                  {r.isFeatured ? "Featured" : "Standard"}
                </button>
              </div>

              <p className="text-xs text-brand-navy-800 leading-relaxed italic">
                &ldquo;{r.comment}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-brand-warm-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-brand-navy-950">{r.authorName}</p>
                <p className="text-[11px] text-brand-navy-500 flex items-center">
                  <MapPin className="w-3 h-3 text-brand-gold-600 mr-0.5" />
                  {r.authorLocation}
                </p>
              </div>

              <button
                onClick={() => handleDeleteReview(r.id)}
                className="text-rose-600 hover:text-rose-800 p-1"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-brand-warm-200">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-4">
              <h2 className="font-serif font-bold text-lg text-brand-navy-950">Add Client Review</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-brand-warm-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Author / Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fatima Zahra"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. F-7, Islamabad"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Rating</label>
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. 1st Birthday Setup"
                  value={formEventTitle}
                  onChange={(e) => setFormEventTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Review Comment *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Client feedback and experience..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-warm-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-gold px-5 py-2 text-xs font-semibold flex items-center space-x-1.5"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Publish Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
