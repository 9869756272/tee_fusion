import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import state from '../store/index.js';

function CameraRig({ children }) {
  const group = useRef();
  const snap = useSnapshot(state);
  const { camera, viewport, gl } = useThree();
  const [rotation, setRotation] = useState([0, 0, 0]);
  const isDraggingRef = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      lastMousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
      gl.domElement.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      
      const deltaX = e.clientX - lastMousePosition.current.x;
      const deltaY = e.clientY - lastMousePosition.current.y;
      
      // Update rotation based on drag delta
      // Horizontal drag rotates around Y axis (spinning the shirt)
      // Vertical drag rotates around X axis (tilting up/down)
      setRotation(prev => [
        prev[0] + deltaY * 0.005, // X rotation (tilt)
        prev[1] - deltaX * 0.005, // Y rotation (spin)
        prev[2]
      ]);
      
      lastMousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      gl.domElement.style.cursor = 'grab';
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        lastMousePosition.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      e.preventDefault();
      
      const deltaX = e.touches[0].clientX - lastMousePosition.current.x;
      const deltaY = e.touches[0].clientY - lastMousePosition.current.y;
      
      setRotation(prev => [
        prev[0] + deltaY * 0.005,
        prev[1] - deltaX * 0.005,
        prev[2]
      ]);
      
      lastMousePosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const canvas = gl.domElement;
    
    // Mouse events
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    
    // Set initial cursor style
    canvas.style.cursor = 'grab';
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.style.cursor = 'default';
    };
  }, [gl]);
  
  useFrame((state, delta) => {
    easing.damp3(
      camera.position,
      [snap.intro ? -viewport.width / 4 : 0, 0, 2],
      0.25,
      delta
    );
    if (group.current) {
      // Smooth rotation based on drag
      easing.dampE(
        group.current.rotation,
        rotation,
        0.15,
        delta
      );
    }
  });
  
  return <group ref={group}>{children}</group>;
}

export default CameraRig;

