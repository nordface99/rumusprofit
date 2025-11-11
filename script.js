// Mapping cryptocurrency IDs untuk CoinGecko API
const cryptoMap = {
    'bitcoin': { symbol: 'BTC', name: 'Bitcoin' },
    'ethereum': { symbol: 'ETH', name: 'Ethereum' },
    'litecoin': { symbol: 'LTC', name: 'Litecoin' },
    'tron': { symbol: 'TRX', name: 'Tron' },
    'solana': { symbol: 'SOL', name: 'Solana' },
    'dash': { symbol: 'DASH', name: 'Dash' }
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
        const price = data[cryptoId].usd;
        const change = data[cryptoId].usd_24h_change;
        
        showLoading(false);
        return { price, change };
    } catch (error) {
        showLoading(false);
        console.error('Error:', error);
        alert('Gagal mengambil data harga. Silakan coba lagi.');
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
        document.getElementById('hargaSekarangText').textContent = `$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        // Update price change
        const priceChangeElement = document.getElementById('priceChange');
        priceChangeElement.textContent = `(${priceChange24h >= 0 ? '+' : ''}${priceChange24h.toFixed(2)}%)`;
        priceChangeElement.className = priceChange24h >= 0 ? 'positive' : 'negative';
        priceChangeElement.classList.remove('hidden');
    }
}

// Fungsi utama hitung profit
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

    // Tampilkan hasil
    document.getElementById('profitPercentage').textContent = `${profitPercentage.toFixed(2)}%`;
    document.getElementById('profitNominal').textContent = `$${profitNominal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('totalNilai').textContent = `$${totalNilai.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('modalAwal').textContent = `$${modalAwal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('jumlahKoinDimiliki').textContent = jumlahKoin.toFixed(8);
    document.getElementById('hargaBeliDisplay').textContent = `$${hargaBeli.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('hargaSekarangDisplay').textContent = `$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Tentukan status dan warna
    const statusElement = document.getElementById('status');
    const percentageElement = document.getElementById('profitPercentage');
    const nominalElement = document.getElementById('profitNominal');

    // Reset kelas
    percentageElement.className = 'value';
    nominalElement.className = 'value';
    statusElement.className = 'value';

    if (profitPercentage > 0) {
        statusElement.textContent = 'PROFIT 🎉';
        statusElement.className += ' profit';
        percentageElement.className += ' profit';
        nominalElement.className += ' profit';
    } else if (profitPercentage < 0) {
        statusElement.textContent = 'LOSS 📉';
        statusElement.className += ' loss';
        percentageElement.className += ' loss';
        nominalElement.className += ' loss';
    } else {
        statusElement.textContent = 'BREAK EVEN ➖';
        statusElement.className += ' neutral';
    }

    // Tampilkan hasil
    document.getElementById('hasil').classList.remove('hidden');

    // Scroll ke hasil
    document.getElementById('hasil').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
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
    // Auto update harga ketika cryptocurrency dipilih
    document.getElementById('cryptoSelect').addEventListener('change', function() {
        if (this.value) {
            updateHargaSekarang();
            document.getElementById('hargaBeli').focus();
        }
    });

    // Enter key support
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                hitungProfit();
            }
        });
    });
});

// Fungsi untuk reset form
function resetForm() {
    document.getElementById('cryptoSelect').value = '';
    document.getElementById('hargaBeli').value = '';
    document.getElementById('jumlahInvestasi').value = '';
    document.getElementById('hargaSekarangText').textContent = '-';
    document.getElementById('priceChange').classList.add('hidden');
    document.getElementById('hasil').classList.add('hidden');
    
    currentPrice = 0;
    priceChange24h = 0;
}
