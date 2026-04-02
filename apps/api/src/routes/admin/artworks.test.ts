import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildApp } from '../../app'
import { miraCharacterDetail, miraCharacterListItem } from '../../test/fixtures'

vi.mock('../../lib/prisma', () => ({
  prisma: {
    character: { findUnique: vi.fn() },
    artwork: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import { prisma } from '../../lib/prisma'

const mockArtwork = miraCharacterDetail.artworks[0]!
const otherUserCharacter = { ...miraCharacterListItem, createdById: 'user-2' }
const artworkWithCharacter = { ...mockArtwork, character: { createdById: 'user-1' } }
const artworkWithOtherCharacter = { ...mockArtwork, character: { createdById: 'user-2' } }

beforeEach(() => vi.clearAllMocks())

async function setup() {
  const app = buildApp()
  await app.ready()
  const token = app.jwt.sign({ userId: 'user-1', email: 'admin@example.com' })
  return { app, authCookie: `token=${token}` }
}

describe('GET /admin/characters/:id/artworks', () => {
  it('returns 200 with artwork list', async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(miraCharacterListItem)
    vi.mocked(prisma.artwork.findMany).mockResolvedValue([mockArtwork])
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'GET',
      url: '/admin/characters/cuid-mira/artworks',
      headers: { cookie: authCookie },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toHaveLength(1)
  })

  it('returns 403 when character belongs to another user', async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(otherUserCharacter)
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'GET',
      url: '/admin/characters/cuid-mira/artworks',
      headers: { cookie: authCookie },
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 401 when unauthenticated', async () => {
    const { app } = await setup()
    const res = await app.inject({
      method: 'GET',
      url: '/admin/characters/cuid-mira/artworks',
    })
    expect(res.statusCode).toBe(401)
  })
})

describe('POST /admin/characters/:id/artworks', () => {
  it('creates artwork and returns 201', async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(miraCharacterListItem)
    vi.mocked(prisma.artwork.create).mockResolvedValue(mockArtwork)
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'POST',
      url: '/admin/characters/cuid-mira/artworks',
      headers: { cookie: authCookie },
      payload: { imageUrl: 'https://placehold.co/800x1000/1a1a2e/e0e0e0?text=Mira' },
    })
    expect(res.statusCode).toBe(201)
    const call = vi.mocked(prisma.artwork.create).mock.calls[0]![0]!
    expect(call.data.characterId).toBe('cuid-mira')
  })

  it('returns 403 when character belongs to another user', async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(otherUserCharacter)
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'POST',
      url: '/admin/characters/cuid-mira/artworks',
      headers: { cookie: authCookie },
      payload: { imageUrl: 'https://example.com/art.jpg' },
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 401 when unauthenticated', async () => {
    const { app } = await setup()
    const res = await app.inject({
      method: 'POST',
      url: '/admin/characters/cuid-mira/artworks',
      payload: { imageUrl: 'https://example.com/art.jpg' },
    })
    expect(res.statusCode).toBe(401)
  })
})

describe('PUT /admin/artworks/:artworkId', () => {
  it('updates artwork and returns 200', async () => {
    vi.mocked(prisma.artwork.findUnique).mockResolvedValue(artworkWithCharacter)
    vi.mocked(prisma.artwork.update).mockResolvedValue({ ...mockArtwork, order: 1 })
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'PUT',
      url: '/admin/artworks/cuid-art-1',
      headers: { cookie: authCookie },
      payload: { order: 1 },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().order).toBe(1)
  })

  it('returns 404 when not found', async () => {
    vi.mocked(prisma.artwork.findUnique).mockResolvedValue(null)
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'PUT',
      url: '/admin/artworks/unknown',
      headers: { cookie: authCookie },
      payload: { order: 1 },
    })
    expect(res.statusCode).toBe(404)
  })

  it('returns 403 when artwork belongs to another user', async () => {
    vi.mocked(prisma.artwork.findUnique).mockResolvedValue(artworkWithOtherCharacter)
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'PUT',
      url: '/admin/artworks/cuid-art-1',
      headers: { cookie: authCookie },
      payload: { order: 1 },
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 401 when unauthenticated', async () => {
    const { app } = await setup()
    const res = await app.inject({
      method: 'PUT',
      url: '/admin/artworks/cuid-art-1',
      payload: { order: 1 },
    })
    expect(res.statusCode).toBe(401)
  })
})

describe('DELETE /admin/artworks/:artworkId', () => {
  it('deletes artwork and returns 204', async () => {
    vi.mocked(prisma.artwork.findUnique).mockResolvedValue(artworkWithCharacter)
    vi.mocked(prisma.artwork.delete).mockResolvedValue(mockArtwork)
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'DELETE',
      url: '/admin/artworks/cuid-art-1',
      headers: { cookie: authCookie },
    })
    expect(res.statusCode).toBe(204)
  })

  it('returns 404 when not found', async () => {
    vi.mocked(prisma.artwork.findUnique).mockResolvedValue(null)
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'DELETE',
      url: '/admin/artworks/unknown',
      headers: { cookie: authCookie },
    })
    expect(res.statusCode).toBe(404)
  })

  it('returns 403 when artwork belongs to another user', async () => {
    vi.mocked(prisma.artwork.findUnique).mockResolvedValue(artworkWithOtherCharacter)
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'DELETE',
      url: '/admin/artworks/cuid-art-1',
      headers: { cookie: authCookie },
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 401 when unauthenticated', async () => {
    const { app } = await setup()
    const res = await app.inject({ method: 'DELETE', url: '/admin/artworks/cuid-art-1' })
    expect(res.statusCode).toBe(401)
  })
})
