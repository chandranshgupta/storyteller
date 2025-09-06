
import type { ComponentType } from "react";

export interface Chapter {
  title: string;
  content: (string | { type: 'dialogue'; character: string; line: string })[];
  image: string;
  dataAiHint: string;
}

export interface ConstellationStar {
  name?: string; // Optional name to reference for lines
  x: number;
  y: number;
  z: number;
  brightness?: number; // Optional brightness multiplier (e.g., 1.5 for brighter)
}

export interface VideoAsset {
    title: string; 
    src: string;
    thumbnail: string;
}

export interface Story {
  id: string;
  title: string;
  nakshatraName: string;
  summary: string;
  characters: string[];
  icon: ComponentType<{ className?: string }>;
  chapters: Chapter[];
  constellation: ConstellationStar[];
  constellationLines?: string[][]; // Array of paths, each path is an array of star names
  videos?: VideoAsset[]; // Optional array of video objects
}

import { RamaPadukaIcon } from "@/components/icons/rama-paduka-icon";
import { ChakraIcon } from "@/components/icons/chakra-icon";
import { BowIcon } from "@/components/icons/bow-icon";

export const stories: Story[] = [
  {
    id: "ramayana",
    title: "The Ramayana",
    nakshatraName: "Punarvasu",
    summary:
      "An ancient Indian epic which narrates the struggle of the divine prince Rama to rescue his wife Sita from the demon king Ravana. Along with Mahabharata, it forms the Hindu Itihasa.",
    characters: ["Rama", "Sita", "Ravana", "Hanuman"],
    icon: RamaPadukaIcon,
    videos: [
        { title: "The Divine Birth", src: "/videos/0 - The Divine Birth.mp4", thumbnail: "/videos/thumbnails/0.jpg" },
        { title: "Journey to Janakpur", src: "/videos/1 - The Journey to Janakpur.mp4", thumbnail: "/videos/thumbnails/1.jpg" },
        { title: "Breaking the Bow", src: "/videos/2 - Breaking the Bow.mp4", thumbnail: "/videos/thumbnails/2.jpg" },
        { title: "The Marriage of Rama and Sita", src: "/videos/3 - The Marriage of Rama and Sita.mp4", thumbnail: "/videos/thumbnails/3.jpg" },
        { title: "The Exile", src: "/videos/4 - The Exile.mp4", thumbnail: "/videos/thumbnails/4.jpg" },
        { title: "The Golden Deer", src: "/videos/5 - The Golden Deer.mp4", thumbnail: "/videos/thumbnails/5.jpg" },
        { title: "Sita's Abduction", src: "/videos/6 - Sita's Abduction.mp4", thumbnail: "/videos/thumbnails/6.jpg" },
        { title: "Gathering the Army", src: "/videos/7 - Gathering the Army.mp4", thumbnail: "/videos/thumbnails/7.jpg" },
        { title: "The Defeat of Ravana", src: "/videos/8 - The Defeat of Ravana.mp4", thumbnail: "/videos/thumbnails/8.jpg" },
        { title: "The Triumphant Return to Ayodhya", src: "/videos/9 - The Triumphant Return to Ayodhya.mp4", thumbnail: "/videos/thumbnails/9.jpg" },
    ],
    chapters: [
      {
        title: "A Prince's Virtue",
        image: "https://picsum.photos/1200/800",
        dataAiHint: "ancient kingdom",
        content: [
          "In the ancient kingdom of Kosala, nestled along the Sarayu river, the noble king Dasharatha ruled from the grand city of Ayodhya. His eldest son, Rama, was the epitome of dharma—righteous, compassionate, and unwavering in his duty. He was loved by all, a beacon of hope and virtue.",
          { type: 'dialogue', character: 'Rama', line: 'A king must protect his people, not just with might, but with his heart.' },
          "His prowess with the bow was legendary, matched only by his wisdom. But fate, woven by the gods and the ambitions of mortals, had a different path for him than the throne of Ayodhya.",
        ],
      },
      {
        title: "The Forest Exile",
        image: "https://picsum.photos/1200/800",
        dataAiHint: "dense forest",
        content: [
            "Through the machinations of his stepmother, Queen Kaikeyi, Rama was exiled to the forest for fourteen years. His devoted wife, Sita, and his loyal brother, Lakshmana, refused to be parted from him, choosing to share his fate.",
            { type: 'dialogue', character: 'Sita', line: 'Where you go, I go. A palace without you is a wilderness, and a wilderness with you is my home.' },
            "They journeyed into the dense, untamed forests of Dandaka, leaving behind a kingdom in mourning. It was a test of spirit, a pilgrimage that would pit them against demons, sages, and the very forces of nature.",
        ],
      }
    ],
    constellation: [
      // Pollux Figure (Southern/Right Twin)
      { name: 'pollux', x: -5, y: 12.5, z: 0, brightness: 2.5 },
      { name: 'pollux_shoulder', x: -3.5, y: 8, z: 0 },
      { name: 'wasat', x: -3.5, y: 0, z: 0, brightness: 1.5 },
      { name: 'mekbuda', x: -5.5, y: -4, z: 0, brightness: 1.8 },
      { name: 'alhena', x: -3, y: -12, z: 0, brightness: 2.0 },
      
      // Castor Figure (Northern/Left Twin)
      { name: 'castor', x: 5, y: 14, z: 0, brightness: 2.2 },
      { name: 'castor_shoulder', x: 4, y: 9.5, z: 0 },
      { name: 'mebsuta', x: 8, y: 4, z: 0, brightness: 1.9 },
      { name: 'propus', x: 3, y: -6, z: 0, brightness: 1.6 },
      { name: 'tejat', x: 1, y: -10, z: 0, brightness: 1.7 },
      
      // Shared node
      { name: 'arm_link_point', x: 0, y: 7.5, z: 0 },
    ],
    constellationLines: [
        // Pollux's body and leg
        ['pollux', 'pollux_shoulder', 'wasat', 'mekbuda', 'alhena'],
        // Castor's body and legs
        ['castor', 'castor_shoulder', 'mebsuta', 'tejat'],
        ['mebsuta', 'propus'], // Fork for Castor's other leg
        // Connecting arms
        ['pollux_shoulder', 'arm_link_point', 'castor_shoulder']
    ]
  },
  {
    id: "mahabharata",
    title: "The Mahabharata",
    nakshatraName: "Jyeshtha",
    summary:
      "One of the two major Sanskrit epics of ancient India, the Mahabharata is an epic narrative of the Kurukshetra War and the fates of the Kaurava and the Pandava princes.",
    characters: ["Krishna", "Arjuna", "Draupadi", "Duryodhana"],
    icon: ChakraIcon,
    chapters: [
      {
        title: "The Field of Dharma",
        image: "https://picsum.photos/1200/800",
        dataAiHint: "epic battle",
        content: [
            "On the sacred field of Kurukshetra, two armies of cousins stood arrayed for war. The air was thick with the scent of steel and the sound of conch shells. The Pandava prince, Arjuna, a peerless archer, looked across the battlefield and saw his kinsmen, his teachers, and his friends standing against him.",
            { type: 'dialogue', character: 'Arjuna', line: 'Krishna, my limbs fail me and my mouth is dry. I see no good in killing my own kinsmen in battle.' },
            "His heart filled with despair, he lowered his mighty bow, Gandiva. It was then that his charioteer and divine guide, Lord Krishna, began to impart the timeless wisdom of the Bhagavad Gita.",
            { type: 'dialogue', character: 'Krishna', line: 'It is not the warrior who kills, but duty that commands action. Do your dharma, Arjuna, without attachment to the fruits of your labor.' }
        ],
      }
    ],
    constellation: [
      // Anchor Node
      { name: 'antares', x: 0, y: 0, z: 0, brightness: 2.9 },
      // Claws/Head
      { name: 'alniyat', x: -1.5, y: 2.5, z: 0, brightness: 1.8 },
      { name: 'dschubba', x: -2.5, y: 5.5, z: 0, brightness: 2.3 },
      { name: 'graffias', x: -4, y: 6.5, z: 0, brightness: 2.6 },
      { name: 'pi_sco', x: 0.5, y: 5, z: 0, brightness: 1.9 },
      // Body
      { name: 'body1', x: 1.5, y: -2.5, z: 0 },
      { name: 'body2', x: 2, y: -5, z: 0 },
      { name: 'tail_anchor', x: 2, y: -7.5, z: 0 },
      // Tail & Stinger
      { name: 'tail1', x: 1, y: -10, z: 0 },
      { name: 'sargas', x: -3.5, y: -14, z: 0, brightness: 1.9 },
      { name: 'tail2', x: -5.5, y: -13, z: 0 },
      { name: 'shaula', x: -7.5, y: -8.5, z: 0, brightness: 2.7 },
    ],
    constellationLines: [
      // Line for the claws
      ['graffias', 'dschubba', 'alniyat', 'antares'],
      ['pi_sco', 'antares'],
      // Line for the body and tail
      ['antares', 'body1', 'body2', 'tail_anchor', 'tail1', 'sargas', 'tail2', 'shaula'],
    ]
  },
];
