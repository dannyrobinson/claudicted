import React from 'react';

const experience = [
    { company: 'Hydrow', role: 'SVP, UX, Design & Creative', period: '2021 – Present' },
    { company: 'Flexport', role: 'VP, Design & User Research', period: '2020 – 2021' },
    { company: 'AI Fund', role: 'EIR & Head of Design', period: '2019 – 2020' },
    { company: 'Yahoo', role: 'VP, Global Design & UX Strategy', period: '2015 – 2019' },
    { company: 'Hightail', role: 'VP, Design, Brand & User Research', period: '2012 – 2015' }
];

const CV = () => {
    return (
        <section style={{ paddingTop: '8rem', minHeight: '100vh', paddingBottom: '8rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
                <header style={{ marginBottom: '6rem' }}>
                    <span className="mono-label">Professional History</span>
                    <h2 style={{ fontSize: '4rem' }} className="italic">Career</h2>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                    {experience.map((item, index) => (
                        <div key={index} style={{ borderBottom: '1px solid #DDD', paddingBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '2.5rem', textTransform: 'none' }} className="italic">{item.company}</h3>
                                <span className="mono-label" style={{ color: 'var(--text)', opacity: 0.6 }}>{item.period}</span>
                            </div>
                            <p style={{ fontSize: '1.25rem', opacity: 0.8 }}>{item.role}</p>
                        </div>
                    ))}
                </div>

                <footer style={{ marginTop: '8rem' }}>
                    <span className="mono-label">Connect</span>
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
                        <a href="mailto:david@davidrdesign.com" className="nav-link" style={{ color: 'var(--accent)' }}>Email</a>
                        <a href="https://linkedin.com/in/davidrdesign" className="nav-link" style={{ color: 'var(--accent)' }}>LinkedIn</a>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export default CV;
