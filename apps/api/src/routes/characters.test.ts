import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildApp } from '../app'
import { miraCharacterListItem, miraCharacterDetail, miraStory } from '../test/fixtures'

vi.mock('../lib/prisma', () => ({
  prisma: {
    character: { findMany: vi.fn(), findFirst: vi.fn() },
    story: { findFirst: vi.fn() },
  },
}))

import { prisma } from '../lib/prisma'

describe('GET /characters', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 200 with character list', async () => {
    vi.mocked(prisma.character.findMany).mockResolvedValue([miraCharacterListItem])
    const app = buildApp()
    const res = await app.inject({ method: 'GET', url: '/characters' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body[0].slug).toBe('mira-ashveil')
    expect(body[0].tags).toEqual(['mage', 'D&D 5e', 'retired'])
  })

  it('supports ?system= filter', async () => {
    vi.mocked(prisma.character.findMany).mockResolvedValue([])
    const app = buildApp()
    await app.inject({ method: 'GET', url: '/characters?system=D%26D+5e' })
    const call = vi.mocked(prisma.character.findMany).mock.calls[0]![0]!
    expect(call.where).toMatchObject({ system: { equals: 'D&D 5e', mode: 'insensitive' } })
  })
})

describe('GET /characters/:slug', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 404 for unknown slug', async () => {
    vi.mocked(prisma.character.findFirst).mockResolvedValue(null)
    const app = buildApp()
    const res = await app.inject({ method: 'GET', url: '/characters/unknown' })
    expect(res.statusCode).toBe(404)
  })

  it('returns character with tags flattened', async () => {
    vi.mocked(prisma.character.findFirst).mockResolvedValue(miraCharacterDetail)
    const app = buildApp()
    const res = await app.inject({ method: 'GET', url: '/characters/mira-ashveil' })
    expect(res.statusCode).toBe(200)
    expect(res.json().tags).toEqual(['mage', 'D&D 5e', 'retired'])
    expect(res.json().name).toBe('Mira Ashveil')
  })
})

describe('GET /characters/:slug/stories/:storySlug', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 404 for unknown story', async () => {
    vi.mocked(prisma.story.findFirst).mockResolvedValue(null)
    const app = buildApp()
    const res = await app.inject({ method: 'GET', url: '/characters/mira-ashveil/stories/unknown' })
    expect(res.statusCode).toBe(404)
  })

  it('returns the story', async () => {
    vi.mocked(prisma.story.findFirst).mockResolvedValue(miraStory)
    const app = buildApp()
    const res = await app.inject({ method: 'GET', url: '/characters/mira-ashveil/stories/the-last-spell' })
    expect(res.statusCode).toBe(200)
    expect(res.json().title).toBe('The Last Spell')
  })
})
