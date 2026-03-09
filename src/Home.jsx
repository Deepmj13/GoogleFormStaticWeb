import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        document.querySelectorAll('[data-reveal]').forEach((node) => observer.observe(node));

        return () => {
            document.querySelectorAll('[data-reveal]').forEach((node) => observer.unobserve(node));
        };
    }, []);

    const handlePlanSelection = (plan, price) => {
        localStorage.setItem(
            'formboost_plan',
            JSON.stringify({ plan, price })
        );
        navigate('/request');
    };

    return (
        <>
            <div className="ambient ambient-left"></div>
            <div className="ambient ambient-right"></div>

            <header className="site-header">
                <div className="container header-row">
                    <a href="/" className="brand" aria-label="FormBoost home">
                        <span className="brand-mark">FB</span>
                        <span>FormBoost</span>
                    </a>
                    <nav className="header-links" aria-label="Primary navigation">
                        <a href="#how-it-works">How it works</a>
                        <a href="#pricing">Pricing</a>
                        <button className="btn btn-outline" onClick={() => navigate('/request')}>Start Request</button>
                    </nav>
                </div>
            </header>

            <main>
                <section className="hero container">
                    <div className="hero-copy" data-reveal>
                        <p className="eyebrow">Static, simple, fast</p>
                        <h1>Get Google Form responses without the setup headache.</h1>
                        <p className="hero-text">
                            Share your form link, define response style, pick a plan, and track payment in one clean flow.
                            Built for projects, demos, and academic pilots.
                        </p>
                        <div className="hero-cta">
                            <button className="btn btn-primary" onClick={() => navigate('/request')}>Create Request</button>
                            <a className="btn btn-ghost" href="#pricing">View Plans</a>
                        </div>
                        <ul className="hero-points">
                            <li>Clear 3-step process</li>
                            <li>Works smoothly on phone and desktop</li>
                            <li>No account signup required</li>
                        </ul>
                    </div>
                    <div className="hero-card" data-reveal>
                        <img src="/assets/hero.jpg" alt="Google form workflow illustration" />
                        <div className="mini-metrics">
                            <article>
                                <h3>24-48h</h3>
                                <p>Standard turnaround</p>
                            </article>
                            <article>
                                <h3>4 Plans</h3>
                                <p>Flexible by response count</p>
                            </article>
                        </div>
                    </div>
                </section>

                <section id="how-it-works" className="container section" data-reveal>
                    <div className="section-head">
                        <p className="eyebrow">How it works</p>
                        <h2>A straightforward flow</h2>
                    </div>
                    <div className="steps-grid">
                        <article className="card step-card">
                            <span className="step-index">01</span>
                            <h3>Submit your requirements</h3>
                            <p>Add your Google Form link, target response count, and audience pattern.</p>
                        </article>
                        <article className="card step-card">
                            <span className="step-index">02</span>
                            <h3>Confirm plan and price</h3>
                            <p>Choose from transparent plans and move to the payment page with order details prefilled.</p>
                        </article>
                        <article className="card step-card">
                            <span className="step-index">03</span>
                            <h3>Get delivery update</h3>
                            <p>Receive confirmation and your responses based on the requested format and timeline.</p>
                        </article>
                    </div>
                </section>

                <section id="pricing" className="container section" data-reveal>
                    <div className="section-head">
                        <p className="eyebrow">Pricing</p>
                        <h2>Choose your response package</h2>
                    </div>
                    <div className="pricing-grid">
                        <article className="card pricing-card">
                            <h3>500 responses</h3>
                            <p className="price">INR 250</p>
                            <ul>
                                <li>Natural variation</li>
                                <li>Standard delivery</li>
                            </ul>
                            <button className="btn btn-outline" onClick={() => handlePlanSelection('500 Responses', '250')}>Select Plan</button>
                        </article>
                        <article className="card pricing-card">
                            <h3>1000 responses</h3>
                            <p className="price">INR 500</p>
                            <ul>
                                <li>Natural variation</li>
                                <li>Standard delivery</li>
                            </ul>
                            <button className="btn btn-outline" onClick={() => handlePlanSelection('1000 Responses', '500')}>Select Plan</button>
                        </article>
                        <article className="card pricing-card featured">
                            <p className="chip">Most popular</p>
                            <h3>1500 responses</h3>
                            <p className="price">INR 750</p>
                            <ul>
                                <li>Priority queue</li>
                                <li>Custom pattern support</li>
                            </ul>
                            <button className="btn btn-primary" onClick={() => handlePlanSelection('1500 Responses', '750')}>Select Plan</button>
                        </article>
                        <article className="card pricing-card">
                            <h3>2000 responses</h3>
                            <p className="price">INR 1000</p>
                            <ul>
                                <li>Priority queue</li>
                                <li>Natural variation</li>
                            </ul>
                            <button className="btn btn-outline" onClick={() => handlePlanSelection('2000 Responses', '1000')}>Select Plan</button>
                        </article>
                    </div>
                </section>
            </main>

            <footer className="site-footer">
                <div className="container footer-row">
                    <p>© 2026 FormBoost</p>
                    <button className="btn btn-ghost" onClick={() => navigate('/request')}>Start your request</button>
                </div>
            </footer>
        </>
    );
};

export default Home;
