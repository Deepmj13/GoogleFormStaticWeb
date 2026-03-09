import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './pages.css';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load Razorpay script dynamically
    useEffect(() => {
        const loadScript = () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        };
        loadScript();
    }, []);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!location.state || !location.state.orderId) {
                navigate('/request');
                return;
            }

            try {
                const response = await fetch(`/api/orders/${location.state.orderId}`);
                if (!response.ok) throw new Error('Order not found');

                const data = await response.json();
                setOrderDetails(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [location, navigate]);

    const handlePayment = async () => {
        if (!location.state || !location.state.razorpayOrderId) return;

        // DEVELOPMENT ONLY: Bypass Razorpay UI and simulate successful payment
        try {
            const verifyResponse = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razorpay_order_id: location.state.razorpayOrderId,
                    razorpay_payment_id: 'dev_mock_payment_id_' + Date.now(),
                    razorpay_signature: 'dev_mock_signature',
                    order_id: location.state.orderId,
                }),
            });

            if (verifyResponse.ok) {
                alert('Development Mock Payment successful! Your request has been confirmed.');
                navigate('/');
            } else {
                alert('Development Mock Payment verification failed.');
            }
        } catch (error) {
            console.error('Error verifying payment', error);
            alert('Payment verification failed.');
        }
    };

    if (loading) {
        return (
            <div className="container page-grid">
                <section className="card wide">
                    <p>Loading order details...</p>
                </section>
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div className="container page-grid">
                <section className="card wide">
                    <p>No order details found. Please go back.</p>
                </section>
            </div>
        );
    }

    return (
        <>
            <header className="page-header">
                <div className="container row">
                    <a href="/" className="brand" onClick={(e) => { e.preventDefault(); navigate('/'); }}>FormBoost</a>
                    <p className="crumb">Step 2 of 2</p>
                </div>
            </header>

            <main className="container page-grid payment-grid">
                <section className="card wide">
                    <h1>Complete payment</h1>
                    <p className="lead">Securely complete your payment using Razorpay to confirm your order.</p>

                    <div style={{ marginTop: '2rem' }}>
                        <button className="btn btn-primary full" onClick={handlePayment}>
                            Pay Now (INR {orderDetails.amount})
                        </button>
                    </div>
                </section>

                <aside className="card">
                    <h2>Request details</h2>
                    <dl className="summary" id="requestSummary">
                        <div><dt>Name</dt><dd>{orderDetails.clientName}</dd></div>
                        <div><dt>Contact</dt><dd>{orderDetails.contact}</dd></div>
                        <div><dt>Responses</dt><dd>{orderDetails.responses}</dd></div>
                        <div><dt>Audience</dt><dd>{orderDetails.audience}</dd></div>
                        <div><dt>Amount</dt><dd>INR {orderDetails.amount}</dd></div>
                        <div><dt>Status</dt><dd><b>{orderDetails.status}</b></dd></div>
                    </dl>
                    <button className="btn btn-outline full" onClick={() => navigate('/request')}>
                        Edit request
                    </button>
                </aside>
            </main>
        </>
    );
};

export default Payment;
