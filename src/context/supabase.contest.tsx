import { createContext, useContext, ReactNode } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from 'utils/supabase'

// Create context
const SupabaseContext = createContext<SupabaseClient | undefined>(undefined)

// Provider component
export function SupabaseProvider({ children }: { children: ReactNode }) {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

// Hook to use the context
export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}