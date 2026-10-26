export type Grade = "SD" | "SMP" | "SMA";
export type Question = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};
export type Section = {
  id: string;
  title: string;
  text: string;
  analogy: string;
  question: string;
  concept: string;
  requires: string[];
};
export type LearningModule = {
  id: string;
  title: string;
  grade: Grade;
  subject: string;
  color: string;
  icon: string;
  description: string;
  objectives: string[];
  sections: Section[];
  quiz: Question[];
  references: { title: string; url: string }[];
};
const curriculum = {
  title: "Capaian Pembelajaran — Kemendikdasmen",
  url: "https://pusatinformasi.rumahpendidikan.kemendikdasmen.go.id/hc/id/articles/52513313951257-Pengertian-Capaian-Pembelajaran-CP",
};
type Seed = [
  Grade,
  string,
  string,
  string,
  string,
  string,
  string,
  [string, string, string, string][],
  [string, string[], number, string][],
];
const seeds: Seed[] = [
  [
    "SD",
    "Matematika",
    "pecahan",
    "Pecahan di sekitar kita",
    "pie",
    "coral",
    "Belajar membagi dengan adil, satu potong demi satu potong.",
    [
      [
        "Bagian dari satu kesatuan",
        "Pecahan menunjukkan bagian dari satu kesatuan yang dibagi sama besar. Jika satu roti dibagi menjadi empat potong sama besar, satu potong adalah seperempat. Bagian yang tidak sama besar tidak dapat langsung disebut seperempat. Sebelum menghitung, tentukan dulu apa yang disebut satu kesatuan.",
        "Bayangkan satu pizza sebagai satu kesatuan. Potongan sama besar membuat pembagian adil.",
        "Mengapa ukuran potongan harus sama?",
      ],
      [
        "Pembilang dan penyebut",
        "Pada pecahan 3/4, angka 4 adalah penyebut: banyaknya bagian sama besar dalam satu kesatuan. Angka 3 adalah pembilang: banyak bagian yang diambil. Penyebut tidak boleh nol. Dengan penyebut sama, pembilang lebih besar menunjukkan bagian lebih banyak.",
        "Penyebut seperti jumlah kotak dalam satu rak; pembilang seperti kotak yang terisi.",
        "Apa arti angka 3 pada 3/4?",
      ],
      [
        "Menjumlahkan bagian",
        "Untuk menjumlahkan pecahan berpenyebut sama, jumlahkan pembilang dan pertahankan penyebut. Contoh 1/4 + 2/4 = 3/4. Kita menghitung banyak potong, bukan mengubah ukuran setiap potong. Pecahan 2/4 setara dengan 1/2 karena keduanya menutupi luas yang sama.",
        "Satu potong pizza ditambah dua potong berukuran sama menghasilkan tiga potong.",
        "Mengapa penyebut tidak ikut dijumlahkan?",
      ],
    ],
    [
      [
        "Satu dari empat bagian sama besar ditulis …",
        ["1/4", "4/1", "1/3", "4/4"],
        0,
        "Penyebut menyatakan empat bagian, pembilang satu bagian.",
      ],
      [
        "Penyebut pada 2/5 adalah …",
        ["2", "3", "5", "7"],
        2,
        "Angka di bawah garis pecahan adalah penyebut.",
      ],
      [
        "1/5 + 2/5 = …",
        ["3/10", "2/5", "1/5", "3/5"],
        3,
        "Jumlahkan pembilang: 1 + 2, penyebut tetap 5.",
      ],
      [
        "Pecahan setara dengan 1/2 adalah …",
        ["1/4", "2/4", "3/4", "4/2"],
        1,
        "Dua dari empat bagian sama dengan separuh.",
      ],
      [
        "Bagian yang dapat disebut seperempat harus …",
        ["Berbeda ukuran", "Sama besar", "Selalu bulat", "Berwarna sama"],
        1,
        "Pembagian pecahan menggunakan bagian sama besar.",
      ],
    ],
  ],
  [
    "SD",
    "IPA",
    "siklus-air",
    "Petualangan setetes air",
    "drop",
    "blue",
    "Ikuti perjalanan air dari laut, awan, sampai kembali ke bumi.",
    [
      [
        "Penguapan",
        "Siklus air adalah perputaran air antara permukaan bumi dan atmosfer. Panas matahari membantu air cair berubah menjadi uap air; proses ini disebut evaporasi atau penguapan. Penguapan juga terjadi dari genangan, sungai, dan danau. Tumbuhan melepaskan uap air melalui transpirasi.",
        "Seperti baju basah yang mengering, airnya berpindah ke udara sebagai uap.",
        "Ke mana air di baju basah berpindah?",
      ],
      [
        "Pembentukan awan",
        "Uap air yang naik dapat mendingin dan mengalami kondensasi menjadi tetes air kecil atau kristal es. Kumpulan tetes dan kristal ini membentuk awan. Awan bukan sekadar uap air yang tidak terlihat. Saat tetes membesar dan cukup berat, air dapat jatuh.",
        "Bagian luar gelas dingin menjadi basah karena uap air di udara mengembun.",
        "Mengapa udara yang mendingin dapat membentuk titik air?",
      ],
      [
        "Hujan dan peresapan",
        "Air yang jatuh dari awan disebut presipitasi, misalnya hujan. Air kemudian mengalir di permukaan menuju sungai dan laut, atau meresap ke tanah melalui infiltrasi. Menjaga tanah bervegetasi membantu peresapan. Siklus air terus berlangsung dan tidak memiliki satu titik awal mutlak.",
        "Tanah berpori seperti spons yang menampung sebagian air hujan.",
        "Apa perbedaan air mengalir dan air meresap?",
      ],
    ],
    [
      [
        "Air cair menjadi uap disebut …",
        ["Kondensasi", "Evaporasi", "Infiltrasi", "Presipitasi"],
        1,
        "Evaporasi adalah penguapan.",
      ],
      [
        "Sumber energi utama penguapan dalam siklus air adalah …",
        ["Bulan", "Angin saja", "Matahari", "Tanah"],
        2,
        "Energi matahari memanaskan air.",
      ],
      [
        "Kondensasi mengubah uap menjadi …",
        ["Tetes air", "Pasir", "Batu", "Udara baru"],
        0,
        "Uap yang mendingin dapat mengembun.",
      ],
      [
        "Air meresap ke tanah melalui …",
        ["Evaporasi", "Infiltrasi", "Pembakaran", "Pembekuan"],
        1,
        "Infiltrasi adalah peresapan ke tanah.",
      ],
      [
        "Hujan termasuk …",
        ["Transpirasi", "Kondensasi saja", "Presipitasi", "Fotosintesis"],
        2,
        "Presipitasi adalah air yang jatuh dari atmosfer.",
      ],
    ],
  ],
  [
    "SD",
    "Bahasa Indonesia",
    "ide-pokok",
    "Menemukan inti cerita",
    "book",
    "purple",
    "Temukan gagasan utama tanpa tersesat dalam detail.",
    [
      [
        "Gagasan utama",
        "Ide pokok adalah gagasan utama yang menjadi inti pembahasan paragraf. Kalimat utama biasanya menyatakan gagasan itu. Letaknya dapat di awal, akhir, atau tersirat dalam keseluruhan paragraf. Tanyakan: paragraf ini terutama membicarakan apa?",
        "Ide pokok seperti judul kotak mainan; detail adalah isi di dalam kotaknya.",
        "Apa topik yang berulang dalam paragraf?",
      ],
      [
        "Kalimat pendukung",
        "Kalimat pendukung menjelaskan gagasan utama lewat contoh, alasan, atau rincian. Pada paragraf tentang manfaat pohon, contoh memberi keteduhan dan menyerap air mendukung topik manfaat pohon. Detail penting membantu pemahaman, tetapi tidak selalu menjadi ide pokok.",
        "Batang pohon seperti ide utama, cabangnya seperti penjelasan.",
        "Apakah satu contoh sudah mencakup seluruh paragraf?",
      ],
      [
        "Menyimpulkan dengan kata sendiri",
        "Baca paragraf sampai selesai, tentukan topik, lalu pilih gagasan yang mencakup rincian penting. Tulis inti dalam satu kalimat menggunakan kata sendiri tanpa menambahkan informasi baru. Periksa apakah semua detail utama masih cocok dengan kalimat ringkasan.",
        "Seperti merapikan isi tas ke dalam satu label yang tepat.",
        "Bagaimana menjelaskan paragraf ini dalam satu kalimat?",
      ],
    ],
    [
      [
        "Ide pokok adalah …",
        ["Rincian kecil", "Gagasan utama", "Kata terakhir", "Nama penulis"],
        1,
        "Ide pokok merangkum inti pembahasan.",
      ],
      [
        "Kalimat pendukung memberi …",
        [
          "Contoh atau rincian",
          "Topik yang selalu berbeda",
          "Judul buku",
          "Nama penerbit",
        ],
        0,
        "Kalimat pendukung menjelaskan gagasan utama.",
      ],
      [
        "Sebelum menyimpulkan, kita perlu …",
        [
          "Menebak judul",
          "Membaca satu kata",
          "Membaca paragraf utuh",
          "Menghitung huruf",
        ],
        2,
        "Konteks utuh membantu menentukan inti.",
      ],
      [
        "Ringkasan yang baik …",
        [
          "Menambah cerita baru",
          "Memuat seluruh kata",
          "Mengabaikan inti",
          "Mempertahankan inti",
        ],
        3,
        "Ringkasan mengurangi rincian sambil menjaga gagasan utama.",
      ],
      [
        "Paragraf tentang keteduhan dan peresapan oleh pohon terutama membahas …",
        ["Warna daun", "Manfaat pohon", "Harga kayu", "Jenis tas"],
        1,
        "Kedua rincian merupakan manfaat pohon.",
      ],
    ],
  ],
  [
    "SD",
    "English",
    "daily-activities",
    "My everyday adventures",
    "sun",
    "amber",
    "Ceritakan kebiasaan sehari-hari dengan kalimat sederhana.",
    [
      [
        "Everyday verbs",
        "Daily activities are things we do regularly: wake up, eat breakfast, go to school, and read. Dalam bahasa Inggris, kata kerja menyatakan kegiatan. Kalimat I read berarti saya membaca. Pilih kata yang cocok dengan kegiatan nyata yang ingin kamu ceritakan.",
        "Kata kerja seperti tombol aksi dalam cerita harimu.",
        "What do you do after waking up?",
      ],
      [
        "Simple present",
        "Gunakan simple present untuk kebiasaan. I, you, we, dan they memakai kata kerja dasar: I read every day. Untuk he, she, it, umumnya tambahkan s atau es: She reads every day. Ada bentuk khusus seperti have menjadi has.",
        "Simple present seperti jadwal yang berulang, bukan foto satu kejadian kemarin.",
        "How is I read different from She reads?",
      ],
      [
        "Time and routines",
        "Keterangan waktu membantu menjelaskan kebiasaan: every day, in the morning, dan at seven. Contoh: I eat breakfast at seven. Gunakan at untuk jam tertentu. Urutkan kegiatan dengan first, then, dan finally agar cerita mudah diikuti.",
        "Keterangan waktu seperti angka pada jam kegiatanmu.",
        "When do you eat breakfast?",
      ],
    ],
    [
      [
        "I … breakfast every morning.",
        ["eat", "eats", "eating", "ate"],
        0,
        "I memakai kata kerja dasar untuk simple present.",
      ],
      [
        "She … books every day.",
        ["read", "reads", "reading", "readed"],
        1,
        "She membutuhkan reads.",
      ],
      [
        "Wake up berarti …",
        ["Tidur", "Membaca", "Bangun tidur", "Berenang"],
        2,
        "Wake up adalah bangun tidur.",
      ],
      [
        "Untuk pukul tujuh, gunakan …",
        ["in seven", "on seven", "by seven only", "at seven"],
        3,
        "At digunakan untuk jam tertentu.",
      ],
      [
        "Every day menunjukkan …",
        ["Kebiasaan", "Hanya masa lampau", "Tempat", "Warna"],
        0,
        "Every day berarti setiap hari.",
      ],
    ],
  ],
  [
    "SD",
    "Critical Thinking",
    "fakta-opini",
    "Detektif fakta dan opini",
    "search",
    "green",
    "Belajar bertanya: bisa dibuktikan atau merupakan pendapat?",
    [
      [
        "Fakta yang dapat diperiksa",
        "Fakta adalah pernyataan yang dapat diperiksa melalui bukti atau pengamatan. Contoh: segitiga memiliki tiga sisi. Klaim faktual tetap perlu diperiksa; kalimat yang terdengar pasti belum tentu benar. Cari cara menguji klaim dengan menghitung, mengamati, atau membaca sumber tepercaya.",
        "Detektif mencari jejak, bukan hanya percaya suara yang paling keras.",
        "Bagaimana memeriksa jumlah sisi segitiga?",
      ],
      [
        "Opini dan selera",
        "Opini adalah penilaian, pandangan, atau selera. Contoh: warna hijau paling indah. Orang lain boleh menyukai warna berbeda. Kata paling enak atau terbaik sering menandai penilaian, tetapi konteks tetap penting. Opini bisa disertai alasan dan tidak otomatis buruk.",
        "Selera warna seperti rasa es krim favorit yang dapat berbeda.",
        "Apakah semua orang harus memiliki warna kesukaan sama?",
      ],
      [
        "Memeriksa sebelum percaya",
        "Pisahkan bagian yang bisa dibuktikan dari bagian penilaian. Tanyakan siapa sumbernya, apa buktinya, dan apakah ada penjelasan lain. Jangan menyebarkan klaim yang belum diperiksa hanya karena menarik. Mengakui belum tahu lebih baik daripada berpura-pura yakin.",
        "Seperti memeriksa isi kotak sebelum memasang label.",
        "Bukti apa yang akan membuatmu lebih yakin?",
      ],
    ],
    [
      [
        "Pernyataan fakta adalah …",
        [
          "Merah paling bagus",
          "Segitiga memiliki tiga sisi",
          "Es krim ini terenak",
          "Belajar selalu membosankan",
        ],
        1,
        "Jumlah sisi dapat diperiksa.",
      ],
      [
        "Opini berkaitan dengan …",
        [
          "Selera atau penilaian",
          "Bukti yang selalu pasti",
          "Rumus saja",
          "Angka saja",
        ],
        0,
        "Opini memuat pandangan atau penilaian.",
      ],
      [
        "Sebelum menyebarkan klaim kita sebaiknya …",
        [
          "Langsung percaya",
          "Menambah cerita",
          "Memeriksa bukti",
          "Mengikuti suara terkeras",
        ],
        2,
        "Periksa bukti dan sumber.",
      ],
      [
        "Opini orang lain dapat …",
        ["Selalu salah", "Harus sama", "Dihapus", "Berbeda"],
        3,
        "Selera dan pandangan dapat berbeda.",
      ],
      [
        "Jika bukti belum cukup, sikap tepat adalah …",
        [
          "Mengaku belum tahu",
          "Mengarang bukti",
          "Memaksa setuju",
          "Mengabaikan pertanyaan",
        ],
        0,
        "Ketidakpastian perlu disampaikan dengan jujur.",
      ],
    ],
  ],
  [
    "SMP",
    "Matematika",
    "persamaan-linear",
    "Misteri nilai x",
    "equal",
    "coral",
    "Pecahkan persamaan dengan menjaga kedua sisi tetap seimbang.",
    [
      [
        "Variabel dan persamaan",
        "Variabel adalah simbol untuk nilai yang belum diketahui atau dapat berubah. Persamaan menyatakan dua bentuk bernilai sama. Dalam x + 3 = 8, x adalah nilai yang membuat pernyataan benar. Persamaan linear satu variabel memiliki variabel berpangkat satu.",
        "Persamaan seperti timbangan dengan dua sisi setimbang.",
        "Nilai apa yang menjaga x + 3 sama dengan 8?",
      ],
      [
        "Operasi setara",
        "Tambahkan, kurangkan, kalikan, atau bagi kedua sisi dengan nilai sama untuk menjaga kesetaraan; pembagi tidak boleh nol. Dari x + 3 = 8, kurangi kedua sisi dengan 3 sehingga x = 5. Hindari sekadar menghafal pindah ruas tanpa memahami operasi yang dilakukan.",
        "Mengambil beban yang sama dari dua sisi timbangan menjaga keseimbangan.",
        "Mengapa mengurangi hanya satu sisi tidak benar?",
      ],
      [
        "Memeriksa solusi",
        "Untuk 2x + 4 = 10, kurangi kedua sisi dengan 4 lalu bagi dengan 2 sehingga x = 3. Substitusikan kembali: 2 kali 3 ditambah 4 sama dengan 10. Dalam soal cerita, definisikan variabel dan periksa apakah hasil masuk akal dalam konteks.",
        "Memeriksa jawaban seperti mencoba kunci pada pintu asalnya.",
        "Bagaimana membuktikan bahwa x = 3 memenuhi persamaan?",
      ],
    ],
    [
      [
        "Pada x + 3 = 8, x = …",
        ["3", "5", "8", "11"],
        1,
        "Kurangi kedua sisi dengan 3.",
      ],
      [
        "Operasi yang menjaga persamaan adalah …",
        [
          "Mengubah satu sisi saja",
          "Menghapus x",
          "Operasi sama pada kedua sisi",
          "Membagi dengan nol",
        ],
        2,
        "Kesetaraan dijaga dengan operasi yang setara.",
      ],
      [
        "2x + 4 = 10 memberi x = …",
        ["3", "4", "5", "7"],
        0,
        "2x = 6, maka x = 3.",
      ],
      [
        "Solusi diperiksa melalui …",
        ["Tebakan", "Warna", "Pembulatan selalu", "Substitusi"],
        3,
        "Ganti variabel dengan nilai solusi.",
      ],
      [
        "Variabel dalam persamaan linear berpangkat …",
        ["0 saja", "1", "2", "3"],
        1,
        "Linear berarti pangkat variabel satu.",
      ],
    ],
  ],
  [
    "SMP",
    "IPA",
    "ekosistem",
    "Jaringan kehidupan",
    "leaf",
    "green",
    "Lihat bagaimana makhluk hidup dan lingkungannya saling terhubung.",
    [
      [
        "Komponen ekosistem",
        "Ekosistem mencakup makhluk hidup dan lingkungan fisik yang saling berinteraksi. Komponen biotik meliputi tumbuhan, hewan, dan mikroorganisme. Komponen abiotik meliputi air, cahaya, suhu, dan tanah. Perubahan komponen fisik dapat memengaruhi kehidupan organisme.",
        "Ekosistem seperti tim yang bergantung pada anggota dan tempat bermainnya.",
        "Bagaimana kekurangan air memengaruhi tumbuhan?",
      ],
      [
        "Aliran energi",
        "Produsen seperti tumbuhan menggunakan energi cahaya untuk membuat bahan organik. Konsumen memperoleh energi dengan memakan organisme lain. Pengurai menguraikan sisa organisme dan mengembalikan unsur hara. Energi mengalir dan sebagian terlepas sebagai panas pada setiap perpindahan; energi tidak berputar seperti materi.",
        "Aliran energi seperti kiriman yang sebagian dipakai di setiap pemberhentian.",
        "Mengapa energi yang tersedia berkurang pada tingkat trofik berikutnya?",
      ],
      [
        "Keseimbangan dan perubahan",
        "Jaring-jaring makanan menghubungkan beberapa rantai makanan. Hilangnya satu spesies dapat memengaruhi spesies lain, tetapi dampaknya bergantung pada hubungan yang ada. Keanekaragaman, habitat, dan sumber daya memengaruhi ketahanan ekosistem. Gunakan bukti untuk menilai perubahan, bukan asumsi satu penyebab saja.",
        "Satu benang yang putus dapat mengubah kekuatan seluruh jaring.",
        "Apa yang mungkin terjadi jika populasi produsen menurun?",
      ],
    ],
    [
      [
        "Contoh komponen abiotik adalah …",
        ["Rumput", "Jamur", "Cahaya", "Kelinci"],
        2,
        "Cahaya merupakan faktor fisik.",
      ],
      [
        "Produsen memperoleh energi utama dari …",
        ["Cahaya matahari", "Konsumen", "Pengurai saja", "Tanah saja"],
        0,
        "Tumbuhan melakukan fotosintesis.",
      ],
      [
        "Pengurai berperan …",
        [
          "Menciptakan energi",
          "Mengembalikan unsur hara",
          "Menghilangkan semua panas",
          "Menjadi batu",
        ],
        1,
        "Pengurai membantu daur materi.",
      ],
      [
        "Energi dalam ekosistem …",
        [
          "Berputar tanpa hilang",
          "Selalu bertambah",
          "Tidak berpindah",
          "Mengalir dan terlepas sebagai panas",
        ],
        3,
        "Setiap perpindahan energi melibatkan pelepasan panas.",
      ],
      [
        "Jaring-jaring makanan terdiri dari …",
        [
          "Satu organisme",
          "Beberapa rantai yang terhubung",
          "Benda mati saja",
          "Satu produsen saja",
        ],
        1,
        "Jaring-jaring menggabungkan hubungan makan yang beragam.",
      ],
    ],
  ],
  [
    "SMP",
    "Bahasa Indonesia",
    "teks-eksplanasi",
    "Mengapa sesuatu terjadi?",
    "book",
    "purple",
    "Jelaskan fenomena melalui urutan sebab dan akibat.",
    [
      [
        "Tujuan eksplanasi",
        "Teks eksplanasi menjelaskan bagaimana atau mengapa fenomena terjadi. Fokusnya adalah proses dan hubungan sebab akibat, misalnya pembentukan hujan. Penjelasan perlu didukung fakta yang relevan dan disusun runtut agar pembaca memahami mekanisme.",
        "Eksplanasi seperti membuka mesin untuk melihat cara kerjanya.",
        "Apa bedanya menjelaskan hujan dan mengajak membeli payung?",
      ],
      [
        "Struktur penjelasan",
        "Teks dapat diawali pernyataan umum tentang fenomena, diikuti deretan penjelas proses atau sebab akibat, dan diakhiri interpretasi bila diperlukan. Setiap tahap harus terhubung secara logis. Hindari melompat ke akibat tanpa menerangkan penyebab yang relevan.",
        "Struktur seperti peta perjalanan dari pengenalan sampai proses terjadinya.",
        "Tahap mana yang harus dijelaskan sebelum akibatnya?",
      ],
      [
        "Hubungan kausal",
        "Kata karena, sehingga, dan akibatnya membantu menghubungkan sebab akibat. Namun, kata penghubung tidak membuktikan kebenaran hubungan. Periksa apakah mekanisme dan buktinya masuk akal. Contoh: udara mendingin sehingga uap dapat mengembun, bukan sekadar dua peristiwa berurutan.",
        "Kata penghubung seperti jembatan; fondasinya tetap bukti dan logika.",
        "Apakah terjadi setelah selalu berarti disebabkan oleh?",
      ],
    ],
    [
      [
        "Tujuan teks eksplanasi adalah …",
        [
          "Menjelaskan proses",
          "Menjual produk",
          "Menceritakan selera saja",
          "Memberi perintah saja",
        ],
        0,
        "Eksplanasi menjelaskan bagaimana atau mengapa.",
      ],
      [
        "Bagian awal biasanya berisi …",
        ["Harga", "Pernyataan umum", "Daftar tokoh", "Penutup"],
        1,
        "Pernyataan umum mengenalkan fenomena.",
      ],
      [
        "Kata penghubung sebab adalah …",
        ["Dan", "Atau", "Karena", "Tetapi saja"],
        2,
        "Karena menandai alasan atau sebab.",
      ],
      [
        "Urutan waktu saja …",
        [
          "Selalu membuktikan sebab",
          "Tidak butuh fakta",
          "Menghapus mekanisme",
          "Belum membuktikan sebab",
        ],
        3,
        "Hubungan kausal memerlukan bukti.",
      ],
      [
        "Penjelasan yang baik disusun …",
        ["Acak", "Runtut", "Tanpa hubungan", "Dengan klaim palsu"],
        1,
        "Urutan logis membantu pembaca memahami proses.",
      ],
    ],
  ],
  [
    "SMP",
    "English",
    "past-events",
    "Stories from yesterday",
    "clock",
    "amber",
    "Ceritakan pengalaman lampau secara runtut dan jelas.",
    [
      [
        "Simple past",
        "Simple past describes completed events in the past. Regular verbs usually add ed: walk becomes walked. Many common verbs are irregular: go becomes went, eat becomes ate. Penanda waktu seperti yesterday membantu memperjelas kapan kejadian berlangsung.",
        "Simple past seperti membuka album peristiwa yang sudah selesai.",
        "What did you do yesterday?",
      ],
      [
        "Questions and negatives",
        "Use did not or did not shortened as didn't with the base verb: I did not go. Questions use Did plus subject plus base verb: Did you go? Jangan memakai went sesudah did dalam pola ini. Untuk be, gunakan was atau were sesuai subjek.",
        "Did sudah membawa tanda lampau, jadi kata kerja kembali ke bentuk dasar.",
        "Why do we say Did you go, not Did you went?",
      ],
      [
        "A short recount",
        "A recount introduces who, where, and when, then describes events in order. Use first, then, and finally to connect events. Example: Yesterday, I visited my aunt. Then we cooked lunch. Finally, I went home. Keep verb forms consistent with the time being described.",
        "Recount seperti menyusun foto sesuai urutan waktunya.",
        "Which event happened first in your story?",
      ],
    ],
    [
      [
        "Past form of go is …",
        ["goed", "goes", "went", "going"],
        2,
        "Go adalah kata kerja tidak beraturan.",
      ],
      [
        "Kalimat yang benar adalah …",
        ["Did you went?", "Did you go?", "Did you goes?", "Do you went?"],
        1,
        "Did diikuti kata kerja dasar.",
      ],
      [
        "Negative form of I played adalah …",
        ["I did not play", "I did not played", "I not plays", "I no played"],
        0,
        "Did not diikuti play.",
      ],
      [
        "Yesterday menunjukkan …",
        ["Masa depan", "Tempat", "Kebiasaan saja", "Masa lampau"],
        3,
        "Yesterday berarti kemarin.",
      ],
      [
        "First, then, finally membantu menunjukkan …",
        ["Warna", "Urutan", "Ukuran", "Harga"],
        1,
        "Kata-kata ini menandai urutan peristiwa.",
      ],
    ],
  ],
  [
    "SMP",
    "Critical Thinking",
    "evaluasi-argumen",
    "Alasan di balik pendapat",
    "search",
    "blue",
    "Bedakan klaim, bukti, dan alasan yang menghubungkannya.",
    [
      [
        "Klaim dan alasan",
        "Argumen terdiri atas klaim yang ingin diterima dan alasan yang mendukungnya. Klaim adalah pernyataan utama, sedangkan alasan menjawab mengapa klaim patut dipercaya. Pendapat tanpa dukungan belum menjadi argumen yang kuat.",
        "Klaim seperti atap; alasan adalah tiang penyangganya.",
        "Apa klaim utama dari pendapat yang sedang dibahas?",
      ],
      [
        "Menilai bukti",
        "Bukti yang baik harus relevan, dapat diperiksa, dan cukup untuk mendukung klaim. Perhatikan sumber, waktu, cara pengumpulan, dan jumlah pengamatan. Satu pengalaman pribadi tidak otomatis mewakili semua orang. Bedakan fakta teramati dan kesimpulan yang ditarik.",
        "Bukti seperti ukuran sepatu: harus cocok dengan kaki klaimnya.",
        "Apakah satu contoh cukup untuk menyimpulkan semua siswa?",
      ],
      [
        "Menanggapi dengan adil",
        "Periksa apakah kesimpulan mengikuti alasan. Hindari menyerang pribadi sebagai pengganti menilai gagasan. Cari penjelasan alternatif dan bukti yang dapat membantah klaim sendiri. Argumen dapat diperbaiki ketika muncul informasi baru.",
        "Diskusi seperti memeriksa peta bersama, bukan berlomba berteriak.",
        "Bukti apa yang dapat mengubah pendapatmu?",
      ],
    ],
    [
      [
        "Klaim adalah …",
        [
          "Pernyataan utama",
          "Nama sumber saja",
          "Angka acak",
          "Serangan pribadi",
        ],
        0,
        "Klaim adalah hal yang ingin didukung.",
      ],
      [
        "Bukti harus …",
        [
          "Populer saja",
          "Relevan dan dapat diperiksa",
          "Selalu satu contoh",
          "Tanpa sumber",
        ],
        1,
        "Relevansi dan keterperiksaan penting.",
      ],
      [
        "Satu pengalaman pribadi …",
        [
          "Selalu mewakili semua",
          "Menghapus kebutuhan data",
          "Belum tentu mewakili semua",
          "Pasti palsu",
        ],
        2,
        "Generalisasi memerlukan bukti cukup.",
      ],
      [
        "Menyerang pribadi …",
        [
          "Membuktikan klaim",
          "Menguatkan data",
          "Selalu relevan",
          "Tidak menggantikan penilaian alasan",
        ],
        3,
        "Nilai gagasan berdasarkan alasan dan bukti.",
      ],
      [
        "Sikap terbuka berarti …",
        [
          "Mau memperbarui kesimpulan",
          "Percaya semua klaim",
          "Menolak bukti",
          "Tidak punya alasan",
        ],
        0,
        "Informasi baru dapat memperbaiki argumen.",
      ],
    ],
  ],
  [
    "SMA",
    "Matematika",
    "peluang",
    "Mengukur kemungkinan",
    "dice",
    "coral",
    "Dari ruang sampel ke penalaran peluang yang lebih tajam.",
    [
      [
        "Ruang sampel",
        "Ruang sampel adalah himpunan seluruh hasil yang mungkin dari percobaan. Kejadian merupakan himpunan bagian ruang sampel. Untuk dadu bersisi enam, hasil yang mungkin adalah 1 sampai 6. Tentukan percobaan dan ruang sampelnya sebelum menghitung peluang.",
        "Ruang sampel seperti daftar seluruh pintu yang mungkin terbuka.",
        "Apa ruang sampel pelemparan satu koin?",
      ],
      [
        "Peluang kejadian",
        "Jika semua hasil sama mungkin, peluang A adalah banyak hasil dalam A dibagi banyak hasil ruang sampel. Pada dadu adil, peluang bilangan genap adalah 3/6 = 1/2. Rumus hitungan ini tidak boleh dipakai tanpa memeriksa asumsi kesamaan kemungkinan. Nilai peluang berada antara 0 dan 1.",
        "Peluang seperti porsi kursi bertanda dari semua kursi yang sama mungkin terpilih.",
        "Mengapa kata adil penting pada contoh dadu?",
      ],
      [
        "Komplemen dan independensi",
        "Peluang komplemen A adalah 1 dikurangi P(A). Dua kejadian independen bila terjadinya satu tidak mengubah peluang yang lain. Pada dua lemparan koin adil yang independen, peluang dua gambar adalah 1/2 kali 1/2 = 1/4. Saling lepas berarti dua kejadian tidak dapat terjadi bersamaan, seperti hasil ganjil dan genap pada satu lemparan dadu. Dua kejadian saling lepas yang masing-masing berpeluang positif tidak independen: ketika satu terjadi, peluang yang lain menjadi nol. Bandingkan dua lemparan koin yang independen dengan ganjil dan genap pada satu lemparan dadu yang saling lepas.",
        "Lemparan koin baru tidak menyimpan utang terhadap hasil sebelumnya.",
        "Apakah rentetan gambar membuat angka pasti muncul berikutnya?",
      ],
    ],
    [
      [
        "Peluang genap pada dadu adil adalah …",
        ["1/6", "1/2", "2/3", "1"],
        1,
        "Ada tiga hasil genap dari enam hasil sama mungkin.",
      ],
      [
        "Jika P(A)=0,3, peluang komplemennya …",
        ["0,3", "1,3", "0,7", "3"],
        2,
        "1 dikurangi 0,3 sama dengan 0,7.",
      ],
      [
        "Peluang dua gambar pada dua lemparan independen adalah …",
        ["1/4", "1/2", "3/4", "1"],
        0,
        "Kalikan 1/2 dengan 1/2.",
      ],
      [
        "Rumus jumlah kejadian dibagi ruang sampel mensyaratkan …",
        [
          "Hasil selalu berbeda",
          "Sampel besar saja",
          "Tanpa asumsi",
          "Hasil sama mungkin",
        ],
        3,
        "Peluang berbasis hitungan membutuhkan hasil ekuiprobabel.",
      ],
      [
        "Independen berarti …",
        [
          "Tidak dapat terjadi bersama",
          "Tidak saling mengubah peluang",
          "Selalu sama",
          "Pasti berlawanan",
        ],
        1,
        "Independensi berkaitan dengan pengaruh pada peluang.",
      ],
    ],
  ],
  [
    "SMA",
    "IPA",
    "genetika",
    "Kode kehidupan",
    "dna",
    "green",
    "Hubungkan DNA, pewarisan sifat, dan batas model sederhana.",
    [
      [
        "DNA, gen, dan kromosom",
        "DNA menyimpan informasi genetik. Gen adalah bagian DNA yang berkontribusi pada produk fungsional, dan kromosom mengemas DNA bersama protein. Alel adalah variasi pada suatu lokus gen. Model pewarisan sederhana membantu belajar, tetapi banyak sifat dipengaruhi banyak gen dan lingkungan.",
        "DNA seperti perpustakaan; gen seperti bagian instruksi di dalamnya.",
        "Apa perbedaan gen dengan alel?",
      ],
      [
        "Genotipe dan fenotipe",
        "Genotipe adalah susunan genetik, sedangkan fenotipe merupakan sifat teramati hasil interaksi genotipe dan lingkungan. Dalam model dominansi penuh, Aa menampilkan fenotipe dominan. Dominan tidak berarti lebih baik atau selalu lebih umum dalam populasi.",
        "Genotipe seperti resep, fenotipe seperti hasil masakan yang juga dipengaruhi kondisi dapur.",
        "Mengapa lingkungan dapat memengaruhi fenotipe?",
      ],
      [
        "Persilangan monohibrid",
        "Pada model Mendel sederhana dengan dominansi penuh, persilangan Aa dengan Aa memberi peluang genotipe AA: Aa: aa sebesar 1:2:1. Rasio fenotipe harapannya 3:1. Ini adalah peluang, bukan jaminan bahwa setiap empat keturunan persis mengikuti rasio itu.",
        "Kotak Punnett seperti peta semua pasangan alel yang mungkin.",
        "Mengapa rasio harapan tidak selalu sama dengan hasil sampel kecil?",
      ],
    ],
    [
      [
        "Variasi pada lokus gen disebut …",
        ["Kromosom", "Alel", "Sel", "Jaringan"],
        1,
        "Alel adalah variasi pada lokus yang sama.",
      ],
      [
        "Fenotipe dipengaruhi …",
        [
          "Genotipe dan lingkungan",
          "Nama saja",
          "Genotipe saja selalu",
          "Lingkungan saja selalu",
        ],
        0,
        "Keduanya dapat berkontribusi.",
      ],
      [
        "Aa × Aa memberi peluang aa sebesar …",
        ["0", "1/2", "1/4", "1"],
        2,
        "Satu dari empat kombinasi harapan adalah aa.",
      ],
      [
        "Dominan berarti …",
        [
          "Pasti paling umum",
          "Paling baik",
          "Selalu kuat",
          "Tampak pada heterozigot dalam model dominansi penuh",
        ],
        3,
        "Dominansi adalah hubungan ekspresi alel dalam model tertentu.",
      ],
      [
        "Rasio 3:1 adalah …",
        [
          "Jaminan tiap empat keturunan",
          "Rasio fenotipe harapan",
          "Rasio kromosom",
          "Ukuran DNA",
        ],
        1,
        "Rasio merupakan harapan probabilistik.",
      ],
    ],
  ],
  [
    "SMA",
    "Bahasa Indonesia",
    "teks-argumentasi",
    "Menulis gagasan yang bertahan",
    "pen",
    "purple",
    "Bangun pendapat dengan bukti, penalaran, dan sanggahan.",
    [
      [
        "Tesis yang jelas",
        "Teks argumentasi berusaha meyakinkan pembaca melalui klaim dan dukungan logis. Tesis menyatakan posisi utama yang dapat diperdebatkan. Batasi klaim agar sesuai bukti: pernyataan tentang satu sekolah tidak otomatis berlaku untuk seluruh Indonesia.",
        "Tesis seperti tujuan perjalanan yang membuat arah tulisan jelas.",
        "Apakah tesis ini cukup spesifik untuk diuji?",
      ],
      [
        "Bukti dan penalaran",
        "Sajikan bukti relevan dari sumber tepercaya dan jelaskan kaitannya dengan tesis. Data tidak berbicara sendiri: penulis perlu menunjukkan alasan mengapa data mendukung kesimpulan. Bedakan korelasi dan sebab akibat. Sertakan sumber serta batas pengukuran.",
        "Bukti adalah bahan bangunan; penalaran menyambungkannya menjadi rumah.",
        "Jembatan logika apa yang menghubungkan data dengan kesimpulan?",
      ],
      [
        "Sanggahan dan simpulan",
        "Pertimbangkan keberatan yang kuat secara adil lalu tanggapi dengan bukti atau pembatasan klaim. Simpulan menegaskan posisi berdasarkan pembahasan tanpa memasukkan bukti baru yang belum dijelaskan. Mengakui keterbatasan dapat membuat tulisan lebih dapat dipercaya.",
        "Sanggahan seperti menguji jembatan sebelum dilalui banyak orang.",
        "Keberatan apa yang paling masuk akal terhadap tesismu?",
      ],
    ],
    [
      [
        "Tesis adalah …",
        [
          "Posisi utama",
          "Daftar pustaka",
          "Kutipan acak",
          "Kalimat tanpa posisi",
        ],
        0,
        "Tesis menyatakan posisi yang dikembangkan.",
      ],
      [
        "Data perlu diikuti …",
        [
          "Hiasan",
          "Penjelasan kaitan logis",
          "Serangan pribadi",
          "Kesimpulan tanpa alasan",
        ],
        1,
        "Penalaran menghubungkan bukti dan klaim.",
      ],
      [
        "Korelasi …",
        [
          "Selalu sebab akibat",
          "Tidak memerlukan analisis",
          "Belum membuktikan sebab akibat",
          "Selalu palsu",
        ],
        2,
        "Penjelasan alternatif perlu diperiksa.",
      ],
      [
        "Sanggahan yang baik …",
        [
          "Diabaikan",
          "Diputarbalikkan",
          "Disembunyikan",
          "Ditanggapi secara adil",
        ],
        3,
        "Tanggapi argumen terbaik pihak lain.",
      ],
      [
        "Simpulan sebaiknya …",
        [
          "Menegaskan hasil pembahasan",
          "Menambah data tanpa penjelasan",
          "Mengubah seluruh topik",
          "Menghapus tesis",
        ],
        0,
        "Simpulan berpijak pada pembahasan yang sudah ada.",
      ],
    ],
  ],
  [
    "SMA",
    "English",
    "analytical-exposition",
    "Make your case",
    "globe",
    "amber",
    "Susun argumen bahasa Inggris yang logis dan meyakinkan.",
    [
      [
        "Purpose and thesis",
        "An analytical exposition presents a position and supports it with reasons. The thesis introduces the topic and the writer's position. A useful thesis is specific enough to defend, for example: Schools should provide quiet reading time. Distinguish persuasion through reasons from merely stating a preference.",
        "A thesis is a destination; arguments explain why the route makes sense.",
        "What position does the writer want readers to accept?",
      ],
      [
        "Arguments and evidence",
        "Develop each argument with relevant evidence and explanation. Connect ideas with because, therefore, and however, but do not use connectors to hide gaps in reasoning. Source quality matters. A statistic should include enough context to understand what was measured.",
        "Evidence supports a bridge; explanation connects the bridge to the other side.",
        "How does this example support the thesis?",
      ],
      [
        "Reiteration and qualification",
        "A reiteration restates the position in light of the arguments. Do not introduce a completely new argument in the conclusion. Use qualified language when evidence is limited: may, can, or in this sample. Strong academic writing matches the strength of the claim to the strength of the evidence.",
        "A conclusion ties the thread together instead of starting a different fabric.",
        "When is may more accurate than always?",
      ],
    ],
    [
      [
        "The thesis presents …",
        [
          "Only a date",
          "The writer's position",
          "A random quote",
          "Only a title",
        ],
        1,
        "The thesis identifies the position.",
      ],
      [
        "Arguments need …",
        [
          "Relevant evidence",
          "Only loud language",
          "No explanation",
          "Personal attacks",
        ],
        0,
        "Evidence and explanation support the position.",
      ],
      [
        "However often signals …",
        ["Time only", "A list", "Contrast", "A number"],
        2,
        "However introduces contrast.",
      ],
      [
        "A reiteration should …",
        [
          "Add unrelated arguments",
          "Change the topic",
          "Omit the position",
          "Restate the supported position",
        ],
        3,
        "It brings the exposition back to its thesis.",
      ],
      [
        "May is useful when …",
        [
          "A claim needs qualification",
          "Everything is certain",
          "No evidence matters",
          "A date is needed",
        ],
        0,
        "Qualification reflects limited certainty.",
      ],
    ],
  ],
  [
    "SMA",
    "Critical Thinking",
    "data-bias",
    "Membaca data dengan jernih",
    "chart",
    "blue",
    "Kenali bias, ketidakpastian, dan kesimpulan yang terlalu jauh.",
    [
      [
        "Populasi dan sampel",
        "Populasi adalah kelompok yang ingin dipahami, sedangkan sampel adalah bagian yang diamati. Sampel besar belum tentu mewakili populasi jika cara pemilihannya bias. Survei hanya kepada pengunjung perpustakaan tidak langsung mewakili semua siswa tentang kebiasaan membaca.",
        "Sampel seperti mencicipi sup; ambil dari bagian yang mewakili seluruh panci.",
        "Siapa yang tidak terwakili dalam survei ini?",
      ],
      [
        "Bias dan variabel perancu",
        "Bias seleksi muncul ketika pemilihan pengamatan menyimpangkan kesimpulan. Variabel perancu dapat memengaruhi dua variabel yang tampak berkaitan. Hubungan antara penjualan es krim dan kejadian tertentu tidak otomatis berarti es krim penyebabnya; musim dapat menjadi faktor lain.",
        "Perancu seperti pengatur lampu tersembunyi yang memengaruhi dua ruangan.",
        "Adakah faktor ketiga yang menjelaskan hubungan ini?",
      ],
      [
        "Kesimpulan proporsional",
        "Periksa sumber, metode, ukuran sampel, skala grafik, serta ketidakpastian. Sumbu yang dipotong dapat memperbesar kesan selisih. Bedakan perubahan absolut dan relatif: dari 1 menjadi 2 naik satu unit sekaligus 100 persen. Sesuaikan kekuatan klaim dengan desain penelitian dan kualitas data.",
        "Grafik seperti peta: skala mengubah kesan jarak tanpa mengubah tempatnya.",
        "Informasi apa yang hilang sebelum kita mengambil keputusan?",
      ],
    ],
    [
      [
        "Sampel besar …",
        [
          "Pasti representatif",
          "Belum tentu representatif",
          "Tidak pernah berguna",
          "Sama dengan populasi",
        ],
        1,
        "Cara memilih sampel tetap menentukan.",
      ],
      [
        "Faktor yang memengaruhi dua variabel disebut …",
        ["Variabel perancu", "Judul", "Kesimpulan", "Persentase"],
        0,
        "Perancu dapat menjelaskan hubungan semu.",
      ],
      [
        "Dari 1 ke 2 berarti kenaikan relatif …",
        ["1 persen", "50 persen", "100 persen", "200 persen"],
        2,
        "Kenaikan satu dibagi nilai awal satu adalah 100 persen.",
      ],
      [
        "Sumbu grafik terpotong dapat …",
        [
          "Mengubah data asli",
          "Menghapus bias",
          "Membuktikan sebab",
          "Memperbesar kesan selisih",
        ],
        3,
        "Tampilan skala dapat memengaruhi persepsi.",
      ],
      [
        "Kesimpulan harus disesuaikan dengan …",
        [
          "Popularitas saja",
          "Kualitas data dan metode",
          "Judul paling menarik",
          "Pendapat penulis saja",
        ],
        1,
        "Kekuatan bukti membatasi kesimpulan.",
      ],
    ],
  ],
];
export const modules: LearningModule[] = seeds.map(
  ([
    grade,
    subject,
    id,
    title,
    icon,
    color,
    description,
    parts,
    questions,
  ]) => ({
    id,
    grade,
    subject,
    title,
    icon,
    color,
    description,
    objectives: [
      `Memahami dasar ${title.toLowerCase()}.`,
      "Menjelaskan konsep dengan kata sendiri.",
      "Menerapkan konsep dalam masalah sehari-hari.",
    ],
    sections: parts.map(([heading, text, analogy, question], i) => ({
      id: `bagian-${i + 1}`,
      title: heading,
      text,
      analogy,
      question,
      concept: `${id}-konsep-${i + 1}`,
      requires: i === 0 ? [] : [`${id}-konsep-${i}`],
    })),
    quiz: questions.map(([prompt, options, answer, explanation]) => ({
      prompt,
      options,
      answer,
      explanation,
    })),
    references: [curriculum],
  }),
);
export const getModule = (id: string) => modules.find((m) => m.id === id);
export function publicModule(m: LearningModule) {
  return {
    ...m,
    quiz: m.quiz.map(({ prompt, options }) => ({ prompt, options })),
  };
}
export type PublicModule = ReturnType<typeof publicModule>;

// Explicit curriculum prerequisites, reviewed as directed learning relationships.
const crossModulePrerequisites: Record<string, string[]> = {
  "fakta-opini-konsep-3": ["ide-pokok-konsep-1"],
  "evaluasi-argumen-konsep-3": ["teks-eksplanasi-konsep-3"],
  "ekosistem-konsep-3": ["evaluasi-argumen-konsep-2"],
  "genetika-konsep-3": ["peluang-konsep-2"],
  "teks-argumentasi-konsep-2": ["data-bias-konsep-1"],
};
for (const module of modules)
  for (const section of module.sections)
    section.requires.push(...(crossModulePrerequisites[section.concept] ?? []));
