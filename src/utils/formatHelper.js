import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

// Format currency to IDR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (dateString, formatStr = 'dd MMMM yyyy HH:mm') => {
  return format(new Date(dateString), formatStr, {
    locale: idLocale,
  });
};

// Check if auction is closed
export const isAuctionClosed = (closedAt) => {
  return new Date(closedAt) < new Date();
};

// Get time remaining
export const getTimeRemaining = (closedAt) => {
  const now = new Date();
  const endDate = new Date(closedAt);
  const diff = endDate - now;

  if (diff <= 0) return 'Ditutup';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days} hari lagi`;
  if (hours > 0) return `${hours} jam lagi`;
  return `${minutes} menit lagi`;
};

// Format datetime for API
export const formatDateTimeForAPI = (datetime) => {
  return datetime.replace('T', ' ') + ':00';
};

// Format datetime for input
export const formatDateTimeForInput = (datetime) => {
  return datetime.replace(' ', 'T').substring(0, 16);
};