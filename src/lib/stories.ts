import type { ComponentType } from "react";

export interface Chapter {
  title: string;
  content: (string | { type: 'dialogue'; character: string; line: string })[];
  image: string;
  dataAiHint: string;
}

export interface Story {
  id: string;
  title: string;
  nakshatraName: string;
  summary: string;
  characters: string[];
  icon: ComponentType<{ className?: string }>;
  chapters: Chapter[];
  constellation: { x: number; y: number; z: number }[];
}

import { BowIcon } from "@/components/icons/bow-icon";
import { ChakraIcon } from "@/components/icons/chakra-icon";

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
    constellation: [
      { x: -15, y: 15, z: -40 },
      { x: -18, y: 12, z: -42 },
      { x: -12, y: 10, z: -38 },
      { x: -10, y: 18, z: -45 },
    ],
  },
  {
    id: "mahabharata",
    title: "The Mahabharata",
    nakshatraName: "Krittika",
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
      { x: 20, y: -5, z: -35 },
      { x: 22, y: -8, z: -37 },
      { x: 18, y: -10, z: -33 },
      { x: 25, y: -2, z: -39 },
      { x: 15, y: -4, z: -32 },
    ],
  },
];
