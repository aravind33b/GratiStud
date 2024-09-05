'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const colors = ['bg-red-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-purple-200']

const colleges = [
  "College of Engineering",
  "D&apos;Amore-McKim School of Business",
  "Khoury College of Computer Sciences",
  "College of Social Sciences and Humanities",
  "Bouvé College of Health Sciences",
  "College of Arts, Media and Design",
  "School of Law",
  "College of Professional Studies",
  "College of Science",
]

// Define an interface for the post structure
interface Post {
  _id: string;
  author: string;
  message: string;
  hashtags?: string;
  college?: string;
}

export default function NUGratitudeApp() {
  const [message, setMessage] = useState('')
  const [author, setAuthor] = useState('')
  const [college, setCollege] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const fetchPosts = useCallback(async (pageNum = 1) => {
    try {
      const response = await fetch(`https://gratitudor-backend.onrender.com/api/posts?page=${pageNum}&limit=10`)
      const data: Post[] = await response.json()
      if (pageNum === 1) {
        setPosts(data)
      } else {
        setPosts(prevPosts => [...prevPosts, ...data])
      }
      setHasMore(data.length === 10)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    await fetchPosts(page + 1)
    setPage(prevPage => prevPage + 1)
    setIsLoadingMore(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message && author.trim()) {
      setIsSubmitting(true)
      const formattedHashtags = hashtags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')
        .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
        .join(' ')

      const newPost = {
        author: author.trim() || "Anonymous",
        message,
        hashtags: formattedHashtags,
        college: college || undefined,
      }

      try {
        const response = await fetch('https://gratitudor-backend.onrender.com/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost),
        })

        if (response.ok) {
          await fetchPosts()
          setMessage('')
          setAuthor('')
          setCollege('')
          setHashtags('')
          setShowSuccessMessage(true)
          setTimeout(() => setShowSuccessMessage(false), 3000)
        } else {
          console.error('Failed to create post')
        }
      } catch (error) {
        console.error('Error creating post:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-pink-50 to-white p-4 sm:p-8 flex flex-col">
      <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm flex-grow shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center text-red-600">University Gratitude Board 🎓</CardTitle>
          <p className="text-center text-black">Share what you&apos;re thankful for at your university!</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div>
              <Label htmlFor="author" className="text-black">Your Name</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="share your name and inspire others - break the chain!"
                className="text-black"
              />
              <p className="text-xs text-gray-600 mt-1">Sharing your name helps build a stronger, more connected Husky community!</p>
            </div>
            <div>
              <Label htmlFor="message" className="text-black">Gratitude Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="what are you grateful for?"
                required
                className="text-black"
              />
            </div>
            <div>
              <Label htmlFor="hashtags" className="text-black">Hashtags (Optional)</Label>
              <Input
                id="hashtags"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="hashtags are bae -- separated by commas (e.g., grateful, husky, northeastern)"
                className="text-black"
              />
            </div>
            <div>
              <Label htmlFor="college" className="text-black">College (Optional)</Label>
              <Select value={college} onValueChange={setCollege}>
                <SelectTrigger className="text-black bg-white border-gray-300">
                  <SelectValue placeholder="Select your college" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {colleges.map((c) => (
                    <SelectItem key={c} value={c} className="text-black hover:bg-gray-100">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black w-full transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg rounded-full py-2 font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sharing...' : 'Share Gratitude'}
            </Button>
          </form>

          <AnimatePresence>
            {showSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Thank you! </strong>
                <span className="block sm:inline">Your gratitude has been shared.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {posts.map((post: Post, index: number) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className={`
                    ${colors[index % colors.length]} 
                    p-4 rounded-lg shadow-md 
                    transform rotate-${Math.floor(Math.random() * 3) - 1} 
                    transition-all duration-300 ease-in-out
                    hover:rotate-0 hover:scale-105 hover:shadow-lg
                    hover:-translate-y-1 cursor-pointer
                  `}
                >
                  <h3 className="font-bold mb-2 text-black">{post.author}</h3>
                  <p className="text-sm mb-2 text-black">{post.message}</p>
                  {post.hashtags && <p className="text-xs text-gray-600">{post.hashtags}</p>}
                  {post.college && <p className="text-xs italic mt-1 text-black">{post.college}</p>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {hasMore && (
            <div className="mt-8 text-center">
              <Button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg rounded-full py-2 px-6 font-semibold"
              >
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <footer className="w-full max-w-4xl mx-auto text-center text-gray-600 text-sm sm:text-base bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Created by</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <a href="https://x.com/kashyab_19" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">@kashyab_19</a>
              <span className="hidden sm:inline">&</span>
              <a href="https://x.com/aravindguru33" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">@aravindguru33</a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Powered by</h3>
            <a href="https://x.com/cursor_ai" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">@cursor_ai</a>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Inspired by</h3>
            <a href='https://x.com/ankitkr0' target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">@ankitkr0</a>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p>&copy; 2024 Gratigram. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}