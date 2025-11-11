// Mapping cryptocurrency IDs untuk CoinGecko API
const cryptoMap = {
    'bitcoin': { symbol: 'BTC', name: 'Bitcoin' },
    'ethereum': { symbol: 'ETH', name: 'Ethereum' },
    'binancecoin': { symbol: 'BNB', name: 'Binance Coin' },
    'ripple': { symbol: 'XRP', name: 'Ripple' },
    'solana': { symbol: 'SOL', name: 'Solana' },
    'litecoin': { symbol: 'LTC', name: 'Litecoin' },
    'tron': { symbol: 'TRX', name: 'Tron' },
    'dash': { symbol: 'DASH', name: 'Dash' },
    'tellor': { symbol: 'TRB', name: 'Tellor' }
};

let currentPrice = 0;
let priceChange24h = 0;

// Fungsi untuk mendapatkan harga real-time dari CoinGecko
async function getCurrentPrice(cryptoId) {
    try {
        showLoading(true);
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd&include_24hr_change=true`);
        
        if (!response.ok) {
            throw new Error('Gagal mengambil data harga');
        }
        
        const data = await response.json();
        
        if (!data[cryptoId]) {
            throw new Error(`Data untuk ${cryptoId} tidak ditemukan`);
        }
        
        const price = data[cryptoId].usd;
        const change = data[cryptoId].usd_24h_change || 0;
        
        showLoading(false);
        return { price, change };
    } catch (error) {
        showLoading(false);
        console.error('Error:', error);
        alert('Gagal mengambil data harga. Silakan coba lagi atau pilih crypto lain.');
        return null;
    }
}

// Fungsi untuk update harga saat cryptocurrency dipilih
async function updateHargaSekarang() {
    const cryptoSelect = document.getElementById('cryptoSelect');
    const selectedCrypto = cryptoSelect.value;
    
    if (!selectedCrypto) {
        alert('Silakan pilih cryptocurrency terlebih dahulu!');
        return;
    }
    
    const priceData = await getCurrentPrice(selectedCrypto);
    
    if (priceData) {
        currentPrice = priceData.price;
        priceChange24h = priceData.change;
        
        // Update tampilan harga
        document.getElementById('hargaSekarangText').textContent = `$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
        
        // Update price change
        const priceChangeElement = document.getElementById('priceChange');
        if (priceChange24h !== undefined && priceChange24h !== null) {
            priceChangeElement.textContent = `(${priceChange24h >= 0 ? '+' : ''}${priceChange24h.toFixed(2)}%)`;
            priceChangeElement.className = priceChange24h >= 0 ? 'positive' : 'negative';
            priceChangeElement.classList.remove('hidden');
        } else {
            priceChangeElement.classList.add('hidden');
        }
        
        // Auto-focus ke input harga beli setelah harga didapat
        document.getElementById('hargaBeli').focus();
    }
}

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
    document.body.style.overflow = 'hidden';
}

// Fungsi untuk menutup modal
function closeModal() {
    const modal = document.getElementById('resultModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Fungsi untuk share result
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
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Hasil telah disalin ke clipboard! 📋');
        });
    }
}

// Fungsi utama hitung profit
async function hitungProfit() {
    const cryptoSelect = document.getElementById('cryptoSelect');
    const hargaBeliInput = document.getElementById('hargaBeli');
    const jumlahInvestasiInput = document.getElementById('jumlahInvestasi');
    
    const selectedCrypto = cryptoSelect.value;
    const hargaBeli = parseFloat(hargaBeliInput.value);
    const jumlahInvestasi = parseFloat(jumlahInvestasiInput.value);

    // Validasi input
    if (!selectedCrypto) {
        alert('Silakan pilih cryptocurrency terlebih dahulu!');
        cryptoSelect.focus();
        return;
    }

    if (!hargaBeli || isNaN(hargaBeli)) {
        alert('Silakan isi harga beli dengan angka yang valid!');
        hargaBeliInput.focus();
        return;
    }

    if (!jumlahInvestasi || isNaN(jumlahInvestasi)) {
        alert('Silakan isi jumlah investasi dengan angka yang valid!');
        jumlahInvestasiInput.focus();
        return;
    }

    if (hargaBeli <= 0) {
        alert('Harga beli harus lebih besar dari 0!');
        hargaBeliInput.focus();
        return;
    }

    if (jumlahInvestasi <= 0) {
        alert('Jumlah investasi harus lebih besar dari 0!');
        jumlahInvestasiInput.focus();
        return;
    }

    // Jika harga sekarang belum diambil, ambil dulu
    if (currentPrice === 0) {
        await updateHargaSekarang();
        if (currentPrice === 0) {
            alert('Gagal mengambil harga realtime. Silakan coba lagi.');
            return;
        }
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
    showResultModal(selectedCrypto, currentPrice, profitData);
}

// Fungsi untuk menampilkan/menyembunyikan loading
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (show) {
        loadingElement.classList.remove('hidden');
    } else {
        loadingElement.classList.add('hidden');
    }
}

// Event listener ketika halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Pastikan modal tersembunyi saat halaman dimuat
    closeModal();
    
    // Auto update harga ketika cryptocurrency dipilih
    document.getElementById('cryptoSelect').addEventListener('change', function() {
        if (this.value) {
            updateHargaSekarang();
        }
    });

    // Enter key support untuk input fields
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                hitungProfit();
            }
        });
    });

    // Close modal ketika klik di luar konten
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
});

// Fungsi untuk reset form
function resetForm() {
    document.getElementById('cryptoSelect').value = '';
    document.getElementById('hargaBeli').value = '';
    document.getElementById('jumlahInvestasi').value = '';
    document.getElementById('hargaSekarangText').textContent = '-';
    document.getElementById('priceChange').classList.add('hidden');
    
    // Pastikan modal tertutup saat reset
    closeModal();
    
    currentPrice = 0;
    priceChange24h = 0;
}
