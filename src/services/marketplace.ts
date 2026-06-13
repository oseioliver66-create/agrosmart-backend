// mobile/services/marketplace.ts
import { API } from '../constants/api';

export async function fetchListings(filter: string = 'all') {
  const url = filter === 'all'
    ? `${API.BACKEND}/listings`
    : `${API.BACKEND}/listings?type=${filter}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch listings');
  return res.json();
}

export async function createListing(data: {
  name: string; crop_type: string; qty: number;
  price: number; location: string; organic: boolean;
}, token: string) {
  const res = await fetch(`${API.BACKEND}/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create listing');
  return res.json();
}

export async function createOrder(data: {
  listing_id: number; qty: number; delivery_address: string;
}, token: string) {
  const res = await fetch(`${API.BACKEND}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}