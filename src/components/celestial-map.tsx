

"use client";

import * as THREE from "three";
import React, { useRef, useEffect, useState, useMemo } from "react";
import type { Story, ConstellationStar } from "@/lib/stories";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

interface CelestialMapProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

function createIcon(iconSvgString: string): THREE.Group {
    const loader = new SVGLoader();
    const svgData = loader.parse(iconSvgString);
    
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

function createStarShape(size: number) {
  const shape = new THREE.Shape();
  const outerRadius = size;
  const innerRadius = size * 0.4;
  const points = 4;
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i / points) * Math.PI;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();
  return shape;
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
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const storyObjects: THREE.Object3D[] = [];

    storyPositions.forEach(({ story, position }) => {
      const group = new THREE.Group();
      group.userData = { story };
      group.position.copy(position);
      
      const starMap: { [key: string]: THREE.Vector3 } = {};
      const starGroups: THREE.Group[] = [];

      story.constellation.forEach((starData: ConstellationStar) => {
        const starGroup = new THREE.Group();
        const brightness = starData.brightness || 1.0;
        
        // Star Core
        const coreSize = (0.2 + Math.random() * 0.1) * brightness;
        const starShape = createStarShape(coreSize);
        const coreGeo = new THREE.ShapeGeometry(starShape);
        const coreMat = new THREE.MeshBasicMaterial({
          color: 0xfff0d8,
          transparent: true,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        starGroup.add(coreMesh);
        

        starGroup.position.set(starData.x, starData.y, 0);
        starGroup.userData.initialBrightness = brightness;
        starGroup.userData.randomOffset = Math.random() * 100;
        group.add(starGroup);
        starGroups.push(starGroup);

        if (starData.name) {
          starMap[starData.name] = starGroup.position;
        }
      });

      // Add constellation lines
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x999999,
        transparent: true,
        opacity: 0.3
      });

      if (story.constellationLines) {
        story.constellationLines.forEach(path => {
           const points = path.map(name => starMap[name]).filter(Boolean);
           if (points.length > 1) {
              const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
              const line = new THREE.Line(lineGeometry, lineMaterial);
              group.add(line);
           }
        });
      }


      const icon = createIcon(story.icon({ className: "w-8 h-8" }));
      icon.name = "story_icon";
      icon.position.set(0, 0, 0); 
      group.add(icon);

      scene.add(group);
      storyObjects.push(group);
    });

    // --- COMET IMPLEMENTATION ---
    const comet = new THREE.Group();

    // Comet Head
    const cometHeadGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const cometHeadMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });
    const cometHead = new THREE.Mesh(cometHeadGeo, cometHeadMat);
    comet.add(cometHead);
    
    // Comet Tail
    const tailLength = 20;
    const tailWidth = 0.8;
    const segments = 5;
    const tailVertices = [];
    for (let i = 0; i < segments; i++) {
        const progress = i / (segments - 1);
        const currentWidth = tailWidth * (1 - progress);
        const yPos = -i * (tailLength / segments);
        tailVertices.push(currentWidth / 2, yPos, 0);
        tailVertices.push(-currentWidth / 2, yPos, 0);
    }
    const tailIndices = [];
    for (let i = 0; i < segments - 1; i++) {
        const p1 = i * 2;
        const p2 = p1 + 1;
        const p3 = (i + 1) * 2;
        const p4 = p3 + 1;
        tailIndices.push(p1, p2, p3);
        tailIndices.push(p2, p4, p3);
    }

    const cometTailGeo = new THREE.BufferGeometry();
    cometTailGeo.setAttribute('position', new THREE.Float32BufferAttribute(tailVertices, 3));
    cometTailGeo.setIndex(tailIndices);

    const cometTailMat = new THREE.MeshBasicMaterial({
        color: 0xaaaaff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });
    const cometTail = new THREE.Mesh(cometTailGeo, cometTailMat);
    comet.add(cometTail);
    
    scene.add(comet);
    
    let cometData = {
        active: false,
        velocity: new THREE.Vector3(),
        startTime: 0,
        life: 0, 
        resetTimeout: -1,
    };

    const clock = new THREE.Clock();
    
    function launchComet() {
        cometData.active = true;
        cometData.startTime = clock.getElapsedTime();
        cometData.life = 3 + Math.random() * 4; // Lives for 3-7 seconds

        const angle = Math.random() * Math.PI * 2;
        const startPos = new THREE.Vector3(Math.cos(angle) * 80, Math.sin(angle) * 40, -50 - Math.random() * 50);
        
        const targetAngle = angle + (Math.PI * 0.8 - Math.random() * Math.PI * 1.6);
        const endPos = new THREE.Vector3(Math.cos(targetAngle) * 80, Math.sin(targetAngle) * 40, startPos.z);
        
        comet.position.copy(startPos);
        const direction = new THREE.Vector3().subVectors(endPos, startPos).normalize();
        const speed = 0.5 + Math.random() * 0.3;
        cometData.velocity.copy(direction).multiplyScalar(speed);

        comet.rotation.z = Math.atan2(cometData.velocity.y, cometData.velocity.x) - Math.PI / 2;
    }

    function scheduleNextComet() {
        const randomInterval = Math.random() * 8000 + 4000; // 4 to 12 seconds
        cometData.resetTimeout = window.setTimeout(launchComet, randomInterval);
    }

    scheduleNextComet();


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

      const time = clock.getElapsedTime();

      // Twinkle effect for constellation stars
      storyObjects.forEach(obj => {
        (obj as THREE.Group).children.forEach(child => {
           if (child instanceof THREE.Group && child.name !== 'story_icon') {
              const baseBrightness = child.userData.initialBrightness || 1.0;
              const randomOffset = child.userData.randomOffset || 0;
              
              const pulse = (Math.sin(time * 1.5 + randomOffset) + 1) / 2;
              const scale = 1 + pulse * 0.4 * baseBrightness;
              const opacity = 0.7 + pulse * 0.3 * baseBrightness;

              const coreMesh = child.children[0] as THREE.Mesh;

              coreMesh.scale.set(scale, scale, scale);
              (coreMesh.material as THREE.Material).opacity = opacity;
           }
        });
      });

      // Animate comet
      if (cometData.active) {
          comet.position.add(cometData.velocity);
          const lifeLived = time - cometData.startTime;
          
          let opacity = 0;
          if (lifeLived < cometData.life) {
              const fadeInDuration = 1.0;
              const fadeOutDuration = 1.5;
              if (lifeLived < fadeInDuration) {
                  opacity = lifeLived / fadeInDuration;
              } else if (lifeLived > cometData.life - fadeOutDuration) {
                  opacity = (cometData.life - lifeLived) / fadeOutDuration;
              } else {
                  opacity = 1.0;
              }
          }

          cometHeadMat.opacity = opacity;
          cometTailMat.opacity = opacity * 0.5; // Tail is fainter
          
          if (lifeLived >= cometData.life) {
              cometData.active = false;
              scheduleNextComet();
          }
      }


      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(storyObjects, true);

      let foundStory = null;
      storyObjects.forEach(obj => {
          (obj as THREE.Group).children.forEach(child => {
             if (child.name === 'story_icon') {
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
               if (child.name === 'story_icon') {
                   (child as THREE.Group).children.forEach(c => {
                       if (c instanceof THREE.Mesh) {
                          (c.material as THREE.MeshBasicMaterial).color.set(0xffe4b5);
                          (c.material as THREE.MeshBasicMaterial).opacity = 1.0;
                       }
                   });
               }
            });
        }
      }
      setHoveredStory(foundStory);

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      currentMount.removeEventListener("mousemove", onMouseMove);
      currentMount.removeEventListener("click", onClick);
      if (renderer.domElement.parentElement === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      if(cometData.resetTimeout) {
          clearTimeout(cometData.resetTimeout);
      }
    };
  }, [storyPositions, onSelectStory]);

  return (
    <>
      <div ref={mountRef} className="w-full h-full absolute top-0 left-0" />
       {hoveredStory && (
         <TooltipProvider>
            <Tooltip open={true}>
                <TooltipTrigger asChild>
                    <div style={{ position: 'fixed', left: mousePos.x + 15, top: mousePos.y + 15, pointerEvents: 'none' }}></div>
                </TooltipTrigger>
                <TooltipContent className="font-headline text-lg">
                    <p>{hoveredStory.title}</p>
                    <p className="text-sm text-muted-foreground">{hoveredStory.nakshatraName}</p>
                </TooltipContent>
            </Tooltip>
         </TooltipProvider>
      )}
    </>
  );
}
