'use client';

import { useState, useEffect, Suspense } from 'react';
import VideoPage from '@/component/Video';
import React from 'react';
import { motion, Variants } from 'framer-motion';
import useTrans from '@/hooks/useTrans';

const contentSwirlVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.6,
    rotate: -180,
    y: -100,
    x: -50,
    filter: 'blur(10px)',
    originX: 0.2,
    originY: 0.2,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    y: 0,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: [0.6, 0.01, 0.05, 0.9],
    },
  },
};

export default function VideosPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { trans } = useTrans();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }} className='ml-1 mr-10 shadow-2xl'>
      <motion.div
        initial="hidden"
        animate={isMounted ? "visible" : "hidden"}
        variants={contentSwirlVariants}
        style={{ position: 'relative', width: '100%', height: '100%' }}
      >
        <Suspense fallback={<div>{trans.common.loading}</div>}>
          <VideoPage />
        </Suspense>
      </motion.div>
    </div>
  );
}
