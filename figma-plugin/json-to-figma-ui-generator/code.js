// Show plugin UI
figma.showUI(__html__, { width: 420, height: 600 });

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function clamp01(n) {
  if (Number.isNaN(n)) return 1;
  return Math.max(0, Math.min(1, n));
}

function normalizeColorComponent(n) {
  if (n > 1) return clamp01(n / 255);
  return clamp01(n);
}

function firstDefined() {
  for (var i = 0; i < arguments.length; i++) {
    var v = arguments[i];
    if (v !== undefined && v !== null) return v;
  }
  return undefined;
}

function toSolidPaint(input) {
  try {
    if (!input) return null;
    if (input.type && input.type !== 'SOLID') return null;
    const c = (input && typeof input.color !== 'undefined') ? input.color : input;
    const r = normalizeColorComponent(
      (typeof c.r !== 'undefined') ? c.r : ((typeof c.red !== 'undefined') ? c.red : 0)
    );
    const g = normalizeColorComponent(
      (typeof c.g !== 'undefined') ? c.g : ((typeof c.green !== 'undefined') ? c.green : 0)
    );
    const b = normalizeColorComponent(
      (typeof c.b !== 'undefined') ? c.b : ((typeof c.blue !== 'undefined') ? c.blue : 0)
    );
    const a = clamp01(
      (typeof c.a !== 'undefined') ? c.a :
      ((typeof c.alpha !== 'undefined') ? c.alpha :
      ((typeof input.opacity !== 'undefined') ? input.opacity : 1))
    );
    return {
      type: 'SOLID',
      color: { r, g, b },
      opacity: a,
      visible: input.visible !== false,
    };
  } catch (e) {
    console.log('toSolidPaint error', e);
    return null;
  }
}

