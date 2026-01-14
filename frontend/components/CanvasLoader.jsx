
import React from 'react';
import { Html, useProgress } from '@react-three/drei';

const CanvasLoader = () => {
  const { progress } = useProgress();
  
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-blue rounded-full animate-spin mb-2"></div>
        <p className="text-xs font-bold text-brand-charcoal tracking-widest">
          {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
};

export default CanvasLoader;
