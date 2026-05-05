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
}

export const providers: Provider[] = [
  {
    id: "sp-001",
    name: "James Otieno",
    company: "Otieno Plumbing Works",
    specialty: "Plumbing",
    city: "Nairobi",
    rating: 4.9,
    reviews: 184,
    hourlyRate: 1500,
    responseTime: "Under 1 hour",
    verified: true,
    bio: "Licensed plumber with 12 years on residential and commercial systems. Same-day emergency callouts.",
    yearsExperience: 12,
    completedJobs: 410,
  },
  {
    id: "sp-002",
    name: "Aisha Mwangi",
    company: "BrightSpark Electrical",
    specialty: "Electrical",
    city: "Nairobi",
    rating: 4.8,
    reviews: 142,
    hourlyRate: 1800,
    responseTime: "Same day",
    verified: true,
    bio: "Certified electrician handling rewiring, panel upgrades, solar tie-ins, and fault finding.",
    yearsExperience: 9,
    completedJobs: 287,
  },
  {
    id: "sp-003",
    name: "Daniel Kiprono",
    company: "CoolAir HVAC",
    specialty: "HVAC",
    city: "Mombasa",
    rating: 4.7,
    reviews: 96,
    hourlyRate: 2200,
    responseTime: "Next day",
    verified: true,
    bio: "Air-conditioning install, service, and refrigerant work for apartments and offices.",
    yearsExperience: 7,
    completedJobs: 168,
  },
  {
    id: "sp-004",
    name: "Grace Wambui",
    company: "Wambui Appliance Repair",
    specialty: "Appliance",
    city: "Nairobi",
    rating: 4.9,
    reviews: 211,
    hourlyRate: 1200,
    responseTime: "Same day",
    verified: true,
    bio: "Fridges, washing machines, ovens — fixed in-home with a 90-day workmanship warranty.",
    yearsExperience: 11,
    completedJobs: 502,
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
    city: "Nairobi",
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
    city: "Nairobi",
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