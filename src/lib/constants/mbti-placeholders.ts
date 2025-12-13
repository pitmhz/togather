/**
 * Playful MBTI Empty State Jokes
 * 
 * These first-person "quotes" are shown when a member hasn't set their MBTI type.
 * Indonesian Gen-Z vibe to encourage engagement and add personality.
 */
export const MBTI_EMPTY_JOKES = [
    "Belum nyetel MBTI nih, rada mager. Mungkin nanti dulu ya 😴",
    "MBTI itu apa guys? Bantu kasih paham dong, ajarin aku sepuh 🙏",
    "Lagi bersemedi mencari jati diri di gunung. Tungguin ya 🧘‍♂️",
    "Aku terlalu unik untuk dikotak-kotakkan oleh 4 huruf. Asik 🤪",
    "Masih menjadi misteri ilahi. Jangan ditebak ya, nanti salah ❤️",
    "Kayaknya sih E... E... Eeembuh apa ya? Belum tes nih 😅",
    "Personality-ku terlalu kompleks buat 16 kategori. Deal with it 💅",
    "Loading personality... 99%... *connection timeout* 🔄",
];

/**
 * Get a random MBTI joke
 * Should only be called client-side to avoid hydration mismatch
 */
export function getRandomMBTIJoke(): string {
    const idx = Math.floor(Math.random() * MBTI_EMPTY_JOKES.length);
    return MBTI_EMPTY_JOKES[idx];
}
