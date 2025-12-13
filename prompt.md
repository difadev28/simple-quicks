Tentu, ini adalah _prompt_ yang terstruktur dan rinci untuk membantu Anda memulai proyek menggunakan **React, Vite, dan Tailwind CSS v4**, dengan menggunakan API _mock_ dari [https://jsonplaceholder.typicode.com/](https://jsonplaceholder.typicode.com/):

---

## 💻 **Prompt Proyek: Aplikasi Chat & Task Management (React, Vite, Tailwind v4)**

### **I. Deskripsi Proyek & Teknologi Dasar**

Buatlah aplikasi _front-end_ menggunakan **React** dan **Vite** sebagai _bundler_, serta **Tailwind CSS v4** untuk _styling_. Aplikasi ini akan menggunakan API _mock_ dari [https://jsonplaceholder.typicode.com/](https://jsonplaceholder.typicode.com/) untuk mengambil data yang dibutuhkan.

### **II. Struktur Utama & Navigasi**

Aplikasi memiliki satu tata letak (layout) utama dengan dua fitur utama: **Chat** dan **Task**.

* **Tabs Navigasi:** Di bagian bawah layar (fixed-bottom), terdapat komponen _Tabs_ sederhana untuk beralih antara fitur **Chat** dan **Task**. Salah satu tab harus ditandai sebagai tab yang sedang aktif.

### **III. Fitur 1: Chat Management**

Fitur Chat terdiri dari dua halaman utama: **List Chat** dan **Inbox Chat Detail**.

#### **A. Halaman 1: List Chat (`/chat`)**

Halaman ini menampilkan daftar percakapan (inbox) yang tersedia.

1.  **Header:**
    * **Search Input:** Input teks untuk mencari percakapan berdasarkan nama pengguna (user) atau isi pesan terbaru.
2.  **List Percakapan:** Tampilkan daftar item percakapan. Setiap item harus memiliki:
    * **Informasi Pengirim:**
        * _Profile Image_ (API: `picture` dari _User_)
        * _Username_ (API: `firstName` dan `lastName` dari _User_)
    * **Informasi Pesan Terakhir:**
        * _Latest Updated Chat_ (Timestamp/Waktu)
        * _Isi Pesan Terakhir_ (Truncated: Hanya satu baris, tambahkan elipsis jika kepanjangan).
    * **Status Pesan:**
        * **Label "New Message":** Jika pesan tersebut belum pernah dilihat, tampilkan label **"NEW MESSAGE"** di atas item percakapan.
3.  **Aksi:** Mengklik salah satu item akan menavigasi ke **Inbox Chat Detail** (misalnya, `/chat/:userId`).

#### **B. Halaman 2: Inbox Chat Detail ( `/chat/:userId` )**

Halaman ini menampilkan riwayat obrolan dengan pengguna tertentu.

1.  **Header:**
    * Kembali ke **List Chat**.
    * Tampilkan nama pengguna lawan bicara.
2.  **Riwayat Chat (Pesan):**
    * Tampilkan pesan dalam format _popup bubble_ (gelembung percakapan).
    * **Pesan Orang Lain (Lawan Bicara):**
        * Posisi: Sebelah kiri.
        * Warna _bubble_: **Amber Orange** (menggunakan utilitas warna Tailwind v4).
        * Isi: Nama pengguna dan di bawahnya isi pesan.
    * **Pesan Anda (Pengguna Saat Ini):**
        * Posisi: Sebelah kanan.
        * Warna _bubble_: **Ungu** (menggunakan utilitas warna Tailwind v4).
        * Isi: Isi pesan.
    * **Aksi Pada Pesan:**
        * Setiap _popup bubble_ (milik Anda atau orang lain) memiliki tombol aksi **Edit** dan **Delete**. *(Catatan: Untuk penyederhanaan API _mock_, fungsionalitas edit/delete hanya diterapkan pada sisi UI/State lokal)*.
        * **Aksi Edit:** Mengklik **Edit** akan mengubah _popup bubble_ menjadi **popup input form** dengan isi pesan sebelumnya.
            * Di bawah input, tampilkan tombol **Cancel** dan **Update**.
            * **Update:** Mengubah teks pesan dan mengembalikan ke tampilan _popup bubble_ normal.
            * **Cancel:** Mengembalikan ke tampilan _popup bubble_ normal tanpa perubahan.
        * **Aksi Delete:** Mengklik **Delete** akan menampilkan **modal konfirmasi** (Contoh: "Apakah Anda yakin ingin menghapus pesan ini?").
            * **Confirm:** Menghapus pesan dari riwayat chat.
3.  **Input Pesan (Fixed Footer):**
    * Container **fixed di bagian bawah** layar.
    * **Input Teks** untuk menulis pesan.
    * **Button Send:** Mengirim pesan baru.
        * Aksi: Pesan yang dikirim akan otomatis **ditambahkan ke riwayat chat** (_local state_) sebagai pesan Anda (warna Ungu).

### **IV. Fitur 2: Task Management ( `/task` )**

**(Catatan: Fitur Task tidak dijelaskan secara rinci. Untuk tujuan _prompt_ ini, Anda hanya perlu membuat _placeholder_ untuk fitur ini.)**

* Tampilkan halaman **Task Management** sebagai _placeholder_ dengan tulisan: "Halaman Task Management akan segera hadir."

### **V. Persyaratan API (DummyAPI.io)**

Gunakan API berikut (atau yang relevan) dari **[https://jsonplaceholder.typicode.com/](https://jsonplaceholder.typicode.com/)**:

* **Untuk List Chat/User Data:** Gunakan _endpoint_ **User** (misalnya, `/user`).
* **Untuk Riwayat Pesan:** Gunakan _endpoint_ **Comment** atau **Post** (untuk mensimulasikan riwayat percakapan), Anda mungkin perlu mengadaptasi struktur data yang diterima.

> **PENTING:** Karena **dummyapi.io** adalah API _mock_ sederhana, interaksi dinamis (seperti mengirim/mengedit/menghapus pesan) akan diimplementasikan menggunakan **_State Management_ lokal** di React, **BUKAN** melalui panggilan API yang sebenarnya.

---

### 🚀 **Ringkasan Tugas Anda**

1.  Setup proyek dengan **Vite + React + Tailwind CSS v4**.
2.  Implementasi **Tabs Navigasi** di bagian bawah.
3.  Bangun komponen **List Chat** lengkap dengan **Search** dan detail item.
4.  Bangun halaman **Inbox Chat Detail** dengan logika:
    * Tampilan _bubble_ **Amber Orange** dan **Ungu**.
    * Fungsionalitas **Send Message** (menambah ke _state_ lokal).
    * Fungsionalitas **Edit** dan **Delete** pesan (mengubah _state_ lokal).
5.  Buat _placeholder_ untuk fitur **Task**.

---

Gunakan Pendekatan Ini 
Oke, dari **gambar chat yang kamu kirim**, aku jelasin **cara paling masuk akal (dan dinilai senior)** untuk ngedata & nge-handle ini pakai **JSONPlaceholder** 👇
(*tanpa backend beneran, tapi tetap realistis*)

---

## 🧩 Apa saja yang terlihat dari UI ini

Dari screenshot, fitur chat-nya punya:

1. **Header**

   * Judul case / room
   * Jumlah participant
2. **Message list**

   * Grouped by **date** (Today June 09, 2021)
   * Bubble kiri (orang lain)
   * Bubble kanan (You)
   * Ada sender name (Mary Hilda)
   * Timestamp
3. **Composer**

   * Input message
   * Send button
   * New Message button

---

## 🧠 Mapping ke JSONPlaceholder (REALISTIS)

### 1️⃣ Chat Room (Header)

👉 pakai `/users`

```ts
GET https://jsonplaceholder.typicode.com/users
```

Mapping:

```ts
ChatRoom {
  id: number
  title: `${user.username} - Case`
  participants: 3
}
```

---

### 2️⃣ Message List

👉 pakai `/comments` atau `/posts`

**Rekomendasi:** `/comments?postId=:id`

```ts
GET https://jsonplaceholder.typicode.com/comments?postId=1
```

Mapping ke message:

```ts
Message {
  id: number
  sender: 'me' | 'them'
  senderName: string
  text: string
  createdAt: string
}
```

Transform example:

```ts
const mapCommentToMessage = (c) => ({
  id: c.id,
  sender: c.email.includes('me') ? 'me' : 'them',
  senderName: c.name,
  text: c.body,
  createdAt: fakeDate(),
})
```

📌 **Ini penting**:
Reviewer **TAHU** JSONPlaceholder gak punya `createdAt`,
yang mereka lihat adalah **cara kamu meng-handle kekurangan API**.

---

### 3️⃣ Group by Date (WAJIB BIAR KELIHATAN PRO)

```ts
const groupByDate = (messages) => {
  return messages.reduce((acc, msg) => {
    const date = formatDate(msg.createdAt)
    acc[date] = acc[date] || []
    acc[date].push(msg)
    return acc
  }, {})
}
```

UI hasil:

```
— Today June 09, 2021 —
• message
• message
```

🔥 Ini **nilai plus besar**.

---

## ✉️ Kirim Message (POST)

👉 pakai `POST /comments` atau `/posts`

```ts
POST https://jsonplaceholder.typicode.com/comments
```

```ts
await fetch('/comments', {
  method: 'POST',
  body: JSON.stringify({
    postId: roomId,
    body: message,
    email: 'me@quicks.app',
    name: 'You',
  }),
})
```

### 🔥 Pola yang BENAR (Optimistic UI)

```ts
addMessage({
  id: Date.now(),
  sender: 'me',
  senderName: 'You',
  text,
  createdAt: new Date().toISOString(),
})

await postMessage()
```

✔ Pesan langsung muncul
✔ UX terasa real
✔ Backend limitation tertutup rapi

---

## 📂 Struktur folder (senior & clean)

```txt
src/
 ├─ api/
 │   └─ chat.api.ts
 ├─ features/
 │   └─ messaging/
 │       ├─ MessageList.tsx
 │       ├─ MessageItem.tsx
 │       ├─ MessageComposer.tsx
 │       └─ useMessages.ts
 ├─ utils/
 │   └─ date.ts
```

---
 