# Nalar

Demo lokal platform edukasi Indonesia dengan Next.js App Router, TypeScript, Tailwind CSS, ChironDB, dan tutor Vector + Graph RAG. **Evaluasi dengan data sintetis; belum untuk siswa nyata atau layanan produksi.**

## Yang tersedia

- Beranda, tentang, katalog SD/SMP/SMA, pendaftaran/login, dashboard, dan 15 modul statis.
- Tiga bagian per modul, analogi Feynman, visual SD, 75 soal yang dinilai server, progres dan badge 1/5/15 modul.
- Jadwal pengulangan 1/3/7/14 hari untuk skor minimal 80%; gagal kembali ke satu hari. Jenjang dapat diubah di dashboard, progres lama tetap disimpan.
- Akun Argon2id, cookie iron-session tujuh hari, sesi database yang dapat dicabut, query berparameter, transaksi dan isolasi data pemilik.
- Koleksi pengetahuan berisi 105 point (15 modul, 45 konsep, 45 chunk) dan 125 edge `TEACHES`, `HAS_CHUNK`, `REQUIRES`.
- Tutor mengambil maksimal enam chunk di modul aktif dengan konteks bagian yang dipilih, menambahkan chunk prasyarat lewat graph, lalu membatasi konteks ke sepuluh chunk/16.000 karakter dan riwayat ke 20 pesan. Kutipan dan versi sumber disimpan bersama jawaban.

## Menjalankan

Node.js **22+**, npm, Rust toolchain sesuai snapshot ChironDB. Perintah berikut dijalankan dari folder proyek ini. Database dan aplikasi selalu terikat ke loopback.

```sh
npm ci
cp -n .env.example .env.local
npm run db:prepare -- /path/to/ChironDB
```

Ganti `/path/to/ChironDB` dengan lokasi checkout ChironDB yang memiliki commit `32a5240460c244db3fc3f0a41f7cab1b595cd64f`. `db:prepare` mengekstrak commit tersebut ke `.runtime/server-src` dan membangun ke `.runtime/target` dengan satu job. Checkout dan hasil build pekerjaan ChironDB lain tidak diubah. Isi `CHIRONDB_API_KEY` serta `SESSION_SECRET` di `.env.local` dengan nilai acak terpisah, minimal 32 karakter. Jika `.env.local` sudah ada, pertahankan file itu. Konfigurasi, database, hasil build, dan laporan lokal terperinci tidak disimpan di Git.

Terminal pertama:

```sh
npm run db:start
```

Terminal kedua:

```sh
npm run db:migrate
npm run build
npm run start
```

Buka **http://127.0.0.1:3000**. Database memakai port 17401/17402/17403 dan `.runtime/data`; jangan arahkan aplikasi ke data pekerjaan lain. `npm run dev` dapat menggantikan build/start ketika mengedit. Jangan menjalankan dev dan production server pada port yang sama atau melakukan build ketika production server lama masih dipakai.

## Mengaktifkan tutor nyata

Isi hanya di `.env.local`, bukan di chat atau kode:

```dotenv
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4.1-2025-04-14
LLM_API_KEY=isi-key-provider-chat
EMBEDDING_BASE_URL=https://api.openai.com/v1
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_API_KEY=isi-key-provider-embedding
```

Penyedia harus mendukung Chat Completions streaming dan `/embeddings` dengan `encoding_format: float`. Chat dan embedding boleh memakai penyedia berbeda. Tidak ada default model, embedding buatan, atau respons AI palsu pada aplikasi biasa.

Konfigurasi demo yang telah diuji memakai `gpt-4.1-2025-04-14` dan `text-embedding-3-small` (1.536 dimensi). GPT-4.1 Mini dicoba lebih dahulu, tetapi tinjauan menemukan kutipan yang hilang dan analogi yang kurang tepat; hasil percobaan terperinci disimpan secara lokal di `reports/` dan tidak diunggah ke repository. Model tutor kemudian diganti ke GPT-4.1 penuh. API key tetap hanya berada di `.env.local`.

