"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    THREE: any;
  }
}

export default function ThreeDPlant() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scene: any, camera: any, renderer: any, animationId: number, plantGroup: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let leftLeaf: any, rightLeaf: any;

    const initThree = () => {
      if (!mountRef.current || !window.THREE) return;

      const THREE = window.THREE;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 1.5, 8);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      if (mountRef.current.childElementCount === 0) {
        mountRef.current.appendChild(renderer.domElement);
      }
      setIsLoaded(true);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
      mainLight.position.set(5, 10, 7);
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = 1024;
      mainLight.shadow.mapSize.height = 1024;
      scene.add(mainLight);

      const fillLight = new THREE.PointLight(0x90e0ef, 0.4);
      fillLight.position.set(-5, 0, 5);
      scene.add(fillLight);

      plantGroup = new THREE.Group();

      // Materials
      const potMat = new THREE.MeshStandardMaterial({ color: 0xe07a5f, roughness: 0.8 });
      const soilMat = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 1.0 });
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2a9d8f, roughness: 0.4, metalness: 0.1 });
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.3 });
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
      const cheekMat = new THREE.MeshStandardMaterial({ color: 0xffb5a7, roughness: 0.6 });

      // Pot
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.0, 1.6, 32), potMat);
      pot.position.y = -0.8;
      pot.castShadow = true;
      pot.receiveShadow = true;
      plantGroup.add(pot);

      // Pot Rim
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32), potMat);
      rim.position.y = 0.15;
      rim.castShadow = true;
      plantGroup.add(rim);

      // Soil
      const soil = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.1, 32), soilMat);
      soil.position.y = 0.3;
      plantGroup.add(soil);

      // Body
      const body = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), bodyMat);
      body.scale.set(1, 1.1, 1);
      body.position.y = 1.2;
      body.castShadow = true;
      plantGroup.add(body);

      // Eyes
      const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), eyeMat);
      leftEye.position.set(-0.4, 1.4, 1.1);
      const rightEye = leftEye.clone();
      rightEye.position.set(0.4, 1.4, 1.1);
      plantGroup.add(leftEye, rightEye);

      // Cheeks
      const leftCheek = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), cheekMat);
      leftCheek.position.set(-0.65, 1.15, 1.05);
      leftCheek.scale.set(1.5, 0.8, 0.5);
      const rightCheek = leftCheek.clone();
      rightCheek.position.set(0.65, 1.15, 1.05);
      plantGroup.add(leftCheek, rightCheek);

      // Leaves
      const leafGeo = new THREE.SphereGeometry(0.5, 32, 32);

      leftLeaf = new THREE.Mesh(leafGeo, leafMat);
      leftLeaf.scale.set(1, 2.0, 0.3);
      leftLeaf.position.set(-0.3, 2.7, 0);
      leftLeaf.rotation.z = Math.PI / 6;
      leftLeaf.castShadow = true;

      rightLeaf = new THREE.Mesh(leafGeo, leafMat);
      rightLeaf.scale.set(1, 1.8, 0.3);
      rightLeaf.position.set(0.4, 2.6, 0);
      rightLeaf.rotation.z = -Math.PI / 4;
      rightLeaf.castShadow = true;

      plantGroup.add(leftLeaf, rightLeaf);

      plantGroup.position.y = -0.5;
      scene.add(plantGroup);

      // Animation loop
      const clock = new THREE.Clock();

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        if (plantGroup) {
          plantGroup.position.y = -0.5 + Math.sin(time * 2) * 0.05;
          plantGroup.rotation.y = Math.sin(time * 0.5) * 0.15;
          leftLeaf.rotation.z = Math.PI / 6 + Math.sin(time * 3) * 0.05;
          rightLeaf.rotation.z = -Math.PI / 4 + Math.cos(time * 3) * 0.05;
        }

        renderer.render(scene, camera);
      };

      animate();
    };

    if (!window.THREE) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      script.onload = initThree;
      document.body.appendChild(script);
    } else {
      initThree();
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer && mountRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-80 flex items-center justify-center">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div ref={mountRef} className="w-full h-full absolute inset-0 z-10" />
    </div>
  );
}
