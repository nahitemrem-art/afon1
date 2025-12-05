export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatPercent = (num: number, decimals: number = 2): string => {
  const formatted = num.toFixed(decimals);
  return num >= 0 ? `+${formatted}%` : `${formatted}%`;
};

export const formatCurrency = (num: number, decimals: number = 2): string => {
  return `₺${formatNumber(num, decimals)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTime = (dateString: string): string => {
  return `${formatShortDate(dateString)} ${formatTime(dateString)}`;
};

export const getReturnColor = (value: number): string => {
  if (value > 0) return '#10b981';
  if (value < 0) return '#ef4444';
  return '#6b7280';
};

export const timeSince = (dateString: string): string => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} saniye önce`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} dakika önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
};

export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(2)} Milyar`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)} Milyon`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)} Bin`;
  }
  return num.toString();
};
