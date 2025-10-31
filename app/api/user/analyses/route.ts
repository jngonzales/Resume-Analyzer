import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ensureUserExists } from '@/lib/ensure-user'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user exists in database
    const userId = await ensureUserExists(session.user.email, session.user.name, session.user.image)

    const analyses = await prisma.analysis.findMany({
      where: { userId },
      orderBy: { analyzedAt: 'desc' },
      take: 10,
    })

    return NextResponse.json(analyses)
  } catch (error) {
    console.error('Fetch analyses error:', error)
    return NextResponse.json({ error: 'Failed to fetch analyses' }, { status: 500 })
  }
}
