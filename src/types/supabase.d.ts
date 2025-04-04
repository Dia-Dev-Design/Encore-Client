declare module '@supabase/supabase-js' {
  export function createClient(supabaseUrl: string, supabaseKey: string, options?: any): SupabaseClient;

  export interface SupabaseClient {
    channel(name: string): RealtimeChannel;
  }

  export interface RealtimeChannel {
    on(event: 'postgres_changes', config: {
      event: string;
      schema: string;
      table: string;
      filter?: string;
    }, callback: (payload: any) => void): RealtimeChannel;
    subscribe(callback: (status: string) => void): RealtimeChannel;
    unsubscribe(): void;
    state: string;
  }
} 