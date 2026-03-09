const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    contact: { type: String, required: true },
    formLink: { type: String, required: true },
    responses: { type: Number, required: true },
    audience: { type: String, required: true },
    notes: { type: String },
    amount: { type: Number, required: true },

    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: { type: String, default: 'Pending Payment' },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
