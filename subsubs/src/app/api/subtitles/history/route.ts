import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const history = await db.subtitleHistory.findMany({
      orderBy: {
        downloadedAt: 'desc',
      },
      take: 50, // Limit to last 50 downloads
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error('History fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch download history' },
      { status: 500 }
    )
  }
}