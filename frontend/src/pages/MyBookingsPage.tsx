import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Star, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { getGuestBookings, createReview, Booking } from "../lib/api";
import { toast } from "sonner";

interface MyBookingsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function MyBookingsPage({ onNavigate }: MyBookingsPageProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBookingId, setExpandedBookingId] = useState<number | null>(
    null
  );
  const [reviewingBookingId, setReviewingBookingId] = useState<number | null>(
    null
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [aiAccuracyFeedback, setAiAccuracyFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getGuestBookings();
      setBookings(data);
    } catch (error: any) {
      console.error("Error loading bookings:", error);

      // Check if it's an authentication error
      if (
        error.message?.includes("401") ||
        error.message?.includes("Authentication required")
      ) {
        toast.error("Please log in to view your bookings");
        onNavigate("login");
      } else {
        toast.error(error.message || "Failed to load bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  const openReviewDialog = (booking: Booking) => {
    setReviewingBookingId(booking.booking_id);
    setRating(5);
    setComment("");
    setAiAccuracyFeedback("");
  };

  const handleCancelReview = () => {
    setReviewingBookingId(null);
    setRating(5);
    setComment("");
    setAiAccuracyFeedback("");
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    const booking = bookings.find((b) => b.booking_id === reviewingBookingId);
    if (!booking) return;

    try {
      setSubmitting(true);
      await createReview(
        booking.booking_id,
        rating,
        comment,
        aiAccuracyFeedback
      );
      toast.success("Review submitted successfully!");
      handleCancelReview();
      loadBookings(); // Reload to update has_review status
    } catch (error: any) {
      console.error("Error submitting review:", error);

      if (
        error.message?.includes("401") ||
        error.message?.includes("Authentication required")
      ) {
        toast.error("Please log in to submit a review");
        handleCancelReview();
        onNavigate("login");
      } else {
        toast.error(error.message || "Failed to submit review");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl">My Bookings</h1>
              <p className="text-white/90 text-lg">
                View and review your stays
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring and book your perfect stay!
            </p>
            <Button onClick={() => onNavigate("search")}>
              Browse Properties
            </Button>
          </Card>
        )}

        {!loading && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.booking_id} className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Property Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl text-gray-900 mb-2">
                          {booking.property.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.property.location}</span>
                        </div>
                        <p className="text-gray-700 font-medium">
                          {booking.room.title}
                        </p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="text-gray-900 font-medium">
                          {new Date(booking.check_in).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="text-gray-900 font-medium">
                          {new Date(booking.check_out).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Cost</span>
                        <span className="text-2xl text-gray-900 font-bold">
                          ${booking.total_cost}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Section */}
                  <div className="lg:w-64 flex flex-col justify-between border-l lg:pl-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Booked on</p>
                      <p className="text-gray-900 mb-4">
                        {new Date(booking.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    {booking.has_review ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Review submitted</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Thank you for your feedback!
                        </p>
                      </div>
                    ) : (
                      <Button
                        onClick={() => openReviewDialog(booking)}
                        className="w-full"
                        disabled={booking.status === "cancelled"}
                        variant={
                          reviewingBookingId === booking.booking_id
                            ? "default"
                            : "outline"
                        }
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {reviewingBookingId === booking.booking_id
                          ? "Writing Review..."
                          : "Leave a Review"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Inline Review Form */}
                {reviewingBookingId === booking.booking_id &&
                  !booking.has_review && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Share Your Experience
                      </h3>

                      {/* Star Rating */}
                      <div>
                        <Label className="text-base mb-3 block">
                          Rate your stay
                        </Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              onClick={() => setRating(value)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  value <= rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-3 text-xl text-gray-900 font-semibold">
                            {rating}/5
                          </span>
                        </div>
                      </div>

                      {/* Comment */}
                      <div>
                        <Label
                          htmlFor={`comment-${booking.booking_id}`}
                          className="text-base mb-2 block"
                        >
                          Your Review
                        </Label>
                        <Textarea
                          id={`comment-${booking.booking_id}`}
                          placeholder="Tell us about your experience..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={4}
                          className="resize-none"
                        />
                      </div>

                      {/* AI Feedback */}
                      <div>
                        <Label
                          htmlFor={`ai-feedback-${booking.booking_id}`}
                          className="text-base mb-2 block"
                        >
                          AI Feedback (Optional)
                        </Label>
                        <Textarea
                          id={`ai-feedback-${booking.booking_id}`}
                          placeholder="Did our AI recommendation help?"
                          value={aiAccuracyFeedback}
                          onChange={(e) =>
                            setAiAccuracyFeedback(e.target.value)
                          }
                          rows={2}
                          className="resize-none"
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleSubmitReview}
                          disabled={submitting || !comment.trim()}
                          className="flex-1"
                        >
                          {submitting ? "Submitting..." : "Submit Review"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancelReview}
                          disabled={submitting}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
