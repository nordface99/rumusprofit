function hitungProfit() {
    // Ambil nilai dari input
    const cryptoSelect = document.getElementById('cryptoSelect').value;
    const hargaBeli = parseFloat(document.getElementById('hargaBeli').value);
    const hargaSekarang = parseFloat(document.getElementById('hargaSekarang').value);
    const jumlahKoin = parseFloat(document.getElementById('jumlahKoin').value);

    // Validasi input
    if (!cryptoSelect) {
        alert('Silakan pilih cryptocurrency terlebih dahulu!');
        return;
    }

    if (!hargaBeli || !hargaSekarang || !jumlahKoin) {
        alert('Silakan isi semua field dengan benar!');
        return;
    }

    if (hargaBeli <= 0 || hargaSekarang <= 0 || jumlahKoin <= 0) {
        alert('Nilai harus lebih besar dari 0!');
        return;
    }

    // Hitung profit/loss
    const profitPercentage = ((hargaSekarang - hargaBeli) / hargaBeli) * 100;
    const profitNominal = (hargaSekarang - hargaBeli) * jumlahKoin;
    const totalNilai = hargaSekarang * jumlahKoin;

    // Tampilkan hasil
    document.getElementById('profitPercentage').textContent = `${profitPercentage.toFixed(2)}%`;
    document.getElementById('profitNominal').textContent = `$${profitNominal.toFixed(2)}`;
    document.getElementById('totalNilai').textContent = `$${totalNilai.toFixed(2)}`;

    // Tentukan status dan warna
    const statusElement = document.getElementById('status');
    const percentageElement = document.getElementById('profitPercentage');
    const nominalElement = document.getElementById('profitNominal');

    // Reset kelas
    percentageElement.className = '';
    nominalElement.className = '';
    statusElement.className = '';

    if (profitPercentage > 0) {
        statusElement.textContent = 'PROFIT 🎉';
        statusElement.className = 'profit';
        percentageElement.className = 'profit';
        nominalElement.className = 'profit';
    } else if (profitPercentage < 0) {
        statusElement.textContent = 'LOSS 📉';
        statusElement.className = 'loss';
        percentageElement.className = 'loss';
        nominalElement.className = 'loss';
    } else {
        statusElement.textContent = 'BREAK EVEN ➖';
    }

    // Tampilkan hasil
    document.getElementById('hasil').classList.remove('hidden');

    // Scroll ke hasil
    document.getElementById('hasil').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

// Event listener untuk input real-time (opsional)
document.addEventListener('DOMContentLoaded', function() {
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

// Fungsi untuk reset form (opsional)
function resetForm() {
    document.getElementById('cryptoSelect').value = '';
    document.getElementById('hargaBeli').value = '';
    document.getElementById('hargaSekarang').value = '';
    document.getElementById('jumlahKoin').value = '';
    document.getElementById('hasil').classList.add('hidden');
}