// Parse #rgb, #rgba, #rrggbb, #rrggbbaa to {r,g,b,a} in 0..1
function parseHexToRgba(hex) {
  try {
    if (!hex || typeof hex !== 'string') return null;
    const s = hex.trim().replace(/^#/, '');
    if (s.length === 3) {
      const r = parseInt(s[0] + s[0], 16);
      const g = parseInt(s[1] + s[1], 16);
      const b = parseInt(s[2] + s[2], 16);
      return { r: r / 255, g: g / 255, b: b / 255, a: 1 };
    } else if (s.length === 4) {
      const r = parseInt(s[0] + s[0], 16);
      const g = parseInt(s[1] + s[1], 16);
      const b = parseInt(s[2] + s[2], 16);
      const a = parseInt(s[3] + s[3], 16);
      return { r: r / 255, g: g / 255, b: b / 255, a: a / 255 };
    } else if (s.length === 6) {
      const r = parseInt(s.slice(0, 2), 16);
      const g = parseInt(s.slice(2, 4), 16);
      const b = parseInt(s.slice(4, 6), 16);
      return { r: r / 255, g: g / 255, b: b / 255, a: 1 };
    } else if (s.length === 8) {
      const r = parseInt(s.slice(0, 2), 16);
      const g = parseInt(s.slice(2, 4), 16);
      const b = parseInt(s.slice(4, 6), 16);
      const a = parseInt(s.slice(6, 8), 16);
      return { r: r / 255, g: g / 255, b: b / 255, a: a / 255 };
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function createImagePaintFromSource(source) {
  try {
    let bytes = null;
    if (!source) {
      console.log('createImagePaintFromSource: source is null/undefined');
      return null;
    }
    let s;
    if (typeof source === 'string') {
      s = source;
    } else if (typeof source === 'object') {
      s = source.base64 || source.url || source.src || source.image || '';
    }
    if (!s) {
      console.log('createImagePaintFromSource: no valid source string found', source);
      return null;
    }
    
    console.log('createImagePaintFromSource: processing source, length:', s.length, 'starts with:', s.substring(0, 50));

    if (s.startsWith('data:image/')) {
      const comma = s.indexOf(',');
      const b64 = s.substring(comma + 1);
      console.log('createImagePaintFromSource: extracting base64 from data URL, base64 length:', b64.length);
      bytes = base64ToBytes(b64);
      console.log('createImagePaintFromSource: decoded bytes length:', bytes ? bytes.length : 0);
    } else if (/^[A-Za-z0-9+/=]+$/.test(s) && s.length > 32) {
      console.log('createImagePaintFromSource: treating as raw base64, length:', s.length);
      bytes = base64ToBytes(s);
      console.log('createImagePaintFromSource: decoded bytes length:', bytes ? bytes.length : 0);
    } else if (/^https?:\/\//i.test(s)) {
      console.log('createImagePaintFromSource: fetching from URL:', s);
      const res = await fetch(s);
      const buf = await res.arrayBuffer();
      bytes = new Uint8Array(buf);
      console.log('createImagePaintFromSource: fetched bytes length:', bytes.length);
    }
    if (!bytes || bytes.length === 0) {
      console.log('createImagePaintFromSource: no bytes extracted');
      return null;
    }
    console.log('createImagePaintFromSource: creating Figma image from', bytes.length, 'bytes');
    const image = figma.createImage(bytes);
    console.log('createImagePaintFromSource: created image with hash:', image.hash);
    const paint = {
      type: 'IMAGE',
      imageHash: image.hash,
      scaleMode: 'FILL',
      visible: true,
    };
    console.log('createImagePaintFromSource: returning paint:', paint);
    return paint;
  } catch (e) {
    console.log('createImagePaintFromSource error', e);
    if (e.message) console.log('Error message:', e.message);
    if (e.stack) console.log('Error stack:', e.stack);
    return null;
  }
}

function base64ToBytes(b64) {
  try {
    if (!b64 || typeof b64 !== 'string') {
      console.log('base64ToBytes: invalid input');
      return new Uint8Array();
    }
    
    // Try atob first (if available in browser-like environment)
    if (typeof atob === 'function') {
      console.log('base64ToBytes: using atob, base64 length:', b64.length);
      const binary = atob(b64);
      console.log('base64ToBytes: decoded binary length:', binary.length);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      console.log('base64ToBytes: created Uint8Array, length:', bytes.length);
      return bytes;
    }
    
    // Manual base64 decoding for Figma plugin environment
    console.log('base64ToBytes: atob not available, using manual base64 decode, length:', b64.length);
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const base64Lookup = {};
    for (let i = 0; i < base64Chars.length; i++) {
      base64Lookup[base64Chars[i]] = i;
    }
    
    // Remove padding
    let cleanB64 = b64.replace(/[^A-Za-z0-9+/]/g, '');
    const padding = (cleanB64.match(/=+$/) || [''])[0].length;
    cleanB64 = cleanB64.replace(/=+$/, '');
    
    const outputLength = Math.floor((cleanB64.length * 3) / 4) - (padding > 0 ? 1 : 0);
    const bytes = new Uint8Array(outputLength);
    
    let byteIndex = 0;
    for (let i = 0; i < cleanB64.length; i += 4) {
      const enc1 = base64Lookup[cleanB64[i]] || 0;
      const enc2 = base64Lookup[cleanB64[i + 1]] || 0;
      const enc3 = base64Lookup[cleanB64[i + 2]] || 0;
      const enc4 = base64Lookup[cleanB64[i + 3]] || 0;
      
      const bitmap = (enc1 << 18) | (enc2 << 12) | (enc3 << 6) | enc4;
      
      if (byteIndex < outputLength) bytes[byteIndex++] = (bitmap >> 16) & 255;
      if (byteIndex < outputLength) bytes[byteIndex++] = (bitmap >> 8) & 255;
      if (byteIndex < outputLength) bytes[byteIndex++] = bitmap & 255;
    }
    
    console.log('base64ToBytes: manual decode complete, bytes length:', bytes.length);
    return bytes;
  } catch (e) {
    console.log('base64ToBytes error', e);
    if (e.message) console.log('Error message:', e.message);
    if (e.stack) console.log('Error stack:', e.stack);
    return new Uint8Array();
  }
}

function setConstraints(node, constraints) {
  try {
    if (!constraints) return;
    const horiz = (constraints.horizontal || '').toUpperCase();
    const vert = (constraints.vertical || '').toUpperCase();
    const horizontal =
      horiz === 'MIN' ? 'MIN' : horiz === 'MAX' ? 'MAX' : horiz === 'STRETCH' ? 'STRETCH' : 'MIN';
    const vertical =
      vert === 'MIN' ? 'MIN' : vert === 'MAX' ? 'MAX' : vert === 'STRETCH' ? 'STRETCH' : 'MIN';
    node.constraints = { horizontal, vertical };
  } catch (e) {
    console.log('setConstraints error', e);
  }
}

function setCornerRadius(node, corner) {
  try {
    if (corner == null) return;
    if ('cornerRadius' in node) {
      if (typeof corner === 'number') {
        node.cornerRadius = corner;
      } else if (typeof corner === 'object') {
        if ('topLeftRadius' in node) {
          node.topLeftRadius = (corner.topLeft != null) ? corner.topLeft : ((node.topLeftRadius != null) ? node.topLeftRadius : 0);
          node.topRightRadius = (corner.topRight != null) ? corner.topRight : ((node.topRightRadius != null) ? node.topRightRadius : 0);
          node.bottomRightRadius = (corner.bottomRight != null) ? corner.bottomRight : ((node.bottomRightRadius != null) ? node.bottomRightRadius : 0);
          node.bottomLeftRadius = (corner.bottomLeft != null) ? corner.bottomLeft : ((node.bottomLeftRadius != null) ? node.bottomLeftRadius : 0);
        } else {
          node.cornerRadius =
            firstDefined(corner.topLeft, corner.topRight, corner.bottomRight, corner.bottomLeft, 0);
        }
      }
    }
  } catch (e) {
    console.log('setCornerRadius error', e);
  }
}

async function setFills(node, fills) {
  try {
    if (fills == null) {
      console.log('setFills: fills is null/undefined for node:', node.name);
      return;
    }
    console.log('setFills: processing fills for node:', node.name, 'fills:', fills);
    const arr = Array.isArray(fills) ? fills : [fills];
    const out = [];
    for (const f of arr) {
      const t = ((f && f.type) ? f.type : '').toUpperCase();
      console.log('setFills: processing fill, type:', t, 'fill object:', f);
      if (t === 'IMAGE' || (f && (f.image || f.base64 || f.url))) {
        // Handle different image source formats:
        // 1. f.image is an object with base64 property: { image: { base64: "..." } }
        // 2. f.image is a string: { image: "..." }
        // 3. f.url is a string: { url: "..." }
        // 4. f.base64 is a string: { base64: "..." }
        let src = null;
        if (f && f.image) {
          if (typeof f.image === 'object' && f.image.base64) {
            // Case 1: f.image is { base64: "..." }
            src = f.image.base64;
            console.log('setFills: found image.base64, length:', src ? src.length : 0);
          } else if (typeof f.image === 'string') {
            // Case 2: f.image is a string
            src = f.image;
            console.log('setFills: found image as string, length:', src ? src.length : 0);
          }
        }
        if (!src && f && f.url) {
          // Case 3: f.url is a string
          src = f.url;
          console.log('setFills: found url, length:', src ? src.length : 0);
        }
        if (!src && f && f.base64) {
          // Case 4: f.base64 is a string
          src = f.base64;
          console.log('setFills: found base64, length:', src ? src.length : 0);
        }
        if (!src) {
          // Fallback: use f itself
          src = f;
          console.log('setFills: using fallback source');
        }
        console.log('setFills: calling createImagePaintFromSource with source type:', typeof src);
        const p = await createImagePaintFromSource(src);
        if (p) {
          console.log('setFills: created image paint successfully');
          // Preserve scaleMode if present
          if (f && f.scaleMode && (f.scaleMode === 'FILL' || f.scaleMode === 'FIT' || f.scaleMode === 'CROP' || f.scaleMode === 'TILE')) {
            p.scaleMode = f.scaleMode;
            console.log('setFills: set scaleMode to:', p.scaleMode);
          }
          out.push(p);
        } else {
          console.log('setFills: createImagePaintFromSource returned null');
        }
      } else {
        const p = toSolidPaint(f);
        if (p) out.push(p);
      }
    }
    if ('fills' in node && out.length) {
      console.log('setFills: setting', out.length, 'fills on node:', node.name);
      node.fills = out;
      console.log('setFills: fills set successfully, node.fills:', node.fills);
    } else {
      console.log('setFills: not setting fills - node has fills?', 'fills' in node, 'out.length:', out.length);
    }
  } catch (e) {
    console.log('setFills error', e);
    if (e.message) console.log('Error message:', e.message);
    if (e.stack) console.log('Error stack:', e.stack);
  }
}

function setStrokes(node, strokes, strokeWeight) {
  try {
    // If both strokes and strokeWeight are null/undefined, don't set anything
    if (strokes == null && strokeWeight == null) return;
    
    const arr = Array.isArray(strokes) ? strokes : strokes ? [strokes] : [];
    const out = [];
    for (const s of arr) {
      const p = toSolidPaint(s);
      if (p) out.push(p);
    }
    
    // Only set strokes and strokeWeight if strokes array is not empty
    // If strokes is empty or missing but strokeWeight exists, clear strokes to prevent default black stroke
    if ('strokes' in node) {
      if (out.length > 0) {
        node.strokes = out;
        // Only set strokeWeight if we have strokes
        if ('strokeWeight' in node && typeof strokeWeight === 'number') {
          node.strokeWeight = strokeWeight;
        }
      } else {
        // If strokes is empty or missing (even if strokeWeight exists), clear strokes
        // This is important for VECTOR nodes that have strokeWeight but no strokes in JSON
        // Explicitly set empty array to remove any default strokes
        node.strokes = [];
        // Also clear strokeWeight if strokes are empty
        if ('strokeWeight' in node) {
          node.strokeWeight = 0;
        }
      }
    }
  } catch (e) {
    console.log('setStrokes error', e);
  }
}

function setOpacity(node, opacity) {
  try {
    if (opacity == null) return;
    node.opacity = clamp01(opacity);
  } catch (e) {
    console.log('setOpacity error', e);
  }
}

function setTransformAndSize(node, n, parent, parentJson) {
  try {
    const x = typeof n.x === 'number' ? n.x : undefined;
    const y = typeof n.y === 'number' ? n.y : undefined;
    if (x != null && y != null) {
      const p = parent;
      // Check parent's Auto Layout status from both the node and JSON
      // Prefer JSON layout info as it's more reliable (node might not have layout applied yet)
      const parentJsonLayout = parentJson && parentJson.layout ? parentJson.layout : null;
      const parentJsonLayoutMode = parentJsonLayout ? (parentJsonLayout.layoutMode || parentJsonLayout.mode) : null;
      const parentLayoutMode = p && 'layoutMode' in p ? p.layoutMode : null;
      
      // Determine if parent has Auto Layout - prefer JSON info
      const parentIsAuto = (parentJsonLayoutMode && parentJsonLayoutMode !== 'NONE') ||
                           (parentLayoutMode && parentLayoutMode !== 'NONE');
      
      console.log('setTransformAndSize for', node.name, ':', {
        x, y,
        parentName: p ? p.name : 'no parent',
        parentLayoutMode,
        parentJsonLayoutMode,
        parentIsAuto,
        parentHasLayout: !!parentJsonLayout,
        parentJsonLayout: parentJsonLayout
      });
      
      const isFixedOrAbsolute = n.position === 'fixed' || n.position === 'absolute';
      // Check if parent JSON has _ignoreChildrenXY flag (for button-like frames)
      const shouldIgnoreXY = parentJson && parentJson._ignoreChildrenXY;
      
      // Get parent padding (if any) - check both node and JSON
      // Prefer JSON layout info as it's more reliable
      let parentPaddingLeft = 0;
      let parentPaddingTop = 0;
      
      // First check parent JSON layout (most reliable)
      if (parentJsonLayout) {
        if (typeof parentJsonLayout.paddingLeft === 'number') {
          parentPaddingLeft = parentJsonLayout.paddingLeft;
        } else if (typeof parentJsonLayout.padding === 'object' && parentJsonLayout.padding && typeof parentJsonLayout.padding.left === 'number') {
          parentPaddingLeft = parentJsonLayout.padding.left;
        } else if (typeof parentJsonLayout.padding === 'number') {
          parentPaddingLeft = parentJsonLayout.padding;
        }
        
        if (typeof parentJsonLayout.paddingTop === 'number') {
          parentPaddingTop = parentJsonLayout.paddingTop;
        } else if (typeof parentJsonLayout.padding === 'object' && parentJsonLayout.padding && typeof parentJsonLayout.padding.top === 'number') {
          parentPaddingTop = parentJsonLayout.padding.top;
        } else if (typeof parentJsonLayout.padding === 'number') {
          parentPaddingTop = parentJsonLayout.padding;
        }
      }
      
      // Fallback to parent node properties if JSON doesn't have it
      if (p && parentPaddingLeft === 0 && 'paddingLeft' in p && typeof p.paddingLeft === 'number') {
        parentPaddingLeft = p.paddingLeft;
      }
      if (p && parentPaddingTop === 0 && 'paddingTop' in p && typeof p.paddingTop === 'number') {
        parentPaddingTop = p.paddingTop;
      }
      
      console.log('setTransformAndSize padding:', {
        parentPaddingLeft,
        parentPaddingTop,
        shouldIgnoreXY,
        isFixedOrAbsolute
      });
      
      // For Auto Layout parents, Figma automatically positions children
      // We should NOT set x/y for children in Auto Layout parents (except for absolute/fixed positioning)
      // For non-Auto Layout parents, x/y in JSON are relative to parent's content box (after padding)
      // Figma node.x/y are relative to parent's border box (before padding)
      // So we need to add parent's padding to convert from content box to border box
      
      // Check if parent is a grid layout (Auto Layout disabled but children need positioning)
      const parentIsGridLayout = parentJson && parentJson._isGridLayout;
      
      if ((!parentIsAuto || parentIsGridLayout) && !shouldIgnoreXY) {
        // Non-Auto Layout parent or grid layout: x/y in JSON are relative to parent's content box
        // Add padding to convert to border box coordinates
        const finalX = x + parentPaddingLeft;
        const finalY = y + parentPaddingTop;
        console.log('setTransformAndSize: setting position for non-Auto Layout parent (or grid layout):', {
          originalX: x,
          originalY: y,
          finalX,
          finalY,
          addedPadding: { left: parentPaddingLeft, top: parentPaddingTop },
          isGridLayout: parentIsGridLayout
        });
        node.x = finalX;
        node.y = finalY;
      } else if (parentIsAuto && isFixedOrAbsolute && !shouldIgnoreXY) {
        // Fixed/absolute positioned elements in Auto Layout parents
        // These need explicit positioning relative to parent's border box
        const finalX = x + parentPaddingLeft;
        const finalY = y + parentPaddingTop;
        console.log('setTransformAndSize: setting position for absolute/fixed in Auto Layout parent:', {
          originalX: x,
          originalY: y,
          finalX,
          finalY
        });
        node.x = finalX;
        node.y = finalY;
      } else if (parentIsAuto && !shouldIgnoreXY) {
        // For Auto Layout parents with normal children: do NOT set x/y
        // Figma will automatically position them based on Auto Layout rules
        console.log('setTransformAndSize: NOT setting position for Auto Layout parent child (will be auto-positioned)');
      } else if (shouldIgnoreXY) {
        console.log('setTransformAndSize: NOT setting position (shouldIgnoreXY flag is set)');
      }
    }
    if (typeof n.rotation === 'number') {
      node.rotation = n.rotation;
    }
    const w = typeof n.width === 'number' ? Math.max(0.01, n.width) : undefined;
    const h = typeof n.height === 'number' ? Math.max(0.01, n.height) : undefined;
    
    // Generic size setting for all node types (no hard-coding)
    // Only TEXT nodes need special handling for textAutoResize
    const isText = (node.type === 'TEXT');
    
    if (isText) {
      // For TEXT nodes, respect textAutoResize setting
      if (w != null && 'textAutoResize' in node) {
        const textAutoResize = node.textAutoResize || 'HEIGHT';
        if (textAutoResize === 'HEIGHT' || textAutoResize === 'NONE') {
          // Only update width if it's different from current width
          if (Math.abs(node.width - w) > 0.1) {
            try {
              const currentHeight = node.height;
              if ('resizeWithoutConstraints' in node) {
                node.resizeWithoutConstraints(w, currentHeight);
              } else if ('width' in node && typeof node.width !== 'undefined') {
                node.width = w;
              }
            } catch (e) {
              console.log('Error updating text width:', e);
            }
          }
        }
        // For WIDTH_AND_HEIGHT, don't set size - let text auto-resize
      }
    } else {
      // For all other node types, set size generically
      // Try resizeWithoutConstraints first (works for most node types)
      if (w != null && h != null) {
        // Both width and height specified
        if ('resizeWithoutConstraints' in node) {
          try {
            node.resizeWithoutConstraints(w, h);
          } catch (e) {
            // Fallback: try setting width and height separately
            trySetNodeSize(node, w, h);
          }
        } else {
          // resizeWithoutConstraints not available, try direct assignment
          trySetNodeSize(node, w, h);
        }
      } else if (w != null) {
        // Only width specified
        if ('resizeWithoutConstraints' in node) {
          try {
            const currentHeight = node.height || (h != null ? h : 100);
            node.resizeWithoutConstraints(w, currentHeight);
          } catch (e) {
            trySetNodeSize(node, w, null);
          }
        } else {
          trySetNodeSize(node, w, null);
        }
      } else if (h != null) {
        // Only height specified
        if ('resizeWithoutConstraints' in node) {
          try {
            const currentWidth = node.width || (w != null ? w : 100);
            node.resizeWithoutConstraints(currentWidth, h);
          } catch (e) {
            trySetNodeSize(node, null, h);
          }
        } else {
          trySetNodeSize(node, null, h);
        }
      }
    }
  } catch (e) {
    console.log('setTransformAndSize error', e);
    if (e.message) console.log('Error message:', e.message);
    if (e.stack) console.log('Error stack:', e.stack);
  }
}

// Helper function to set node size generically (works for all node types)
function trySetNodeSize(node, w, h) {
  try {
    if (w != null && 'width' in node && typeof node.width !== 'undefined') {
      try {
        node.width = w;
      } catch (e) {
        console.log('Error setting width for', node.type, ':', e);
      }
    }
    if (h != null && 'height' in node && typeof node.height !== 'undefined') {
      try {
        node.height = h;
      } catch (e) {
        console.log('Error setting height for', node.type, ':', e);
      }
    }
  } catch (e) {
    console.log('Error in trySetNodeSize for', node.type, ':', e);
  }
}

function applyAutoLayout(node, layout, json) {
  try {
    if (!layout) return;
    if (!('layoutMode' in node)) return;
    const modeRaw = (layout.mode || layout.layoutMode || '').toString().toUpperCase();
    const mode =
      modeRaw === 'HORIZONTAL'
        ? 'HORIZONTAL'
        : modeRaw === 'VERTICAL'
        ? 'VERTICAL'
        : layout.enabled
        ? (layout.direction || '').toUpperCase() === 'HORIZONTAL'
          ? 'HORIZONTAL'
          : 'VERTICAL'
        : 'NONE';
    node.layoutMode = mode;
    console.log('applyAutoLayout for', node.name, ': set layoutMode to', mode, 'from', modeRaw);
    if (typeof layout.itemSpacing === 'number') {
      node.itemSpacing = layout.itemSpacing;
    }
    // Handle padding - check multiple sources in priority order
    const p = layout.padding || layout.paddingAll;
    
    // First, try to set from individual padding properties (highest priority)
    if (typeof layout.paddingTop === 'number') node.paddingTop = layout.paddingTop;
    if (typeof layout.paddingRight === 'number') node.paddingRight = layout.paddingRight;
    if (typeof layout.paddingBottom === 'number') node.paddingBottom = layout.paddingBottom;
    if (typeof layout.paddingLeft === 'number') node.paddingLeft = layout.paddingLeft;
    
    // Then, override with padding object if it exists
    if (typeof p === 'number') {
      node.paddingTop = node.paddingRight = node.paddingBottom = node.paddingLeft = p;
      console.log('applyAutoLayout for', node.name, ': set all padding to', p);
    } else if (p && typeof p === 'object') {
      if (typeof p.top === 'number') node.paddingTop = p.top;
      if (typeof p.right === 'number') node.paddingRight = p.right;
      if (typeof p.bottom === 'number') node.paddingBottom = p.bottom;
      if (typeof p.left === 'number') node.paddingLeft = p.left;
      console.log('applyAutoLayout for', node.name, ': set padding from object', {
        top: node.paddingTop,
        right: node.paddingRight,
        bottom: node.paddingBottom,
        left: node.paddingLeft
      });
    } else {
      // Individual properties were already set above
      console.log('applyAutoLayout for', node.name, ': set padding from layout properties', {
        top: node.paddingTop,
        right: node.paddingRight,
        bottom: node.paddingBottom,
        left: node.paddingLeft,
        layoutPaddingTop: layout.paddingTop,
        layoutPaddingLeft: layout.paddingLeft
      });
    }
    const primary = (layout.primaryAxisSizingMode || layout.primarySizing || '').toString().toUpperCase();
    const counter = (layout.counterAxisSizingMode || layout.counterSizing || '').toString().toUpperCase();
    if (primary === 'FILL' || primary === 'HUG' || primary === 'FIXED') {
      node.primaryAxisSizingMode = primary;
    }
    if (counter === 'FILL' || counter === 'HUG' || counter === 'FIXED') {
      node.counterAxisSizingMode = counter;
    }
    // Set alignment for better text centering in buttons and containers
    if (layout.primaryAxisAlignItems) {
      const align = (layout.primaryAxisAlignItems || '').toString().toUpperCase();
      if (align === 'CENTER' || align === 'SPACE_BETWEEN' || align === 'SPACE_AROUND' || align === 'MIN' || align === 'MAX') {
        node.primaryAxisAlignItems = align;
        console.log('applyAutoLayout for', node.name, ': set primaryAxisAlignItems to', align);
      }
    }
    if (layout.counterAxisAlignItems) {
      const align = (layout.counterAxisAlignItems || '').toString().toUpperCase();
      if (align === 'CENTER' || align === 'MIN' || align === 'MAX' || align === 'STRETCH') {
        node.counterAxisAlignItems = align;
        console.log('applyAutoLayout for', node.name, ': set counterAxisAlignItems to', align);
      }
    }
    // If this is a button-like frame (has fills, cornerRadius, and single text child), center align by default
    if (mode !== 'NONE' && json && json.fills && json.cornerRadius != null) {
      const hasSingleTextChild = json.children && json.children.length === 1 && json.children[0] && json.children[0].type === 'TEXT';
      if (hasSingleTextChild) {
        try {
          node.primaryAxisAlignItems = 'CENTER';
          node.counterAxisAlignItems = 'CENTER';
        } catch (e) {
          // Ignore errors
        }
      }
    }
  } catch (e) {
    console.log('applyAutoLayout error', e);
  }
}

async function ensureFont(fontName) {
  const fallback = { family: 'Roboto', style: 'Regular' };
  try {
    if (!fontName) {
      await figma.loadFontAsync(fallback);
      return fallback;
    }
    const toLoad = fontName;
    // Try to load the specified font
    await figma.loadFontAsync(toLoad);
    return toLoad;
  } catch (e) {
    console.log('loadFont failed, trying fallbacks', e);
    // Try common Japanese font fallbacks
    const fallbacks = [
      { family: 'Noto Sans JP', style: 'Regular' },
      { family: 'Hiragino Sans', style: 'W3' },
      { family: 'Yu Gothic', style: 'Regular' },
      { family: 'Meiryo', style: 'Regular' },
      { family: 'MS Gothic', style: 'Regular' },
      fallback
    ];
    for (const fb of fallbacks) {
      try {
        await figma.loadFontAsync(fb);
        return fb;
      } catch (err) {
        // Continue to next fallback
      }
    }
    // Last resort: use Roboto
    try {
      await figma.loadFontAsync(fallback);
      return fallback;
    } catch (err) {
      console.log('All font loading failed', err);
      return fallback;
    }
  }
}

const componentRegistryByKey = new Map();
const componentRegistryByName = new Map();

function registerComponent(node, json) {
  if (node.type !== 'COMPONENT') return;
  if (json.componentKey) componentRegistryByKey.set(json.componentKey, node);
  if (json.name) componentRegistryByName.set(json.name, node);
  if (json.componentName) componentRegistryByName.set(json.componentName, node);
}

function createFallbackFrame(name) {
  const frame = figma.createFrame();
  frame.name = name ? `Unsupported: ${name}` : 'Unsupported';
  frame.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.4, b: 0.4 }, opacity: 0.1 }];
  frame.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.2, b: 0.2 } }];
  frame.strokeWeight = 1;
  frame.resizeWithoutConstraints(120, 80);
  return frame;
}

