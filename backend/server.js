const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('./models/Order');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

// API Routes
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;

        // Create a new order in DB (Pending)
        const order = new Order(orderData);
        await order.save();

        // Create an order in Razorpay
        // const options = {
        //     amount: order.amount * 100, // Amount in paise
        //     currency: 'INR',
        //     receipt: order._id.toString(),
        // };

        // const razorpayOrder = await razorpay.orders.create(options);

        // // Update DB with Razorpay Order ID
        // order.razorpayOrderId = razorpayOrder.id;
        // await order.save();

        // res.status(201).json({
        //     orderId: order._id,
        //     razorpayOrderId: razorpayOrder.id,
        //     amount: order.amount,
        //     key_id: razorpay.key_id
        // });

        // DEVELOPMENT ONLY: Bypass Razorpay and return success
        res.status(201).json({
            orderId: order._id,
            razorpayOrderId: 'dev_mock_order_id_' + Date.now(),
            amount: order.amount,
            key_id: 'dev_mock_key'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Razorpay payment verification
// app.post('/api/verify-payment', async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

//         const sign = razorpay_order_id + '|' + razorpay_payment_id;
//         const expectedSign = crypto
//             .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
//             .update(sign.toString())
//             .digest('hex');

//         if (razorpay_signature === expectedSign) {
//             // Payment is successful
//             const order = await Order.findById(order_id);
//             if (order) {
//                 order.razorpayPaymentId = razorpay_payment_id;
//                 order.razorpaySignature = razorpay_signature;
//                 order.status = 'Paid';
//                 await order.save();
//             }
//             return res.status(200).json({ message: 'Payment verified successfully' });
//         } else {
//             return res.status(400).json({ error: 'Invalid signature sent!' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Payment verification failed' });
//     }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
