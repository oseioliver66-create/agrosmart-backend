"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/payments.ts
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE = 'https://api.paystack.co';
// POST /payments/initialize — start a payment
router.post('/initialize', async (req, res) => {
    try {
        const { email, amount, order_id, buyer_id, farmer_id, callback_url } = req.body;
        const response = await axios_1.default.post(`${PAYSTACK_BASE}/transaction/initialize`, {
            email,
            amount: Math.round(amount * 100), // Paystack uses pesewas (kobo)
            currency: 'GHS',
            reference: `AGR-${Date.now()}`,
            callback_url: callback_url ?? 'https://agrosmart.app/payment/callback',
            metadata: { order_id, buyer_id, farmer_id },
            channels: ['mobile_money', 'card', 'bank'],
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET}`,
                'Content-Type': 'application/json',
            },
        });
        const { data } = response.data;
        // Save payment record
        await supabase.from('payments').insert({
            order_id,
            buyer_id,
            farmer_id,
            amount,
            payment_method: 'paystack',
            paystack_ref: data.reference,
            status: 'pending',
        });
        return res.json({
            success: true,
            authorization_url: data.authorization_url,
            reference: data.reference,
            access_code: data.access_code,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
// GET /payments/verify/:reference — verify payment
router.get('/verify/:reference', async (req, res) => {
    try {
        const response = await axios_1.default.get(`${PAYSTACK_BASE}/transaction/verify/${req.params.reference}`, { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } });
        const { data } = response.data;
        if (data.status === 'success') {
            // Update payment status
            await supabase
                .from('payments')
                .update({ status: 'success', paystack_status: 'success', paid_at: new Date().toISOString() })
                .eq('paystack_ref', req.params.reference);
            // Update order payment status
            const orderId = data.metadata?.order_id;
            if (orderId) {
                await supabase
                    .from('orders')
                    .update({ payment_status: 'paid', status: 'processing' })
                    .eq('id', orderId);
            }
        }
        return res.json({ success: true, payment: data });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
// POST /payments/webhook — Paystack webhook
router.post('/webhook', async (req, res) => {
    const event = req.body;
    if (event.event === 'charge.success') {
        const { reference, metadata } = event.data;
        await supabase
            .from('payments')
            .update({ status: 'success', paid_at: new Date().toISOString() })
            .eq('paystack_ref', reference);
        if (metadata?.order_id) {
            await supabase
                .from('orders')
                .update({ payment_status: 'paid', status: 'processing' })
                .eq('id', metadata.order_id);
        }
    }
    return res.sendStatus(200);
});
exports.default = router;
