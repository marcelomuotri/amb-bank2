// Tipos para la tabla clients de Supabase
export interface Client {
  id: number;
  name: string;
  ein: string;
  industry: string;
  created_at: string; // ISO date string
  organization_id: string;
}

export interface Entity {
  id: number;
  name: string;
  keywords: string[]; // Array de strings
  type: string;
  client_id: number;
  created_at: string;
}

export interface supaBank {
  id: number;
  name: string;
  created_at: string;
  organization_id: string;
}

export interface Bank {
  label: string;
  value: string;
}

// Tipos para las categorías y subcategorías
export interface Category {
  id: number;
  name: string;
  created_at: string;
  organization_id: string;
}

export interface Subcategory {
  id: number;
  name: string;
  created_at: string;
  organization_id: string;
}