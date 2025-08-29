import type { ComponentType } from "react";

export interface Chapter {
  title: string;
  content: (string | { type: 'dialogue'; character: string; line: string })[];
  image: string;
  dataAiHint: string;
}

export interface ConstellationStar {
  x: number;
  y: number;
  z: number;
  brightness?: number; // Optional brightness multiplier (e.g., 1.5 for brighter)
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
    icon: BowIcon,
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
    constellation: [ // Gemini
      { x: -5, y: 10, z: 0, brightness: 2.2 },  // Castor
      { x: -8, y: 8, z: 2, brightness: 2.5 },   // Pollux
      { x: -3, y: 4, z: -1, brightness: 1.5 }, // Wasat
      { x: 3, y: -2, z: 2, brightness: 1.2 },
      { x: 5, y: -5, z: 1, brightness: 1.6 },  // Tejat Posterior
      { x: -1, y: -8, z: -2, brightness: 1.9 },// Alhena
      { x: 6, y: -8, z: 0, brightness: 1.3 },
    ],
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
    constellation: [ // Scorpius
      { x: 1, y: 2, z: 0, brightness: 2.8 },    // Antares (The heart)
      { x: 0, y: 5, z: -1, brightness: 1.8 },   // Graffias
      { x: 2.5, y: 4.5, z: 1, brightness: 1.6 }, // Dschubba
      { x: 3.5, y: 4, z: 1.5 },
      { x: 1.5, y: -1, z: 0.5, brightness: 1.5 },
      { x: 2, y: -3, z: -0.5, brightness: 1.6 },
      { x: 3.5, y: -5.5, z: -1, brightness: 1.7 },
      { x: 5, y: -8, z: -1.5, brightness: 1.5 },
      { x: 4, y: -10.5, z: -1 },
      { x: 2, y: -12, z: -0.5, brightness: 1.9 }, // Sargas
      { x: -0.5, y: -13, z: 0.5 },
      { x: -3, y: -14, z: 1 },
      { x: -5, y: -13, z: 1.5, brightness: 2.2 }, // Shaula (stinger)
      { x: -6, y: -12, z: 2, brightness: 2.1 },   // Lesath (stinger)
    ],
  },
];
