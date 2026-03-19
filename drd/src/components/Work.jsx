import React from 'react';
import { motion } from 'framer-motion';

const projects = [
    { id: 1, title: 'Hydrow Mobile Experience', category: 'Product Design', year: '2023', image: 'https://images.squarespace-cdn.com/content/v1/56e0a04920c64780c24d9044/1705525989319-VHLU9EAVD3EYK8X033X3/Home-2.png' },
    { id: 3, title: 'Yahoo Mail', category: 'UX Strategy', year: '2019', image: 'https://images.squarespace-cdn.com/content/v1/56e0a04920c64780c24d9044/1705529793328-AZLE7NHYM6JEU8SWLY8S/y-mobile-poster.jpg' },
    { id: 4, title: 'Flexport', category: 'Product Leadership', year: '2021', image: 'https://images.squarespace-cdn.com/content/v1/56e0a04920c64780c24d9044/1747423517242-SF75ZAPJ1IRA6CT4KEFF/1*VzTdDuC3LfxdkEdSyELTCw.png' },
    { id: 5, title: 'AI Music (The Layoffs)', category: 'Generative Art', year: '2024', image: 'https://images.squarespace-cdn.com/content/v1/56e0a04920c64780c24d9044/1705969585783-D9CX2VJVV7RRB93DNTQR/alls2.jpg' },
    { id: 2, title: 'Software', category: 'Interface Design', year: '2022', image: 'https://images.squarespace-cdn.com/content/v1/56e0a04920c64780c24d9044/1747427160067-6DGNWKYVVDZ94GU5HT47/2e38fa11a740a442c1341307598084c2.png' },
    { id: 6, title: 'Flickr', category: 'UX Design', year: '2016', image: 'https://images.squarespace-cdn.com/content/v1/56e0a04920c64780c24d9044/1747422703386-UBFBFYWBA7KCNYZHISD6/g3a+%E2%80%94%C2%A0preview+single.png' },
    { id: 7, title: 'Owlcam', category: 'Product Design', year: '2018', image: 'https://images.squarespace-cdn.com/content/v1/56e0a04920c64780c24d9044/1747422896521-T0S5H0H6Z7J6Y8X033X3/owlcam-poster.jpg' },
    { id: 8, title: 'Rustle', category: 'Mobile App', year: '2017', image: 'https://images.squarespace-cdn.com/content/v1/56e0a04920c64780c24d9044/1705528990117-S8R3S2P1IRA6CT4KEFF/rustle-poster.jpg' }
];

const Work = () => {
    return (
        <section style={{ paddingTop: '8rem', minHeight: '100vh' }}>
            <div className="grid-layout">
                <header style={{ gridColumn: 'span 12', marginBottom: '8rem' }}>
                    <span className="mono-label">Selected Projects</span>
                    <h2 style={{ fontSize: '10vw', lineHeight: 0.9 }} className="italic">The Work</h2>
                </header>

                {projects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                            gridColumn: index % 2 === 0 ? 'span 7' : 'span 5',
                            marginBottom: '10rem',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{
                            aspectRatio: '16/9',
                            backgroundColor: '#DDD',
                            marginBottom: '2rem',
                            overflow: 'hidden',
                            position: 'relative',
                            filter: 'grayscale(100%)',
                            transition: 'filter 0.5s ease'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.filter = 'grayscale(0%)'}
                            onMouseLeave={(e) => e.currentTarget.style.filter = 'grayscale(100%)'}
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <span className="mono-label" style={{ marginBottom: '0.5rem' }}>{project.category} · {project.year}</span>
                        <h3 style={{ fontSize: '3.5rem', marginTop: '0', lineHeight: 1 }} className="italic">{project.title}</h3>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Work;
