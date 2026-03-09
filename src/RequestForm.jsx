import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';

const PRICES = {
    500: 250,
    1000: 500,
    1500: 750,
    2000: 1000,
};

const RequestForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        clientName: '',
        contact: '',
        formLink: '',
        responses: 1000,
        audience: 'General mixed users',
        notes: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('formboost_plan');
            const planStr = raw ? JSON.parse(raw) : null;
            if (planStr && planStr.plan) {
                const numeric = Number.parseInt(planStr.plan, 10);
                if (PRICES[numeric]) {
                    setFormData((prev) => ({ ...prev, responses: numeric }));
                }
            }
        } catch (e) {
            console.error('Error reading plan from localStorage', e);
        }
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const currentAmount = PRICES[formData.responses] || 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            ...formData,
            responses: Number(formData.responses),
            amount: currentAmount,
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const data = await response.json();

            alert('Order created successfully! It is now pending admin approval.');
            navigate('/');
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="page-header">
                <div className="container row">
                    <a href="/" className="brand" onClick={(e) => { e.preventDefault(); navigate('/'); }}>FormBoost</a>
                    <p className="crumb">Step 1 of 2</p>
                </div>
            </header>

            <main className="container page-grid">
                <section className="card wide">
                    <h1>Submit your request</h1>
                    <p className="lead">Fill these details so we can deliver responses in your preferred format.</p>

                    {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                    <form id="request-form" className="form-grid" onSubmit={handleSubmit}>
                        <label>
                            Your Name
                            <input type="text" id="clientName" required placeholder="e.g. Deep Patel" value={formData.clientName} onChange={handleChange} />
                        </label>
                        <label>
                            Email or WhatsApp
                            <input type="text" id="contact" required placeholder="e.g. deep@example.com" value={formData.contact} onChange={handleChange} />
                        </label>
                        <label className="full">
                            Google Form Link
                            <input type="url" id="formLink" required placeholder="https://docs.google.com/forms/..." value={formData.formLink} onChange={handleChange} />
                        </label>
                        <label>
                            Required Responses
                            <select id="responses" required value={formData.responses} onChange={handleChange}>
                                <option value="500">500</option>
                                <option value="1000">1000</option>
                                <option value="1500">1500</option>
                                <option value="2000">2000</option>
                            </select>
                        </label>
                        <label>
                            Audience Style
                            <select id="audience" required value={formData.audience} onChange={handleChange}>
                                <option value="General mixed users">General mixed users</option>
                                <option value="Students">Students</option>
                                <option value="Working professionals">Working professionals</option>
                                <option value="Custom">Custom</option>
                            </select>
                        </label>
                        <label className="full">
                            Notes (optional)
                            <textarea id="notes" rows="4" placeholder="Any specific pattern, location, age group, or answer preference" value={formData.notes} onChange={handleChange}></textarea>
                        </label>

                        <button className="btn btn-primary full" type="submit" disabled={loading}>
                            {loading ? 'Processing...' : 'Submit Request'}
                        </button>
                    </form>
                </section>

                <aside className="card">
                    <h2>Order summary</h2>
                    <dl className="summary" id="summaryBox">
                        <div>
                            <dt>Plan</dt>
                            <dd id="sumPlan">{formData.responses} Responses</dd>
                        </div>
                        <div>
                            <dt>Amount</dt>
                            <dd id="sumAmount">INR {currentAmount}</dd>
                        </div>
                        <div>
                            <dt>Delivery</dt>
                            <dd>24-48 hours</dd>
                        </div>
                    </dl>
                    <p className="hint">Your selected plan from homepage is auto-loaded here. You can still change response count above.</p>
                </aside>
            </main>
        </>
    );
};

export default RequestForm;
