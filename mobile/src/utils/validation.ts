export const validateFundCode = (code: string): boolean => {
  return /^[A-Z]{3,10}$/.test(code);
};

export const validateQuantity = (quantity: string): boolean => {
  const num = parseFloat(quantity);
  return !isNaN(num) && num > 0;
};

export const validatePrice = (price: string): boolean => {
  const num = parseFloat(price);
  return !isNaN(num) && num > 0;
};

export const validatePortfolioName = (name: string): boolean => {
  return name.trim().length >= 3 && name.trim().length <= 50;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
