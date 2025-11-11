let jumlahKoinValue = 0;

function hitungProfit() {
    // Ambil nilai dari input
    const cryptoSelect = document.getElementById('cryptoSelect').value;
    const hargaBeli = parseFloat(document.getElementById('hargaBeli').value);
    const hargaSekarang = parseFloat(document.getElementById('hargaSekarang').value);
    const jumlahKoin = parseFloat(document.getElementById('jumlahKoin').value);
    const jumlahUSD = parseFloat(document.getElementById('jumlahUSD').value);

    // Validasi input
    if (!cryptoSelect) {
        alert('Silakan pilih cryptocurrency terlebih dahulu!');
        return;
    }

    if (!hargaBeli || !hargaSekarang) {
        alert('Silakan isi harga beli dan harga sekarang!');
        return;
    }

    if (hargaBeli <= 0 || hargaSekarang <= 0) {
        alert('Harga harus lebih besar dari 0!');
        return;
    }

    // Hitung jumlah koin berdasarkan input
    if (jumlahUSD > 0 && jumlahKoin > 0) {
        alert('Silakan pilih: isi Jumlah Koin ATAU Jumlah USD, bukan keduanya!');
        return;
    }

    if (jumlahUSD > 0) {
        // Jika input USD, hitung jumlah koin
        jumlahKoinValue = jumlahUSD / hargaBeli;
        document.getElementById('jumlahKoin').value = jumlahKoinValue.toFixed(8);
    } else if (jumlahKoin > 0) {
        // Jika input jumlah koin
        jumlahKoinValue = jumlahKoin;
        document.getElementById('jumlahUSD').value = (jumlahKoin * hargaBeli).toFixed(2);
    } else {
        alert('Silakan isi Jumlah Koin atau Jumlah USD!');
        return;
    }

    // Hitung profit/loss
    const profitPercentage = ((hargaSekarang - hargaBeli) / hargaBeli) * 100;
    const profitNominal = (hargaSekarang - hargaBeli) * jumlahKoinValue;
    const totalNilai = hargaSekarang * jumlahKoinValue;
    const modalAwal = hargaBeli * jumlahKoinValue;

    // Tampilkan hasil
    document.getElementById('profitPercentage').textContent = `${profitPercentage.toFixed(2)}%`;
    document.getElementById('profitNominal').textContent = `$${profitNominal.toFixed(2)}`;
    document.getElementById('totalNilai').textContent = `$${totalNilai.toFixed(2)}`;
    document.getElementById('modalAwal').textContent = `$${modalAwal.toFixed(2)}`;
    document.getElementById('jumlahKoinDimiliki').textContent = jumlahKoinValue.toFixed(8);
    document.getElementById('hargaBeliDisplay').textContent = `$${hargaBeli.toFixed(2)}`;
    document.getElementById('hargaSekarangDisplay').textContent = `$${hargaSekarang.toFixed(2)}`;

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

// Fungsi untuk auto-convert antara jumlah koin dan USD
function setupAutoConvert() {
    const jumlahKoinInput = document.getElementById('jumlahKoin');
    const jumlahUSDInput = document.getElementById('jumlahUSD');
    const hargaBeliInput = document.getElementById('hargaBeli');

    jumlahKoinInput.addEventListener('input', function() {
        const hargaBeli = parseFloat(hargaBeliInput.value);
        const jumlahKoin = parseFloat(this.value);
        
        if (hargaBeli > 0 && jumlahKoin > 0) {
            jumlahUSDInput.value = (jumlahKoin * hargaBeli).toFixed(2);
        } else if (jumlahKoin === 0) {
            jumlahUSDInput.value = '';
        }
    });

    jumlahUSDInput.addEventListener('input', function() {
        const hargaBeli = parseFloat(hargaBeliInput.value);
        const jumlahUSD = parseFloat(this.value);
        
        if (hargaBeli > 0 && jumlahUSD > 0) {
            jumlahKoinInput.value = (jumlahUSD / hargaBeli).toFixed(8);
        } else if (jumlahUSD === 0) {
            jumlahKoinInput.value = '';
        }
    });

    hargaBeliInput.addEventListener('input', function() {
        const hargaBeli = parseFloat(this.value);
        const jumlahKoin = parseFloat(jumlahKoinInput.value);
        const jumlahUSD = parseFloat(jumlahUSDInput.value);
        
        if (hargaBeli > 0) {
            if (jumlahKoin > 0) {
                jumlahUSDInput.value = (jumlahKoin * hargaBeli).toFixed(2);
            } else if (jumlahUSD > 0) {
                jumlahKoinInput.value = (jumlahUSD / hargaBeli).toFixed(8);
            }
        }
    });
}

// Event listener untuk input real-time
document.addEventListener('DOMContentLoaded', function() {
    setupAutoConvert();
    
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                hitungProfit();
            }
        });
    });

    // Auto-focus pada harga beli setelah memilih crypto
    document.getElementById('cryptoSelect').addEventListener('change', function() {
        if (this.value) {
            document.getElementById('hargaBeli').focus();
        }
    });
});

// Fungsi untuk reset form
function resetForm() {
    document.getElementById('cryptoSelect').value = '';
    document.getElementById('hargaBeli').value = '';
    document.getElementById('hargaSekarang').value = '';
    document.getElementById('jumlahKoin').value = '';
    document.getElementById('jumlahUSD').value = '';
    document.getElementById('hasil').classList.add('hidden');
}
