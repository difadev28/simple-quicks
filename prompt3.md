Prompt (Bahasa Indonesia)

Buat komponen Quick Action Tabs Button dengan perilaku berikut:

Terdapat 1 button utama (default) berbentuk bulat di posisi kanan.

Saat button utama diklik:

Button expand ke arah kiri

Muncul beberapa button kecil berbentuk bulat tersusun horizontal ke kiri

Animasi smooth (ease-in-out, 200–300ms)

Saat salah satu quick button dipilih:

Button yang dipilih menjadi active

Active button berpindah ke posisi utama (kanan)

Berikan sedikit spacing (gap ±8–12px) antara active button dan button lain

Button lain tetap berada di sisi kiri

Saat active button diklik kembali:

Semua quick button collapse

Kembali ke state default (hanya 1 button utama terlihat)

Jika jumlah quick button lebih dari 1:

Button tetap expand ke kiri

Tidak melebihi batas layar

Style:

Bentuk: circular

Size utama lebih besar dari quick button

Warna active berbeda (highlight)

Shadow ringan

UX behavior:

Click outside → collapse

Hover menunjukkan state interaktif

Output diharapkan:

UI component yang reusable

Mudah diimplementasikan di React / Next.js