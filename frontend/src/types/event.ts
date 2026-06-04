// ============================================================================
// DATA TYPES - Defining what our data looks like (optional but helpful)
// ============================================================================

// This is like a schema - it says each standing has these 3 properties
// Think of it as documentation for what data structure we expect

export interface EventDetail {
  name: string    // Event name
  date: string      // Event date
  overview: string
  drivers_by_overall: Record<string, Driver>
  drivers_by_name: Record<string, Driver>
}

export interface Driver {
  overall: string
  driver: string
  car: string
  class: string
  class_rank: string
  avg_time: string
  total_time: string
  runs: string
  cones: string
  penalty: string
  // ... all fields
}