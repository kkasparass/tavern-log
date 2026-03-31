import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean slate on each run
  await prisma.timelineEvent.deleteMany()
  await prisma.artwork.deleteMany()
  await prisma.voiceLine.deleteMany()
  await prisma.story.deleteMany()
  await prisma.characterTag.deleteMany()
  await prisma.character.deleteMany()
  await prisma.user.deleteMany()

  // Seed user (placeholder — real bcrypt hash added in Milestone 3)
  await prisma.user.create({
    data: {
      email: 'admin@tavernlog.dev',
      passwordHash: 'placeholder',
    },
  })

  // Seed character
  const character = await prisma.character.create({
    data: {
      slug: 'mira-ashveil',
      name: 'Mira Ashveil',
      system: 'D&D 5e',
      campaign: 'The Shattered Crown',
      status: 'RETIRED',
      bio: 'A former court mage who walked away from power after the Siege of Valdenmoor. She now wanders the Ashwood, collecting debts and forgetting names.',
      personality: 'Dry wit, deeply loyal to a very short list of people. Distrusts institutions. Excellent at leaving before things get complicated.',
      isPublic: true,
      theme: {
        bgColor: '#1a1a2e',
        textColor: '#e0e0e0',
        accentColor: '#7c3aed',
      },
      tags: {
        create: [
          { tag: 'mage' },
          { tag: 'D&D 5e' },
          { tag: 'retired' },
        ],
      },
      stories: {
        create: [
          {
            title: 'The Last Spell',
            slug: 'the-last-spell',
            content:
              '<p>The tower was already burning when Mira climbed the final stair.</p>' +
              '<p>She had told herself she was only going back for the grimoire. That was the lie she needed to believe long enough to get there. The truth was simpler and harder: she was going back for Emric, because she always went back for Emric, even when she swore she would not.</p>' +
              '<p>He was unconscious on the observatory floor, one arm flung over his eyes as if sleeping. The fire had not reached him yet. She had perhaps four minutes.</p>',
            isDraft: false,
            publishedAt: new Date('2024-11-10'),
          },
        ],
      },
      voiceLines: {
        create: [
          {
            audioUrl: 'https://example.com/audio/mira-placeholder-1.mp3',
            transcript: "I don't do quests. I do favours, and favours have a price.",
            context: 'When first approached by the party in the Ashwood tavern.',
            order: 0,
          },
          {
            audioUrl: 'https://example.com/audio/mira-placeholder-2.mp3',
            transcript:
              'The thing about fire spells is that everyone expects you to feel bad about them afterward. I stopped feeling bad about things that needed doing a long time ago.',
            context: 'After the ambush at the Crossing.',
            order: 1,
          },
        ],
      },
      artworks: {
        create: [
          {
            imageUrl: 'https://placehold.co/800x1000/1a1a2e/e0e0e0?text=Mira+Ashveil',
            title: 'Mira in the Ashwood',
            caption: 'Portrait commission for The Shattered Crown campaign.',
            artistCredit: 'Placeholder Artist',
            order: 0,
          },
          {
            imageUrl: 'https://placehold.co/800x800/1a1a2e/7c3aed?text=The+Last+Spell',
            title: 'The Tower Burning',
            caption: 'Scene from "The Last Spell".',
            order: 1,
          },
        ],
      },
      timeline: {
        create: [
          {
            title: 'Appointed Court Mage of Valdenmoor',
            description:
              'At 24, Mira accepted the appointment she had spent six years working toward. She lasted three years before the Siege made the position meaningless.',
            dateLabel: 'Year 412 of the Compact',
            order: 0,
          },
          {
            title: 'The Siege of Valdenmoor',
            description:
              'The city fell in nine days. Mira held the eastern gate for seven of them. She does not speak about the other two.',
            dateLabel: 'Year 415 of the Compact',
            order: 1,
          },
          {
            title: 'Retired to the Ashwood',
            description:
              'Left the capital without notice. Took the grimoire, her travel cloak, and nothing that reminded her of the court.',
            dateLabel: 'Year 415 of the Compact, late autumn',
            order: 2,
          },
        ],
      },
    },
  })

  console.log(`Seeded character: ${character.name} (${character.slug})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
