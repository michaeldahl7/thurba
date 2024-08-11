import { client } from "../utils/hono";

export class AuthClient {
  async getCurrentUser() {
    const res = await client.api.me.$get();
    if (res.ok) {
      return res.json();
    }
    return null;
  }

  async signIn(provider: "github" | "google") {
    window.location.href = `/api/login/${provider}`;
  }

  async signOut() {
    const res = await client.api.signOut.$post();
    return res.ok;
  }

  async markNotificationAsRead(notificationId: number) {
    const res = await client.api.notifications.markRead.$post({
      json: { notificationId },
    });
    return res.ok;
  }
}
