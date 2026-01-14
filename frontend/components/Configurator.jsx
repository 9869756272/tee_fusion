import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { Palette, Image, Type, FileText } from 'lucide-react';
import state from '../store/index.js';

const Configurator = ({ onAddToCart }) => {
  const snap = useSnapshot(state);
  const [activeSection, setActiveSection] = useState('color');

  const colors = [
    '#FFFFFF', '#000000', '#EFBD4E', '#80C670', '#726DE8', 
    '#EF674E', '#353934', '#FF6B6B', '#4ECDC4', '#95E1D3',
    '#F38181', '#AA96DA', '#FCBAD3', '#FFD93D', '#6BCB77'
  ];

  const fontStyles = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 
    'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Comic Sans MS',
    'Impact', 'Trebuchet MS', 'Lucida Console', 'Tahoma', 'Roboto'
  ];

  const handleDecalUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      state.logoDecal = reader.result;
      state.isLogoTexture = true;
    };
    reader.readAsDataURL(file);
  };

  const saveToHistory = () => {
    const currentState = {
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
    
    // Remove any states after current index (for redo)
    state.history = state.history.slice(0, snap.historyIndex + 1);
    state.history.push(JSON.parse(JSON.stringify(currentState)));
    state.historyIndex = state.history.length - 1;
    
    // Limit history size
    if (state.history.length > 50) {
      state.history.shift();
      state.historyIndex--;
    }
  };

  const updateState = (updates) => {
    Object.assign(state, updates);
    saveToHistory();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-brand-black mb-2">Customize Your Tee</h2>
        <p className="text-sm text-gray-500">Design your perfect t-shirt</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'color', label: 'Color', icon: Palette },
          { id: 'logo', label: 'Logo', icon: Image },
          { id: 'front', label: 'Front Text', icon: Type },
          { id: 'back', label: 'Back Text', icon: FileText },
        ].map((section) => {
          const IconComponent = section.icon;
          return (
            <button 
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-lg transition-all whitespace-nowrap ${
                activeSection === section.id
                  ? 'text-brand-blue border-b-2 border-brand-blue bg-blue-50'
                  : 'text-gray-500 hover:text-brand-black'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Color Section */}
        {activeSection === 'color' && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Select T-Shirt Color
              </label>
              <div className="grid grid-cols-5 gap-3">
            {colors.map((color) => (
              <button
                key={color}
                    onClick={() => updateState({ color })}
                    className={`w-12 h-12 rounded-xl border-2 transition-all hover:scale-110 ${
                      snap.color === color
                        ? 'border-brand-blue scale-110 shadow-lg ring-2 ring-brand-blue/50'
                        : 'border-gray-300'
                    }`}
                style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Logo Section */}
        {activeSection === 'logo' && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Logo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-brand-blue transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDecalUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">
                    {snap.logoDecal ? 'Change Logo' : 'Click to Upload'}
                  </span>
                  <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
                </label>
              </div>
              {snap.logoDecal && (
                <button
                  onClick={() => updateState({ logoDecal: '', isLogoTexture: false })}
                  className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Remove Logo
                </button>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Logo Size
              </label>
              <div className="flex gap-3">
                {['S', 'M', 'L'].map((size) => (
                  <button
                    key={size}
                    onClick={() => updateState({ logoSize: size })}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                      snap.logoSize === size
                        ? 'bg-brand-blue text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Logo Placement
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' },
                ].map((placement) => (
                  <button
                    key={placement.value}
                    onClick={() => updateState({ logoPlacement: placement.value })}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      snap.logoPlacement === placement.value
                        ? 'bg-brand-blue text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {placement.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Front Text Section */}
        {activeSection === 'front' && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Front Text
              </label>
              <input
                type="text"
                value={snap.frontText}
                onChange={(e) => updateState({ frontText: e.target.value })}
                placeholder="Enter text for front..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                maxLength={50}
              />
              <p className="mt-1 text-xs text-gray-400">{snap.frontText.length}/50</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Font Style
              </label>
              <select
                value={snap.frontFontStyle}
                onChange={(e) => updateState({ frontFontStyle: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                {fontStyles.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Font Size: {snap.frontFontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="72"
                value={snap.frontFontSize}
                onChange={(e) => updateState({ frontFontSize: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>12px</span>
                <span>72px</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Text Placement
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' },
                ].map((placement) => (
                  <button
                    key={placement.value}
                    onClick={() => updateState({ frontTextPlacement: placement.value })}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      snap.frontTextPlacement === placement.value
                        ? 'bg-brand-blue text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {placement.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Text Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={snap.frontTextColor}
                  onChange={(e) => updateState({ frontTextColor: e.target.value })}
                  className="w-16 h-16 rounded-xl border-2 border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={snap.frontTextColor}
                  onChange={(e) => updateState({ frontTextColor: e.target.value })}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        )}

        {/* Back Text Section */}
        {activeSection === 'back' && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Back Text
              </label>
              <input
                type="text"
                value={snap.backText}
                onChange={(e) => updateState({ backText: e.target.value })}
                placeholder="Enter text for back..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                maxLength={50}
              />
              <p className="mt-1 text-xs text-gray-400">{snap.backText.length}/50</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Font Style
              </label>
              <select
                value={snap.backFontStyle}
                onChange={(e) => updateState({ backFontStyle: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                {fontStyles.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Font Size: {snap.backFontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="72"
                value={snap.backFontSize}
                onChange={(e) => updateState({ backFontSize: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>12px</span>
                <span>72px</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Text Placement
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' },
                ].map((placement) => (
                  <button
                    key={placement.value}
                    onClick={() => updateState({ backTextPlacement: placement.value })}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      snap.backTextPlacement === placement.value
                        ? 'bg-brand-blue text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {placement.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Text Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={snap.backTextColor}
                  onChange={(e) => updateState({ backTextColor: e.target.value })}
                  className="w-16 h-16 rounded-xl border-2 border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={snap.backTextColor}
                  onChange={(e) => updateState({ backTextColor: e.target.value })}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Configurator;
