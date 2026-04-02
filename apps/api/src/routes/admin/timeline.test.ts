import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildApp } from '../../app'
import { miraCharacterDetail } from '../../test/fixtures'

vi.mock('../../lib/prisma', () => ({
  prisma: {
    timelineEvent: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import { prisma } from '../../lib/prisma'

const mockEvent = miraCharacterDetail.timeline[0]!

beforeEach(() => vi.clearAllMocks())

async function setup() {
  const app = buildApp()
  await app.ready()
  const token = app.jwt.sign({ userId: 'user-1', email: 'admin@example.com' })
  return { app, authCookie: `token=${token}` }
}

describe('GET /admin/characters/:id/timeline', () => {
  it('returns 200 with timeline event list', async () => {
    vi.mocked(prisma.timelineEvent.findMany).mockResolvedValue([mockEvent])
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'GET',
      url: '/admin/characters/cuid-mira/timeline',
      headers: { cookie: authCookie },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toHaveLength(1)
  })

  it('returns 401 when unauthenticated', async () => {
    const { app } = await setup()
    const res = await app.inject({
      method: 'GET',
      url: '/admin/characters/cuid-mira/timeline',
    })
    expect(res.statusCode).toBe(401)
  })
})

describe('POST /admin/characters/:id/timeline', () => {
  it('creates timeline event and returns 201', async () => {
    vi.mocked(prisma.timelineEvent.create).mockResolvedValue(mockEvent)
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'POST',
      url: '/admin/characters/cuid-mira/timeline',
      headers: { cookie: authCookie },
      payload: { title: 'Appointed Court Mage' },
    })
    expect(res.statusCode).toBe(201)
    const call = vi.mocked(prisma.timelineEvent.create).mock.calls[0]![0]!
    expect(call.data.characterId).toBe('cuid-mira')
  })

  it('returns 401 when unauthenticated', async () => {
    const { app } = await setup()
    const res = await app.inject({
      method: 'POST',
      url: '/admin/characters/cuid-mira/timeline',
      payload: { title: 'New Event' },
    })
    expect(res.statusCode).toBe(401)
  })
})

describe('PUT /admin/timeline/:eventId', () => {
  it('updates timeline event and returns 200', async () => {
    vi.mocked(prisma.timelineEvent.findUnique).mockResolvedValue(mockEvent)
    vi.mocked(prisma.timelineEvent.update).mockResolvedValue({ ...mockEvent, order: 1 })
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'PUT',
      url: '/admin/timeline/cuid-tl-1',
      headers: { cookie: authCookie },
      payload: { order: 1 },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().order).toBe(1)
  })

  it('returns 404 when not found', async () => {
    vi.mocked(prisma.timelineEvent.findUnique).mockResolvedValue(null)
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'PUT',
      url: '/admin/timeline/unknown',
      headers: { cookie: authCookie },
      payload: { order: 1 },
    })
    expect(res.statusCode).toBe(404)
  })

  it('returns 401 when unauthenticated', async () => {
    const { app } = await setup()
    const res = await app.inject({
      method: 'PUT',
      url: '/admin/timeline/cuid-tl-1',
      payload: { order: 1 },
    })
    expect(res.statusCode).toBe(401)
  })
})

describe('DELETE /admin/timeline/:eventId', () => {
  it('deletes timeline event and returns 204', async () => {
    vi.mocked(prisma.timelineEvent.findUnique).mockResolvedValue(mockEvent)
    vi.mocked(prisma.timelineEvent.delete).mockResolvedValue(mockEvent)
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'DELETE',
      url: '/admin/timeline/cuid-tl-1',
      headers: { cookie: authCookie },
    })
    expect(res.statusCode).toBe(204)
  })

  it('returns 404 when not found', async () => {
    vi.mocked(prisma.timelineEvent.findUnique).mockResolvedValue(null)
    const { app, authCookie } = await setup()
    const res = await app.inject({
      method: 'DELETE',
      url: '/admin/timeline/unknown',
      headers: { cookie: authCookie },
    })
    expect(res.statusCode).toBe(404)
  })

  it('returns 401 when unauthenticated', async () => {
    const { app } = await setup()
    const res = await app.inject({ method: 'DELETE', url: '/admin/timeline/cuid-tl-1' })
    expect(res.statusCode).toBe(401)
  })
})
