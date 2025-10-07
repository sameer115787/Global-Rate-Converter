// --- Mock Data Setup ---
const exchangeRates = {
    USD: { EUR: 0.93, GBP: 0.79, JPY: 156.91, CAD: 1.37, AUD: 1.52, INR: 83.2, USD: 1.0 },
    EUR: { USD: 1.07, GBP: 0.85, JPY: 168.91, CAD: 1.47, AUD: 1.63, INR: 89.5, EUR: 1.0 },
    GBP: { USD: 1.27, EUR: 1.18, JPY: 198.05, CAD: 1.74, AUD: 1.93, INR: 104.2, GBP: 1.0 },
    JPY: { USD: 0.0064, EUR: 0.0059, GBP: 0.0051, CAD: 0.0087, AUD: 0.0097, INR: 0.53, JPY: 1.0 },
    CAD: { USD: 0.73, EUR: 0.68, GBP: 0.57, JPY: 114.94, AUD: 1.11, INR: 60.7, CAD: 1.0 },
    AUD: { USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 103.09, CAD: 0.90, INR: 55.3, AUD: 1.0 },
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0096, JPY: 1.89, CAD: 0.016, AUD: 0.018, INR: 1.0 }
};

const currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$', INR: '₹'
};
const currencyList = Object.keys(exchangeRates);

// --- DOM Elements ---
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from_currency');
const toCurrencySelect = document.getElementById('to_currency');
const convertButton = document.getElementById('convert_button');
const swapButton = document.getElementById('swap_button');
const resultDisplay = document.getElementById('conversion_result');
const rateDisplay = document.getElementById('rate_display');
const loadingIndicator = document.getElementById('loading_indicator');
const errorMessage = document.getElementById('error_message');

/**
 * Populates the currency select dropdowns with available currencies.
 */
function populateCurrencies() {
    const fragment = document.createDocumentFragment();
    currencyList.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = `${currency} (${currencySymbols[currency]})`;
        fragment.appendChild(option);
    });

    fromCurrencySelect.appendChild(fragment.cloneNode(true));
    toCurrencySelect.appendChild(fragment);

    // Set default selections
    fromCurrencySelect.value = 'USD';
    toCurrencySelect.value = 'INR';
}

/**
 * Converts the currency based on mock rates.
 */
function convertCurrency() {
    // Clear previous results/errors
    resultDisplay.querySelector('p').textContent = '';
    rateDisplay.textContent = '';
    errorMessage.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');

    const amount = parseFloat(amountInput.value);
    const from = fromCurrencySelect.value;
    const to = toCurrencySelect.value;

    // Simple validation
    if (isNaN(amount) || amount <= 0) {
        errorMessage.textContent = 'Please enter a valid amount greater than zero.';
        errorMessage.classList.remove('hidden');
        loadingIndicator.classList.add('hidden');
        return;
    }

    // Check if rate exists
    if (!exchangeRates[from] || !exchangeRates[from][to]) {
        errorMessage.textContent = `Conversion rate from ${from} to ${to} is not available in mock data.`;
        errorMessage.classList.remove('hidden');
        loadingIndicator.classList.add('hidden');
        return;
    }

    // Simulate API delay for a better user experience (UX)
    setTimeout(() => {
        loadingIndicator.classList.add('hidden');

        const rate = exchangeRates[from][to];
        const convertedAmount = amount * rate;

        // Format the result
        const formattedResult = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: to,
            maximumFractionDigits: 2,
        }).format(convertedAmount);

        const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: from,
            maximumFractionDigits: 2,
        }).format(amount);

        // Display the result
        resultDisplay.querySelector('p').textContent = `${formattedResult}`;

        // Display the rate
        rateDisplay.textContent = `${formattedAmount} equals ${formattedResult} at a rate of 1 ${from} = ${rate.toFixed(4)} ${to}`;

    }, 500); // 500ms delay
}

/**
 * Swaps the 'From' and 'To' currency selections.
 */
function swapCurrencies() {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    convertCurrency(); // Run conversion after swapping
}

// --- Event Listeners and Initialization ---
window.onload = () => {
    populateCurrencies();
    convertButton.addEventListener('click', convertCurrency);
    swapButton.addEventListener('click', swapCurrencies);

    // Allow pressing Enter in the amount field to convert
    amountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convertCurrency();
        }
    });

    // Run initial conversion on load
    convertCurrency();
};