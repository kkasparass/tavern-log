export enum CharacterStatus {
  ACTIVE = 'ACTIVE',
  RETIRED = 'RETIRED',
  DECEASED = 'DECEASED',
}

export type CharacterTheme = {
  bgColor?: string
  textColor?: string
  accentColor?: string
  bgPattern?: string
  transition?: string
}

export type CharacterStory = {
  id: string
  slug: string
  title: string
  publishedAt: string | null
}

export type CharacterVoiceLine = {
  id: string
  audioUrl: string
  transcript: string
  context: string | null
  order: number
}

export type CharacterArtwork = {
  id: string
  imageUrl: string
  title: string | null
  caption: string | null
  artistCredit: string | null
  order: number
}

export type CharacterTimelineEvent = {
  id: string
  title: string
  description: string | null
  dateLabel: string | null
  order: number
}

export type Character = {
  id: string
  slug: string
  name: string
  system: string
  campaign: string | null
  status: CharacterStatus
  bio: string | null
  personality: string | null
  thumbnailUrl: string | null
  theme: CharacterTheme
  tags: string[]
  stories: CharacterStory[]
  voiceLines: CharacterVoiceLine[]
  artworks: CharacterArtwork[]
  timeline: CharacterTimelineEvent[]
}
