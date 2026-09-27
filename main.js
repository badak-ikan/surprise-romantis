/* ==========================================================================
   KONFIGURASI PESAN & ALUR ANIMAASI (BISA KAMU EDIT DENGAN MUDAH DI SINI)
   ========================================================================== */

/** 
 * Teks pesan romantis yang akan muncul huruf demi huruf.
 * Gunakan '\n' untuk membuat baris baru (enter).
 */
const PESAN_ROMANTIS = "Untuk kamu, terima kasih sudah hadir dan melengkapi hariku.\nSemoga kamu selalu bahagia & tersenyum setiap hari. ❤️";

/** Kecepatan animasi ketik teks (dalam milidetik per huruf) */
const KECEPATAN_KETIK_MS = 75;

/** 
 * Durasi tampilan kebun bunga setelah tombol diklik 
 * sebelum otomatis bertransisi halus ke animasi hati (dalam milidetik).
 * 8000ms = 8 detik (memberikan jeda ±2 detik setelah bunga tumbuh penuh).
 */
const DURASI_BUNGA_MEKAR_MS = 8000;


/* ==========================================================================
   STATE MANAGEMENT & ELEMENT REFERENCES
   ========================================================================== */
const startScreen = document.getElementById('start-screen');
const revealBtn = document.getElementById('revealBtn');
const flowerScene = document.getElementById('flower-scene');
const heartScene = document.getElementById('heart-scene');
const messageTextEl = document.getElementById('message-text');
const backgroundMusic = document.getElementById('backgroundMusic');
const muteBtn = document.getElementById('muteBtn');
const audioIcon = document.getElementById('audioIcon');
const audioControl = document.getElementById('audio-control');

let isMuted = false;
let heartAnimationInterval = null;


/* ==========================================================================
   ALUR REVEAL BERTAHAP
   ========================================================================== */

// 1. Event Listener Tombol "Klik di sini"
revealBtn.addEventListener('click', function () {
    // Sembunyikan layar pembuka dengan fade out
    startScreen.classList.add('hidden');

    // Mulai animasi kebun bunga dengan menghapus class container (unpause CSS animations)
    document.body.classList.remove("container");

    // Putar lagu sempurna.mp3 (diizinkan browser karena terjadi setelah gesture klik user)
    playMusic();

    // Tampilkan tombol kontrol audio di pojok layar
    audioControl.classList.add('visible');

    // 2. Set Timer untuk Transisi dari Bunga ke Hati Partikel Canvas
    setTimeout(() => {
        transitionToHeartScene();
    }, DURASI_BUNGA_MEKAR_MS);
});


// 3. Fungsi Transisi Halus (Fade Out Bunga -> Fade In Hati)
function transitionToHeartScene() {
    // Fade out kebun bunga
    flowerScene.classList.add('fade-out');

    // Fade in canvas hati & pesan
    heartScene.classList.add('active');

    // Inisialisasi & Jalankan Canvas Hati Nebula Partikel
    initHeartCanvas();

    // Mulai Efek Ketik Pesan Romantis
    startTypingEffect();
}


/* ==========================================================================
   EFEK TYPING TEKS (HURUF DEMI HURUF)
   ========================================================================== */
function startTypingEffect() {
    messageTextEl.textContent = '';
    let index = 0;

    function typeNextChar() {
        if (index < PESAN_ROMANTIS.length) {
            messageTextEl.textContent += PESAN_ROMANTIS.charAt(index);
            index++;
            setTimeout(typeNextChar, KECEPATAN_KETIK_MS);
        }
    }

    typeNextChar();
}


/* ==========================================================================
   KONTROL AUDIO (PLAY & MUTE/UNMUTE)
   ========================================================================== */
function playMusic() {
    backgroundMusic.volume = 0.8;
    backgroundMusic.play().catch(error => {
        console.log("Autoplay audio dicegah oleh browser: ", error);
    });
}

muteBtn.addEventListener('click', function () {
    isMuted = !isMuted;
    backgroundMusic.muted = isMuted;

    if (isMuted) {
        audioIcon.textContent = '🔇';
        muteBtn.title = "Unmute Musik";
    } else {
        audioIcon.textContent = '🔊';
        muteBtn.title = "Mute Musik";
    }
});


