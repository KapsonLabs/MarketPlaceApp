export type MaterialCategory =
  | "Plumbing"
  | "Electrical"
  | "Paint"
  | "Cleaning"
  | "Hardware"
  | "Garden";

export interface MaterialItem {
  id: string;
  name: string;
  category: MaterialCategory;
  supplier: string;
  location: string;
  price: number;
  unit: string;
  stock: string;
  deliveryTime: string;
  description: string;
}

export const materialCategories: MaterialCategory[] = [
  "Plumbing",
  "Electrical",
  "Paint",
  "Cleaning",
  "Hardware",
  "Garden",
];

export const materials: MaterialItem[] = [
  {
    id: "mat-001",
    name: "PVC pressure pipe 1 inch",
    category: "Plumbing",
    supplier: "Kampala BuildMart",
    location: "Kampala",
    price: 18500,
    unit: "6m length",
    stock: "In stock",
    deliveryTime: "Same day",
    description: "Pressure-rated pipe for domestic water repairs and extensions.",
  },
  {
    id: "mat-002",
    name: "Single lever mixer tap",
    category: "Plumbing",
    supplier: "Nalubega Hardware",
    location: "Wakiso",
    price: 92000,
    unit: "piece",
    stock: "12 available",
    deliveryTime: "Same day",
    description: "Chrome basin mixer with flexible connectors and mounting kit.",
  },
  {
    id: "mat-003",
    name: "Twin socket outlet",
    category: "Electrical",
    supplier: "BrightLine Electrical",
    location: "Kampala",
    price: 16500,
    unit: "piece",
    stock: "In stock",
    deliveryTime: "2 hours",
    description: "Durable wall outlet for residential and light commercial installs.",
  },
  {
    id: "mat-004",
    name: "LED bulkhead security light",
    category: "Electrical",
    supplier: "BrightLine Electrical",
    location: "Kampala",
    price: 58000,
    unit: "piece",
    stock: "8 available",
    deliveryTime: "Same day",
    description: "Weather-resistant exterior fitting for corridors and compounds.",
  },
  {
    id: "mat-005",
    name: "Interior emulsion paint",
    category: "Paint",
    supplier: "FreshCoat Depot",
    location: "Entebbe",
    price: 145000,
    unit: "20L bucket",
    stock: "In stock",
    deliveryTime: "Next day",
    description: "Washable matte paint for rental turnovers and occupied homes.",
  },
  {
    id: "mat-006",
    name: "Deep cleaning starter kit",
    category: "Cleaning",
    supplier: "Sparkle Supplies",
    location: "Kampala",
    price: 76000,
    unit: "kit",
    stock: "In stock",
    deliveryTime: "Same day",
    description: "Disinfectant, degreaser, gloves, microfiber cloths and scrub pads.",
  },
  {
    id: "mat-007",
    name: "Door lock replacement set",
    category: "Hardware",
    supplier: "SecureHome Hardware",
    location: "Mbarara",
    price: 68000,
    unit: "set",
    stock: "20 available",
    deliveryTime: "Next day",
    description: "Lever lockset with keys, latch, screws and strike plate.",
  },
  {
    id: "mat-008",
    name: "Irrigation repair fittings pack",
    category: "Garden",
    supplier: "GreenScape Stores",
    location: "Wakiso",
    price: 42000,
    unit: "pack",
    stock: "10 available",
    deliveryTime: "Same day",
    description: "Assorted connectors, clamps and seals for garden water lines.",
  },
];
