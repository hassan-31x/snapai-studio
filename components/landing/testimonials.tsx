"use client";

import React from 'react';
import { InfiniteMovingCards } from '../ui/infinity-moving-cards';

const testimonials = [
	{
		quote: 'Snap AI completely transformed our creative workflow. We\'re generating professional ads in seconds instead of hours.',
		name: 'Sarah Chen',
		role: 'Marketing Director',
		company: 'TechFlow',
	},
	{
		quote: 'As a small business owner, I can\'t afford expensive designers. Snap AI gives me professional-quality ads at a fraction of the cost.',
		name: 'Marcus Rodriguez',
		role: 'Founder',
		company: 'Local Eats',
	},
	{
		quote: 'The AI understands our brand perfectly. Every creative feels like it was made by our in-house team, but 10x faster.',
		name: 'Emily Watson',
		role: 'Creative Lead',
		company: 'Bloom Beauty',
	},
	{
		quote: 'I was skeptical about AI-generated creatives, but the quality is incredible. Our CTR improved by 40% using Snap AI ads.',
		name: 'David Kim',
		role: 'Performance Marketer',
		company: 'Growth Labs',
	},
	{
		quote: 'The platform is so intuitive. Upload a product photo and get multiple variations instantly. It\'s like having a design team on demand.',
		name: 'Lisa Thompson',
		role: 'E-commerce Manager',
		company: 'StyleHub',
	},
];

const Testimonials = () => {
	return (
		<section className="py-20 px-6 bg-gray-50/30">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-16">
					<div className="inline-block bg-indigo-50 text-indigo-600 text-sm font-medium px-4 py-2 rounded-full mb-4">
						Customer Stories
					</div>
					<h2
						className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900"
						style={{ fontFamily: 'Geist,Inter,sans-serif' }}
					>
						Loved by creators and brands worldwide
					</h2>
					<p
						className="text-base text-gray-500 max-w-2xl mx-auto"
						style={{ fontFamily: 'Inter,Geist,sans-serif' }}
					>
						See how thousands of designers and marketers are creating
						scroll-stopping ads with AI
					</p>
				</div>

				<div className="space-y-4">
					<InfiniteMovingCards
						key="testimonials-row-1"
						items={testimonials}
						direction="left"
						speed="normal"
					/>

					<InfiniteMovingCards
						key="testimonials-row-2"
						items={testimonials}
						direction="right"
						speed="normal"
					/>
				</div>

				<div className="mt-16 text-center">
					<p
						className="text-sm text-gray-400 mb-6"
						style={{ fontFamily: 'Inter,Geist,sans-serif' }}
					>
						Join thousands of satisfied users creating better ads with AI
					</p>
				</div>
			</div>
		</section>
	);
};

export default Testimonials;