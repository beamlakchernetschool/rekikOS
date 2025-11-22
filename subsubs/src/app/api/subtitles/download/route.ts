import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const OPENSUBTITLES_API_KEY = process.env.OPENSUBTITLES_API_KEY
const OPENSUBTITLES_BASE_URL = 'https://api.opensubtitles.com/api/v1'

export async function POST(request: NextRequest) {
  try {
    const { 
      subtitleId, 
      title, 
      year, 
      imdbId, 
      language, 
      fileName 
    } = await request.json()

    if (!subtitleId) {
      return NextResponse.json(
        { error: 'Subtitle ID is required' },
        { status: 400 }
      )
    }

    if (!OPENSUBTITLES_API_KEY) {
      return NextResponse.json(
        { error: 'OpenSubtitles API key is not configured' },
        { status: 500 }
      )
    }

    // Get download link from OpenSubtitles
    const downloadResponse = await fetch(
      `${OPENSUBTITLES_BASE_URL}/download`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'BeamlakSRTs v1.0',
          'Api-Key': OPENSUBTITLES_API_KEY,
        },
        body: JSON.stringify({
          file_id: subtitleId,
        }),
      }
    )

    if (!downloadResponse.ok) {
      throw new Error(`OpenSubtitles download error: ${downloadResponse.status}`)
    }

    const downloadData = await downloadResponse.json()
    
    // Save to database
    await db.subtitleHistory.create({
      data: {
        title,
        year: year?.toString(),
        imdbId: imdbId?.toString(),
        subtitleId,
        language,
        downloadUrl: downloadData.link,
        fileName: fileName || `${title}.${language}.srt`,
      },
    })

    return NextResponse.json({
      downloadUrl: downloadData.link,
      fileName: fileName || `${title}.${language}.srt`,
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to download subtitle' },
      { status: 500 }
    )
  }
}