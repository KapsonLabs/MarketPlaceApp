export type Specialty =
  | "Plumbing"
  | "Electrical"
  | "HVAC"
  | "Appliance"
  | "Structural"
  | "Cleaning"
  | "Painting"
  | "Landscaping"
  | "Other";

export interface Provider {
  id: string;
  name: string;
  company: string;
  specialty: Specialty;
  city: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  responseTime: string;
  verified: boolean;
  bio: string;
  yearsExperience: number;
  completedJobs: number;
  serviceAreas?: string[];
  languages?: string[];
  certifications?: string[];
  services?: string[];
  availability?: string;
  profileReviews?: ProviderReview[];
  coverImage?: string;
  gallery?: string[];
}

export interface ProviderReview {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  service: string;
  comment: string;
}

export const providers: Provider[] = [
  {
    id: "sp-001",
    name: "James Otieno",
    company: "Otieno Plumbing Works",
    specialty: "Plumbing",
    city: "Kampala",
    rating: 4.9,
    reviews: 184,
    hourlyRate: 1500,
    responseTime: "Under 1 hour",
    verified: true,
    bio: "Licensed plumber with 12 years on residential and commercial systems. Same-day emergency callouts.",
    yearsExperience: 12,
    completedJobs: 410,
    serviceAreas: ["Kampala Central", "Kololo", "Ntinda", "Naguru"],
    languages: ["English", "Luganda", "Swahili"],
    certifications: ["Licensed plumber", "Water systems safety", "Emergency leak response"],
    services: ["Leak detection", "Tap and valve repair", "Pump installation", "Drain unblocking"],
    availability: "Weekdays, Saturdays and emergency callouts",
    profileReviews: [
      {
        id: "rev-001",
        author: "Sarah N.",
        role: "Tenant",
        rating: 5,
        date: "Apr 2026",
        service: "Kitchen leak repair",
        comment:
          "Arrived on time, explained the repair clearly and helped source the missing parts before closing the job.",
      },
      {
        id: "rev-002",
        author: "Property desk",
        role: "Landlord team",
        rating: 5,
        date: "Mar 2026",
        service: "Bathroom plumbing",
        comment:
          "Good updates through the job and clean handover photos for the tenant maintenance file.",
      },
      {
        id: "rev-003",
        author: "Daniel K.",
        role: "Direct customer",
        rating: 4,
        date: "Feb 2026",
        service: "Water pump pressure issue",
        comment:
          "Diagnosed the pressure problem quickly and gave a fair quote before replacing the faulty valve.",
      },
    ],
  },
  {
    id: "sp-002",
    name: "Aisha Mwangi",
    company: "BrightSpark Electrical",
    specialty: "Electrical",
    city: "Mbarara",
    rating: 4.8,
    reviews: 142,
    hourlyRate: 1800,
    responseTime: "Same day",
    verified: true,
    bio: "Certified electrician handling rewiring, panel upgrades, solar tie-ins, and fault finding.",
    yearsExperience: 9,
    completedJobs: 287,
    serviceAreas: ["Mbarara", "Nyamitanga", "Ruti", "Kakoba"],
    languages: ["English", "Runyankole", "Swahili"],
    certifications: ["Certified electrician", "Solar tie-in safety", "Panel upgrade specialist"],
    services: ["Fault finding", "Rewiring", "Socket installation", "Backup power setup"],
    availability: "Weekdays and booked weekend jobs",
    profileReviews: [
      {
        id: "rev-004",
        author: "Moses A.",
        role: "Property manager",
        rating: 5,
        date: "Apr 2026",
        service: "Distribution board repair",
        comment: "Clear diagnosis, tidy work and a useful safety note for future inspections.",
      },
      {
        id: "rev-005",
        author: "Immaculate R.",
        role: "Tenant",
        rating: 5,
        date: "Mar 2026",
        service: "Power outage fault",
        comment: "She restored power fast and showed me which appliance had caused the trip.",
      },
    ],
  },
  {
    id: "sp-003",
    name: "Daniel Kiprono",
    company: "CoolAir HVAC",
    specialty: "HVAC",
    city: "Entebbe",
    rating: 4.7,
    reviews: 96,
    hourlyRate: 2200,
    responseTime: "Next day",
    verified: true,
    bio: "Air-conditioning install, service, and refrigerant work for apartments and offices.",
    yearsExperience: 7,
    completedJobs: 168,
    serviceAreas: ["Entebbe", "Kitoro", "Katabi", "Kajjansi"],
    languages: ["English", "Luganda"],
    certifications: ["HVAC service technician", "Refrigerant handling"],
    services: ["AC servicing", "Filter replacement", "Refrigerant top-up", "Thermostat repair"],
    availability: "Next-day appointments and planned maintenance visits",
    profileReviews: [
      {
        id: "rev-006",
        author: "Airport Office Park",
        role: "Facilities team",
        rating: 5,
        date: "Apr 2026",
        service: "Office AC servicing",
        comment:
          "Professional scheduling and every unit was tagged with service notes after inspection.",
      },
      {
        id: "rev-007",
        author: "Linda M.",
        role: "Direct customer",
        rating: 4,
        date: "Jan 2026",
        service: "Bedroom AC repair",
        comment:
          "The unit is cooling properly again and the quote was explained before work started.",
      },
    ],
  },
  {
    id: "sp-004",
    name: "Grace Wambui",
    company: "Wambui Appliance Repair",
    specialty: "Appliance",
    city: "Wakiso",
    rating: 4.9,
    reviews: 211,
    hourlyRate: 1200,
    responseTime: "Same day",
    verified: true,
    bio: "Fridges, washing machines, ovens — fixed in-home with a 90-day workmanship warranty.",
    yearsExperience: 11,
    completedJobs: 502,
    serviceAreas: ["Wakiso", "Kira", "Namugongo", "Najjera"],
    languages: ["English", "Luganda"],
    certifications: ["Appliance diagnostics", "Refrigeration repair"],
    services: ["Fridge repair", "Washer repair", "Oven diagnostics", "Spare part fitting"],
    availability: "Same-day diagnostics when parts are available",
    profileReviews: [
      {
        id: "rev-008",
        author: "Janet O.",
        role: "Tenant",
        rating: 5,
        date: "Apr 2026",
        service: "Fridge repair",
        comment:
          "Grace found the fault quickly and returned with the correct part the same afternoon.",
      },
      {
        id: "rev-009",
        author: "Samuel T.",
        role: "Landlord",
        rating: 5,
        date: "Feb 2026",
        service: "Washing machine service",
        comment: "Helpful repair report and photos made it easy to approve the final payment.",
      },
    ],
  },
  {
    id: "sp-005",
    name: "Peter Kamau",
    company: "Solid Build Co.",
    specialty: "Structural",
    city: "Kiambu",
    rating: 4.6,
    reviews: 58,
    hourlyRate: 2500,
    responseTime: "1–2 days",
    verified: true,
    bio: "Cracks, masonry, roofing repairs, waterproofing. NCA-registered contractor.",
    yearsExperience: 15,
    completedJobs: 134,
  },
  {
    id: "sp-006",
    name: "Mary Achieng",
    company: "SparkleHome Cleaning",
    specialty: "Cleaning",
    city: "Kampala",
    rating: 4.8,
    reviews: 320,
    hourlyRate: 800,
    responseTime: "Same day",
    verified: true,
    bio: "Deep cleans, post-tenancy moveouts, carpet shampooing.",
    yearsExperience: 6,
    completedJobs: 870,
  },
  {
    id: "sp-007",
    name: "Brian Ndegwa",
    company: "FreshCoat Painters",
    specialty: "Painting",
    city: "Nakuru",
    rating: 4.7,
    reviews: 74,
    hourlyRate: 1000,
    responseTime: "Next day",
    verified: false,
    bio: "Interior and exterior painting, decorative finishes, free colour consultation.",
    yearsExperience: 8,
    completedJobs: 192,
  },
  {
    id: "sp-008",
    name: "Lucy Njeri",
    company: "GreenScape Gardens",
    specialty: "Landscaping",
    city: "Kampala",
    rating: 4.9,
    reviews: 63,
    hourlyRate: 1100,
    responseTime: "1–2 days",
    verified: true,
    bio: "Garden design, lawn care, irrigation, and outdoor lighting.",
    yearsExperience: 10,
    completedJobs: 145,
  },
];

export const specialties: Specialty[] = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliance",
  "Structural",
  "Cleaning",
  "Painting",
  "Landscaping",
  "Other",
];

export function getProvider(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}

// Stable, keyword-themed images per specialty (Unsplash CDN, fixed IDs).
export const SPECIALTY_IMAGES: Record<Specialty, string> = {
  Plumbing:
    "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=70",
  Electrical:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=70",
  HVAC: "https://images.unsplash.com/photo-1631545308456-15bbf41a1d62?auto=format&fit=crop&w=1200&q=70",
  Appliance:
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=70",
  Structural:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=70",
  Cleaning:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=70",
  Painting:
    "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=70",
  Landscaping:
    "https://images.unsplash.com/photo-1599629954294-14df9ec8bc34?auto=format&fit=crop&w=1200&q=70",
  Other:
    "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=70",
};

export function providerCover(p: Provider): string {
  return p.coverImage ?? SPECIALTY_IMAGES[p.specialty];
}

export function providerGallery(p: Provider): string[] {
  if (p.gallery && p.gallery.length) return p.gallery;
  // Use specialty hero + two generic worksite shots so every profile shows a gallery.
  return [
    SPECIALTY_IMAGES[p.specialty],
    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=70",
    "https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=900&q=70",
  ];
}
