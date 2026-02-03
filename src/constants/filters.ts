export interface ColorOption {
  hex: string;
  name: string;
}

export interface ProductTypeOption {
  value: string;
  label: string;
}

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const COLORS: ColorOption[] = [
  { hex: "#000000", name: "Black" },
  { hex: "#FFFFFF", name: "White" },
  { hex: "#808080", name: "Gray" },
  { hex: "#C0C0C0", name: "Silver" },
  { hex: "#000080", name: "Navy" },
  { hex: "#0000FF", name: "Blue" },
  { hex: "#87CEEB", name: "Sky Blue" },
  { hex: "#008000", name: "Green" },
  { hex: "#90EE90", name: "Light Green" },
  { hex: "#FF0000", name: "Red" },
  { hex: "#FFC0CB", name: "Pink" },
  { hex: "#FFB6C1", name: "Light Pink" },
  { hex: "#800080", name: "Purple" },
  { hex: "#FFFF00", name: "Yellow" },
  { hex: "#FFA500", name: "Orange" },
  { hex: "#A52A2A", name: "Brown" },
  { hex: "#F5F5DC", name: "Beige" },
  { hex: "#D2B48C", name: "Tan" },
];

export const PRODUCT_TYPES: ProductTypeOption[] = [
  { value: "shoes", label: "Shoes" },
  { value: "t-shirts", label: "T-Shirts" },
  { value: "bags", label: "Bags" },
  { value: "jeans", label: "Jeans" },
  { value: "watch", label: "Watch" },
  { value: "dress", label: "Dress" },
  { value: "jacket", label: "Jacket" },
  { value: "accessories", label: "Accessories" },
];
