"use client"

import { useState, useEffect } from "react"
import { Search, Download, History, Film, Globe, Clock, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"

interface SubtitleResult {
  id: string
  attributes: {
    subtitle_id: string
    language: string
    release: string
    comments: string
    rating: number
    download_count: number
    fps: number
    feature_details: {
      feature_type: string
      year: number
      title: string
      imdb_id: number
    }
  }
}

interface HistoryItem {
  id: string
  title: string
  year?: string
  imdbId?: string
  subtitleId: string
  language: string
  downloadUrl: string
  fileName: string
  downloadedAt: string
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SubtitleResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [activeTab, setActiveTab] = useState<"search" | "history">("search")

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/subtitles/history")
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      }
    } catch (error) {
      console.error("Failed to fetch history:", error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch("/api/subtitles/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.data || [])
      } else {
        console.error("Search failed")
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleDownload = async (subtitle: SubtitleResult) => {
    try {
      const response = await fetch("/api/subtitles/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subtitleId: subtitle.attributes.subtitle_id,
          title: subtitle.attributes.feature_details.title,
          year: subtitle.attributes.feature_details.year,
          imdbId: subtitle.attributes.feature_details.imdb_id,
          language: subtitle.attributes.language,
          fileName: subtitle.attributes.release,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Create download link
        const link = document.createElement("a")
        link.href = data.downloadUrl
        link.download = data.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Refresh history
        fetchHistory()
      } else {
        console.error("Download failed")
      }
    } catch (error) {
      console.error("Download error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50/50 via-amber-50/30 to-orange-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Film className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            <h1 className="text-4xl font-bold text-gradient dark:text-gradient-dark">
              Beamlak SRTs
            </h1>
          </div>
          <ModeToggle />
        </div>

        {/* Tagline */}
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg">
          Search and download subtitles for your favorite movies and TV shows
        </p>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-1 flex space-x-1 border gold-border">
            <button
              onClick={() => setActiveTab("search")}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === "search"
                  ? "bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Search className="inline h-4 w-4 mr-2" />
              Search
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <History className="inline h-4 w-4 mr-2" />
              History
            </button>
          </div>
        </div>

        {/* Search Tab */}
        {activeTab === "search" && (
          <div className="max-w-4xl mx-auto">
            {/* Search Form */}
            <Card className="mb-8 bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span>Search Subtitles</span>
                </CardTitle>
                <CardDescription>
                  Enter a movie or TV show title to find subtitles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex space-x-4">
                  <Input
                    type="text"
                    placeholder="Enter movie or TV show title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={isSearching || !searchQuery.trim()}
                    className="button-hover"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Search Results ({searchResults.length})
                </h3>
                {searchResults.map((subtitle) => (
                  <Card key={subtitle.id} className="card-hover bg-background/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Film className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            <h4 className="text-lg font-semibold text-foreground">
                              {subtitle.attributes.feature_details.title}
                            </h4>
                            <span className="text-muted-foreground">
                              ({subtitle.attributes.feature_details.year})
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center space-x-1">
                              <Globe className="h-4 w-4" />
                              <span>{subtitle.attributes.language}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{subtitle.attributes.release}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>⭐ {subtitle.attributes.rating}</span>
                            </div>
                          </div>
                          {subtitle.attributes.comments && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {subtitle.attributes.comments}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => handleDownload(subtitle)}
                          className="button-hover ml-4"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {searchResults.length === 0 && searchQuery && !isSearching && (
              <Card className="bg-background/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No subtitles found for "{searchQuery}"</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span>Download History</span>
                </CardTitle>
                <CardDescription>
                  Your recently downloaded subtitles
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-yellow-600" />
                  </div>
                ) : history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg border gold-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <Film className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            <h4 className="font-semibold text-foreground">
                              {item.title}
                            </h4>
                            {item.year && (
                              <span className="text-muted-foreground">
                                ({item.year})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center space-x-1">
                              <Globe className="h-4 w-4" />
                              <span>{item.language}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(item.downloadedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {item.fileName}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No download history yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Search and download subtitles to see them here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}