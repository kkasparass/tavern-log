// Fixture data mirrors apps/api/prisma/seed.ts — keep in sync when seed changes
import { CharacterStatus } from '@/lib/types'
import type { Character, StoryEntry } from '@/lib/types'

export const mockCharacter: Character = {
  id: 'cuid-mira',
  slug: 'mira-ashveil',
  name: 'Mira Ashveil',
  system: 'D&D 5e',
  campaign: 'The Shattered Crown',
  status: CharacterStatus.RETIRED,
  bio: 'A former court mage who walked away from power after the Siege of Valdenmoor. She now wanders the Ashwood, collecting debts and forgetting names.',
  personality: 'Dry wit, deeply loyal to a very short list of people. Distrusts institutions. Excellent at leaving before things get complicated.',
  thumbnailUrl: null,
  theme: { bgColor: '#1a1a2e', textColor: '#e0e0e0', accentColor: '#7c3aed' },
  tags: ['mage', 'D&D 5e', 'retired'],
  stories: [
    { id: 'cuid-story-1', slug: 'the-last-spell', title: 'The Last Spell', publishedAt: '2024-11-10T00:00:00.000Z' },
  ],
  voiceLines: [
    {
      id: 'cuid-vl-1',
      audioUrl: 'https://example.com/audio/mira-placeholder-1.mp3',
      transcript: "I don't do quests. I do favours, and favours have a price.",
      context: 'When first approached by the party in the Ashwood tavern.',
      order: 0,
    },
    {
      id: 'cuid-vl-2',
      audioUrl: 'https://example.com/audio/mira-placeholder-2.mp3',
      transcript: 'The thing about fire spells is that everyone expects you to feel bad about them afterward.',
      context: 'After the ambush at the Crossing.',
      order: 1,
    },
  ],
  artworks: [
    {
      id: 'cuid-art-1',
      imageUrl: 'https://placehold.co/800x1000/1a1a2e/e0e0e0?text=Mira+Ashveil',
      title: 'Mira in the Ashwood',
      caption: 'Portrait commission for The Shattered Crown campaign.',
      artistCredit: 'Placeholder Artist',
      order: 0,
    },
    {
      id: 'cuid-art-2',
      imageUrl: 'https://placehold.co/800x800/1a1a2e/7c3aed?text=The+Last+Spell',
      title: 'The Tower Burning',
      caption: 'Scene from "The Last Spell".',
      artistCredit: null,
      order: 1,
    },
  ],
  timeline: [
    {
      id: 'cuid-tl-1',
      title: 'Appointed Court Mage of Valdenmoor',
      description: 'At 24, Mira accepted the appointment she had spent six years working toward. She lasted three years before the Siege made the position meaningless.',
      dateLabel: 'Year 412 of the Compact',
      order: 0,
    },
    {
      id: 'cuid-tl-2',
      title: 'The Siege of Valdenmoor',
      description: 'The city fell in nine days. Mira held the eastern gate for seven of them.',
      dateLabel: 'Year 415 of the Compact',
      order: 1,
    },
    {
      id: 'cuid-tl-3',
      title: 'Retired to the Ashwood',
      description: 'Left the capital without notice. Took the grimoire, her travel cloak, and nothing that reminded her of the court.',
      dateLabel: 'Year 415 of the Compact, late autumn',
      order: 2,
    },
  ],
}

export const mockStory: StoryEntry = {
  id: 'cuid-story-1',
  slug: 'the-last-spell',
  title: 'The Last Spell',
  content:
    '<p>The tower was already burning when Mira climbed the final stair.</p>' +
    '<p>She had told herself she was only going back for the grimoire.</p>',
  isDraft: false,
  publishedAt: '2024-11-10T00:00:00.000Z',
  createdAt: '2024-11-10T00:00:00.000Z',
  updatedAt: '2024-11-10T00:00:00.000Z',
}

export const mockCharacterListItem = {
  id: mockCharacter.id,
  slug: mockCharacter.slug,
  name: mockCharacter.name,
  system: mockCharacter.system,
  thumbnailUrl: mockCharacter.thumbnailUrl,
  tags: mockCharacter.tags,
}
