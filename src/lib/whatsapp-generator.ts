import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type Event = {
  id: string;
  title: string;
  topic: string | null;
  event_date: string;
  location: string | null;
};

type Role = {
  role_name: string;
  assignee_name: string | null;
};

// Role icon mapping
function getRoleEmoji(roleName: string): string {
  const lower = roleName.toLowerCase();
  if (lower.includes('leader') || lower.includes('ketua') || lower.includes('wl')) return '👑';
  if (lower.includes('rumah') || lower.includes('host') || lower.includes('tempat')) return '🏠';
  if (lower.includes('fellowship') || lower.includes('makan') || lower.includes('snack') || lower.includes('konsumsi')) return '🍴';
  if (lower.includes('worship') || lower.includes('lagu') || lower.includes('gitar') || lower.includes('singer') || lower.includes('musik')) return '🎸';
  if (lower.includes('game') || lower.includes('ice') || lower.includes('breaker')) return '🎮';
  if (lower.includes('doa') || lower.includes('pray') || lower.includes('pendoa')) return '🙏';
  return '👤';
}

export function generateInvitationText(
  event: Event,
  roles: Role[],
  groupName: string = "Komsel",
  appUrl: string = "https://togather.vercel.app"
): string {
  const eventDate = new Date(event.event_date);
  const formattedDay = format(eventDate, "EEEE", { locale: idLocale });
  const formattedDate = format(eventDate, "d MMMM yyyy", { locale: idLocale });
  const formattedTime = format(eventDate, "HH:mm");

  // Build role list
  const filledRoles = roles.filter(r => r.assignee_name);
  const rolesList = filledRoles.length > 0
    ? filledRoles.map(r => `${getRoleEmoji(r.role_name)} ${r.role_name}: ${r.assignee_name}`).join("\n")
    : "Belum ada petugas";

  const text = `📅 *${event.title}*
${event.topic ? `🗣️ Topik: ${event.topic}\n` : ""}⏰ ${formattedDay}, ${formattedDate} • Pukul ${formattedTime}
${event.location ? `📍 ${event.location}\n` : ""}
*Petugas:*
${rolesList}

🔗 Detail: ${appUrl}/events/${event.id}

Sampai jumpa! 🙏`;

  return encodeURIComponent(text);
}

export function generateCoachReport(
  event: Event,
  attendanceStats: { present: number; absent: number; total: number },
  notes: string | null,
  groupName: string = "Komsel"
): string {
  const eventDate = new Date(event.event_date);
  const formattedDate = format(eventDate, "EEEE, d MMMM yyyy", { locale: idLocale });

  const text = `📊 *LAPORAN ${groupName.toUpperCase()}*
━━━━━━━━━━━━━━━
📅 ${event.title}
🗓️ ${formattedDate}

👥 Hadir: ${attendanceStats.present}/${attendanceStats.total}
🚫 Absen: ${attendanceStats.absent}

${notes ? `📝 *Catatan Sesi:*\n${notes}` : "📝 Belum ada catatan sesi."}

Terpuji Tuhan! 🙏`;

  return encodeURIComponent(text);
}

// Get raw text (for clipboard)
export function generateInvitationTextRaw(
  event: Event,
  roles: Role[],
  groupName: string = "Komsel",
  appUrl: string = "https://togather.vercel.app"
): string {
  return decodeURIComponent(generateInvitationText(event, roles, groupName, appUrl));
}

export function generateCoachReportRaw(
  event: Event,
  attendanceStats: { present: number; absent: number; total: number },
  notes: string | null,
  groupName: string = "Komsel"
): string {
  return decodeURIComponent(generateCoachReport(event, attendanceStats, notes, groupName));
}
