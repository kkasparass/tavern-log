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

export const naraStory: Story = {
  id: 'cuid-nara-story-1',
  characterId: 'cuid-nara',
  slug: 'the-crows-foot-job',
  title: "The Crow's Foot Job",
  content:
    "<p>The job was supposed to take twenty minutes. It took three days and cost Nara two ribs and a contact she'd spent years cultivating.</p>" +
    "<p>She'd do it again. The Red Sashes had been charging their cut on every shipment through the Dusk ward for six years. Someone had to make that stop.</p>",
  isDraft: false,
  publishedAt: new Date('2025-02-14'),
  createdAt: new Date('2025-02-14'),
  updatedAt: new Date('2025-02-14'),
}

export const naraCharacterListItem: CharacterListItem = {
  id: 'cuid-nara',
  slug: 'nara-solis',
  name: 'Nara Solis',
  system: 'Blades in the Dark',
  campaign: 'Shadows of Doskvol',
  status: CharacterStatus.ACTIVE,
  bio: "Former dockworker turned enforcer for the Red Sashes. She cut ties with the crew after a job went sideways in the Dusk ward and now runs her own small operation out of Crow's Foot.",
  personality: "Pragmatic to a fault. Doesn't enjoy violence but is very good at it. Has a reputation for honoring her word — which in Doskvol is either an asset or a liability depending on who's asking.",
  thumbnailUrl: null,
  isPublic: true,
  theme: { bgColor: '#1c1408', textColor: '#e8d5b0', accentColor: '#d4901a' },
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  tags: [{ tag: 'scoundrel' }, { tag: 'Blades in the Dark' }, { tag: 'active' }],
}

const naraVoiceLines: VoiceLine[] = [
  {
    id: 'cuid-nara-vl-1',
    characterId: 'cuid-nara',
    audioUrl: 'https://example.com/audio/nara-placeholder-1.mp3',
    transcript: "I don't take jobs I can't finish. Problem is, I always finish them.",
    context: 'Before agreeing to work with the party.',
    order: 0,
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'cuid-nara-vl-2',
    characterId: 'cuid-nara',
    audioUrl: 'https://example.com/audio/nara-placeholder-2.mp3',
    transcript: 'Doskvol teaches you two things: how to disappear, and how to hit before they see you coming.',
    context: 'During a tense standoff in the Dusk ward.',
    order: 1,
    createdAt: new Date('2025-01-01'),
  },
]

const naraArtworks: Artwork[] = [
  {
    id: 'cuid-nara-art-1',
    characterId: 'cuid-nara',
    imageUrl: 'https://placehold.co/800x1000/1c1408/e8d5b0?text=Nara+Solis',
    title: "Nara in Crow's Foot",
    caption: 'Portrait commission for Shadows of Doskvol.',
    artistCredit: 'Placeholder Artist',
    order: 0,
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'cuid-nara-art-2',
    characterId: 'cuid-nara',
    imageUrl: 'https://placehold.co/800x800/1c1408/d4901a?text=The+Job',
    title: 'The Dusk Ward Job',
    caption: 'Scene from "The Crow\'s Foot Job".',
    artistCredit: null,
    order: 1,
    createdAt: new Date('2025-01-01'),
  },
]

const naraTimeline: TimelineEvent[] = [
  {
    id: 'cuid-nara-tl-1',
    characterId: 'cuid-nara',
    title: 'Joined the Red Sashes',
    description: 'Took the enforcer contract at 19. She told herself it was temporary.',
    dateLabel: 'Year 847 of the Imperial Calendar',
    order: 0,
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'cuid-nara-tl-2',
    characterId: 'cuid-nara',
    title: 'The Dusk Ward Incident',
    description: 'A routine collection turned into a three-day standoff. She walked out; most of the Red Sashes in the ward did not.',
    dateLabel: 'Year 849 of the Imperial Calendar',
    order: 1,
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'cuid-nara-tl-3',
    characterId: 'cuid-nara',
    title: "Established her crew in Crow's Foot",
    description: 'Took on two associates and a leaky safehouse off Tanners Alley. Called it an upgrade.',
    dateLabel: 'Year 849 of the Imperial Calendar, late winter',
    order: 2,
    createdAt: new Date('2025-01-01'),
  },
]

export const naraCharacterDetail: CharacterDetail = {
  ...naraCharacterListItem,
  stories: [
    { id: naraStory.id, slug: naraStory.slug, title: naraStory.title, publishedAt: naraStory.publishedAt },
  ],
  voiceLines: naraVoiceLines,
  artworks: naraArtworks,
  timeline: naraTimeline,
}

export const miraCharacterDetail: CharacterDetail = {
  ...miraCharacterListItem,
  stories: [
    { id: miraStory.id, slug: miraStory.slug, title: miraStory.title, publishedAt: miraStory.publishedAt },
  ],
  voiceLines: miraVoiceLines,
  artworks: miraArtworks,
  timeline: miraTimeline,
}