// ---------------------------------------------------------------------------
// Compatibility: convert extractor.js JSON into builder schema
// ---------------------------------------------------------------------------

function isExtractorBundle(json) {
  try {
    return json && typeof json === 'object' && (json.root || Array.isArray(json.roots)) && (json.version != null);
  } catch (e) {
    return false;
  }
}

function makeNameFromDomMeta(n) {
  try {
    const t = n && n.tag ? String(n.tag).toLowerCase() : (n && n.type) || 'node';
    const id = n && n.id ? `#${n.id}` : '';
    const cls = n && n.class ? `.${String(n.class).toString().split(/\s+/).filter(Boolean).join('.')}` : '';
    return `${t}${id}${cls}`.slice(0, 200);
  } catch (e) {
    return (n && (n.name || n.type)) || 'node';
  }
}

function convertPaddingArrayToObj(padArr) {
  try {
    if (!Array.isArray(padArr) || padArr.length < 4) return null;
    return { top: padArr[0] || 0, right: padArr[1] || 0, bottom: padArr[2] || 0, left: padArr[3] || 0 };
  } catch (e) {
    return null;
  }
}

function buildLayoutFromComputed(c, children) {
  if (!c) return null;
  const mode = (c.layoutMode || '').toString().toUpperCase();
  const display = (c.display || '').toLowerCase();
  const itemSpacing = (typeof c.gap === 'number') ? c.gap : undefined;
  const pad = convertPaddingArrayToObj(c.padding);
  const layout = {};
  
  // If explicit flex layout mode, use it
  if (mode === 'HORIZONTAL' || mode === 'VERTICAL') {
    layout.layoutMode = mode;
  } else if (display === 'flex' || display === 'inline-flex') {
    // Infer from flex-direction
    const flexDir = (c.flexDirection || '').toLowerCase();
    layout.layoutMode = flexDir === 'column' ? 'VERTICAL' : 'HORIZONTAL';
  }
  // Don't auto-infer layout for block elements - let Figma handle positioning naturally
  // Auto-inference was causing incorrect layouts
  
  if (typeof itemSpacing === 'number') layout.itemSpacing = itemSpacing;
  if (pad) {
    layout.paddingTop = pad.top;
    layout.paddingRight = pad.right;
    layout.paddingBottom = pad.bottom;
    layout.paddingLeft = pad.left;
  }
  return Object.keys(layout).length ? layout : null;
}

