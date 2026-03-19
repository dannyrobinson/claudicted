import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ onEnter }) => {
    return (
        <section style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 2rem'
        }}>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                    fontSize: 'clamp(4rem, 15vw, 12rem)',
                    lineHeight: 0.9,
                    marginBottom: '2rem'
                }}
                className="italic"
            >
                David Robinson
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                style={{
                    maxWidth: '600px',
                    fontSize: '1.25rem',
                    marginBottom: '3rem',
                    lineHeight: 1.6
                }}
            >
                Design leadership. A bias toward clarity and strong opinions about progress rings that usually require a second monitor and a snack to fully unpack.
            </motion.p>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEnter}
                className="btn-primary"
            >
                Welcome In /&gt;
            </motion.button>
        </section>
    );
};

export default Hero;
