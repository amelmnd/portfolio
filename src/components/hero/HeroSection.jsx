'use client';
import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

const HeroSection = () => {
	return (
		<section>
			<div>
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
				>
					<h1 class="hero__text color__gradiente">
						<span>Hello, Je suis </span>
						<br />
						<TypeAnimation
							sequence={[
								'Amel',
								1000,
								'Développeuse Full Stack',
								1000,
								'Développeuse React Native',
								1000,
								'Développeuse C',
								1000,
							]}
							wrapper="span"
							speed={50}
							repeat={Infinity}
						/>
					</h1>
				</motion.div>
			</div>
		</section>
	);
};

export default HeroSection;
