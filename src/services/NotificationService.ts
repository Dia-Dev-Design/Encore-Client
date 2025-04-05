import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "utils/supabase";


type NotificationCallback = (notification: any, eventType?: string) => void;

class NotificationService {
  private subscribers: NotificationCallback[] = [];
  private channel: any;

  init(staffId: string, supabase: SupabaseClient) {
    if (this.channel) return;

    this.channel = supabase
      .channel('notifications-staff')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'NotificationsStaff',
          filter: `staffId=eq.${staffId}`,
        },
        (payload) => {
          console.log('[📩 Notification Received]', payload.new);
          this.subscribers.forEach((cb) => cb(payload.new, 'INSERT'));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'NotificationsStaff',
          filter: `staffId=eq.${staffId}`,
        },
        (payload) => {
          console.log('[✏️ Notification UPDATE]', payload.new);
          this.subscribers.forEach((cb) => cb(payload.new, 'UPDATE'));
        }
      )
      .subscribe((status) => {
        console.log('[ℹ️ Supabase] Subscription status:', status);
      });
  }

  onNotification(callback: NotificationCallback) {
    // log notification received
    console.log('[📩 Notification Received]');
    this.subscribers.push(callback);
  }

  removeListeners() {
    this.subscribers = [];
    if (this.channel) {
      supabase.removeChannel(this.channel);
      console.log('[🧹 Supabase] Channel removed');
      this.channel = null;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
