/**
 * Error and Success Messages
 * 
 * Centralized user-facing messages for consistency.
 */

export const MESSAGES = {
    BOOKING: {
        CONFLICT: 'Slot waktu sudah dipesan. Silakan pilih waktu lain.',
        INVALID_DATE: 'Tanggal tidak valid. Pilih tanggal di masa depan.',
        GUEST_WINDOW: 'Member Guest hanya bisa booking 3 hari ke depan. Upgrade ke Pro untuk akses 7 hari!',
        PRO_WINDOW: 'Booking hanya dapat dilakukan 7 hari ke depan.',
        SUCCESS: 'Booking berhasil dibuat!',
        CANCELLED: 'Booking telah dibatalkan.'
    },

    AUTH: {
        UNAUTHORIZED: 'Silakan login untuk melanjutkan.',
        FORBIDDEN: 'Anda tidak memiliki akses ke halaman ini.',
        SESSION_EXPIRED: 'Sesi Anda telah berakhir. Silakan login kembali.',
        INVALID_CREDENTIALS: 'Email atau password salah.'
    },

    PAYMENT: {
        PENDING: 'Menunggu pembayaran...',
        SUCCESS: 'Pembayaran berhasil!',
        FAILED: 'Pembayaran gagal. Silakan coba lagi.',
        EXPIRED: 'Link pembayaran telah kadaluarsa.'
    },

    VALIDATION: {
        REQUIRED_FIELD: 'Field ini wajib diisi.',
        INVALID_EMAIL: 'Format email tidak valid.',
        INVALID_PHONE: 'Nomor telepon tidak valid.',
        MIN_LENGTH: (min: number) => `Minimal ${min} karakter.`,
        MAX_LENGTH: (max: number) => `Maksimal ${max} karakter.`
    },

    GENERAL: {
        ERROR: 'Terjadi kesalahan. Silakan coba lagi.',
        LOADING: 'Memuat...',
        NO_DATA: 'Tidak ada data.',
        SUCCESS: 'Berhasil!'
    }
} as const
