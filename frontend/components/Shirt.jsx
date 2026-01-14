import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture, RoundedBox } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { easing } from 'maath';
import * as THREE from 'three';
import state from '../store/index.js';

// Helper function to create text texture
const createTextTexture = (text, fontStyle, fontSize, textColor, width = 1024, height = 512) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  
  // Clear canvas with transparent background
  context.clearRect(0, 0, width, height);
  
  if (!text || text.trim() === '') {
    return null;
  }
  
  // Set font with better rendering
  context.font = `bold ${fontSize}px ${fontStyle}`;
  context.fillStyle = textColor;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  
  // Enable better text rendering
  context.textRenderingOptimization = 'optimizeQuality';
  
  // Handle text wrapping for longer text
  const maxWidth = width * 0.9;
  const words = text.split(' ');
  let line = '';
  let y = height / 2;
  const lineHeight = fontSize * 1.2;
  const lines = [];
  
  // Simple word wrapping
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  
  // Center lines vertically
  const totalHeight = lines.length * lineHeight;
  y = (height - totalHeight) / 2 + lineHeight / 2;
  
  // Draw each line
  lines.forEach((line) => {
    context.fillText(line.trim(), width / 2, y);
    y += lineHeight;
  });
  
  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = true; // Flip Y for correct orientation on decals
  texture.needsUpdate = true;
  return texture;
};

// Preload the GLB model
useGLTF.preload('/shirt_baked_collapsed.glb');

