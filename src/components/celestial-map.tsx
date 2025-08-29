"use client";

import * as THREE from "three";
import React, { useRef, useEffect, useState, useMemo } from "react";
import type { Story } from "@/lib/stories";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

interface CelestialMapProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

const STAR_COLORS = [0xffffff, 0xffd2a1, 0xa1cfff];

function createIcon(IconComponent: React.ComponentType<{className?: string}>): THREE.Group {
    const iconContainer = document.createElement('div');
    iconContainer.innerHTML = new IconComponent({ className: 'w-8 h-8' }).props.dangerouslySetInnerHTML.__html;
    const svgElement = iconContainer.querySelector('svg')!;

    const loader = new SVGLoader();
    const svgData = loader.parse(new XMLSerializer().serializeToString(svgElement));
    
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({
        color: 0xD2B48C,
        opacity: 0.6,
        transparent: true,
        side: THREE.DoubleSide
    });

    svgData.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
            const geometry = new THREE.ShapeGeometry(shape);
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);
        });
    });

    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    box.getCenter(center);
    group.position.sub(center);
    group.scale.set(0.1, -0.1, 0.1);

    return group;
}

export function CelestialMap({ stories, onSelectStory }: CelestialMapProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredStory, setHoveredStory] = useState<Story | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const storyPositions = useMemo(() => {
    const positions: { story: Story; position: THREE.Vector3; boundingBox: THREE.Box2 }[] = [];
    const minSeparation = 40; 

    stories.forEach(story => {
      let position: THREE.Vector3;
      let boundingBox: THREE.Box2;
      let collision: boolean;

      do {
        collision = false;
        position = new THREE.Vector3(
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 40,
          -50 - Math.random() * 20
        );
        
        const size = new THREE.Vector2(30, 20);
        boundingBox = new THREE.Box2(
          new THREE.Vector2(position.x - size.x / 2, position.y - size.y / 2),
          new THREE.Vector2(position.x + size.x / 2, position.y + size.y / 2)
        );

        for (const p of positions) {
          if (boundingBox.intersectsBox(p.boundingBox)) {
             const dist = position.distanceTo(p.position);
             if (dist < minSeparation) {
                collision = true;
                break;
             }
          }
        }
      } while (collision);

      positions.push({ story, position, boundingBox });
    });
    return positions;
  }, [stories]);


  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0007);

    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const starVertices = [];
    for (let i = 0; i < 20000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const storyObjects: THREE.Object3D[] = [];
    storyPositions.forEach(({ story, position }) => {
      const group = new THREE.Group();
      group.userData = { story };
      group.position.copy(position);
      
      story.constellation.forEach(pos => {
        const size = 0.2 + Math.random() * 0.2;
        const starGeo = new THREE.SphereGeometry(size, 24, 24);
        const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
        const starMat = new THREE.MeshBasicMaterial({ 
          color,
          opacity: 0.8 + Math.random() * 0.2,
         });
        const starMesh = new THREE.Mesh(starGeo, starMat);
        starMesh.position.set(pos.x, pos.y, pos.z);
        group.add(starMesh);
      });

      const icon = createIcon(story.icon);
      icon.name = "story_icon";
      icon.position.set(0, 0, 0); 
      group.add(icon);

      scene.add(group);
      storyObjects.push(group);
    });

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

    const animate = () => {
      requestAnimationFrame(animate);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(storyObjects, true);

      let foundStory = null;
      storyObjects.forEach(obj => {
          (obj as THREE.Group).children.forEach(child => {
             if (child instanceof THREE.Mesh) {
                (child.material as THREE.MeshBasicMaterial).color.set(0xD2B48C);
             } else if (child.name === 'story_icon') {
                 (child as THREE.Group).children.forEach(c => {
                    if (c instanceof THREE.Mesh) {
                        (c.material as THREE.MeshBasicMaterial).color.set(0xD2B48C);
                        (c.material as THREE.MeshBasicMaterial).opacity = 0.6;
                    }
                 });
             }
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
                if (child instanceof THREE.Mesh) {
                    (child.material as THREE.MeshBasicMaterial).color.set(0xffffff);
                } else if (child.name === 'story_icon') {
                    (child as THREE.Group).children.forEach(c => {
                        if (c instanceof THREE.Mesh) {
                           (c.material as THREE.MeshBasicMaterial).color.set(0xffffff);
                           (c.material as THREE.MeshBasicMaterial).opacity = 1.0;
                        }
                    });
                }
            });
        }
      }
      setHoveredStory(foundStory);

      stars.rotation.x += 0.0001;
      stars.rotation.y += 0.0001;
      renderer.render(scene, camera);
    };
    animate();

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
  }, [stories, onSelectStory, storyPositions]);

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
