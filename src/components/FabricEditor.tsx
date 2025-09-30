"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";

// Tip: We avoid importing fabric at module top-level to prevent SSR issues.
// We'll dynamically require it inside useEffect where window is available.

type FabricNS = typeof import("fabric");

type Props = {
  imageUrl: string;
  width?: number; // canvas pixel width
  height?: number; // canvas pixel height
  backgroundColor?: string;
};

export default function FabricEditor({ imageUrl, width = 1200, height = 800, backgroundColor = "#000" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<FabricNS | null>(null);
  const fcanvasRef = useRef<any>(null);
  const bgImageRef = useRef<any>(null);

  // Filters state
  const [brightness, setBrightness] = useState(0); // -1..1
  const [contrast, setContrast] = useState(0); // -1..1
  const [saturation, setSaturation] = useState(0); // -1..1
  const [blur, setBlur] = useState(0); // 0..1 (roughly)
  const [opacity, setOpacity] = useState(1); // 0..1

  // Elements: shapes config
  const [shapeMode, setShapeMode] = useState<'fill' | 'stroke'>('fill');
  const [shapeFill, setShapeFill] = useState<string>('#ffffff');
  const [shapeStroke, setShapeStroke] = useState<string>('#ffffff');
  const [shapeStrokeWidth, setShapeStrokeWidth] = useState<number>(2);
  const [shapeFillType, setShapeFillType] = useState<'solid' | 'gradient' | 'image'>('solid');
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [gradientColor1, setGradientColor1] = useState<string>('#ff0000');
  const [gradientColor2, setGradientColor2] = useState<string>('#0000ff');
  const [shapeImageFill, setShapeImageFill] = useState<string>('');
  const [selectedShapeCategory, setSelectedShapeCategory] = useState<string>('basic');

  // Elements: image by URL
  const [imageURL, setImageURL] = useState<string>('');

  // Helpers
  const applyBgFilters = useCallback(() => {
    const fabric = fabricRef.current;
    const bgImg = bgImageRef.current;
    if (!fabric || !bgImg) return;

    const filters: any[] = [];
    if (brightness !== 0) filters.push(new fabric.Image.filters.Brightness({ brightness }));
    if (contrast !== 0) filters.push(new fabric.Image.filters.Contrast({ contrast }));
    if (saturation !== 0) filters.push(new fabric.Image.filters.Saturation({ saturation }));
    if (blur > 0) filters.push(new fabric.Image.filters.Blur({ blur }));
    bgImg.set({ opacity });
    bgImg.filters = filters;
    bgImg.applyFilters();
    fcanvasRef.current?.requestRenderAll();
  }, [brightness, contrast, saturation, blur, opacity]);

  // Initialize canvas
  useEffect(() => {
    let disposed = false;
    (async () => {
      const fabric: FabricNS = (await import("fabric")).fabric;
      fabricRef.current = fabric;
      if (disposed) return;

      // Default scaling behavior: allow non-uniform scaling and extend from dragged edge
      // Using any-cast to avoid potential TS type mismatches across fabric versions
      (fabric as any).Object.prototype.centeredScaling = false;
      (fabric as any).Object.prototype.lockUniScaling = false;

      const c = new fabric.Canvas(canvasRef.current!, {
        width,
        height,
        backgroundColor,
        selection: true,
        preserveObjectStacking: true,
      });
      fcanvasRef.current = c;

      // Load background image
      if (imageUrl) {
        fabric.Image.fromURL(imageUrl, (img: any) => {
          if (!img) return;
          // Fit image into canvas while preserving aspect ratio
          const scale = Math.min(width / img.width!, height / img.height!);
          img.set({
            selectable: false,
            evented: false,
            left: (width - img.width! * scale) / 2,
            top: (height - img.height! * scale) / 2,
            scaleX: scale,
            scaleY: scale,
          });
          bgImageRef.current = img;
          c.add(img);
          c.sendToBack(img);
          c.requestRenderAll();
        }, { crossOrigin: "anonymous" });
      }

      // Basic keyboard shortcuts
      const handleKey = (e: KeyboardEvent) => {
        const active = c.getActiveObjects();
        if (e.key === "Delete" || e.key === "Backspace") {
          if (active.length) {
            active.forEach((o: any) => c.remove(o));
            c.discardActiveObject();
            c.requestRenderAll();
            e.preventDefault();
          }
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") {
          if (active.length > 1) {
            const group = new fabric.Group(active);
            active.forEach((o: any) => c.remove(o));
            c.add(group);
            c.setActiveObject(group);
            c.requestRenderAll();
            e.preventDefault();
          }
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
          const obj = c.getActiveObject();
          if (obj) {
            c.sendToBack(obj);
            c.requestRenderAll();
            e.preventDefault();
          }
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
          const obj = c.getActiveObject();
          if (obj) {
            c.bringToFront(obj);
            c.requestRenderAll();
            e.preventDefault();
          }
        }
      };
      window.addEventListener("keydown", handleKey);

      return () => {
        window.removeEventListener("keydown", handleKey);
        c.dispose();
      };
    })();
    return () => {
      disposed = true;
    };
  }, [imageUrl, width, height, backgroundColor]);

  useEffect(() => {
    applyBgFilters();
  }, [applyBgFilters]);

  // Actions
  const addText = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const text = new fabric.IText("Yeni Metin", {
      left: c.getWidth() / 2 - 50,
      top: c.getHeight() / 2 - 20,
      fill: "#ffffff",
      fontFamily: "Inter, ui-sans-serif, system-ui",
      fontSize: 48,
      textAlign: "center",
      shadow: undefined,
      centeredScaling: false,
      lockUniScaling: false,
    });
    c.add(text);
    c.setActiveObject(text);
    c.requestRenderAll();
  };

  const addRect = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      width: 240,
      height: 120,
      rx: 12,
      ry: 12,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const r = new fabric.Rect({ ...base, ...opts, ...extras });
    c.add(r);
    c.setActiveObject(r);
    c.requestRenderAll();
  };

  const addCircle = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 140,
      top: 140,
      radius: 80,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const circ = new fabric.Circle({ ...base, ...opts, ...extras });
    c.add(circ);
    c.setActiveObject(circ);
    c.requestRenderAll();
  };

  const addTriangle = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      width: 120,
      height: 120,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const triangle = new fabric.Triangle({ ...base, ...opts, ...extras });
    c.add(triangle);
    c.setActiveObject(triangle);
    c.requestRenderAll();
  };

  const addStar = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      radius: 60,
      innerRadius: 30,
      numPoints: 5,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const star = new fabric.Polygon(createStarPoints(base.radius, base.innerRadius, base.numPoints), { 
      ...base, 
      ...opts, 
      ...extras 
    });
    c.add(star);
    c.setActiveObject(star);
    c.requestRenderAll();
  };

  const addHeart = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      width: 100,
      height: 90,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const heart = new fabric.Path(createHeartPath(), { ...base, ...opts, ...extras });
    c.add(heart);
    c.setActiveObject(heart);
    c.requestRenderAll();
  };

  const addDiamond = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      width: 100,
      height: 100,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const diamond = new fabric.Polygon([
      { x: 0, y: -50 },
      { x: 50, y: 0 },
      { x: 0, y: 50 },
      { x: -50, y: 0 }
    ], { ...base, ...opts, ...extras });
    c.add(diamond);
    c.setActiveObject(diamond);
    c.requestRenderAll();
  };

  const addHexagon = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      width: 100,
      height: 100,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const hexagon = new fabric.Polygon(createHexagonPoints(50), { ...base, ...opts, ...extras });
    c.add(hexagon);
    c.setActiveObject(hexagon);
    c.requestRenderAll();
  };

  const addOctagon = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      width: 100,
      height: 100,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const octagon = new fabric.Polygon(createOctagonPoints(50), { ...base, ...opts, ...extras });
    c.add(octagon);
    c.setActiveObject(octagon);
    c.requestRenderAll();
  };

  const addArrow = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      width: 120,
      height: 40,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const arrow = new fabric.Path(createArrowPath(), { ...base, ...opts, ...extras });
    c.add(arrow);
    c.setActiveObject(arrow);
    c.requestRenderAll();
  };

  const addSpeechBubble = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      width: 150,
      height: 100,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const bubble = new fabric.Path(createSpeechBubblePath(), { ...base, ...opts, ...extras });
    c.add(bubble);
    c.setActiveObject(bubble);
    c.requestRenderAll();
  };

  const addPentagon = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      width: 100,
      height: 100,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const pentagon = new fabric.Polygon(createPentagonPoints(50), { ...base, ...opts, ...extras });
    c.add(pentagon);
    c.setActiveObject(pentagon);
    c.requestRenderAll();
  };

  const addCross = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      width: 80,
      height: 80,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const cross = new fabric.Path(createCrossPath(), { ...base, ...opts, ...extras });
    c.add(cross);
    c.setActiveObject(cross);
    c.requestRenderAll();
  };

  const addPlus = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      width: 60,
      height: 60,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const plus = new fabric.Path(createPlusPath(), { ...base, ...opts, ...extras });
    c.add(plus);
    c.setActiveObject(plus);
    c.requestRenderAll();
  };

  const addMinus = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      width: 60,
      height: 20,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const minus = new fabric.Rect({ ...base, ...opts, ...extras });
    c.add(minus);
    c.setActiveObject(minus);
    c.requestRenderAll();
  };

  const addCheckmark = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      width: 80,
      height: 60,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const checkmark = new fabric.Path(createCheckmarkPath(), { ...base, ...opts, ...extras });
    c.add(checkmark);
    c.setActiveObject(checkmark);
    c.requestRenderAll();
  };

  const addXMark = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const base: any = {
      left: 100,
      top: 100,
      width: 60,
      height: 60,
    };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;
    const xMark = new fabric.Path(createXMarkPath(), { ...base, ...opts, ...extras });
    c.add(xMark);
    c.setActiveObject(xMark);
    c.requestRenderAll();
  };

  const addShapeWithText = (shapeType: string) => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    
    // Create the shape first
    let shape: any;
    const base: any = { left: 100, top: 100 };
    const opts = getShapeOptions();
    const extras = { centeredScaling: false, lockUniScaling: false, strokeUniform: true } as const;

    switch (shapeType) {
      case 'rect':
        shape = new fabric.Rect({ ...base, width: 200, height: 100, rx: 12, ry: 12, ...opts, ...extras });
        break;
      case 'circle':
        shape = new fabric.Circle({ ...base, radius: 60, ...opts, ...extras });
        break;
      case 'triangle':
        shape = new fabric.Triangle({ ...base, width: 120, height: 120, ...opts, ...extras });
        break;
      default:
        shape = new fabric.Rect({ ...base, width: 200, height: 100, rx: 12, ry: 12, ...opts, ...extras });
    }

    // Create text
    const text = new fabric.IText("Metin", {
      left: shape.left + (shape.width || shape.radius * 2) / 2,
      top: shape.top + (shape.height || shape.radius * 2) / 2,
      fill: "#000000",
      fontFamily: "Inter, ui-sans-serif, system-ui",
      fontSize: 24,
      textAlign: "center",
      originX: "center",
      originY: "center",
      selectable: true,
      evented: true,
    });

    // Create a group with shape and text
    const group = new fabric.Group([shape, text], {
      left: base.left,
      top: base.top,
      selectable: true,
      evented: true,
    });

    c.add(group);
    c.setActiveObject(group);
    c.requestRenderAll();
  };

  // Helper functions for shape creation
  const createStarPoints = (outerRadius: number, innerRadius: number, numPoints: number) => {
    const points = [];
    const angle = Math.PI / numPoints;
    for (let i = 0; i < 2 * numPoints; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(i * angle) * radius;
      const y = Math.sin(i * angle) * radius;
      points.push({ x, y });
    }
    return points;
  };

  const createHeartPath = () => {
    return "M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z";
  };

  const createHexagonPoints = (radius: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      points.push({ x, y });
    }
    return points;
  };

  const createOctagonPoints = (radius: number) => {
    const points = [];
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 4) * i;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      points.push({ x, y });
    }
    return points;
  };

  const createArrowPath = () => {
    return "M0,0 L80,0 L80,15 L120,20 L80,25 L80,40 L0,40 Z";
  };

  const createSpeechBubblePath = () => {
    return "M0,20 Q0,0 20,0 L130,0 Q150,0 150,20 L150,80 Q150,100 130,100 L30,100 L20,110 L30,100 L20,100 Q0,100 0,80 Z";
  };

  const createPentagonPoints = (radius: number) => {
    const points = [];
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI / 2.5) * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      points.push({ x, y });
    }
    return points;
  };

  const createCrossPath = () => {
    return "M20,0 L60,0 L60,20 L80,20 L80,60 L60,60 L60,80 L20,80 L20,60 L0,60 L0,20 L20,20 Z";
  };

  const createPlusPath = () => {
    return "M20,0 L40,0 L40,20 L60,20 L60,40 L40,40 L40,60 L20,60 L20,40 L0,40 L0,20 L20,20 Z";
  };

  const createCheckmarkPath = () => {
    return "M10,30 L25,45 L70,0 L80,10 L25,65 L0,40 Z";
  };

  const createXMarkPath = () => {
    return "M10,10 L30,30 L50,10 L60,20 L40,40 L60,60 L50,70 L30,50 L10,70 L0,60 L20,40 L0,20 Z";
  };

  const getShapeOptions = () => {
    const fabric = fabricRef.current;
    if (!fabric) return { fill: shapeFill || '#ffffff', stroke: undefined, strokeWidth: 0 };

    if (shapeMode === 'stroke') {
      return { fill: 'transparent', stroke: shapeStroke || '#ffffff', strokeWidth: shapeStrokeWidth };
    }

    if (shapeFillType === 'gradient') {
      const gradient = new fabric.Gradient({
        type: gradientType,
        coords: gradientType === 'linear' 
          ? { x1: 0, y1: 0, x2: 1, y2: 0 }
          : { x1: 0.5, y1: 0.5, x2: 0.5, y2: 0.5, r1: 0, r2: 0.5 },
        colorStops: [
          { offset: 0, color: gradientColor1 },
          { offset: 1, color: gradientColor2 }
        ]
      });
      return { fill: gradient, stroke: undefined, strokeWidth: 0 };
    }

    if (shapeFillType === 'image' && shapeImageFill) {
      return { fill: shapeImageFill, stroke: undefined, strokeWidth: 0 };
    }

    return { fill: shapeFill || '#ffffff', stroke: undefined, strokeWidth: 0 };
  };

  const bringForward = () => {
    const c = fcanvasRef.current as any;
    const obj = c.getActiveObject();
    if (obj) {
      c.bringForward(obj);
      c.requestRenderAll();
    }
  };
  const sendBackwards = () => {
    const c = fcanvasRef.current as any;
    const obj = c.getActiveObject();
    if (obj) {
      c.sendBackwards(obj);
      c.requestRenderAll();
    }
  };
  const lockUnlock = () => {
    const c = fcanvasRef.current as any;
    const obj = c.getActiveObject();
    if (obj) {
      const locked = !!obj.lockMovementX;
      obj.set({
        lockMovementX: !locked,
        lockMovementY: !locked,
        hasControls: locked,
        selectable: locked,
        evented: locked,
      });
      c.requestRenderAll();
    }
  };

  const exportPNG = async () => {
    const c = fcanvasRef.current as any;
    const data = c.toDataURL({ format: "png", multiplier: 1 });
    const a = document.createElement("a");
    a.href = data;
    a.download = "design.png";
    a.click();
  };

  const handleOverlayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      addImageFromURL(url);
    };
    reader.readAsDataURL(file);
  };

  const addImageFromURL = (url: string) => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    fabric.Image.fromURL(url, (img: any) => {
      if (!img) return;
      img.set({ left: c.getWidth() / 2 - 100, top: c.getHeight() / 2 - 100, selectable: true, evented: true, centeredScaling: false, lockUniScaling: false });
      const maxScale = Math.min(600 / (img.width || 1), 600 / (img.height || 1));
      if (isFinite(maxScale) && maxScale > 0) {
        img.scale(maxScale);
      }
      c.add(img);
      c.setActiveObject(img);
      c.requestRenderAll();
    }, { crossOrigin: "anonymous" });
  };

  // Replace background helper
  const replaceBackgroundFromURL = (url: string) => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    if (!fabric || !c) return;
    fabric.Image.fromURL(url, (img: any) => {
      if (!img) return;
      // remove old bg if exists
      if (bgImageRef.current) {
        c.remove(bgImageRef.current);
        bgImageRef.current = null;
      }
      const scale = Math.min(c.getWidth() / (img.width || 1), c.getHeight() / (img.height || 1));
      img.set({
        selectable: false,
        evented: false,
        left: (c.getWidth() - (img.width || 0) * scale) / 2,
        top: (c.getHeight() - (img.height || 0) * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        opacity,
      });
      bgImageRef.current = img;
      c.add(img);
      c.sendToBack(img);
      c.requestRenderAll();
    }, { crossOrigin: "anonymous" });
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => replaceBackgroundFromURL(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleShapeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setShapeImageFill(reader.result as string);
      setShapeFillType('image');
    };
    reader.readAsDataURL(file);
  };

  // Drag & drop to replace background
  const onDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    e.preventDefault();
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    if (!dt) return;
    const file = dt.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => replaceBackgroundFromURL(reader.result as string);
      reader.readAsDataURL(file);
      return;
    }
    // try URL text drop
    const url = dt.getData("text/uri-list") || dt.getData("text/plain");
    if (url && /^(https?:)?\/\//.test(url)) {
      replaceBackgroundFromURL(url.trim());
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={addText} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">Metin Ekle</button>
        <button onClick={addRect} className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm">Dikdörtgen</button>
        <button onClick={addCircle} className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm">Daire</button>
        <button onClick={bringForward} className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm">Öne Getir</button>
        <button onClick={sendBackwards} className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm">Geri Gönder</button>
        <button onClick={lockUnlock} className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm">Kilitle/Aç</button>
        <label className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm cursor-pointer">
          Görsel Yükle (Üstüne)
          <input type="file" accept="image/*" className="hidden" onChange={handleOverlayUpload} />
        </label>
        <label className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm cursor-pointer">
          Arka Plan Yükle
          <input type="file" accept="image/*" className="hidden" onChange={handleBackgroundUpload} />
        </label>
        <div className="ml-auto" />
        <button onClick={exportPNG} className="px-3 py-1.5 rounded bg-emerald-600 text-white text-sm">PNG İndir</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
        <div className="rounded border border-slate-700 overflow-hidden bg-black/40" onDragOver={onDragOver} onDrop={onDrop}>
          <div className="overflow-auto p-2">
            <canvas ref={canvasRef} />
          </div>
        </div>
        <div className="rounded border border-slate-700 p-3 space-y-3 bg-slate-900/40">
          <h3 className="font-medium text-slate-100">Elementler</h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-300 font-medium mb-2">Şekiller</div>
              
              {/* Shape Categories */}
              <div className="flex items-center gap-1 text-xs mb-3">
                <button
                  className={`px-2 py-1 rounded text-xs ${selectedShapeCategory === 'basic' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}
                  onClick={() => setSelectedShapeCategory('basic')}
                >Temel</button>
                <button
                  className={`px-2 py-1 rounded text-xs ${selectedShapeCategory === 'advanced' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}
                  onClick={() => setSelectedShapeCategory('advanced')}
                >Gelişmiş</button>
                <button
                  className={`px-2 py-1 rounded text-xs ${selectedShapeCategory === 'icons' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}
                  onClick={() => setSelectedShapeCategory('icons')}
                >İkonlar</button>
              </div>

              {/* Basic Shapes */}
              {selectedShapeCategory === 'basic' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={addRect} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-4 bg-white rounded-sm"></div>
                      <span>Dikdörtgen</span>
                    </button>
                    <button onClick={addCircle} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                      <span>Daire</span>
                    </button>
                    <button onClick={addTriangle} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-white"></div>
                      <span>Üçgen</span>
                    </button>
                    <button onClick={addDiamond} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-6 bg-white transform rotate-45"></div>
                      <span>Elmas</span>
                    </button>
                    <button onClick={addHexagon} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-6 bg-white" style={{clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)'}}></div>
                      <span>Altıgen</span>
                    </button>
                    <button onClick={addOctagon} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-6 bg-white" style={{clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'}}></div>
                      <span>Sekizgen</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Advanced Shapes */}
              {selectedShapeCategory === 'advanced' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={addStar} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-6 bg-white" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}></div>
                      <span>Yıldız</span>
                    </button>
                    <button onClick={addHeart} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-5 bg-white" style={{clipPath: 'path("M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z")'}}></div>
                      <span>Kalp</span>
                    </button>
                    <button onClick={addPentagon} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-6 bg-white" style={{clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'}}></div>
                      <span>Beşgen</span>
                    </button>
                    <button onClick={addArrow} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-4 bg-white" style={{clipPath: 'polygon(0% 0%, 70% 0%, 70% 30%, 100% 50%, 70% 70%, 70% 100%, 0% 100%)'}}></div>
                      <span>Ok</span>
                    </button>
                    <button onClick={addSpeechBubble} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-4 bg-white rounded-sm relative">
                        <div className="absolute -bottom-1 left-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-white"></div>
                      </div>
                      <span>Konuşma</span>
                    </button>
                    <button onClick={addCross} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-6 bg-white" style={{clipPath: 'polygon(20% 0%, 40% 0%, 40% 20%, 60% 20%, 60% 40%, 80% 40%, 80% 60%, 60% 60%, 60% 80%, 40% 80%, 40% 60%, 20% 60%, 20% 40%, 0% 40%, 0% 20%, 20% 20%)'}}></div>
                      <span>Artı</span>
                    </button>
                    <button onClick={addPlus} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-6 bg-white" style={{clipPath: 'polygon(33% 0%, 67% 0%, 67% 33%, 100% 33%, 100% 67%, 67% 67%, 67% 100%, 33% 100%, 33% 67%, 0% 67%, 0% 33%, 33% 33%)'}}></div>
                      <span>Plus</span>
                    </button>
                    <button onClick={addMinus} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-2 bg-white rounded-sm"></div>
                      <span>Eksi</span>
                    </button>
                    <button onClick={addCheckmark} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-4 bg-white" style={{clipPath: 'polygon(12% 50%, 31% 69%, 87% 0%, 100% 12%, 31% 100%, 0% 62%)'}}></div>
                      <span>Tik</span>
                    </button>
                    <button onClick={addXMark} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-6 bg-white" style={{clipPath: 'polygon(17% 0%, 50% 33%, 83% 0%, 100% 17%, 67% 50%, 100% 83%, 83% 100%, 50% 67%, 17% 100%, 0% 83%, 33% 50%, 0% 17%)'}}></div>
                      <span>Çarpı</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Icon Shapes */}
              {selectedShapeCategory === 'icons' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => addShapeWithText('rect')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-4 bg-white rounded-sm flex items-center justify-center">
                        <span className="text-black text-xs">T</span>
                      </div>
                      <span>Dikdörtgen + Metin</span>
                    </button>
                    <button onClick={() => addShapeWithText('circle')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <span className="text-black text-xs">T</span>
                      </div>
                      <span>Daire + Metin</span>
                    </button>
                    <button onClick={() => addShapeWithText('triangle')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex flex-col items-center gap-1">
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-white flex items-center justify-center">
                        <span className="text-black text-xs absolute -mt-2">T</span>
                      </div>
                      <span>Üçgen + Metin</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Shape Fill Options */}
              <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <button
                  className={`px-2 py-1 rounded ${shapeMode === 'fill' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}
                  onClick={() => setShapeMode('fill')}
                >Dolu</button>
                <button
                  className={`px-2 py-1 rounded ${shapeMode === 'stroke' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}
                  onClick={() => setShapeMode('stroke')}
                >Sadece Kenar</button>
              </div>

                {shapeMode === 'fill' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        className={`px-2 py-1 rounded ${shapeFillType === 'solid' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}
                        onClick={() => setShapeFillType('solid')}
                      >Düz</button>
                      <button
                        className={`px-2 py-1 rounded ${shapeFillType === 'gradient' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}
                        onClick={() => setShapeFillType('gradient')}
                      >Gradyan</button>
                      <button
                        className={`px-2 py-1 rounded ${shapeFillType === 'image' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}
                        onClick={() => setShapeFillType('image')}
                      >Görsel</button>
                    </div>

                    {shapeFillType === 'solid' && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 text-xs w-16">Renk:</span>
                        <input type="color" value={shapeFill} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setShapeFill(e.target.value)} className="h-6 w-12 bg-transparent" />
                      </div>
                    )}

                    {shapeFillType === 'gradient' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <button
                            className={`px-2 py-1 rounded text-xs ${gradientType === 'linear' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}
                            onClick={() => setGradientType('linear')}
                          >Doğrusal</button>
                          <button
                            className={`px-2 py-1 rounded text-xs ${gradientType === 'radial' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}
                            onClick={() => setGradientType('radial')}
                          >Dairesel</button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300 text-xs w-12">1:</span>
                          <input type="color" value={gradientColor1} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setGradientColor1(e.target.value)} className="h-6 w-10 bg-transparent" />
                          <span className="text-slate-300 text-xs w-12">2:</span>
                          <input type="color" value={gradientColor2} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setGradientColor2(e.target.value)} className="h-6 w-10 bg-transparent" />
                        </div>
                      </div>
                    )}

                    {shapeFillType === 'image' && (
                      <div className="space-y-2">
                        <label className="px-2 py-1 rounded bg-slate-700 text-white text-xs cursor-pointer block text-center">
                          Görsel Seç
                          <input type="file" accept="image/*" className="hidden" onChange={handleShapeImageUpload} />
                </label>
                        {shapeImageFill && (
                          <div className="text-xs text-slate-400">Görsel yüklendi ✓</div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {shapeMode === 'stroke' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 text-xs w-16">Kenar:</span>
                      <input type="color" value={shapeStroke} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setShapeStroke(e.target.value)} className="h-6 w-12 bg-transparent" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 text-xs w-20">Kalınlık:</span>
                      <input type="range" min={1} max={20} step={1} value={shapeStrokeWidth} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setShapeStrokeWidth(parseInt(e.target.value,10))} className="flex-1" />
                      <span className="w-6 text-right text-slate-300 text-xs">{shapeStrokeWidth}</span>
                    </div>
              </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="text-xs text-slate-300 font-medium mb-1">Görseller</div>
              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm cursor-pointer">
                  Dosyadan Ekle
                  <input type="file" accept="image/*" className="hidden" onChange={handleOverlayUpload} />
                </label>
                <input
                  type="text"
                  value={imageURL}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setImageURL(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 rounded bg-slate-800/70 border border-slate-700 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500"
                />
                <button
                  className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm"
                  onClick={()=>{ if(imageURL.trim()) { addImageFromURL(imageURL.trim()); setImageURL(''); } }}
                >Ekle</button>
              </div>
            </div>
          </div>

          <hr className="my-3 border-slate-800" />

          <h3 className="font-medium text-slate-100">Arka Plan Filtreleri</h3>
          <div className="text-[11px] text-slate-400">Sürükle-bırak ile arka planı değiştirebilirsiniz. Not: Görselin içindeki yazılar resmin parçasıdır; doğrudan düzenlenemez. Yeni metin ekleyip üstüne yerleştirin veya şekillerle arka planı kapatın.</div>
          <div className="space-y-2">
            <label className="block text-xs text-slate-300">Parlaklık: {brightness.toFixed(2)}</label>
            <input type="range" min={-1} max={1} step={0.01} value={brightness} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setBrightness(parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-slate-300">Kontrast: {contrast.toFixed(2)}</label>
            <input type="range" min={-1} max={1} step={0.01} value={contrast} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setContrast(parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-slate-300">Doygunluk: {saturation.toFixed(2)}</label>
            <input type="range" min={-1} max={1} step={0.01} value={saturation} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setSaturation(parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-slate-300">Bulanıklık: {blur.toFixed(2)}</label>
            <input type="range" min={0} max={1} step={0.01} value={blur} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setBlur(parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-slate-300">Arka Plan Opaklık: {opacity.toFixed(2)}</label>
            <input type="range" min={0} max={1} step={0.01} value={opacity} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setOpacity(parseFloat(e.target.value))} />
          </div>
          <p className="text-[11px] text-slate-400">İpucu: Seçili nesneleri Delete ile silebilirsiniz. ⌘/Ctrl+G ile gruplama, ⌘/Ctrl+F öne, ⌘/Ctrl+B arkaya gönderir.</p>
        </div>
      </div>
    </div>
  );
}
