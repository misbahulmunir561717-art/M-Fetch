const inputUrl = document.getElementById('inputUrl');
const btnCek = document.getElementById('btnCek');
const btnTempel = document.getElementById('btnTempel');
const areaHasil = document.getElementById('areaHasil');
const pilihKualitas = document.getElementById('pilihKualitas');
const daftarSegmen = document.querySelectorAll('.segmen');
const toastPesan = document.getElementById('toastPesan');
const formPengaturan = document.getElementById('formPengaturan');
const halamanAplikasi = document.querySelectorAll('.halaman');
const tabSosmed = document.querySelectorAll('.tombol-tab');
const formUnduh = document.getElementById('formUnduh');

let timerToast;

const listNav = document.querySelectorAll('.list');
const indicator = document.querySelector('.indicator');

function pindahIndikator(elemen) {
    if(!elemen) return;
    const offsetL = elemen.offsetLeft;
    const lebar = elemen.offsetWidth;
    const targetPos = offsetL + (lebar / 2) - 30;
    if(indicator) {
        indicator.style.transform = `translateX(${targetPos}px)`;
    }
}

setTimeout(() => {
    const aktifAwal = document.querySelector('.list.aktif');
    pindahIndikator(aktifAwal);
}, 50);

window.addEventListener('resize', () => {
    pindahIndikator(document.querySelector('.list.aktif'));
});

listNav.forEach(item => {
    item.addEventListener('click', () => {
        const targetView = item.dataset.view;
        
        listNav.forEach(btn => btn.classList.remove('aktif'));
        item.classList.add('aktif');
        
        pindahIndikator(item);
        
        halamanAplikasi.forEach(hal => {
            if (hal.dataset.page === targetView) {
                hal.classList.add('aktif');
                hal.removeAttribute('hidden');
            } else {
                hal.classList.remove('aktif');
                hal.setAttribute('hidden', '');
            }
        });
    });
});

const navSosmedContainer = document.querySelector('.navigasi-sosmed');
let isDown = false;
let startX;
let scrollLeft;

navSosmedContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - navSosmedContainer.offsetLeft;
    scrollLeft = navSosmedContainer.scrollLeft;
    navSosmedContainer.style.scrollBehavior = 'auto';
});
navSosmedContainer.addEventListener('mouseleave', () => { isDown = false; });
navSosmedContainer.addEventListener('mouseup', () => { 
    isDown = false; 
    navSosmedContainer.style.scrollBehavior = 'smooth';
});
navSosmedContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - navSosmedContainer.offsetLeft;
    const walk = (x - startX) * 2;
    navSosmedContainer.scrollLeft = scrollLeft - walk;
});

navSosmedContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    navSosmedContainer.style.scrollBehavior = 'smooth';
    navSosmedContainer.scrollBy({
        left: e.deltaY < 0 ? -150 : 150,
        behavior: 'smooth'
    });
});

tabSosmed.forEach(tab => {
    tab.addEventListener('click', () => {
        const aktifTab = document.querySelector('.tombol-tab.aktif');
        if (aktifTab) {
            aktifTab.classList.remove('aktif');
        }
        
        tab.classList.add('aktif');
        
        navSosmedContainer.style.scrollBehavior = 'smooth';
        tab.scrollIntoView({ 
            behavior: 'smooth', 
            inline: 'center', 
            block: 'nearest' 
        });
    });
});

function perbaruiOpsiKualitas(format) {
    const opsiVideo = [
        { val: '1080', label: '1080p (FHD)' },
        { val: '720', label: '720p (HD)' },
        { val: '480', label: '480p (SD)' }
    ];
    
    const opsiAudio = [
        { val: '320', label: '320 kbps' },
        { val: '192', label: '192 kbps' },
        { val: '128', label: '128 kbps' }
    ];

    const daftarOpsi = format === 'mp4' ? opsiVideo : opsiAudio;
    
    if (pilihKualitas) {
        pilihKualitas.innerHTML = '';
        daftarOpsi.forEach(opsi => {
            const el = document.createElement('option');
            el.value = opsi.val;
            el.textContent = opsi.label;
            pilihKualitas.appendChild(el);
        });
    }
}

daftarSegmen.forEach(segmen => {
    segmen.addEventListener('click', () => {
        const aktifSegmen = document.querySelector('.segmen.aktif');
        if (aktifSegmen) aktifSegmen.classList.remove('aktif');
        segmen.classList.add('aktif');
        perbaruiOpsiKualitas(segmen.dataset.format);
    });
});

perbaruiOpsiKualitas('mp4');