```sh
npm run knowledge:index
```

Restart aplikasi setelah mengubah environment. Pengindeksan memberi ID deterministik, memverifikasi point/edge, dan baru mengaktifkan versi setelah verifikasi berhasil. Kegagalan mempertahankan versi sebelumnya. Model, endpoint, dimensi dan versi preprocessing harus konsisten; perubahan memerlukan pengindeksan ulang. Versi lama tidak dihapus otomatis.

Materi dan kuis tetap bisa dipakai ketika AI belum dikonfigurasi. Tutor menampilkan pesan konfigurasi yang diperlukan; tidak beralih ke jawaban tanpa sumber.

## Pengujian

```sh
npm run check
npm test
npm run build
npm run test:integration
npm run rag:evaluate
npm run tutor:evaluate
```

- Unit: kelengkapan kurikulum, penghapusan kunci jawaban publik, penilaian, jadwal berbasis waktu, chunking, siklus graph, batas konteks dan kutipan.
- Integrasi: server ChironDB nyata + SDK npm beta.3, pada port 18401–18403, aplikasi 3100, dan penyedia fixture 18409. Proses tersebut dihentikan setelah tes. Fixture deterministik **hanya dipasang pada proses uji**, bukan pada aplikasi biasa; hasilnya bukan bukti kualitas model AI atau embedding.
- `rag:evaluate`: 45 pertanyaan berlabel, pencarian pada seluruh chunk satu jenjang, target Recall@6 ≥0,90. Hasil ditulis ke `reports/retrieval-results.json`. Ini evaluasi domain demo, bukan ann-benchmarks/BEIR atau sertifikasi engine.
- `tutor:evaluate`: sembilan pertanyaan/follow-up/adversarial melalui endpoint aplikasi nyata untuk tiga jenjang. Membuat akun sintetis evaluasi dan mencabut sesi setelahnya. Menyimpan delta streaming, versi, relasi dan sumber tanpa credential di `reports/tutor-results.json`; exit 1 bila respons tidak selesai. Setiap eksekusi menghasilkan rubrik baru yang perlu ditinjau langsung, terpisah dari pemeriksaan ID kutipan.
- Laporan berstatus `pending` dan exit code 1 ketika konfigurasi nyata belum tersedia. Jangan menyebutnya lulus. Rubrik manual tetap belum selesai sampai dinilai.

Untuk menjalankan langsung dengan Node host (misalnya jika npm memilih runtime Node lain): `node node_modules/next/dist/bin/next build`, `node --import=tsx --test tests/core.test.ts`, dan `node --env-file=.env.local --import=tsx --test tests/integration.ts`.

Hasil aktual 25 Oktober 2026: Recall@6 **1,00 (45/45)**; sembilan respons tutor dan empat skenario tambahan selesai. Tinjauan langsung oleh Codex menilai jawaban terhadap teks sumber, termasuk penolakan pertanyaan di luar sumber dan kutipan prasyarat graph. Ini uji pengembangan kecil, belum tinjauan pendidik atau sertifikasi ketahanan prompt injection. Ringkasan publik dan cara menghasilkan laporan lokal: [reports/README.md](reports/README.md).

## Query database Nalar

Untuk membuka konsol SQL dengan SDK dan kredensial dari `.env.local`:

```sh
npm run db:console
```

Konsol menampilkan status server, endpoint dan koleksi aktif. Gunakan `\tables`, `\collections`, `\status`, `\help`, atau `\q`. SQL boleh beberapa baris; akhiri dengan titik koma. Konsol tersambung ke database Nalar yang sama dengan aplikasi.

```sql
SELECT id, full_name, grade_level FROM users LIMIT 10;
SELECT collection_name, embedding_model, dimensions, active FROM knowledge_versions;
SELECT role, status, content FROM chat_messages LIMIT 5;
```

Satu query juga dapat dijalankan langsung: `npm run db:console -- "SELECT COUNT(*) AS total FROM users;"`. Data akun/progres/chat memakai SQL relasional; `\collections` menampilkan koleksi vector/graph terpisah. Contoh ini tidak mencetak hash password atau token sesi.