const Shirt = (props) => {
  const { modelPath = '/shirt_baked_collapsed.glb' } = props;
  const snap = useSnapshot(state);
  const shirtRef = useRef();
  const [logoTexture, setLogoTexture] = useState(null);
  const logoTextureRef = useRef(null);
  
  // Load the model - useGLTF must be called unconditionally
  // ErrorBoundary will catch any loading errors
  const gltf = useGLTF(modelPath);
  const nodes = gltf?.nodes;
  const materials = gltf?.materials;
  
  // Check if we have the required nodes and materials
  const hasValidModel = nodes && materials && nodes.T_Shirt_male;
  
  // Load logo texture
  useEffect(() => {
    // Cleanup previous texture
    if (logoTextureRef.current) {
      logoTextureRef.current.dispose();
      logoTextureRef.current = null;
    }
    
    if (snap.logoDecal && snap.isLogoTexture) {
      try {
        const loader = new THREE.TextureLoader();
        loader.load(
          snap.logoDecal,
          (texture) => {
            texture.flipY = true; // Flip Y for correct orientation on decals
            logoTextureRef.current = texture;
            setLogoTexture(texture);
          },
          undefined,
          (error) => {
            console.error('Error loading logo texture:', error);
            setLogoTexture(null);
          }
        );
      } catch (error) {
        console.error('Error loading logo texture:', error);
        setLogoTexture(null);
      }
    } else {
      setLogoTexture(null);
    }
    
    return () => {
      if (logoTextureRef.current) {
        logoTextureRef.current.dispose();
        logoTextureRef.current = null;
      }
    };
  }, [snap.logoDecal, snap.isLogoTexture]);

  // Calculate logo size based on state
  const logoScale = useMemo(() => {
    const sizeMap = { S: 0.1, M: 0.15, L: 0.2 };
    return sizeMap[snap.logoSize] || 0.15;
  }, [snap.logoSize]);

  // Calculate logo position based on placement (adjusted for real shirt model)
  const logoPosition = useMemo(() => {
    const placementMap = {
      left: [-0.15, 0.04, 0.15],
      center: [0, 0.04, 0.15],
      right: [0.15, 0.04, 0.15],
    };
    return placementMap[snap.logoPlacement] || [0, 0.04, 0.15];
  }, [snap.logoPlacement]);
  
  // Fix texture flip for logo
  useEffect(() => {
    if (logoTexture) {
      logoTexture.flipY = true; // Flip Y for correct orientation
    }
  }, [logoTexture]);

  // Create text textures with cleanup
  const frontTextTexture = useMemo(() => {
    const texture = createTextTexture(
      snap.frontText,
      snap.frontFontStyle,
      snap.frontFontSize,
      snap.frontTextColor
    );
    return texture;
  }, [snap.frontText, snap.frontFontStyle, snap.frontFontSize, snap.frontTextColor]);

  const backTextTexture = useMemo(() => {
    const texture = createTextTexture(
      snap.backText,
      snap.backFontStyle,
      snap.backFontSize,
      snap.backTextColor
    );
    return texture;
  }, [snap.backText, snap.backFontStyle, snap.backFontSize, snap.backTextColor]);

  // Cleanup textures on unmount
  useEffect(() => {
    return () => {
      if (frontTextTexture) frontTextTexture.dispose();
      if (backTextTexture) backTextTexture.dispose();
    };
  }, [frontTextTexture, backTextTexture]);

  // Calculate text position based on placement (adjusted for real shirt model)
  const getTextPosition = (placement, isBack = false) => {
    const zOffset = isBack ? -0.15 : 0.15;
    const yOffset = 0.04;
    const placementMap = {
      left: [-0.2, yOffset, zOffset],
      center: [0, yOffset, zOffset],
      right: [0.2, yOffset, zOffset],
    };
    return placementMap[placement] || [0, yOffset, zOffset];
  };
  
  // Fix texture flip for text textures
  useEffect(() => {
    if (frontTextTexture) {
      frontTextTexture.flipY = true; // Flip Y for correct orientation
    }
    if (backTextTexture) {
      backTextTexture.flipY = true; // Flip Y for correct orientation
    }
  }, [frontTextTexture, backTextTexture]);

  // Calculate text scale based on font size
  const getTextScale = (fontSize) => {
    // Normalize font size to a reasonable scale (12-72px -> 0.1-0.3 scale)
    return Math.max(0.08, Math.min(0.3, fontSize / 240));
  };

  // Update material color (rotation is handled by CameraRig for user control)
  useFrame((state, delta) => {
    if (materials && materials.lambert1) {
      // Use the lambert1 material from the GLB model (like reference code)
      easing.dampC(materials.lambert1.color, snap.color, 0.25, delta);
    } else if (materials) {
      // Fallback: try to find any material
      Object.values(materials).forEach((mat) => {
        if (mat && mat.color) {
          easing.dampC(mat.color, snap.color, 0.25, delta);
        }
      });
    } else if (shirtRef.current && shirtRef.current.material) {
      // Fallback for RoundedBox
      const material = shirtRef.current.material;
      if (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial) {
        easing.dampC(material.color, snap.color, 0.25, delta);
      }
    }
  });

  // Use fallback RoundedBox if GLB model is not available
  if (!hasValidModel) {
    return (
      <group key={JSON.stringify(snap)}>
        {/* Fallback: RoundedBox T-Shirt */}
        <RoundedBox ref={shirtRef} args={[1, 1.4, 0.3]} radius={0.1} smoothness={4} position={[0, 0, 0]}>
          <meshStandardMaterial roughness={0.5} />
          
          {/* Logo Decal on Front */}
          {logoTexture && snap.isLogoTexture && (
            <Decal 
              position={logoPosition}
              rotation={[0, 0, 0]}
              scale={logoScale}
              map={logoTexture}
              depthTest={false}
              depthWrite={false}
            />
          )}
          
          {/* Front Text Decal */}
          {frontTextTexture && snap.frontText && (
            <Decal
              position={getTextPosition(snap.frontTextPlacement, false)}
              rotation={[0, 0, 0]}
              scale={getTextScale(snap.frontFontSize)}
              map={frontTextTexture}
              depthTest={false}
              depthWrite={false}
            />
          )}
          
          {/* Back Text Decal */}
          {backTextTexture && snap.backText && (
            <Decal
              position={getTextPosition(snap.backTextPlacement, true)}
              rotation={[0, Math.PI, 0]}
              scale={getTextScale(snap.backFontSize)}
              map={backTextTexture}
              depthTest={false}
              depthWrite={false}
            />
          )}
        </RoundedBox>
        
        {/* Left Sleeve */}
        <RoundedBox 
          args={[0.45, 0.5, 0.3]} 
          radius={0.1} 
          smoothness={4} 
          position={[-0.65, 0.35, 0]} 
          rotation={[0, 0, 0.2]}
        >
          <meshStandardMaterial color={snap.color} roughness={0.5} />
        </RoundedBox>
        
        {/* Right Sleeve */}
        <RoundedBox 
          args={[0.45, 0.5, 0.3]} 
          radius={0.1} 
          smoothness={4} 
          position={[0.65, 0.35, 0]} 
          rotation={[0, 0, -0.2]}
        >
          <meshStandardMaterial color={snap.color} roughness={0.5} />
        </RoundedBox>
      </group>
    );
  }

  // Use the real shirt model (like reference code)
  return (
    <mesh
      ref={shirtRef}
      castShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={materials.lambert1}
      material-roughness={1}
      {...props}
      dispose={null}
    >
      {/* Logo Decal on Front */}
      {logoTexture && snap.isLogoTexture && (
        <Decal 
          position={logoPosition}
          rotation={[0, 0, 0]}
          scale={logoScale}
          map={logoTexture}
          depthTest={false}
          depthWrite={false}
        />
      )}
      
      {/* Front Text Decal */}
      {frontTextTexture && snap.frontText && (
        <Decal
          position={getTextPosition(snap.frontTextPlacement, false)}
          rotation={[0, 0, 0]}
          scale={getTextScale(snap.frontFontSize)}
          map={frontTextTexture}
          depthTest={false}
          depthWrite={false}
        />
      )}
      
      {/* Back Text Decal */}
      {backTextTexture && snap.backText && (
        <Decal
          position={getTextPosition(snap.backTextPlacement, true)}
          rotation={[0, Math.PI, 0]}
          scale={getTextScale(snap.backFontSize)}
          map={backTextTexture}
          depthTest={false}
          depthWrite={false}
        />
      )}
    </mesh>
  );
};

export default Shirt;