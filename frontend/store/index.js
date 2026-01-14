import { proxy } from 'valtio';

const state = proxy({
  intro: false,
  color: '#FFFFFF',
  isLogoTexture: false,
  isFullTexture: false,
  logoDecal: '',
  fullDecal: '',
  // Logo customization
  logoSize: 'M', // S, M, L
  logoPlacement: 'center', // left, center, right
  // Text customization - Front
  frontText: '',
  frontFontStyle: 'Arial',
  frontFontSize: 24,
  frontTextPlacement: 'center', // left, center, right
  frontTextColor: '#000000',
  // Text customization - Back
  backText: '',
  backFontStyle: 'Arial',
  backFontSize: 24,
  backTextPlacement: 'center', // left, center, right
  backTextColor: '#000000',
  // Undo/Redo history
  history: [],
  historyIndex: -1,
});

export default state;