/* ==========================================================================
   ANIMASI CANVAS PARTIKEL HATI NEBULA/GALAKSI (RESPONSIVE)
   ========================================================================== */
function initHeartCanvas() {
    const canvas = document.getElementById('alx');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let e = [];
    let h = [];
    const v = 32 + 16 + 8; // Total partikel
    const R = Math.random;
    const C = Math.cos;
    const Y = 6.3;

    // Kalkulasi titik kurva hati (Heart Curve Points) sesuai resolusi layar
    function calculateHeartPoints() {
        h = [];
        // Skala responsif untuk layar HP / Laptop
        const scaleFactor = Math.min(1, width / 768);
        const r1 = 210 * scaleFactor;
        const r2 = 150 * scaleFactor;
        const r3 = 90 * scaleFactor;
        const h1 = 13 * scaleFactor;
        const h2 = 9 * scaleFactor;
        const h3 = 5 * scaleFactor;

        for (let i = 0; i < Y; i += 0.2) {
            h.push([
                width / 2 + r1 * Math.pow(Math.sin(i), 3),
                height / 2 + h1 * -(15 * C(i) - 5 * C(2 * i) - 2 * C(3 * i) - C(4 * i))
            ]);
        }
        for (let i = 0; i < Y; i += 0.4) {
            h.push([
                width / 2 + r2 * Math.pow(Math.sin(i), 3),
                height / 2 + h2 * -(15 * C(i) - 5 * C(2 * i) - 2 * C(3 * i) - C(4 * i))
            ]);
        }
        for (let i = 0; i < Y; i += 0.8) {
            h.push([
                width / 2 + r3 * Math.pow(Math.sin(i), 3),
                height / 2 + h3 * -(15 * C(i) - 5 * C(2 * i) - 2 * C(3 * i) - C(4 * i))
            ]);
        }
    }

    calculateHeartPoints();

    // Inisialisasi partikel nebula
    for (let i = 0; i < v;) {
        const x = R() * width;
        const y = R() * height;
        const H = 350 + Math.random() * 20; // 350°–370° (setara 350°–10°) = rentang merah
        const S = 40 * R() + 60;
        const B = 60 * R() + 20;
        const f = [];

        for (let k = 0; k < v;) {
            f[k++] = {
                x: x,
                y: y,
                X: 0,
                Y: 0,
                R: 1 - k / v + 1,
                S: R() + 1,
                q: ~~(R() * v),
                D: 2 * (i % 2) - 1,
                F: 0.2 * R() + 0.7,
                f: "hsla(" + ~~H + "," + ~~S + "%," + ~~B + "%,.1)"
            };
        }
        e[i++] = f;
    }

    function drawPath(d) {
        ctx.fillStyle = d.f;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.R, 0, Y, true);
        ctx.closePath();
        ctx.fill();
    }

    // Loop animasi partikel hati
    if (heartAnimationInterval) clearInterval(heartAnimationInterval);

    heartAnimationInterval = setInterval(function () {
        ctx.fillStyle = "rgba(0,0,0,.2)";
        ctx.fillRect(0, 0, width, height);

        for (let i = v; i--;) {
            let f = e[i];
            let u = f[0];
            let q = h[u.q];

            if (!q) continue;

            let D = u.x - q[0];
            let E = u.y - q[1];
            let G = Math.sqrt(D * D + E * E);

            if (10 > G) {
                if (0.95 < R()) {
                    u.q = ~~(R() * v);
                } else {
                    if (0.99 < R()) u.D *= -1;
                    u.q += u.D;
                    u.q %= v;
                    if (0 > u.q) u.q += v;
                }
            }

            u.X += -D / G * u.S;
            u.Y += -E / G * u.S;
            u.x += u.X;
            u.y += u.Y;
            drawPath(u);
            u.X *= u.F;
            u.Y *= u.F;

            for (let k = 0; k < v - 1;) {
                let T = f[k];
                let N = f[++k];
                N.x -= 0.7 * (N.x - T.x);
                N.y -= 0.7 * (N.y - T.y);
                drawPath(N);
            }
        }
    }, 25);

    // Penanganan Window Resize agar Kanvas & Hati selalu di tengah
    window.addEventListener('resize', function () {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        calculateHeartPoints();
    });
}
