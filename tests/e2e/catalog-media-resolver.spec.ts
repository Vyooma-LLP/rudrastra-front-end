import { test, expect } from '@playwright/test';
import { resolveProductAssets, normalizeMediaMetadata } from '../../src/lib/catalog/product-media';

test.describe('CAD Presentation Metadata Architecture', () => {

  test('Test 1 — Single composite image', () => {
    const product = {
      productMedia: [
        {
          url: 'composite.png',
          mediaType: 'image',
          assetRole: 'drawing',
          metadata: { presentation: 'single' }
        }
      ]
    };
    const assets = resolveProductAssets(product, { mediaType: 'image', assetRole: 'drawing' });
    expect(assets.length).toBe(1);
    expect(assets[0].metadata?.presentation).toBe('single');
  });

  test('Test 2 — Multi-view', () => {
    const product = {
      productMedia: [
        { url: 'top.png', mediaType: 'image', assetRole: 'drawing', metadata: { presentation: 'multi_view', view: 'top' } },
        { url: 'bottom.png', mediaType: 'image', assetRole: 'drawing', metadata: { presentation: 'multi_view', view: 'bottom' } },
        { url: 'side.png', mediaType: 'image', assetRole: 'drawing', metadata: { presentation: 'multi_view', view: 'side' } }
      ]
    };
    const assets = resolveProductAssets(product, { mediaType: 'image', assetRole: 'drawing' });
    expect(assets.length).toBe(3);
    expect(assets[0].metadata?.presentation).toBe('multi_view');
    expect(assets[0].metadata?.view).toBe('top');
    expect(assets[1].metadata?.view).toBe('bottom');
    expect(assets[2].metadata?.view).toBe('side');
  });

  test('Test 3 — Partial multi-view', () => {
    const product = {
      productMedia: [
        { url: 'top.png', mediaType: 'image', assetRole: 'drawing', metadata: { presentation: 'multi_view', view: 'top' } },
        { url: 'iso.png', mediaType: 'image', assetRole: 'drawing', metadata: { presentation: 'multi_view', view: 'isometric' } }
      ]
    };
    const assets = resolveProductAssets(product, { mediaType: 'image', assetRole: 'drawing' });
    expect(assets.length).toBe(2);
    expect(assets[1].metadata?.view).toBe('isometric');
  });

  test('Test 4 — Mixed assets', () => {
    const product = {
      productMedia: [
        { url: 'drawing.png', mediaType: 'image', assetRole: 'drawing', metadata: { presentation: 'single' } },
        { url: 'model.step', mediaType: 'cad', assetRole: 'drawing', metadata: { presentation: 'model' } },
        { url: 'dims.pdf', mediaType: 'document', assetRole: 'drawing', metadata: { presentation: 'document' } }
      ]
    };
    const imageAssets = resolveProductAssets(product, { mediaType: 'image', assetRole: 'drawing' });
    expect(imageAssets.length).toBe(1);
    expect(imageAssets[0].metadata?.presentation).toBe('single');

    const cadAssets = resolveProductAssets(product, { mediaType: 'cad', assetRole: 'drawing' });
    expect(cadAssets.length).toBe(1);
    expect(cadAssets[0].metadata?.presentation).toBe('model');
    
    const docAssets = resolveProductAssets(product, { mediaType: 'document', assetRole: 'drawing' });
    expect(docAssets.length).toBe(1);
    expect(docAssets[0].metadata?.presentation).toBe('document');
  });

  test('Test 5 — Legacy product fallback', () => {
    // A legacy product row from before the metadata column existed
    const product = {
      productMedia: [
        { url: 'old_drawing.png', mediaType: 'image', assetRole: 'drawing' },
        { url: 'old_model.step', mediaType: 'cad', assetRole: 'drawing' },
        { url: 'old_doc.pdf', mediaType: 'document', assetRole: 'drawing' }
      ]
    };

    // We can test the normalizer directly
    const normalizedImage = normalizeMediaMetadata(product.productMedia[0]);
    expect(normalizedImage.presentation).toBe('single');
    
    const normalizedCad = normalizeMediaMetadata(product.productMedia[1]);
    expect(normalizedCad.presentation).toBe('model');
    
    const normalizedDoc = normalizeMediaMetadata(product.productMedia[2]);
    expect(normalizedDoc.presentation).toBe('document');

    // And verify the resolver preserves it
    const resolvedImages = resolveProductAssets(product, { mediaType: 'image', assetRole: 'drawing' });
    expect(resolvedImages[0].metadata?.presentation).toBe('single');
  });

});
