import React from 'react';
import { motion } from 'framer-motion';

const YouTubePlayer = ({ videoId, title }) => {
    if (!videoId) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-premium bg-black"
        >
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                title={title || "YouTube video player"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
            ></iframe>
        </motion.div>
    );
};

export default YouTubePlayer;
