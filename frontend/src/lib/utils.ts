import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "Programming Languages": "from-blue-500 to-cyan-500",
    "Artificial Intelligence": "from-purple-500 to-pink-500",
    "DevOps & Cloud": "from-orange-500 to-red-500",
    "Security": "from-red-500 to-rose-500",
    "Infrastructure": "from-green-500 to-teal-500",
    "Data & Analytics": "from-emerald-500 to-green-500",
    "Mathematics": "from-indigo-500 to-blue-500",
    "Hardware & Embedded": "from-yellow-500 to-orange-500",
    "Emerging Technologies": "from-cyan-500 to-blue-500",
  };
  return colors[category] || "from-gray-500 to-gray-600";
}

export function formatLearningTime(months: string): string {
  return months;
}
