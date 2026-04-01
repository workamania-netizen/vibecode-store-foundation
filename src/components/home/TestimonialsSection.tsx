import storeConfig from "@/config/store";
import SectionHeading from "@/components/ui/SectionHeading";
import StarRating from "@/components/ui/StarRating";

export default function TestimonialsSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="What Our Customers Say"
          subtitle="Real reviews from honey lovers across the region."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {storeConfig.testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <StarRating rating={testimonial.rating} />
              <blockquote className="mt-4 text-gray-600">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="font-semibold text-dark">{testimonial.name}</p>
                <p className="text-sm text-gray-500">
                  {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
