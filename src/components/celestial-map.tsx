"use client";

import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
import type { Story } from "@/lib/stories";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface CelestialMapProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

export function CelestialMap({ stories, onSelectStory }: CelestialMapProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredStory, setHoveredStory] = useState<Story | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    
    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 1;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Starfield
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
      opacity: 0.7,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Constellations
    const storyObjects: THREE.Object3D[] = [];
    stories.forEach((story) => {
      const group = new THREE.Group();
      group.userData = { story };
      story.constellation.forEach(pos => {
        const starGeo = new THREE.SphereGeometry(0.3, 24, 24);
        const starMat = new THREE.MeshBasicMaterial({ color: 0xD2B48C });
        const starMesh = new THREE.Mesh(starGeo, starMat);
        starMesh.position.set(pos.x, pos.y, pos.z);
        group.add(starMesh);
      });
      scene.add(group);
      storyObjects.push(group);
    });

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    const onClick = () => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(storyObjects, true);
        if (intersects.length > 0) {
            let parentGroup = intersects[0].object;
            while(parentGroup.parent && !(parentGroup.userData.story)) {
                parentGroup = parentGroup.parent;
            }
            if (parentGroup.userData.story) {
                onSelectStory(parentGroup.userData.story);
            }
        }
    }
    
    currentMount.addEventListener("mousemove", onMouseMove);
    currentMount.addEventListener("click", onClick);


    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update raycaster and check for intersections
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(storyObjects, true);

      let foundStory = null;
      storyObjects.forEach(obj => {
          (obj as THREE.Group).children.forEach(child => {
            ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).color.set(0xD2B48C);
          });
      });

      if (intersects.length > 0) {
        let parentGroup = intersects[0].object;
        while(parentGroup.parent && !(parentGroup.userData.story)) {
            parentGroup = parentGroup.parent;
        }

        if (parentGroup.userData.story) {
            foundStory = parentGroup.userData.story;
            (parentGroup as THREE.Group).children.forEach(child => {
                ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).color.set(0xffffff);
            });
        }
      }
      setHoveredStory(foundStory);


      stars.rotation.x += 0.0001;
      stars.rotation.y += 0.0001;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentMount) {
        currentMount.removeEventListener("mousemove", onMouseMove);
        currentMount.removeEventListener("click", onClick);
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [stories, onSelectStory]);

  return (
    <TooltipProvider>
      <Tooltip open={!!hoveredStory}>
        <TooltipTrigger asChild>
          <div ref={mountRef} className="w-full h-full cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent
          style={{
            top: `${mousePos.y + 15}px`,
            left: `${mousePos.x + 15}px`,
            pointerEvents: "none",
          }}
          className="font-headline"
        >
          {hoveredStory?.nakshatraName}: {hoveredStory?.title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
