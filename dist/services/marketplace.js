"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchListings = fetchListings;
exports.createListing = createListing;
exports.createOrder = createOrder;
// mobile/services/marketplace.ts
const api_1 = require("../constants/api");
async function fetchListings(filter = 'all') {
    const url = filter === 'all'
        ? `${api_1.API.BACKEND}/listings`
        : `${api_1.API.BACKEND}/listings?type=${filter}`;
    const res = await fetch(url);
    if (!res.ok)
        throw new Error('Failed to fetch listings');
    return res.json();
}
async function createListing(data, token) {
    const res = await fetch(`${api_1.API.BACKEND}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok)
        throw new Error('Failed to create listing');
    return res.json();
}
async function createOrder(data, token) {
    const res = await fetch(`${api_1.API.BACKEND}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok)
        throw new Error('Failed to create order');
    return res.json();
}
