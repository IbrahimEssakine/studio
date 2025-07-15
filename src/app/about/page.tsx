import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, HeartHandshake, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-foreground">
            Your Vision, Our Expertise
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            We are more than just an eyewear store. We are a team of certified opticians offering thorough eye exams and personalized fittings with modern equipment, dedicated to helping you see the world clearly and in style.
          </p>
        </div>
      </div>

      <div className="relative w-full h-64 md:h-96">
        <Image
          src="https://placehold.co/1600x600.png"
          alt="Our team working"
          layout="fill"
          objectFit="cover"
          className="filter"
          data-ai-hint="optometry store"
        />
        <div className="absolute inset-0 bg-primary/30" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
              Founded on Quality and Care
            </h2>
            <p className="mt-4 text-muted-foreground">
              Agharas Vision was born from the belief that buying glasses should be a
              professional and inspiring experience. We specialize in optical and sunglasses frames, corrective lenses, contact lenses, and accessories.
            </p>
            <p className="mt-4 text-muted-foreground">
              Our journey is defined by a commitment to professional guidance and high-quality visual solutions. We offer a wide selection of designer frames and tailor solutions to your unique lifestyle and visual needs.
            </p>
          </div>
          <div>
            <Image
              src="https://placehold.co/600x400.png"
              alt="Our first store"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
              data-ai-hint="modern optometry"
            />
          </div>
        </div>
      </div>

      <div className="bg-card">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary rounded-full text-primary-foreground">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-2xl font-headline font-semibold">Our Mission</h3>
              <p className="mt-2 text-muted-foreground">
                To provide our customers with the highest quality eyewear and
                unparalleled service, ensuring perfect vision and a confident
                look with professional guidance.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary rounded-full text-primary-foreground">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-2xl font-headline font-semibold">Our Services</h3>
              <p className="mt-2 text-muted-foreground">
                We offer services like glasses repair, child optometry, contact lens fittings, and provide various advanced lens options to suit your needs.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary rounded-full text-primary-foreground">
                <HeartHandshake className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-2xl font-headline font-semibold">Our Values</h3>
              <p className="mt-2 text-muted-foreground">
                Quality, Integrity, and a Passion for helping people see
                better. We are conveniently located in central Agadir for easy access.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
          Ready to See the Difference?
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore our collection or book a personalized consultation with one of
          our expert opticians today.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/shop">Shop Collection</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/book-appointment">Book an Appointment</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
