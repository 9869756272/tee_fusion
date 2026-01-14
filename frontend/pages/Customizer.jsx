import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Center, Environment } from '@react-three/drei';
import Shirt from '../components/Shirt.jsx';
import Backdrop from '../components/Backdrop.jsx';
import CameraRig from '../components/CameraRig.jsx';
import Configurator from '../components/Configurator.jsx';
import CanvasLoader from '../components/CanvasLoader.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import { useSnapshot } from 'valtio';
import state from '../store/index.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useConfirmation } from '../context/ConfirmationContext.jsx';
import { API_BASE_URL } from '../constants.js';

const Customizer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const snap = useSnapshot(state);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { confirm } = useConfirmation();
  const [product, setProduct] = useState(null);
  const [glContext, setGlContext] = useState(null);

  useEffect(() => {
    // Initialize history with current state
    const initialState = {
      color: snap.color,
      logoDecal: snap.logoDecal,
      isLogoTexture: snap.isLogoTexture,
      logoSize: snap.logoSize,
      logoPlacement: snap.logoPlacement,
      frontText: snap.frontText,
      frontFontStyle: snap.frontFontStyle,
      frontFontSize: snap.frontFontSize,
      frontTextPlacement: snap.frontTextPlacement,
      frontTextColor: snap.frontTextColor,
      backText: snap.backText,
      backFontStyle: snap.backFontStyle,
      backFontSize: snap.backFontSize,
      backTextPlacement: snap.backTextPlacement,
      backTextColor: snap.backTextColor,
    };
    state.history = [JSON.parse(JSON.stringify(initialState))];
    state.historyIndex = 0;

    // Fetch standard product info to link with customization
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          // Ensure modelPath is correct
          setProduct({ ...data, modelPath: '/shirt_baked_collapsed.glb' });
        }
      } catch (err) {
        // Fallback for mock
        setProduct({ _id: id, name: 'Custom Tee', price: 39.99, image: 'mock', modelPath: '/shirt_baked_collapsed.glb' });
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    // Capture snapshot if canvas is available
    let snapshot = null;
    if (glContext) {
      snapshot = glContext.domElement.toDataURL('image/png');
    }
    
    const customization = {
      color: snap.color,
      logoDecal: snap.logoDecal,
      decalUrl: snap.logoDecal, // For backward compatibility with CartContext
      logoSize: snap.logoSize,
      logoPlacement: snap.logoPlacement,
      frontText: snap.frontText,
      frontFontStyle: snap.frontFontStyle,
      frontFontSize: snap.frontFontSize,
      frontTextPlacement: snap.frontTextPlacement,
      frontTextColor: snap.frontTextColor,
      backText: snap.backText,
      backFontStyle: snap.backFontStyle,
      backFontSize: snap.backFontSize,
      backTextPlacement: snap.backTextPlacement,
      backTextColor: snap.backTextColor,
      snapshot: snapshot,
    };

    addToCart(product, 1, customization);
    showToast('Added to cart', 'success');
    navigate('/cart');
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="absolute top-5 left-5 z-20">
        <button 
          onClick={() => navigate(-1)}
          className="bg-white/90 backdrop-blur-md text-brand-black px-6 py-3 rounded-full text-sm font-bold hover:bg-white transition-all shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex h-screen pt-20 pb-24">
        {/* Left Side - Empty for now */}
        <div className="w-0 lg:w-1/6"></div>

        {/* Center - 3D Preview */}
        <div className="flex-1 relative">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white">
            <ErrorBoundary>
              <Canvas
                shadows
                camera={{ position: [0, 0, 2.5], fov: 25 }}
                gl={{ preserveDrawingBuffer: true }}
                onCreated={({ gl }) => setGlContext(gl)}
                className="w-full h-full"
                dpr={[1, 2]}
              >
                <ambientLight intensity={0.5 * Math.PI} />
                <Suspense fallback={<CanvasLoader />}>
                  <Environment 
                    files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" 
                  />
                  <CameraRig>
                    <Backdrop />
                    <Center>
                      <Shirt modelPath="/shirt_baked_collapsed.glb" />
                    </Center>
                  </CameraRig>
                </Suspense>
              </Canvas>
            </ErrorBoundary>
          </div>
        </div>

        {/* Right Side - Configurator Panel */}
        <div className="w-full lg:w-96 xl:w-[420px] p-6 overflow-y-auto">
          <Configurator onAddToCart={handleAddToCart} />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                if (snap.historyIndex > 0) {
                  state.historyIndex--;
                  const previousState = state.history[state.historyIndex];
                  Object.assign(state, previousState);
                }
              }}
              disabled={snap.historyIndex <= 0}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Undo
            </button>

            <button
              onClick={() => {
                if (snap.historyIndex < snap.history.length - 1) {
                  state.historyIndex++;
                  const nextState = state.history[state.historyIndex];
                  Object.assign(state, nextState);
                }
              }}
              disabled={snap.historyIndex >= snap.history.length - 1}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Redo
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button
              onClick={() => {
                // Save current state to localStorage
                const savedState = {
                  color: snap.color,
                  logoDecal: snap.logoDecal,
                  logoSize: snap.logoSize,
                  logoPlacement: snap.logoPlacement,
                  frontText: snap.frontText,
                  frontFontStyle: snap.frontFontStyle,
                  frontFontSize: snap.frontFontSize,
                  frontTextPlacement: snap.frontTextPlacement,
                  frontTextColor: snap.frontTextColor,
                  backText: snap.backText,
                  backFontStyle: snap.backFontStyle,
                  backFontSize: snap.backFontSize,
                  backTextPlacement: snap.backTextPlacement,
                  backTextColor: snap.backTextColor,
                };
                localStorage.setItem('customizer_save', JSON.stringify(savedState));
                showToast('Design saved successfully!', 'success');
              }}
              className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save
            </button>

            <button
              onClick={async () => {
                const confirmed = await confirm({
                  title: 'Reset Design',
                  message: 'Are you sure you want to reset all customizations? This will clear all your changes.',
                  confirmText: 'Reset',
                  cancelText: 'Cancel',
                  type: 'warning',
                });
                
                if (confirmed) {
                  state.color = '#FFFFFF';
                  state.logoDecal = '';
                  state.isLogoTexture = false;
                  state.logoSize = 'M';
                  state.logoPlacement = 'center';
                  state.frontText = '';
                  state.frontFontStyle = 'Arial';
                  state.frontFontSize = 24;
                  state.frontTextPlacement = 'center';
                  state.frontTextColor = '#000000';
                  state.backText = '';
                  state.backFontStyle = 'Arial';
                  state.backFontSize = 24;
                  state.backTextPlacement = 'center';
                  state.backTextColor = '#000000';
                  showToast('Design reset', 'info');
                }
              }}
              className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>

            <button
              onClick={handleAddToCart}
              className="px-8 py-3 bg-gradient-to-r from-brand-blue to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customizer;
