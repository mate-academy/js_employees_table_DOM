export const formatCurrency = (value) => {
  const amount = value.replace(/[$,]/g, '');

  if (isNaN(amount) || amount <= 0) {
    return;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};
