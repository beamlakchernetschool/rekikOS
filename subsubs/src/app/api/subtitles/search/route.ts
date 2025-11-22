import { NextRequest, NextResponse } from 'next/server'

const OPENSUBTITLES_API_KEY = process.env.OPENSUBTITLES_API_KEY
const OPENSUBTITLES_BASE_URL = 'https://api.opensubtitles.com/api/v1'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    if (!OPENSUBTITLES_API_KEY) {
      return NextResponse.json(
        { error: 'OpenSubtitles API key is not configured' },
        { status: 500 }
      )
    }

    // Search for subtitles
    const searchResponse = await fetch(
      `${OPENSUBTITLES_BASE_URL}/subtitles?query=${encodeURIComponent(query)}&languages=en`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'BeamlakSRTs v1.0',
        },
      }
    )

    if (!searchResponse.ok) {
      throw new Error(`OpenSubtitles API error: ${searchResponse.status}`)
    }

    const searchData = await searchResponse.json()

    return NextResponse.json(searchData)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search subtitles' },
      { status: 500 }
    )
  }
}