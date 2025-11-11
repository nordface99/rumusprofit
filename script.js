// ... (kode sebelumnya tetap) ...

// Fungsi untuk menampilkan modal hasil
function showResultModal(cryptoName, cryptoPrice, profitData) {
    const modal = document.getElementById('resultModal');
    const cryptoInfo = cryptoMap[cryptoName];
    
    // Update konten modal
    document.getElementById('modalCryptoName').textContent = `${cryptoInfo.name} (${cryptoInfo.symbol})`;
    document.getElementById('modalCryptoPrice').textContent = `Harga Sekarang: $${cryptoPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
    
    // Update hasil perhitungan
    document.getElementById('modalProfitPercentage').textContent = `${profitData.percentage.toFixed(2)}%`;
    document.getElementById('modalProfitNominal').textContent = `$${profitData.nominal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('modalTotalNilai').textContent = `$${profitData.totalNilai.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('modalModalAwal').textContent = `$${profitData.modalAwal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('modalJumlahKoin').textContent = profitData.jumlahKoin.toFixed(8);
    document.getElementById('modalHargaBeli').textContent = `$${profitData.hargaBeli.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
    document.getElementById('modalHargaSekarang').textContent = `$${profitData.hargaSekarang.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
    
    // Set status dan warna
    const statusElement = document.getElementById('modalStatus');
    const percentageElement = document.getElementById('modalProfitPercentage');
    const nominalElement = document.getElementById('modalProfitNominal');
    
    // Reset classes
    statusElement.className = 'value-modal';
    percentageElement.className = 'value-modal';
    nominalElement.className = 'value-modal';
    
    if (profitData.percentage > 0) {
        statusElement.textContent = 'PROFIT 🎉';
        statusElement.className += ' profit';
        percentageElement.className += ' profit';
        nominalElement.className += ' profit';
    } else if (profitData.percentage < 0) {
        statusElement.textContent = 'LOSS 📉';
        statusElement.className += ' loss';
        percentageElement.className += ' loss';
        nominalElement.className += ' loss';
    } else {
        statusElement.textContent = 'BREAK EVEN ➖';
        statusElement.className += ' neutral';
    }
    
    // Tampilkan modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Fungsi untuk menutup modal
function closeModal() {
    const modal = document.getElementById('resultModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Enable scrolling again
}

// Fungsi untuk share result (opsional)
function shareResult() {
    const cryptoName = document.getElementById('modalCryptoName').textContent;
    const profitPercentage = document.getElementById('modalProfitPercentage').textContent;
    const profitNominal = document.getElementById('modalProfitNominal').textContent;
    
    const shareText = `📊 Hasil Perhitungan Crypto:\n${cryptoName}\nProfit: ${profitPercentage} (${profitNominal})\n\nHitung di: ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Crypto Profit Calculator',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback untuk browser yang tidak support Web Share API
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Hasil telah disalin ke clipboard! 📋');
        });
    }
}

// Fungsi utama hitung profit (diupdate)
async function hitungProfit() {
    const cryptoSelect = document.getElementById('cryptoSelect').value;
    const hargaBeli = parseFloat(document.getElementById('hargaBeli').value);
    const jumlahInvestasi = parseFloat(document.getElementById('jumlahInvestasi').value);

    // Validasi input
    if (!cryptoSelect) {
        alert('Silakan pilih cryptocurrency terlebih dahulu!');
        return;
    }

    if (!hargaBeli || !jumlahInvestasi) {
        alert('Silakan isi harga beli dan jumlah investasi!');
        return;
    }

    if (hargaBeli <= 0 || jumlahInvestasi <= 0) {
        alert('Harga beli dan jumlah investasi harus lebih besar dari 0!');
        return;
    }

    // Jika harga sekarang belum diambil, ambil dulu
    if (currentPrice === 0) {
        await updateHargaSekarang();
        if (currentPrice === 0) return; // Jika masih gagal, berhenti
    }

    // Hitung jumlah koin berdasarkan investasi
    const jumlahKoin = jumlahInvestasi / hargaBeli;

    // Hitung profit/loss
    const profitPercentage = ((currentPrice - hargaBeli) / hargaBeli) * 100;
    const profitNominal = (currentPrice - hargaBeli) * jumlahKoin;
    const totalNilai = currentPrice * jumlahKoin;
    const modalAwal = hargaBeli * jumlahKoin;

    // Siapkan data untuk modal
    const profitData = {
        percentage: profitPercentage,
        nominal: profitNominal,
        totalNilai: totalNilai,
        modalAwal: modalAwal,
        jumlahKoin: jumlahKoin,
        hargaBeli: hargaBeli,
        hargaSekarang: currentPrice
    };

    // Tampilkan modal popup
    showResultModal(cryptoSelect, currentPrice, profitData);
}

// ... (kode lainnya tetap sama) ...

// Close modal ketika klik di luar konten
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('resultModal');
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal dengan ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    // ... (event listener lainnya) ...
});
