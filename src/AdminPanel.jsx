import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';

const AdminPanel = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/orders');
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Refresh the orders after update
            fetchOrders();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <>
            <header className="page-header">
                <div className="container row">
                    <a href="/" className="brand" onClick={(e) => { e.preventDefault(); navigate('/'); }}>FormBoost Admin</a>
                </div>
            </header>

            <main className="container page-grid" style={{ gridTemplateColumns: '1fr' }}>
                <section className="card wide">
                    <h1>Order Approvals</h1>
                    <p className="lead">Manage user orders and their status.</p>

                    {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                    {loading ? (
                        <p>Loading orders...</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd' }}>Client</th>
                                        <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd' }}>Amount & Plan</th>
                                        <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd' }}>Notes</th>
                                        <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd' }}>Status</th>
                                        <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.5rem' }}>
                                                <strong>{order.clientName}</strong><br />
                                                <small>{order.contact}</small>
                                            </td>
                                            <td style={{ padding: '0.5rem' }}>
                                                INR {order.amount}<br />
                                                <small>{order.responses} reps - {order.audience}</small>
                                            </td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <span style={{ fontSize: '0.85rem' }}>{order.notes || '-'}</span><br />
                                                <a href={order.formLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>Link to Form</a>
                                            </td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <span style={{
                                                    padding: '0.2rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.85rem',
                                                    backgroundColor: order.status === 'Approved' ? '#d4edda' : order.status === 'Rejected' ? '#f8d7da' : '#fff3cd',
                                                    color: order.status === 'Approved' ? '#155724' : order.status === 'Rejected' ? '#721c24' : '#856404',
                                                }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.5rem' }}>
                                                {order.status === 'Pending' && (
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={() => handleStatusChange(order._id, 'Approved')}
                                                            style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(order._id, 'Rejected')}
                                                            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>No orders found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
};

export default AdminPanel;
