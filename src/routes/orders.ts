// backend/src/routes/orders.ts
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// POST /orders — create new order
router.post('/', async (req, res) => {
  try {
    const { buyer_id, farmer_id, listing_id, quantity_kg, total_amount, delivery_address, delivery_region, payment_method } = req.body;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        buyer_id,
        farmer_id,
        listing_id,
        quantity_kg,
        total_amount,
        delivery_address,
        delivery_region,
        payment_method,
        status: 'pending',
        payment_status: 'unpaid',
      })
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, order: data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /orders/buyer/:buyer_id — get buyer orders
router.get('/buyer/:buyer_id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`*, listings(name, crop_type), farmers(full_name)`)
      .eq('buyer_id', req.params.buyer_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, orders: data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /orders/farmer/:farmer_id — get farmer orders
router.get('/farmer/:farmer_id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`*, listings(name, crop_type), buyers(full_name, phone)`)
      .eq('farmer_id', req.params.farmer_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, orders: data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /orders/:id/confirm — buyer confirms delivery
router.patch('/:id/confirm', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'delivered', updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, order: data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;