function solidPaintFromHex(hex, fallbackOpacity) {
  const rgba = parseHexToRgba(hex);
  if (!rgba) return null;
  return {
    type: 'SOLID',
    color: { r: rgba.r, g: rgba.g, b: rgba.b },
    opacity: (typeof rgba.a === 'number') ? rgba.a : (typeof fallbackOpacity === 'number' ? fallbackOpacity : 1),
  };
}

function transformExtractorNode(n) {
  return transformExtractorNodeWithParent(n, null);
}

function transformExtractorNodeWithParent(n, parentAbs, parentNode) {
  if (!n || typeof n !== 'object') return null;
  const out = {};
  out.type = ((n.type || '') + '').toUpperCase() || 'FRAME';
  out.name = n.name || makeNameFromDomMeta(n);
  // geometry: convert absolute (page) coords to parent-relative
  const absX = (typeof n.x === 'number') ? n.x : null;
  const absY = (typeof n.y === 'number') ? n.y : null;
  const parentX = (parentAbs && typeof parentAbs.x === 'number') ? parentAbs.x : 0;
  const parentY = (parentAbs && typeof parentAbs.y === 'number') ? parentAbs.y : 0;
  const parentComputed = parentNode && parentNode.computed ? parentNode.computed : null;
  const parentDisplay = parentComputed && typeof parentComputed.display === 'string'
    ? parentComputed.display.toLowerCase()
    : null;
  const parentIsAuto = parentDisplay === 'flex' || parentDisplay === 'inline-flex';
  // Calculate parent's content box offset (padding only for auto-layout)
  const parentPadTop = parentComputed && Array.isArray(parentComputed.padding) ? (parentComputed.padding[0] || 0) : 0;
  const parentPadLeft = parentComputed && Array.isArray(parentComputed.padding) ? (parentComputed.padding[3] || 0) : 0;
  const c = n.computed || {};
  const position = c.position ? String(c.position).toLowerCase() : 'static';
  const isFixedOrAbsolute = position === 'fixed' || position === 'absolute';
  // Simple relative position calculation:
  // getBoundingClientRect() already accounts for margins, so we just need to subtract parent position
  // For auto-layout parents, Figma handles padding automatically, so subtract it here
  // For non-auto-layout, position is relative to parent's border box (no padding subtraction)
  if (absX != null) {
    if (isFixedOrAbsolute && parentAbs) {
      // Fixed/absolute: keep relative to parent's origin
      out.x = Math.round(absX - parentX);
    } else {
      // Static/relative: subtract parent position and padding (if auto-layout)
      out.x = Math.round(absX - parentX - (parentIsAuto ? parentPadLeft : 0));
    }
  }
  if (absY != null) {
    if (isFixedOrAbsolute && parentAbs) {
      out.y = Math.round(absY - parentY);
    } else {
      out.y = Math.round(absY - parentY - (parentIsAuto ? parentPadTop : 0));
    }
  }
  // Store position info for later use
  if (isFixedOrAbsolute) out.position = position;
  if (typeof n.width === 'number') out.width = Math.max(0.01, Math.round(n.width));
  if (typeof n.height === 'number') out.height = Math.max(0.01, Math.round(n.height));
  if (typeof n.rotation === 'number') out.rotation = n.rotation;
  // text
  if (out.type === 'TEXT') {
    if (typeof n.text !== 'undefined') out.text = String(n.text);
    // Prefer leaf TEXT: do not generate children for inline text nodes
    out.children = [];
    if (typeof c.fontSize === 'number') out.fontSize = c.fontSize;
    if (typeof c.lineHeight === 'number') out.lineHeight = c.lineHeight;
    if (typeof c.textAlign === 'string') out.textAlign = c.textAlign;
    if (typeof c.fontFamily === 'string' && c.fontFamily) {
      // Extract font family name (first font in comma-separated list)
      const fontName = c.fontFamily.split(',')[0].trim().replace(/['"]/g, '');
      out.fontName = { family: fontName, style: 'Regular' };
    }
    if (typeof c.letterSpacing === 'number') out.letterSpacing = c.letterSpacing;
    if (typeof c.textDecoration === 'string' && c.textDecoration) {
      // Map text-decoration to Figma textStyleId or manual styling
      if (c.textDecoration.includes('underline')) out.textDecoration = 'UNDERLINE';
      else if (c.textDecoration.includes('line-through')) out.textDecoration = 'STRIKETHROUGH';
    }
    if (c.color) {
      const fp = solidPaintFromHex(c.color, c.opacity);
      if (fp) out.fills = [fp];
    }
    // Let Figma auto-size text height by default
    out.textAutoResize = 'HEIGHT';
  }
  // fills from background-color / background-image
  const fills = [];
  if (c.backgroundColor) {
    const fp = solidPaintFromHex(c.backgroundColor, c.opacity);
    if (fp) fills.push(fp);
  }
  const img = n.image || {};
  if (img.backgroundUrl) {
    fills.push({ image: img.backgroundUrl });
  }
  if (fills.length) out.fills = fills;
  // image node direct
  if (out.type === 'IMAGE') {
    if (img && (img.url || img.base64)) {
      out.image = img.base64 ? { base64: img.base64 } : { url: img.url };
    }
  }
  // strokes (border width only; color not present in extractor)
  if (c && typeof c.borderRadius === 'number') {
    out.cornerRadius = c.borderRadius;
  }
  if (typeof c.opacity === 'number') {
    out.opacity = c.opacity;
  }
  // border -> strokes
  if (c && Array.isArray(c.border) && c.border.length === 4) {
    const w = Math.max(c.border[0] || 0, c.border[1] || 0, c.border[2] || 0, c.border[3] || 0);
    const col = c.borderColor || null;
    if (w > 0 && col) {
      const sp = solidPaintFromHex(col, c.opacity);
      if (sp) {
        out.strokes = [sp];
        out.strokeWeight = w;
      }
    }
  }
  // children
  const kids = Array.isArray(n.children) ? n.children : [];
  // Sort by z-index if available (ascending: lower first)
  const kidsSorted = kids.slice().sort((a, b) => {
    const ai = a && a.computed && typeof a.computed.zIndex === 'number' ? a.computed.zIndex : 0;
    const bi = b && b.computed && typeof b.computed.zIndex === 'number' ? b.computed.zIndex : 0;
    return ai - bi;
  });
  if (out.type !== 'TEXT') out.children = [];
  const nextParentAbs = {
    x: (typeof n.x === 'number') ? n.x : parentX,
    y: (typeof n.y === 'number') ? n.y : parentY
  };
  for (const child of kidsSorted) {
    const t = transformExtractorNodeWithParent(child, nextParentAbs, n);
    if (t && out.type !== 'TEXT') out.children.push(t);
  }
  // autolayout (after children are processed to infer layout from positions)
  const layout = buildLayoutFromComputed(c, out.children);
  if (layout) out.layout = layout;
  
  // Adjust frame size based on children if needed (for better bounds)
  if (out.type !== 'TEXT' && Array.isArray(out.children) && out.children.length > 0) {
    const childBounds = out.children
      .filter(ch => ch && typeof ch.x === 'number' && typeof ch.y === 'number' && typeof ch.width === 'number' && typeof ch.height === 'number')
      .map(ch => ({
        left: ch.x,
        top: ch.y,
        right: ch.x + ch.width,
        bottom: ch.y + ch.height
      }));
    if (childBounds.length > 0) {
      const minX = Math.min(...childBounds.map(b => b.left));
      const minY = Math.min(...childBounds.map(b => b.top));
      const maxX = Math.max(...childBounds.map(b => b.right));
      const maxY = Math.max(...childBounds.map(b => b.bottom));
      const computedWidth = maxX - minX;
      const computedHeight = maxY - minY;
      // Use computed size if it's larger than current size (to include all children)
      // But only if current size seems too small (less than 1.2x computed)
      if (typeof out.width === 'number' && typeof out.height === 'number') {
        const pad = c.padding && Array.isArray(c.padding) ? {
          top: c.padding[0] || 0,
          right: c.padding[1] || 0,
          bottom: c.padding[2] || 0,
          left: c.padding[3] || 0
        } : { top: 0, right: 0, bottom: 0, left: 0 };
        const border = c.border && Array.isArray(c.border) ? {
          top: c.border[0] || 0,
          right: c.border[1] || 0,
          bottom: c.border[2] || 0,
          left: c.border[3] || 0
        } : { top: 0, right: 0, bottom: 0, left: 0 };
        const neededWidth = computedWidth + pad.left + pad.right + border.left + border.right;
        const neededHeight = computedHeight + pad.top + pad.bottom + border.top + border.bottom;
        // Expand frame if children extend beyond current bounds
        if (neededWidth > out.width * 0.9) {
          out.width = Math.max(out.width, neededWidth);
        }
        if (neededHeight > out.height * 0.9) {
          out.height = Math.max(out.height, neededHeight);
        }
      }
    }
  }
  // Prune non-text nodes that have no area, no fills, and no children
  const hasArea = typeof out.width === 'number' && typeof out.height === 'number' && (out.width > 0 && out.height > 0);
  const hasFills = Array.isArray(out.fills) && out.fills.length > 0;
  const hasKids = Array.isArray(out.children) && out.children.length > 0;
  if (out.type !== 'TEXT' && !hasArea && !hasFills && !hasKids) {
    return null;
  }
  return out;
}

function convertExtractorBundle(bundle) {
  try {
    if (bundle && Array.isArray(bundle.roots) && bundle.roots.length) {
      const out = [];
      for (const r of bundle.roots) {
        const t = transformExtractorNode(r);
        if (t) out.push(t);
      }
      return out;
    }
    const root = bundle && bundle.root ? bundle.root : null;
    if (root) {
      const transformed = transformExtractorNode(root);
      return transformed ? [transformed] : [];
    }
    return [];
  } catch (e) {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Node builder
// ---------------------------------------------------------------------------

async function buildNode(json, parent, parentJson) {
  let node = null;
  const type = (json.type || '').toString().toUpperCase();
  const name = json.name || json.componentName || type || 'Node';
  try {
    switch (type) {
      case 'FRAME': {
        node = figma.createFrame();
        // Set clipping - prefer explicit clipsContent property, fallback to overflow-based inference
        if ('clipsContent' in node) {
          if (typeof json.clipsContent === 'boolean') {
            // Use explicit clipsContent value from JSON
            node.clipsContent = json.clipsContent;
          } else {
            // Fallback: infer from overflow property if available
            const overflow = json.computed && json.computed.overflow ? String(json.computed.overflow).toLowerCase() : null;
            const overflowX = json.computed && json.computed.overflowX ? String(json.computed.overflowX).toLowerCase() : null;
            const overflowY = json.computed && json.computed.overflowY ? String(json.computed.overflowY).toLowerCase() : null;
            const shouldClip = overflow === 'hidden' || overflow === 'scroll' || 
                              overflowX === 'hidden' || overflowX === 'scroll' ||
                              overflowY === 'hidden' || overflowY === 'scroll';
            node.clipsContent = shouldClip;
          }
        }
        // If this frame has layout and only one child (likely a button with text), ensure proper alignment
        if (json.layout && json.children && json.children.length === 1) {
          // This will be set in applyAutoLayout, but we ensure it's a button-like structure
        }
        break;
      }
      case 'COMPONENT': {
        node = figma.createComponent();
        // Set clipping - prefer explicit clipsContent property, default to false
        if ('clipsContent' in node) {
          node.clipsContent = typeof json.clipsContent === 'boolean' ? json.clipsContent : false;
        }
        break;
      }
      case 'INSTANCE': {
        let inst = null;
        // Try to find component by key first (most reliable)
        if (json.componentKey && componentRegistryByKey.has(json.componentKey)) {
          const comp = componentRegistryByKey.get(json.componentKey);
          inst = comp.createInstance();
        } else if (json.componentName && componentRegistryByName.has(json.componentName)) {
          // Try by name
          const comp = componentRegistryByName.get(json.componentName);
          inst = comp.createInstance();
        } else {
          // Component not found - create a frame with the same structure
          // This preserves the visual appearance even if the component is missing
          node = figma.createFrame();
          // Mark as instance fallback so we can apply instance properties
          node.name = name;
        }
        if (inst) {
          node = inst;
          // For INSTANCE nodes, we need to apply layout settings if they differ from the component
          // Note: INSTANCE nodes inherit layout from their component, but we can override if needed
          // However, if the JSON has layout settings, we should apply them to ensure correctness
          if (json.layout && 'layoutMode' in node) {
            // Apply layout settings to the instance
            // This is important when the instance needs different layout than the component
            applyAutoLayout(node, json.layout, json);
          }
        }
        // Set clipping for INSTANCE (if it's a frame fallback, clipsContent will be set below)
        if (inst && 'clipsContent' in inst) {
          if (typeof json.clipsContent === 'boolean') {
            inst.clipsContent = json.clipsContent;
          }
        }
        break;
      }
      case 'TEXT': {
        const text = figma.createText();
        const font = await ensureFont(json.fontName);
        text.fontName = font;
        const content = (json && typeof json.characters !== 'undefined')
          ? json.characters
          : ((json && typeof json.text !== 'undefined') ? json.text : '');
        text.characters = String(content);
        
        // Set fontSize and other text properties BEFORE setting textAutoResize
        // This ensures proper text layout calculation
        if (typeof json.fontSize === 'number') text.fontSize = json.fontSize;
        if (typeof json.textAlign === 'string' && 'textAlignHorizontal' in text) {
          const a = json.textAlign.toLowerCase();
          text.textAlignHorizontal =
            a === 'center' ? 'CENTER' :
            a === 'right' ? 'RIGHT' :
            a === 'justify' ? 'JUSTIFIED' : 'LEFT';
        }
        if (json.lineHeight) {
          if (typeof json.lineHeight === 'number') {
            text.lineHeight = { unit: 'PIXELS', value: json.lineHeight };
          } else if (typeof json.lineHeight === 'object') {
            text.lineHeight = json.lineHeight;
          }
        }
        if (json.letterSpacing) {
          if (typeof json.letterSpacing === 'number') {
            text.letterSpacing = { unit: 'PIXELS', value: json.letterSpacing };
          } else if (typeof json.letterSpacing === 'object') {
            text.letterSpacing = json.letterSpacing;
          }
        }
        
        // Set width BEFORE textAutoResize to ensure proper text wrapping
        // If width is specified in JSON, set it first
        if (typeof json.width === 'number' && json.width > 0) {
          // For text nodes, we need to set width before textAutoResize
          // If textAutoResize is HEIGHT, we want to fix the width
          const textAutoResize = (json && json.textAutoResize) ? json.textAutoResize : 'HEIGHT';
          if (textAutoResize === 'HEIGHT' || textAutoResize === 'NONE') {
            // Set width before textAutoResize
            try {
              text.resizeWithoutConstraints(json.width, text.height || 100);
            } catch (e) {
              console.log('Error setting text width:', e);
            }
          }
        }
        
        // Now set textAutoResize (this will affect how text wraps)
        if ('textAutoResize' in text) {
          text.textAutoResize = (json && json.textAutoResize) ? json.textAutoResize : 'HEIGHT';
        }
        
        // Apply text decoration (underline, strikethrough)
        if (json.textDecoration && 'setRangeTextDecoration' in text) {
          try {
            if (json.textDecoration === 'UNDERLINE') {
              text.textDecoration = 'UNDERLINE';
            } else if (json.textDecoration === 'STRIKETHROUGH') {
              text.textDecoration = 'STRIKETHROUGH';
            }
          } catch (e) {
            // Fallback: use fills/strokes for decoration if API not available
            console.log('textDecoration not supported:', e);
          }
        }
        node = text;
        break;
      }
      case 'RECTANGLE': {
        node = figma.createRectangle();
        break;
      }
      case 'ELLIPSE': {
        node = figma.createEllipse();
        break;
      }
      case 'LINE': {
        node = figma.createLine();
        break;
      }
      case 'VECTOR': {
        const v = figma.createVector();
        // Clear strokes immediately after creation to prevent default black stroke
        // This is important because Figma may apply default strokes to new VECTOR nodes
        if ('strokes' in v) {
          v.strokes = [];
        }
        if ('strokeWeight' in v) {
          v.strokeWeight = 0;
        }
        // Set size first (if available) before setting vectorPaths
        // This ensures the vector has proper bounds
        if (typeof json.width === 'number' && typeof json.height === 'number') {
          try {
            v.resizeWithoutConstraints(json.width, json.height);
          } catch (e) {
            // If resize fails, try setting width/height directly
            try {
              if ('width' in v) v.width = json.width;
              if ('height' in v) v.height = json.height;
            } catch (e2) {
              console.log('Error setting VECTOR size:', e2);
            }
          }
        }
        // Set vectorPaths after size is set
        if (json.vectorPaths && Array.isArray(json.vectorPaths) && json.vectorPaths.length > 0) {
          try {
            v.vectorPaths = json.vectorPaths.map(path => ({
              data: path.data || '',
              windingRule: path.windingRule || 'NONZERO'
            }));
          } catch (e) {
            console.log('Error setting vectorPaths:', e);
          }
        } else if (json.path && typeof json.path === 'string') {
          try {
            v.vectorPaths = [{ data: json.path, windingRule: 'NONZERO' }];
          } catch (e) {
            console.log('Error setting vector path:', e);
          }
        }
        node = v;
        break;
      }
      case 'GROUP': {
        // Groups in Figma are created by grouping selected nodes
        // We'll create a frame first, then try to group children if possible
        // For now, create as frame but mark it as a group for later processing
        node = figma.createFrame();
        // Groups don't have auto-layout, so ensure layout is NONE
        if ('layoutMode' in node) {
          node.layoutMode = 'NONE';
        }
        // Groups don't clip content by default
        if ('clipsContent' in node) {
          node.clipsContent = false;
        }
        break;
      }
      case 'IMAGE': {
        const r = figma.createRectangle();
        const src = json.image || json.imageRef || json.fills;
        const imgPaint = await createImagePaintFromSource(src);
        if (imgPaint) {
          r.fills = [imgPaint];
        }
        node = r;
        break;
      }
      default: {
        node = createFallbackFrame(json.name || json.type);
        break;
      }
    }
  } catch (e) {
    console.log('create node error', type, e);
    node = createFallbackFrame(json.name || json.type);
  }

  try {
    node.name = name;
    if (json.visible === false) node.visible = false;
    // Handle fills: check json.fills first, then json.image/json.url as fallback
    if (json.fills) {
      console.log('buildNode: setting fills from json.fills for node:', node.name);
      await setFills(node, json.fills);
    } else if (json.image || json.url) {
      // If no fills but image/url exists at top level, create a fill from it
      console.log('buildNode: setting fills from json.image/json.url for node:', node.name);
      let imageSource = null;
      if (json.image) {
        if (typeof json.image === 'object' && json.image.base64) {
          // json.image is { base64: "..." }
          imageSource = json.image.base64;
        } else if (typeof json.image === 'string') {
          // json.image is a string
          imageSource = json.image;
        } else {
          imageSource = json.image;
        }
      } else if (json.url) {
        imageSource = json.url;
      }
      if (imageSource) {
        await setFills(node, imageSource);
      }
    } else {
      // If fills is missing or null, explicitly set empty fills array to prevent default white background
      // This is important for FRAME, COMPONENT, INSTANCE, RECTANGLE, ELLIPSE, VECTOR nodes
      if ('fills' in node && (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE' || 
          node.type === 'RECTANGLE' || node.type === 'ELLIPSE' || node.type === 'VECTOR')) {
        // Only clear fills if the node type supports fills and json.fills is explicitly missing
        // Don't clear if json.fills is an empty array (that would be handled by setFills)
        node.fills = [];
        console.log('buildNode: cleared fills for node:', node.name, 'to prevent default white background');
      }
    }
    // Only set strokes if strokes array exists in JSON
    // If strokes is missing but strokeWeight exists, don't set strokeWeight (prevents default black stroke)
    if (json.strokes !== undefined && json.strokes !== null) {
      setStrokes(node, json.strokes, json.strokeWeight);
    } else {
      // If strokes is missing or null, explicitly clear strokes to prevent default black stroke
      // This is critical for VECTOR nodes that may have strokeWeight but no strokes in JSON
      if ('strokes' in node) {
        node.strokes = [];
      }
      if ('strokeWeight' in node) {
        node.strokeWeight = 0;
      }
    }
    setCornerRadius(node, json.cornerRadius);
    setOpacity(node, json.opacity);
    setConstraints(node, json.constraints);
    
    // Set clipsContent for all node types that support it (FRAME, COMPONENT, INSTANCE)
    // This ensures clipsContent is applied even if it wasn't set during node creation
    if ('clipsContent' in node && typeof json.clipsContent === 'boolean') {
      node.clipsContent = json.clipsContent;
    }
    
    // Detect grid layout from children positions before applying Auto Layout
    // If children form a grid (multiple rows/columns), we should disable Auto Layout
    const childrenForGridCheck = Array.isArray(json.children) ? json.children : [];
    let isGridLayout = false;
    if (childrenForGridCheck.length > 1 && json.layout && (json.layout.layoutMode === 'HORIZONTAL' || json.layout.mode === 'HORIZONTAL')) {
      // Check if children have different y positions (indicating multiple rows)
      const yPositions = childrenForGridCheck
        .filter(child => typeof child.y === 'number')
        .map(child => Math.round(child.y * 100) / 100); // Round to 2 decimal places
      const uniqueYPositions = [...new Set(yPositions)];
      
      // More strict grid detection: require significant y-position differences
      // This avoids false positives from minor alignment differences in Auto Layout
      if (uniqueYPositions.length > 1) {
        // Sort y positions and check if the difference between rows is significant
        const sortedY = uniqueYPositions.sort((a, b) => a - b);
        const minY = sortedY[0];
        const maxY = sortedY[sortedY.length - 1];
        const yDifference = maxY - minY;
        
        // Get the first child's height to estimate row spacing
        const firstChild = childrenForGridCheck.find(child => typeof child.y === 'number' && typeof child.height === 'number');
        const estimatedRowHeight = firstChild ? firstChild.height : 0;
        
        // Only consider it a grid if:
        // 1. There are at least 2 unique y positions
        // 2. The y difference is significant (at least 50% of estimated row height, or at least 50 pixels)
        // This prevents false positives from minor alignment differences
        const isSignificantDifference = yDifference > Math.max(estimatedRowHeight * 0.5, 50);
        
        if (isSignificantDifference) {
          isGridLayout = true;
          console.log('Detected grid layout for', node.name, ':', uniqueYPositions.length, 'rows, y difference:', yDifference);
          // Disable Auto Layout for grid layouts
          if ('layoutMode' in node) {
            node.layoutMode = 'NONE';
          }
        } else {
          console.log('Not a grid layout for', node.name, '- y difference too small:', yDifference, 'estimated row height:', estimatedRowHeight);
        }
      }
    }
    
    // Apply Auto Layout only if it's not a grid layout
    if (!isGridLayout) {
      applyAutoLayout(node, json.layout, json);
    } else {
      // For grid layouts, still apply padding if specified
      if (json.layout) {
        const layout = json.layout;
        if (typeof layout.paddingTop === 'number') node.paddingTop = layout.paddingTop;
        if (typeof layout.paddingRight === 'number') node.paddingRight = layout.paddingRight;
        if (typeof layout.paddingBottom === 'number') node.paddingBottom = layout.paddingBottom;
        if (typeof layout.paddingLeft === 'number') node.paddingLeft = layout.paddingLeft;
      }
    }
    
    // For nodes with Auto Layout and children with x/y, we need to handle positioning differently
    const hasAutoLayout = !isGridLayout && json.layout && json.layout.mode && json.layout.mode !== 'NONE';
    const isButtonLike = json.fills && json.cornerRadius != null;
    
    // Store information about whether to ignore x/y for children
    // This will be used when processing children
    if (hasAutoLayout && isButtonLike) {
      // Button-like frames with Auto Layout should center children, ignore x/y
      json._ignoreChildrenXY = true;
    }
    
    // For grid layouts, we need to set children positions explicitly
    if (isGridLayout) {
      json._isGridLayout = true;
    }
    
    // For GROUP nodes, don't set transform/size yet (will be set after grouping)
    if (json.type !== 'GROUP') {
      setTransformAndSize(node, json, parent, parentJson);
    }

    // For GROUP nodes, don't append to parent yet (will be handled in grouping logic)
    if (json.type !== 'GROUP') {
      if (parent) {
        parent.appendChild(node);
      } else {
        figma.currentPage.appendChild(node);
      }
    }

    registerComponent(node, json);

    const kids = Array.isArray(json.children) ? json.children : [];
    const childNodes = [];
    
    // For GROUP nodes, we need special handling
    if (json.type === 'GROUP' && kids.length > 0) {
      // Build all children first and add them to the page temporarily
      const tempParent = parent || figma.currentPage;
      for (const child of kids) {
        try {
          // Build child without parent first (will be added to page temporarily)
          const childNode = await buildNode(child, null, json);
          if (childNode) {
            // Add to page temporarily so we can group them
            try {
              if (!tempParent.children.includes(childNode)) {
                tempParent.appendChild(childNode);
              }
            } catch (e) {
              // Child might already be in parent, ignore
            }
            childNodes.push(childNode);
          }
        } catch (e) {
          console.log('build child error', e);
          const fallback = createFallbackFrame((child && (child.name || child.type)) || 'Unsupported');
          try {
            tempParent.appendChild(fallback);
          } catch (e2) {
            // Ignore
          }
          childNodes.push(fallback);
        }
      }
      
      // Try to group the children using Figma's group API
      if (childNodes.length > 0) {
        try {
          // Set selection to children (required for group API)
          figma.currentPage.selection = childNodes;
          // Group the selected nodes
          const grouped = figma.group(childNodes, tempParent);
          // Set properties on the grouped node
          grouped.name = json.name || 'Group';
          if (typeof json.x === 'number') grouped.x = json.x;
          if (typeof json.y === 'number') grouped.y = json.y;
          if (typeof json.rotation === 'number') grouped.rotation = json.rotation;
          if (json.visible === false) grouped.visible = false;
          if (typeof json.opacity === 'number' && json.opacity !== 1) grouped.opacity = json.opacity;
          // Apply fills and strokes if present
          await setFills(grouped, json.fills);
          setStrokes(grouped, json.strokes, json.strokeWeight);
          // Remove the temporary frame and use the grouped node
          if (node && node.parent) {
            node.remove();
          }
          node = grouped;
        } catch (e) {
          console.log('Group creation failed, using frame instead:', e);
          // Fallback: append children to frame and set their positions
          for (const childNode of childNodes) {
            // Remove from temporary parent if it was added there
            try {
              if (childNode.parent && childNode.parent === tempParent) {
                tempParent.removeChild(childNode);
              }
            } catch (e2) {
              // Ignore
            }
            try {
              node.appendChild(childNode);
            } catch (e3) {
              // Ignore if already appended
            }
          }
          // Set transform and size for the frame fallback
          setTransformAndSize(node, json, parent, parentJson);
        }
      } else {
        // No children - this shouldn't happen for a GROUP, but handle it
        if (node && node.parent) {
          node.remove();
        }
        return null;
      }
    } else {
      // For non-GROUP nodes, build children normally
      // Process children in order to preserve their sequence
      // Note: buildNode(child, node, json) automatically appends child to node,
      // so we don't need to call appendChild again here
      for (let i = 0; i < kids.length; i++) {
        const child = kids[i];
        try {
          // buildNode will automatically append child to node (parent parameter)
          // This ensures children are added in the correct order
          const childNode = await buildNode(child, node, json);
          if (childNode) {
            childNodes.push(childNode);
          }
        } catch (e) {
          console.log('build child error', e);
          const fallback = createFallbackFrame((child && (child.name || child.type)) || 'Unsupported');
          // Append fallback to parent if it's not already there
          if (node && 'appendChild' in node && fallback.parent !== node) {
            try {
              node.appendChild(fallback);
            } catch (e2) {
              console.log('Error appending fallback child:', e2);
            }
          }
          childNodes.push(fallback);
        }
      }
    }
    
    // After all children are added, if this is a button-like frame with Auto Layout and single text child,
    // ensure the text is properly centered
    if (hasAutoLayout && kids.length === 1 && kids[0] && kids[0].type === 'TEXT') {
      try {
        if ('layoutMode' in node && node.layoutMode !== 'NONE') {
          node.primaryAxisAlignItems = 'CENTER';
          node.counterAxisAlignItems = 'CENTER';
        }
      } catch (e) {
        // Ignore errors in alignment setting
      }
    }
  } catch (e) {
    console.log('apply props/children error', e);
  }
  return node;
}

function normalizeRoot(json) {
  try {
    // Handle PAGE wrapper
    if (json && json.type === 'PAGE' && Array.isArray(json.children)) {
      return json.children;
    }
    // Handle array of nodes
    if (Array.isArray(json)) return json;
    // Handle single node with children
    if (json && Array.isArray(json.children)) return [json];
    // Handle single node object
    if (json && typeof json === 'object') return [json];
    return [];
  } catch (e) {
    console.log('normalizeRoot error', e);
    return [];
  }
}

async function buildFromJson(json) {
  // Clear component registry at the start of each build to avoid reusing old components
  // This ensures that each JSON import creates fresh components
  componentRegistryByKey.clear();
  componentRegistryByName.clear();
  
  const roots = normalizeRoot(json);
  const nodes = [];
  for (const r of roots) {
    try {
      const n = await buildNode(r, null, null);
      nodes.push(n);
    } catch (e) {
      console.log('build root error', e);
      const fb = createFallbackFrame((r && (r.name || r.type)) || 'Unsupported');
      figma.currentPage.appendChild(fb);
      nodes.push(fb);
    }
  }
  return nodes;
}

// ---------------------------------------------------------------------------
// Figma to JSON conversion
// ---------------------------------------------------------------------------

// Convert bytes to base64 (lightweight implementation)
function bytesToBase64(bytes) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  const len = bytes.length;
  while (i < len) {
    const a = bytes[i++];
    const b = i < len ? bytes[i++] : 0;
    const c = i < len ? bytes[i++] : 0;
    const bitmap = (a << 16) | (b << 8) | c;
    result += chars.charAt((bitmap >> 18) & 63);
    result += chars.charAt((bitmap >> 12) & 63);
    if (i - 2 < len) {
      result += chars.charAt((bitmap >> 6) & 63);
    } else {
      result += '=';
    }
    if (i - 1 < len) {
      result += chars.charAt(bitmap & 63);
    } else {
      result += '=';
    }
  }
  return result;
}

function paintToJson(paint, node, exportImages = false) {
  if (!paint || !paint.visible) return null;
  if (paint.type === 'SOLID') {
    return {
      type: 'SOLID',
      color: paint.color ? { r: paint.color.r, g: paint.color.g, b: paint.color.b } : { r: 0, g: 0, b: 0 },
      opacity: paint.opacity != null ? paint.opacity : 1,
      visible: paint.visible !== false
    };
  } else if (paint.type === 'IMAGE') {
    // Store image hash only (base64 encoding is too heavy and causes freezing)
    // Images will be exported separately for nodes that are image containers
    return {
      type: 'IMAGE',
      imageHash: paint.imageHash,
      scaleMode: paint.scaleMode || 'FILL',
      visible: paint.visible !== false
    };
  }
  return null;
}

// Removed bytesToBase64 - image base64 encoding is too heavy and causes freezing
// Images are stored as imageHash references instead

function layoutToJson(node) {
  if (!('layoutMode' in node) || node.layoutMode === 'NONE') return null;
  const layout = {
    layoutMode: node.layoutMode,
    itemSpacing: node.itemSpacing || 0
  };
  if (node.paddingTop != null) layout.paddingTop = node.paddingTop;
  if (node.paddingRight != null) layout.paddingRight = node.paddingRight;
  if (node.paddingBottom != null) layout.paddingBottom = node.paddingBottom;
  if (node.paddingLeft != null) layout.paddingLeft = node.paddingLeft;
  if (node.primaryAxisSizingMode) layout.primaryAxisSizingMode = node.primaryAxisSizingMode;
  if (node.counterAxisSizingMode) layout.counterAxisSizingMode = node.counterAxisSizingMode;
  if (node.primaryAxisAlignItems) layout.primaryAxisAlignItems = node.primaryAxisAlignItems;
  if (node.counterAxisAlignItems) layout.counterAxisAlignItems = node.counterAxisAlignItems;
  return layout;
}

function constraintsToJson(node) {
  if (!('constraints' in node)) return null;
  const c = node.constraints;
  return {
    horizontal: c.horizontal || 'MIN',
    vertical: c.vertical || 'MIN'
  };
}

function cornerRadiusToJson(node) {
  if (!('cornerRadius' in node)) return null;
  if (typeof node.cornerRadius === 'number') {
    return node.cornerRadius;
  }
  // Individual corner radius
  if ('topLeftRadius' in node || 'topRightRadius' in node || 
      'bottomRightRadius' in node || 'bottomLeftRadius' in node) {
    const result = {};
    if (node.topLeftRadius != null) result.topLeft = node.topLeftRadius;
    if (node.topRightRadius != null) result.topRight = node.topRightRadius;
    if (node.bottomRightRadius != null) result.bottomRight = node.bottomRightRadius;
    if (node.bottomLeftRadius != null) result.bottomLeft = node.bottomLeftRadius;
    return result;
  }
  return null;
}

function lineHeightToJson(lh) {
  if (!lh) return null;
  if (typeof lh === 'number') return lh;
  if (typeof lh === 'object') {
    return {
      unit: lh.unit || 'PIXELS',
      value: lh.value
    };
  }
  return null;
}

function letterSpacingToJson(ls) {
  if (!ls) return null;
  if (typeof ls === 'number') return ls;
  if (typeof ls === 'object') {
    return {
      unit: ls.unit || 'PIXELS',
      value: ls.value
    };
  }
  return null;
}

// Image export cache to avoid re-exporting the same image multiple times
const imageExportCache = new Map();

async function nodeToJson(node, exportImages = false) {
  if (!node) return null;
  
  // Debug: log exportImages parameter for image nodes
  if (node.type === 'RECTANGLE' && 'fills' in node && node.fills.some(f => f && f.type === 'IMAGE')) {
    console.log('nodeToJson called for image node:', node.name, 'exportImages:', exportImages);
  }
  
  const json = {
    type: node.type,
    name: node.name || node.type
  };
  
  // Position and size (always include, even if 0)
  if (typeof node.x === 'number') json.x = node.x;
  if (typeof node.y === 'number') json.y = node.y;
  if (typeof node.width === 'number') json.width = node.width;
  if (typeof node.height === 'number') json.height = node.height;
  // Include rotation even if not 0 (results.json shows small rotation values)
  if (typeof node.rotation === 'number') json.rotation = node.rotation;
  
  // Visibility
  if (node.visible === false) json.visible = false;
  if (typeof node.opacity === 'number' && node.opacity !== 1) json.opacity = node.opacity;
  
  // For image nodes (RECTANGLE/FRAME with IMAGE fill), export as PNG when enabled
  // This is done before processing fills to avoid duplicate processing
  let exportedImageDataUrl = null;
  if (exportImages) {
    const hasImageFill = 'fills' in node && 
                        Array.isArray(node.fills) && 
                        node.fills.length > 0 && 
                        node.fills.some(f => f && f.type === 'IMAGE');
    const hasNoChildren = !('children' in node) || !node.children || node.children.length === 0;
    const isImageNode = (node.type === 'RECTANGLE' || node.type === 'FRAME') && 
                       hasImageFill && 
                       hasNoChildren;
    
    if (isImageNode) {
      console.log('Attempting to export image for node:', node.name, 'type:', node.type, 'hasImageFill:', hasImageFill, 'hasNoChildren:', hasNoChildren);
      try {
        // Get the image fill to access the image directly
        const imageFill = node.fills.find(f => f && f.type === 'IMAGE');
        if (imageFill && imageFill.imageHash) {
          // Check cache first to avoid re-exporting the same image
          if (imageExportCache.has(imageFill.imageHash)) {
            const cachedData = imageExportCache.get(imageFill.imageHash);
            console.log('Using cached image data for node:', node.name, 'hash:', imageFill.imageHash);
            exportedImageDataUrl = cachedData;
            json.image = { base64: cachedData };
            json.url = cachedData;
            json.imageHash = imageFill.imageHash;
            console.log('Cached image data added to JSON for node:', node.name);
          } else {
            // Export the rendered node as PNG (includes the image with proper scaling)
            // This is more reliable than exporting individual image fills
            // Use WIDTH constraint to maintain aspect ratio, but ensure width is valid
            const nodeWidth = node.width || 800;
            const exportWidth = Math.max(1, Math.min(nodeWidth, 800));
            
            console.log('Exporting with width:', exportWidth);
            const imageBytes = await node.exportAsync({ 
              format: 'PNG', 
              constraint: { type: 'WIDTH', value: exportWidth }
            });
            
            if (imageBytes && imageBytes.length > 0) {
              console.log('Image exported successfully, size:', imageBytes.length, 'bytes');
              const base64 = bytesToBase64(imageBytes);
              exportedImageDataUrl = `data:image/png;base64,${base64}`;
              // Cache the exported image data
              imageExportCache.set(imageFill.imageHash, exportedImageDataUrl);
              // Store in multiple formats for compatibility
              json.image = { base64: exportedImageDataUrl };
              json.url = exportedImageDataUrl;
              // Keep imageHash for reference
              if (imageFill && imageFill.imageHash) {
                json.imageHash = imageFill.imageHash;
              }
              console.log('Image data added to JSON for node:', node.name);
            } else {
              console.log('Image export returned empty bytes for node:', node.name);
            }
          }
        } else {
          console.log('No image fill or imageHash found for node:', node.name);
        }
      } catch (e) {
        console.log('Image node export error for', node.name, ':', e);
        if (e.message) console.log('Error message:', e.message);
        if (e.stack) console.log('Error stack:', e.stack);
        // Continue with normal processing - will include imageHash in fills
      }
    } else {
      // Debug: log why node is not considered an image node
      if (node.type === 'RECTANGLE' || node.type === 'FRAME') {
        console.log('Node', node.name, 'is not an image node:', {
          type: node.type,
          hasImageFill: hasImageFill,
          hasNoChildren: hasNoChildren,
          childrenCount: ('children' in node && node.children) ? node.children.length : 0
        });
      }
    }
  } else {
    // Debug: log if exportImages is false
    if (node.type === 'RECTANGLE' && 'fills' in node && node.fills.some(f => f && f.type === 'IMAGE')) {
      console.log('Image export is disabled for node:', node.name);
    }
  }
  
  // Fills (synchronous - no heavy image export by default)
  // If we exported an image, include the image data in the fills array
  if ('fills' in node && Array.isArray(node.fills) && node.fills.length > 0) {
    const fills = node.fills.map(paint => {
      const fillJson = paintToJson(paint, node, false);
      // If this is an IMAGE fill and we exported the image, add the image data
      if (fillJson && fillJson.type === 'IMAGE' && exportedImageDataUrl) {
        fillJson.image = { base64: exportedImageDataUrl };
        fillJson.url = exportedImageDataUrl;
        console.log('Added image data to fill for node:', node.name);
      }
      return fillJson;
    }).filter(f => f !== null);
    if (fills.length > 0) {
      json.fills = fills;
    }
  }
  
  // Strokes (synchronous - no heavy image export)
  // Only export strokeWeight if strokes exist (prevents default black stroke on import)
  if ('strokes' in node && Array.isArray(node.strokes) && node.strokes.length > 0) {
    const strokes = node.strokes.map(paint => paintToJson(paint, node, false)).filter(s => s !== null);
    if (strokes.length > 0) {
      json.strokes = strokes;
      // Include strokeWeight only if strokes exist (results.json shows values like 0.4832621216773987)
      if ('strokeWeight' in node && typeof node.strokeWeight === 'number') {
        json.strokeWeight = node.strokeWeight;
      }
    }
  }
  // Don't export strokeWeight if strokes are empty or missing
  
  // Corner radius
  const cornerRadius = cornerRadiusToJson(node);
  if (cornerRadius != null) json.cornerRadius = cornerRadius;
  
  // Constraints
  const constraints = constraintsToJson(node);
  if (constraints) json.constraints = constraints;
  
  // Auto Layout
  const layout = layoutToJson(node);
  if (layout) json.layout = layout;
  
  // Clips content (for frames)
  if ('clipsContent' in node && node.clipsContent) {
    json.clipsContent = true;
  }
  
  // INSTANCE-specific properties
  if (node.type === 'INSTANCE') {
    if ('mainComponent' in node && node.mainComponent) {
      // Try to get component key or name
      try {
        const mainComp = node.mainComponent;
        if ('key' in mainComp) json.componentKey = mainComp.key;
        if ('name' in mainComp) json.componentName = mainComp.name;
      } catch (e) {
        // Ignore errors
      }
    }
  }
  
  // VECTOR-specific properties
  if (node.type === 'VECTOR') {
    if ('vectorPaths' in node && Array.isArray(node.vectorPaths) && node.vectorPaths.length > 0) {
      const paths = node.vectorPaths.map(path => ({
        data: path.data || '',
        windingRule: path.windingRule || 'NONZERO'
      }));
      if (paths.length > 0) json.vectorPaths = paths;
    }
    // Also try to get path data if available
    if ('pathData' in node && node.pathData) {
      json.path = node.pathData;
    }
  }
  
  // LINE-specific properties
  if (node.type === 'LINE') {
    // Lines don't have fills, but may have strokes
    // Position is already handled above
  }
  
  // RECTANGLE/ELLIPSE - no special properties needed beyond fills/strokes
  
  // Text-specific properties
  if (node.type === 'TEXT') {
    if ('characters' in node) json.text = node.characters;
    if ('fontSize' in node && typeof node.fontSize === 'number') json.fontSize = node.fontSize;
    if ('fontName' in node && node.fontName) {
      json.fontName = {
        family: node.fontName.family || 'Roboto',
        style: node.fontName.style || 'Regular'
      };
    }
    if ('textAlignHorizontal' in node) {
      const align = node.textAlignHorizontal;
      if (align === 'CENTER') json.textAlign = 'center';
      else if (align === 'RIGHT') json.textAlign = 'right';
      else if (align === 'JUSTIFIED') json.textAlign = 'justify';
      else json.textAlign = 'left';
    }
    if ('lineHeight' in node) {
      const lh = lineHeightToJson(node.lineHeight);
      if (lh) json.lineHeight = lh;
    }
    if ('letterSpacing' in node) {
      const ls = letterSpacingToJson(node.letterSpacing);
      if (ls) json.letterSpacing = ls;
    }
    if ('textAutoResize' in node && node.textAutoResize !== 'NONE') {
      json.textAutoResize = node.textAutoResize;
    }
    if ('textDecoration' in node && node.textDecoration !== 'NONE') {
      json.textDecoration = node.textDecoration;
    }
    // TEXT nodes should have empty children array
    json.children = [];
  }
  
  // Children (process all node types that can have children)
  // GROUP, FRAME, INSTANCE, COMPONENT, etc. can all have children
  if (node.type !== 'TEXT' && 'children' in node && Array.isArray(node.children) && node.children.length > 0) {
    const children = [];
    for (const child of node.children) {
      try {
        // Pass exportImages parameter to child nodes
        const childJson = await nodeToJson(child, exportImages);
        if (childJson) children.push(childJson);
      } catch (e) {
        console.log('Error processing child node:', e);
        // Continue with next child
      }
    }
    if (children.length > 0) json.children = children;
  } else if (node.type === 'TEXT') {
    // TEXT nodes should have empty children array (already set above)
  } else if (node.type === 'RECTANGLE' || node.type === 'ELLIPSE' || node.type === 'LINE' || node.type === 'VECTOR') {
    // These node types don't have children
    // Don't set children property
  }
  
  return json;
}

async function exportSelectionToJson(exportImages = false) {
  console.log('exportSelectionToJson called with exportImages:', exportImages);
  const selection = figma.currentPage.selection;
  let nodesToProcess = [];
  
  if (selection.length === 0) {
    // If nothing is selected, export the entire page (all root nodes)
    nodesToProcess = figma.currentPage.children;
  } else {
    // Export selected nodes (the selected nodes themselves are the root nodes)
    nodesToProcess = selection;
  }
  
  const results = [];
  
  // Process all nodes with progress updates to avoid freezing
  for (let i = 0; i < nodesToProcess.length; i++) {
    const node = nodesToProcess[i];
    try {
      // Update UI with progress (every 10 nodes or at the end)
      if (i % 10 === 0 || i === nodesToProcess.length - 1) {
        figma.ui.postMessage({
          type: 'export-progress',
          current: i + 1,
          total: nodesToProcess.length
        });
        // Yield to UI thread
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      
      // Export the node (this includes all its properties and children)
      const json = await nodeToJson(node, exportImages);
      if (json) results.push(json);
    } catch (e) {
      console.log('Error exporting node:', e);
      // Continue with next node
    }
  }
  
  // Return single node as object, multiple nodes as array
  // This ensures the top-level parent nodes are always included
  return results.length === 1 ? results[0] : results;
}

// ---------------------------------------------------------------------------
// Message handling
// ---------------------------------------------------------------------------

figma.ui.onmessage = async (msg) => {
  try {
    if (!msg) return;
    if (msg.type === 'ui-error') {
      console.log('UI Error:', msg.error);
      return;
    }
    if (msg.type === 'load-json') {
      const text = String((msg && typeof msg.json !== 'undefined') ? msg.json : '');
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        console.log('JSON パースエラー:', e);
        const fb = createFallbackFrame('JSON Parse Error');
        figma.currentPage.appendChild(fb);
        figma.viewport.scrollAndZoomIntoView([fb]);
        return;
      }
      // Compatibility: handle extractor.js bundle { version, page, root }
      const converted =
        isExtractorBundle(parsed) ? convertExtractorBundle(parsed) : parsed;
      const created = await buildFromJson(converted);
      if (created.length) {
        figma.currentPage.selection = created;
        figma.viewport.scrollAndZoomIntoView(created);
      }
    }
    if (msg.type === 'export-to-json') {
      // Run export in a way that doesn't block the UI
      (async () => {
        try {
          figma.ui.postMessage({
            type: 'export-start'
          });
          // Get exportImages flag from message (default: false to avoid freezing)
          const exportImages = msg.exportImages === true;
          const json = await exportSelectionToJson(exportImages);
          figma.ui.postMessage({
            type: 'export-result',
            json: json.length === 1 ? json[0] : json
          });
        } catch (e) {
          console.log('Export error:', e);
          figma.ui.postMessage({
            type: 'export-error',
            error: String(e)
          });
        }
      })();
    }
    if (msg.type === 'update-from-json') {
      // Update existing nodes from JSON (bidirectional sync)
      const text = String((msg && typeof msg.json !== 'undefined') ? msg.json : '');
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        figma.ui.postMessage({
          type: 'update-error',
          error: 'JSON パースエラー: ' + String(e)
        });
        return;
      }
      // This is a simplified update - in a full implementation,
      // you would match nodes by ID and update properties
      // For now, we'll just rebuild
      const converted = isExtractorBundle(parsed) ? convertExtractorBundle(parsed) : parsed;
      const created = await buildFromJson(converted);
      if (created.length) {
        figma.currentPage.selection = created;
        figma.viewport.scrollAndZoomIntoView(created);
      }
      figma.ui.postMessage({
        type: 'update-success'
      });
    }
  } catch (e) {
    console.log('onmessage error', e);
    figma.ui.postMessage({
      type: 'error',
      error: String(e)
    });
  }
};


