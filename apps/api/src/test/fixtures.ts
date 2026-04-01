// Fixture data mirrors apps/api/prisma/seed.ts — keep in sync when seed changes
import { CharacterStatus, type Story, type VoiceLine, type Artwork, type TimelineEvent, type Prisma } from '@prisma/client'

// Shape returned by GET /characters (findMany with tags selected)
type CharacterListItem = Prisma.CharacterGetPayload<{
  include: { tags: { select: { tag: true } } }
}>

// Shape returned by GET /characters/:slug (findFirst with all includes)
type CharacterDetail = Prisma.CharacterGetPayload<{
  include: {
    tags: { select: { tag: true } }
    stories: { select: { id: true; slug: true; title: true; publishedAt: true } }
    voiceLines: true
    artworks: true
    timeline: true
  }
}>

export const miraCharacterListItem: CharacterListItem = {
  id: 'cuid-mira',
  slug: 'mira-ashveil',
  name: 'Mira Ashveil',
  system: 'D&D 5e',
  campaign: 'The Shattered Crown',
  status: CharacterStatus.RETIRED,
  bio: 'A former court mage who walked away from power after the Siege of Valdenmoor. She now wanders the Ashwood, collecting debts and forgetting names.',
  personality: 'Dry wit, deeply loyal to a very short list of people. Distrusts institutions. Excellent at leaving before things get complicated.',
  thumbnailUrl: null,
  isPublic: true,
  theme: { bgColor: '#1a1a2e', textColor: '#e0e0e0', accentColor: '#7c3aed' },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  tags: [{ tag: 'mage' }, { tag: 'D&D 5e' }, { tag: 'retired' }],
}

export const miraStory: Story = {
  id: 'cuid-story-1',
  characterId: 'cuid-mira',
  slug: 'the-last-spell',
  title: 'The Last Spell',
  content:
    '<p>The tower was already burning when Mira climbed the final stair.</p>' +
    '<p>She had told herself she was only going back for the grimoire.</p>',
  isDraft: false,
  publishedAt: new Date('2024-11-10'),
  createdAt: new Date('2024-11-10'),
  updatedAt: new Date('2024-11-10'),
}

const miraVoiceLines: VoiceLine[] = [
  {
    id: 'cuid-vl-1',
    characterId: 'cuid-mira',
    audioUrl: 'https://example.com/audio/mira-placeholder-1.mp3',
    transcript: "I don't do quests. I do favours, and favours have a price.",
    context: 'When first approached by the party in the Ashwood tavern.',
    order: 0,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'cuid-vl-2',
    characterId: 'cuid-mira',
    audioUrl: 'https://example.com/audio/mira-placeholder-2.mp3',
    transcript: 'The thing about fire spells is that everyone expects you to feel bad about them afterward.',
    context: 'After the ambush at the Crossing.',
    order: 1,
    createdAt: new Date('2024-01-01'),
  },
]

const miraArtworks: Artwork[] = [
  {
    id: 'cuid-art-1',
    characterId: 'cuid-mira',
    imageUrl: 'https://placehold.co/800x1000/1a1a2e/e0e0e0?text=Mira+Ashveil',
    title: 'Mira in the Ashwood',
    caption: 'Portrait commission for The Shattered Crown campaign.',
    artistCredit: 'Placeholder Artist',
    order: 0,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'cuid-art-2',
    characterId: 'cuid-mira',
    imageUrl: 'https://placehold.co/800x800/1a1a2e/7c3aed?text=The+Last+Spell',
    title: 'The Tower Burning',
    caption: 'Scene from "The Last Spell".',
    artistCredit: null,
    order: 1,
    createdAt: new Date('2024-01-01'),
  },
]

const miraTimeline: TimelineEvent[] = [
  {
    id: 'cuid-tl-1',
    characterId: 'cuid-mira',
    title: 'Appointed Court Mage of Valdenmoor',
    description: 'At 24, Mira accepted the appointment she had spent six years working toward. She lasted three years before the Siege made the position meaningless.',
    dateLabel: 'Year 412 of the Compact',
    order: 0,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'cuid-tl-2',
    characterId: 'cuid-mira',
    title: 'The Siege of Valdenmoor',
    description: 'The city fell in nine days. Mira held the eastern gate for seven of them.',
    dateLabel: 'Year 415 of the Compact',
    order: 1,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'cuid-tl-3',
    characterId: 'cuid-mira',
    title: 'Retired to the Ashwood',
    description: 'Left the capital without notice. Took the grimoire, her travel cloak, and nothing that reminded her of the court.',
    dateLabel: 'Year 415 of the Compact, late autumn',
    order: 2,
    createdAt: new Date('2024-01-01'),
  },
]

export const miraCharacterDetail: CharacterDetail = {
  ...miraCharacterListItem,
  stories: [
    { id: miraStory.id, slug: miraStory.slug, title: miraStory.title, publishedAt: miraStory.publishedAt },
  ],
  voiceLines: miraVoiceLines,
  artworks: miraArtworks,
  timeline: miraTimeline,
}
