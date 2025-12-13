/**
 * Human-Friendly Error Messages
 * 
 * Central dictionary translating technical errors to polite Indonesian micro-copy.
 * Used by `toHumanError()` utility in utils.ts.
 * 
 * USAGE IN ZOD SCHEMAS:
 * ```ts
 * import { HUMAN_ERRORS } from "@/lib/constants/human-messages";
 * z.string().min(1, HUMAN_ERRORS.Validation.Required)
 * z.string().email(HUMAN_ERRORS.Validation.InvalidEmail)
 * ```
 */

export const HUMAN_ERRORS = {
  // ===== AUTH ERRORS =====
  Auth: {
    AlreadyRegistered: "Email ini sudah terdaftar. Coba login saja?",
    InvalidCredentials: "Email atau password kurang pas. Coba ingat-ingat lagi.",
    SessionExpired: "Sesi kamu sudah habis. Silakan login ulang.",
    Unauthenticated: "Kamu perlu login dulu untuk mengakses ini.",
    EmailNotConfirmed: "Cek inbox emailmu untuk konfirmasi akun dulu ya.",
    TooManyRequests: "Terlalu banyak percobaan. Tunggu sebentar ya.",
    InvalidMagicLink: "Link login sudah kadaluarsa. Minta link baru ya.",
  },

  // ===== VALIDATION ERRORS (for Zod/Forms) =====
  Validation: {
    Required: "Bagian ini wajib diisi ya.",
    InvalidEmail: "Format emailnya sepertinya salah ketik.",
    TooShort: "Terlalu pendek, tambahin dikit lagi dong.",
    TooLong: "Kepanjangan nih, singkat aja.",
    InvalidPhone: "Nomor teleponnya kayaknya kurang bener.",
    InvalidDate: "Format tanggalnya tidak sesuai.",
    InvalidUrl: "Link-nya sepertinya tidak valid.",
    MustBeNumber: "Ini harus berupa angka ya.",
    MinLength: (min: number) => `Minimal ${min} karakter ya.`,
    MaxLength: (max: number) => `Maksimal ${max} karakter aja.`,
  },

  // ===== DATABASE / API ERRORS =====
  Database: {
    UniqueConstraint: "Data ini sudah ada sebelumnya.",
    ForeignKeyViolation: "Data terkait tidak ditemukan.",
    NotFound: "Data yang kamu cari tidak ditemukan.",
    ConnectionError: "Gagal terhubung ke database. Coba lagi ya.",
    Timeout: "Permintaan terlalu lama. Coba lagi ya.",
  },

  // ===== NETWORK / SYSTEM ERRORS =====
  System: {
    NetworkError: "Koneksi internetmu lagi putus-nyambung nih.",
    ServerError: "Server kami lagi cegukan. Coba lagi sebentar lagi ya.",
    Maintenance: "Sistem sedang maintenance sebentar. Tunggu ya!",
    Unknown: "Ada kesalahan teknis yang aneh. Kami sedang cek.",
  },

  // ===== COMMUNITY / ONBOARDING =====
  Community: {
    InvalidInviteCode: "Kode undangan tidak valid atau sudah kadaluarsa.",
    AlreadyMember: "Kamu sudah tergabung di komunitas ini.",
    CommunityNotFound: "Komunitas tidak ditemukan.",
    LeaderRequired: "Hanya leader yang bisa melakukan ini.",
  },

  // ===== PERMISSION ERRORS =====
  Permission: {
    Unauthorized: "Kamu tidak punya akses untuk ini.",
    AdminOnly: "Ini khusus untuk admin saja.",
    OwnerOnly: "Hanya owner yang bisa melakukan ini.",
  },
} as const;

/**
 * Error keyword patterns for automatic translation
 * Maps technical keywords/patterns to human-friendly messages
 */
export const ERROR_PATTERNS: Array<{
  pattern: RegExp | string;
  message: string;
}> = [
  // Auth patterns
  { pattern: /user already registered/i, message: HUMAN_ERRORS.Auth.AlreadyRegistered },
  { pattern: /invalid login credentials/i, message: HUMAN_ERRORS.Auth.InvalidCredentials },
  { pattern: /invalid credentials/i, message: HUMAN_ERRORS.Auth.InvalidCredentials },
  { pattern: /session.*expired/i, message: HUMAN_ERRORS.Auth.SessionExpired },
  { pattern: /not authenticated/i, message: HUMAN_ERRORS.Auth.Unauthenticated },
  { pattern: /email not confirmed/i, message: HUMAN_ERRORS.Auth.EmailNotConfirmed },
  { pattern: /too many requests/i, message: HUMAN_ERRORS.Auth.TooManyRequests },
  { pattern: /rate limit/i, message: HUMAN_ERRORS.Auth.TooManyRequests },
  { pattern: /magic link/i, message: HUMAN_ERRORS.Auth.InvalidMagicLink },
  { pattern: /otp.*expired/i, message: HUMAN_ERRORS.Auth.InvalidMagicLink },

  // Database patterns
  { pattern: /unique.*constraint/i, message: HUMAN_ERRORS.Database.UniqueConstraint },
  { pattern: /duplicate key/i, message: HUMAN_ERRORS.Database.UniqueConstraint },
  { pattern: /foreign key/i, message: HUMAN_ERRORS.Database.ForeignKeyViolation },
  { pattern: /violates.*constraint/i, message: HUMAN_ERRORS.Database.UniqueConstraint },
  { pattern: /not found/i, message: HUMAN_ERRORS.Database.NotFound },
  { pattern: /connection.*refused/i, message: HUMAN_ERRORS.Database.ConnectionError },
  { pattern: /timeout/i, message: HUMAN_ERRORS.Database.Timeout },
  { pattern: /PGRST/i, message: HUMAN_ERRORS.Database.NotFound },

  // Network patterns
  { pattern: /network error/i, message: HUMAN_ERRORS.System.NetworkError },
  { pattern: /fetch failed/i, message: HUMAN_ERRORS.System.NetworkError },
  { pattern: /failed to fetch/i, message: HUMAN_ERRORS.System.NetworkError },
  { pattern: /500/i, message: HUMAN_ERRORS.System.ServerError },
  { pattern: /internal server error/i, message: HUMAN_ERRORS.System.ServerError },

  // Community patterns
  { pattern: /invite.*code.*invalid/i, message: HUMAN_ERRORS.Community.InvalidInviteCode },
  { pattern: /invalid.*invite/i, message: HUMAN_ERRORS.Community.InvalidInviteCode },
  { pattern: /already.*member/i, message: HUMAN_ERRORS.Community.AlreadyMember },

  // Permission patterns
  { pattern: /unauthorized/i, message: HUMAN_ERRORS.Permission.Unauthorized },
  { pattern: /forbidden/i, message: HUMAN_ERRORS.Permission.Unauthorized },
  { pattern: /403/i, message: HUMAN_ERRORS.Permission.Unauthorized },
];

/**
 * Default fallback message when no pattern matches
 */
export const DEFAULT_ERROR_MESSAGE = HUMAN_ERRORS.System.Unknown;
