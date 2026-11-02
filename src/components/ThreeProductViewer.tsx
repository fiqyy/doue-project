'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3D, Eye, Maximize2, RefreshCw } from 'lucide-react';
import { Product } from '@/types';

interface ThreeProductViewerProps {
  product: Product;
}

export default function ThreeProductViewer({ product }: ThreeProductViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // References to communicate with Three.js instance
  const stateRef = useRef({
    wireframe: false,
    autoRotate: true,
    zoomLevel: 1,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    rotationX: 0,
    rotationY: 0
  });

  useEffect(() => {
    stateRef.current.wireframe = wireframe;
  }, [wireframe]);

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    stateRef.current.zoomLevel = zoomLevel;
  }, [zoomLevel]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0e12);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Studio Studio Lighting for High Fashion
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa1a1aa, 1.2);
    fillLight.position.set(-5, 4, 3);
    scene.add(fillLight);

    const backRimLight = new THREE.PointLight(0xffffff, 2.5, 20);
    backRimLight.position.set(0, 5, -5);
    scene.add(backRimLight);

    const ambientLight = new THREE.AmbientLight(0x27272a, 1.2);
    scene.add(ambientLight);

    // 4. Ground Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(16, 16);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -3.2;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // 5. Load Product Image as Texture for 3D Texturing
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    // Fallback color material if texture takes time or fails
    const fabricMat = new THREE.MeshPhysicalMaterial({
      color: 0x141418,
      roughness: 0.45,
      metalness: 0.1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2
    });

    if (product.images && product.images.length > 0) {
      textureLoader.load(
        product.images[0],
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          fabricMat.map = texture;
          fabricMat.needsUpdate = true;
        },
        undefined,
        (err) => {
          console.warn('Could not load product image texture for 3D viewer:', err);
        }
      );
    }

    const hardwareMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.95,
      roughness: 0.15
    });

    // 6. 3D Model Construction according to product category
    const group = new THREE.Group();

    if (product.threeDType === 'coat') {
      const soleGeo = new THREE.BoxGeometry(1.8, 0.6, 4.2);
      const soleMesh = new THREE.Mesh(soleGeo, fabricMat);
      soleMesh.position.y = -2;
      soleMesh.castShadow = true;
      group.add(soleMesh);

      const upperGeo = new THREE.CylinderGeometry(1.0, 1.3, 3.2, 32);
      const upperMesh = new THREE.Mesh(upperGeo, fabricMat);
      upperMesh.position.set(0, -0.4, -0.4);
      upperMesh.castShadow = true;
      group.add(upperMesh);

      const toeGeo = new THREE.SphereGeometry(1.1, 32, 16);
      toeGeo.scale(0.85, 0.6, 1.2);
      const toeMesh = new THREE.Mesh(toeGeo, fabricMat);
      toeMesh.position.set(0, -1.5, 1.0);
      group.add(toeMesh);

      const buckleGeo = new THREE.TorusGeometry(0.5, 0.08, 16, 32);
      const buckleMesh = new THREE.Mesh(buckleGeo, hardwareMat);
      buckleMesh.position.set(0.9, 0.2, 0);
      buckleMesh.rotation.y = Math.PI / 2;
      group.add(buckleMesh);
    } else if (product.threeDType === 'blazer') {
      const bodyGeo = new THREE.BoxGeometry(3.6, 4.0, 1.6);
      const bodyMesh = new THREE.Mesh(bodyGeo, fabricMat);
      bodyMesh.position.y = -0.5;
      bodyMesh.castShadow = true;
      group.add(bodyMesh);

      const handleGeo = new THREE.TorusGeometry(1.4, 0.1, 16, 48, Math.PI);
      const handleMesh = new THREE.Mesh(handleGeo, fabricMat);
      handleMesh.position.set(0, 1.5, 0);
      group.add(handleMesh);

      for (let x of [-1.5, 1.5]) {
        for (let z of [-0.6, 0.6]) {
          const studGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16);
          const studMesh = new THREE.Mesh(studGeo, hardwareMat);
          studMesh.position.set(x, -2.55, z);
          group.add(studMesh);
        }
      }
    } else {
      // Architectural Coat / Blazer Mannequin Torso
      const torsoGeo = new THREE.CylinderGeometry(1.4, 1.1, 4.2, 32);
      const torsoMesh = new THREE.Mesh(torsoGeo, fabricMat);
      torsoMesh.position.y = -0.3;
      torsoMesh.castShadow = true;
      group.add(torsoMesh);

      const shoulderGeo = new THREE.BoxGeometry(4.2, 0.7, 1.8);
      const shoulderMesh = new THREE.Mesh(shoulderGeo, fabricMat);
      shoulderMesh.position.y = 1.4;
      shoulderMesh.castShadow = true;
      group.add(shoulderMesh);

      const lapelGeo = new THREE.BoxGeometry(0.8, 2.6, 0.2);
      const lapelLeft = new THREE.Mesh(lapelGeo, fabricMat);
      lapelLeft.position.set(-0.7, 0.5, 1.0);
      lapelLeft.rotation.z = -0.2;
      group.add(lapelLeft);

      const lapelRight = new THREE.Mesh(lapelGeo, fabricMat);
      lapelRight.position.set(0.7, 0.5, 1.0);
      lapelRight.rotation.z = 0.2;
      group.add(lapelRight);

      for (let y of [0.4, -0.4, -1.2]) {
        const btnGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.08, 24);
        const btnMesh = new THREE.Mesh(btnGeo, hardwareMat);
        btnMesh.rotation.x = Math.PI / 2;
        btnMesh.position.set(0, y, 1.12);
        group.add(btnMesh);
      }
    }

    scene.add(group);

    // 7. User Drag Interactions
    const onMouseDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevMouseX = e.clientX;
      stateRef.current.prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.isDragging) return;
      const deltaX = e.clientX - stateRef.current.prevMouseX;
      const deltaY = e.clientY - stateRef.current.prevMouseY;

      stateRef.current.rotationY += deltaX * 0.008;
      stateRef.current.rotationX += deltaY * 0.008;

      stateRef.current.rotationX = Math.max(-0.6, Math.min(0.6, stateRef.current.rotationX));

      stateRef.current.prevMouseX = e.clientX;
      stateRef.current.prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * -0.0015;
      setZoomLevel((prev) => Math.max(0.6, Math.min(1.8, prev + zoomDelta)));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', onResize);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.wireframe = stateRef.current.wireframe;
        }
      });

      if (stateRef.current.autoRotate && !stateRef.current.isDragging) {
        stateRef.current.rotationY += 0.007;
      }

      group.rotation.y = stateRef.current.rotationY;
      group.rotation.x = stateRef.current.rotationX;

      camera.position.z = 8.5 / stateRef.current.zoomLevel;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (container && dom) {
        container.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [product]);

  const handleReset = () => {
    stateRef.current.rotationX = 0;
    stateRef.current.rotationY = 0;
    setZoomLevel(1);
    setAutoRotate(true);
  };

  return (
    <div className="threed-viewer-box" style={{ cursor: 'grab' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating 3D Badge */}
      <div className="threed-badge-indicator">
        <Rotate3D size={14} className="animate-spin" />
        <span>3D ATELIER TURNTABLE // 360° INSPECT</span>
      </div>

      {/* Floating Controls Bar */}
      <div className="threed-controls-bar">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`btn-icon ${autoRotate ? 'active' : ''}`}
          style={{
            width: 34,
            height: 34,
            background: autoRotate ? 'var(--text-primary)' : 'var(--bg-card)',
            color: autoRotate ? 'var(--bg-deep)' : 'var(--text-primary)'
          }}
          title={autoRotate ? 'Pause 360° Rotation' : 'Start 360° Rotation'}
        >
          <Rotate3D size={15} />
        </button>

        <button
          onClick={() => setWireframe(!wireframe)}
          className="btn-icon"
          style={{
            width: 34,
            height: 34,
            background: wireframe ? 'var(--text-primary)' : 'var(--bg-card)',
            color: wireframe ? 'var(--bg-deep)' : 'var(--text-primary)'
          }}
          title={wireframe ? 'Show Solid Render' : 'Show Wireframe Seams'}
        >
          <Eye size={15} />
        </button>

        <button
          onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
          className="btn-icon"
          style={{ width: 34, height: 34 }}
          title="Zoom In"
        >
          <Maximize2 size={15} />
        </button>

        <button
          onClick={handleReset}
          className="btn-icon"
          style={{ width: 34, height: 34 }}
          title="Reset Camera"
        >
          <RefreshCw size={15} />
        </button>
      </div>
    </div>
  );
}