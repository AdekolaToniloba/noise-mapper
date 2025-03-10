// public/audioWorker.js
self.onmessage = function (e) {
    const { dataArray, bufferLength } = e.data;

    // Calculate RMS (Root Mean Square)
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
        const amplitude = dataArray[i] / 128 - 1;
        sum += amplitude * amplitude;
    }
    const rms = Math.sqrt(sum / bufferLength);

    // Convert RMS to decibels (approximation)
    const dB = 20 * Math.log10(rms) + 90;

    // Ensure we're in a reasonable range (40-120 dB)
    const normalizedDB = Math.min(Math.max(dB, 40), 120);

    // Send the result back to the main thread
    self.postMessage({ decibels: parseFloat(normalizedDB.toFixed(1)) });
};