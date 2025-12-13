Tentu, saya akan bantu membuatkan *prompt* yang detail untuk mendeskripsikan fitur manajemen tugas (*task management*) yang Anda inginkan.

Ini adalah *prompt* yang dapat Anda gunakan, difokuskan pada **Antarmuka Pengguna (UI)** dan **Fungsionalitas** setiap elemen:

---

## 📝 Prompt Desain Fitur 'My Task Manager'

Buatkan spesifikasi fitur *task manager* dengan nama **"My Task Manager"** yang memiliki struktur utama berupa daftar tugas interaktif. Fitur ini harus mencakup UI/UX dan fungsionalitas berikut:

### 1. Header dan Filter Utama

Header utama fitur ini harus berada di bagian atas dan memiliki komponen-komponen berikut:

* **Dropdown Filter (Status Task):**
    * **Lokasi:** Di sisi kiri *header*.
    * **Pilihan:**
        1.  **My Task**
        2.  **Personal Errands**
        3.  **Urgent To Do**
    * **Fungsi:** Mengubah daftar tugas yang ditampilkan di bawahnya sesuai dengan kategori/status yang dipilih.

* **Button 'New Task':**
    * **Lokasi:** Di sisi kanan *header*.
    * **Fungsi:** Ketika diklik, akan memunculkan **Form Input Tugas Baru** (dijelaskan di bagian 3) dengan tampilan yang persis sama seperti tampilan *task* di list, namun dalam keadaan kosong dan siap diisi.

### 2. Daftar Tugas (Task List)

Di bawah *header*, terdapat daftar tugas yang disusun rapi. Setiap item tugas dalam daftar (*list item*) harus berbentuk **Accordion** yang menampilkan informasi utama di *header*-nya.

#### 2.1. Task Item Header (Informasi Utama)

Setiap *task item* di list harus menampilkan elemen-elemen berikut dari kiri ke kanan:

* **Checkbox Fungsional:**
    * **Fungsi:** Ketika di-*check*, menandakan tugas telah selesai.
    * **UI Efek:** Setelah di-*check*, *title* tugas yang bersangkutan harus ditampilkan dengan efek **garis coret (strikethrough)**.
* **Title Tugas:** Teks judul tugas.
* **Due Date Countdown:** Menampilkan sisa waktu dalam format seperti **"2 Days Left"** atau **"Today"**.
* **Due Date Info (Label):** Label kecil yang menampilkan tanggal pasti *due date* (misalnya, **"15 Dec"**).
* **Button Ellipsis Vertikal (⋮):**
    * **Fungsi:** Ketika diklik, memunculkan menu *action* berupa *popup* kecil.
    * **Menu Action:** Menu harus memiliki satu opsi: **Delete**.
    * **Fungsi Delete:** Ketika **Delete** di-*click*, *task item* yang bersangkutan harus **langsung hilang** dari daftar tugas.

#### 2.2. Task Item Content (Expanded View)

Ketika *task item* (Accordion *header*) di-klik dan di-*expand*, ia harus menampilkan konten detail berikut:

* **Input Date Picker:** Untuk mengubah *due date* tugas yang sudah ada.
* **Content Description:** Area teks untuk melihat atau mengedit deskripsi detail tugas.

### 3. Form Input Tugas Baru (New Task Form)

Form ini muncul ketika tombol **'New Task'** diklik. Form harus memiliki *input field* berikut:

* **Title:** Input teks untuk judul tugas.
* **Input Due Date:** Menggunakan *date picker* untuk memilih tanggal jatuh tempo.
* **Category (Dropdown):** Memilih kategori tugas. Pilihan harus sama dengan *dropdown* di *header* (e.g., Personal Errands, Urgent To Do).
* **Content Description:** Area teks untuk deskripsi detail.
* **Button 'Create':**
    * **Fungsi:** Ketika diklik, tugas baru akan **ditambahkan** ke dalam daftar tugas (*Task List*) di bawah, dan *form* akan ditutup/di-reset.