function tampilToast(pesan) {
    if (!toastPesan) return;
    toastPesan.textContent = pesan;
    toastPesan.classList.remove('sembunyi');
    
    toastPesan.style.animation = 'none';
    toastPesan.offsetHeight; 
    toastPesan.style.animation = 'toastGeser 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';

    clearTimeout(timerToast);
    timerToast = setTimeout(() => {
        toastPesan.classList.add('sembunyi');
    }, 2500);
}

if (btnTempel) {
    btnTempel.addEventListener('click', async () => {
        try {
            const teks = await navigator.clipboard.readText();
            inputUrl.value = teks;
            tampilToast('Tautan berhasil ditempel');
        } catch (err) {
            tampilToast('Papan klip tidak bisa diakses');
        }
    });
}

if (btnCek) {
    btnCek.addEventListener('click', async () => {
        const url = inputUrl.value.trim();
        if (!url) {
            tampilToast('Masukkan URL terlebih dahulu!');
            return;
        }
        
        areaHasil.classList.add('sembunyi');
        tampilToast('Mengekstrak metadata...');

        if (window.pywebview && window.pywebview.api) {
            const info = await window.pywebview.api.get_info(url);
            if (info.error) {
                tampilToast('Gagal: ' + info.error);
            } else {
                document.getElementById('teksJudul').textContent = info.title;
                document.getElementById('teksDurasi').textContent = info.duration + ' detik';
                document.getElementById('teksUkuranAwal').textContent = info.filesize ? `Ukuran: ${info.filesize}` : '';
                if (info.thumbnail) document.getElementById('gambarThumb').src = info.thumbnail;
                areaHasil.classList.remove('sembunyi');
                tampilToast('Data siap diunduh');
            }
        } else {
            setTimeout(() => {
                document.getElementById('teksJudul').textContent = "Video Siap Diunduh (Simulasi UI)";
                document.getElementById('teksDurasi').textContent = "04:20";
                document.getElementById('teksUkuranAwal').textContent = "Ukuran: ~45 MB";
                document.getElementById('gambarThumb').style.backgroundColor = "#2A2A2A"; 
                areaHasil.classList.remove('sembunyi');
                tampilToast('Data siap diunduh');
            }, 600);
        }
    });
}

window.updateDownloadProgress = function(persen, kecepatan, ukuranDiunduh, ukuranTotal) {
    document.getElementById('teksPersentase').textContent = persen + '%';
    document.getElementById('barProses').style.width = persen + '%';
    document.getElementById('teksKecepatan').innerHTML = `<i class="fa-solid fa-gauge-high"></i> ${kecepatan}`;
    document.getElementById('teksUkuran').innerHTML = `<i class="fa-solid fa-hard-drive"></i> ${ukuranDiunduh} / ${ukuranTotal}`;
};

if (formUnduh) {
    formUnduh.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = inputUrl.value.trim();
        if (!url) return;
        
        const formatPilihan = document.querySelector('.segmen.aktif').dataset.format;
        const kualitasPilihan = pilihKualitas.value;
        const btnUnduh = document.querySelector('.tombol-utama');
        const areaProses = document.getElementById('areaProses');
        
        tampilToast('Memulai unduhan...');
        
        areaProses.classList.remove('sembunyi');
        btnUnduh.disabled = true;
        
        if (window.pywebview && window.pywebview.api) {
            await window.pywebview.api.start_download(url, formatPilihan, kualitasPilihan);
        } else {
            let persen = 0;
            let totalSize = Math.floor(Math.random() * 60) + 20; 
            
            let interval = setInterval(() => {
                persen += Math.floor(Math.random() * 5) + 1;
                if (persen > 100) persen = 100;
                
                let speed = (Math.random() * 2 + 0.8).toFixed(1); 
                let downloaded = ((persen / 100) * totalSize).toFixed(1);
                
                window.updateDownloadProgress(persen, `${speed} MB/s`, `${downloaded} MB`, `${totalSize} MB`);
                
                if (persen === 100) {
                    clearInterval(interval);
                    document.getElementById('teksStatusUnduh').textContent = "Selesai!";
                    tampilToast('Unduhan selesai!');
                    
                    setTimeout(() => {
                        areaProses.classList.add('sembunyi');
                        btnUnduh.disabled = false;
                        document.getElementById('teksStatusUnduh').textContent = "Mengunduh Media...";
                        document.getElementById('barProses').style.width = '0%';
                        areaHasil.classList.add('sembunyi');
                        inputUrl.value = '';
                    }, 2000);
                }
            }, 300);
        }
    });
}

if (formPengaturan) {
    formPengaturan.addEventListener('submit', (e) => {
        e.preventDefault();
        tampilToast('Pengaturan lokal berhasil disimpan');
    });
}