## Kontrak API

Semua respons akun/progres memakai `Cache-Control: no-store`. Mutasi memerlukan header `Origin` sama dengan `APP_ORIGIN`; gunakan URL 127.0.0.1 sesuai contoh. Browser otomatis mengirim cookie.

| Endpoint                           | Metode / isi                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| `/api/auth/signup`                 | POST `{full_name,email,password,grade_level}`                                      |
| `/api/auth/login`                  | POST `{email,password}`                                                            |
| `/api/auth/logout`, `/api/auth/me` | POST / GET                                                                         |
| `/api/auth/profile`                | POST `{grade_level}`; pindah jenjang tanpa menghapus progres                       |
| `/api/modules/:id/progress`        | POST `{section_id}`; tidak menerima persentase dari client                         |
| `/api/modules/:id/quiz`            | POST `{answers,request_id}`; UUID diperlukan untuk siswa, indeks pilihan mulai nol |
| `/api/progress`                    | GET data siswa aktif                                                               |
| `/api/chat/sessions`               | GET `?module_id=...`; POST `{module_id,request_id}` dengan UUID                    |
| `/api/chat/sessions/:id/messages`  | GET riwayat; POST `{message,section_id,request_id}`                                |
| `/api/health`                      | GET status aplikasi dan keberadaan konfigurasi, tanpa rahasia                      |

SSE mengirim `sources`, `delta`, `done`, atau `error`. Respons tanpa finalisasi/rujukan valid disimpan sebagai `incomplete` dan tidak dipakai sebagai konteks assistant berikutnya. Permintaan yang sama tidak menggandakan pesan; HTTP 409 mengarahkan client memuat ulang riwayat. Input pesan dibatasi 4.000 karakter, satu generasi aktif per sesi, timeout generasi 60 detik. Riwayat terputus setelah crash ditandai belum lengkap ketika diakses kembali setelah lease 70 detik.

Simpan `request_id` saat mengulang kuis atau membuat sesi. Mutasi SQL memakai kunci idempotensi dan tidak diulang otomatis. Jika acknowledgement tidak pasti, periksa data dengan identitas yang sama; jangan membuat permintaan baru untuk operasi yang sama. SDK juga menyediakan transaction status untuk operator.

## Catatan implementasi

- `lib/api.ts`: batas HTTP, autentikasi, otorisasi, progres, kuis, streaming.
- `lib/knowledge.ts`: ingestion berversi, vector search, traversal graph, provenance dan batas konteks.
- `lib/curriculum.ts`: konten mandiri, soal dan relasi konsep. Client hanya menerima proyeksi tanpa kunci jawaban.
- SDK beta.3 menamai beberapa field tipe budget graph berbeda dari wire server snapshot. Adaptor lokal mengirim field wire yang telah diuji: `max_visited`, `max_edges`, `max_time_ms`, `max_memory_bytes`; tidak mengubah SDK/server atau menaikkan batas engine.
- Semua node graph mendapat embedding nyata. Tidak memakai zero vector atau override keselamatan structural point.
- Pembatas permintaan memakai memori satu proses, cocok untuk demo lokal. Bukan pembatas terdistribusi atau layanan multi-instance.
- Instalasi database ini memakai profil development lokal dengan API key. Ini bukan penerapan protected/TLS/enkripsi-at-rest untuk data siswa nyata.
- Riwayat pribadi tidak diindeks bersama materi. Hanya materi terkurasi, pertanyaan dan konteks chat yang dikirim ke penyedia AI; kolom profil nama/email serta credential tidak dimasukkan otomatis ke prompt. Pesan yang diketik pengguna tetap dikirim sebagai konteks percakapan.
- Ringkasan dan batas verifikasi ada di [reports/README.md](reports/README.md). Laporan JSON, tangkapan layar, dan catatan operasional yang dihasilkan secara lokal diabaikan oleh Git.
