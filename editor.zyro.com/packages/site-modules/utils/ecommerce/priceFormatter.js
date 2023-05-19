export default function formatPrice(amount, currency) {
    if (!currency) {
        return '€0.00';
    }

    const number = Number(amount) || 0;
    const adjustedAmount = Number(number / (10 ** currency.decimal_digits));

    return currency.template.replace('$1', adjustedAmount.toFixed(currency.decimal_digits));
}