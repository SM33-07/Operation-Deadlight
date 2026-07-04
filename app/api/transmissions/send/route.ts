import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isDbAvailable, db } from '@/db'
import { emailTransmissions } from '@/db/schema'
import { setSession } from '@/lib/session'
import { mockTransmissions, MockTransmission } from '@/lib/mockDb'
import { eq, and, gte } from 'drizzle-orm'
import crypto from 'crypto'
import { getClientIp, isRateLimited, verifyCsrf } from '@/lib/rateLimit'

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  email: z.string().trim().email('Invalid email address.').toLowerCase(),
  sector: z.string().trim().min(1, 'Sector is required.'),
})

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: NextRequest) {
  try {
    // 1. CSRF validation
    if (!verifyCsrf(request)) {
      return NextResponse.json({ success: false, message: 'CSRF validation failed.' }, { status: 403 })
    }

    // 2. IP-based rate limiting
    const ip = getClientIp(request)
    if (isRateLimited(ip, 5, 60 * 60 * 1000, 'transmissions-send')) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body: unknown = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 })
    }

    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(' ')
      return NextResponse.json({ success: false, message: errorMsg }, { status: 400 })
    }

    // Sanitize and escape inputs to prevent HTML injection
    const name = escapeHtml(parsed.data.name)
    const email = escapeHtml(parsed.data.email)
    const sector = escapeHtml(parsed.data.sector)

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    // Rate Limiting Check (Max 3 sends per email per hour)
    if (isDbAvailable) {
      try {
        const recentSends = await db
          .select()
          .from(emailTransmissions)
          .where(
            and(
              eq(emailTransmissions.email, email),
              gte(emailTransmissions.sentAt, oneHourAgo)
            )
          )

        if (recentSends.length >= 3) {
          return NextResponse.json(
            { success: false, message: 'Rate limit exceeded. Maximum 3 transmission requests per hour.' },
            { status: 429 }
          )
        }
      } catch (dbErr) {
        console.error('Database query error in send rate limit check:', dbErr)
      }
    } else {
      const mockRecent = Array.from(mockTransmissions.values()).filter(
        t => t.email === email && t.sentAt >= oneHourAgo
      )
      if (mockRecent.length >= 3) {
        return NextResponse.json(
          { success: false, message: 'Rate limit exceeded. Maximum 3 transmission requests per hour.' },
          { status: 429 }
        )
      }
    }

    // Set user session in cookies (log them in)
    const userId = await setSession(name, email)

    // Generate unique recovery key containing 'PLAGAS' as the middle part
    let recoveryKey = ''
    let isUnique = false
    let attempts = 0

    while (!isUnique && attempts < 10) {
      attempts++
      const part1 = crypto.randomBytes(2).toString('hex').toUpperCase()
      const part2 = 'PLAGAS'
      const part3 = crypto.randomBytes(2).toString('hex').toUpperCase()
      recoveryKey = `${part1}-${part2}-${part3}`

      if (isDbAvailable) {
        try {
          const existing = await db
            .select()
            .from(emailTransmissions)
            .where(eq(emailTransmissions.recoveryKey, recoveryKey))
          if (existing.length === 0) {
            isUnique = true
          }
        } catch (dbErr) {
          console.error('Database error checking recovery key uniqueness:', dbErr)
          const existing = Array.from(mockTransmissions.values()).find(
            t => t.recoveryKey === recoveryKey
          )
          if (!existing) isUnique = true
        }
      } else {
        const existing = Array.from(mockTransmissions.values()).find(
          t => t.recoveryKey === recoveryKey
        )
        if (!existing) {
          isUnique = true
        }
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { success: false, message: 'Cryptographic collision error. Please try again.' },
        { status: 500 }
      )
    }

    // Save transmission record (Drizzle or Mock)
    const transmissionId = crypto.randomUUID()
    const newRecord: MockTransmission = {
      id: transmissionId,
      name,
      email,
      sector,
      stageId: 2,
      answer: 'PLAGAS',
      recoveryKey,
      isVerified: false,
      sentAt: new Date(),
      verifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      resendCount: 0,
      lastResentAt: null,
      deliveryStatus: 'delivered',
      deliveryError: null,
    }

    if (isDbAvailable) {
      try {
        await db.insert(emailTransmissions).values({
          id: transmissionId,
          name,
          email,
          sector,
          stageId: 2,
          answer: 'PLAGAS',
          recoveryKey,
          isVerified: false,
          sentAt: newRecord.sentAt,
          createdAt: newRecord.createdAt,
          updatedAt: newRecord.updatedAt,
          deliveryStatus: 'delivered',
          deliveryError: null,
        })
      } catch (dbErr) {
        console.error('Database insert error in transmissions/send:', dbErr)
      }
    }
    mockTransmissions.set(transmissionId, newRecord)

    return NextResponse.json({
      success: true,
      transmission: {
        id: transmissionId,
        name,
        email,
        sector,
      },
    })
  } catch (error: any) {
    console.error('Transmission send API exception:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    )
  }
}
