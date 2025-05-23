import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString();
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function generateQRCode(text) {
  // This would normally use a QR code library
  // For demo purposes, we'll return a placeholder URL
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
}

export function getTimeDifference(date) {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  const diffMs = targetDate.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins <= 0) return 'Ready now';
  if (diffMins === 1) return '1 minute';
  return `${diffMins} minutes`;
}

export function getOrderStatusColor(status) {
  switch (status) {
    case 'pending':
      return 'text-yellow-500 bg-yellow-100';
    case 'preparing':
      return 'text-blue-500 bg-blue-100';
    case 'ready':
      return 'text-green-500 bg-green-100';
    case 'completed':
      return 'text-gray-500 bg-gray-100';
    default:
      return 'text-gray-500 bg-gray-100';
  }
}

export function getOrderStatusStep(status) {
  switch (status) {
    case 'pending':
      return 0;
    case 'preparing':
      return 1;
    case 'ready':
      return 2;
    case 'completed':
      return 3;
    default:
      return 0;
  }
}