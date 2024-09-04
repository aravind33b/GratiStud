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
  "D'Amore-McKim School of Business",
  "Khoury College of Computer Sciences",
  "College of Social Sciences and Humanities",
  "Bouvé College of Health Sciences",
  "College of Arts, Media and Design",
  "School of Law",
  "College of Professional Studies",
  "College of Science",
]

export default function NUGratitudeApp() {
  const [message, setMessage] = useState('')
  const [author, setAuthor] = useState('')
  const [college, setCollege] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [posts, setPosts] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
    const intervalId = setInterval(fetchPosts, 30000)
    return () => clearInterval(intervalId)
  }, [fetchPosts])

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
        author: author.trim(),
        message,
        hashtags: formattedHashtags,
        college: college || undefined,
      }

      try {
        const response = await fetch('http://localhost:3001/api/posts', {
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
          setTimeout(() => setShowSuccessMessage(false), 3000) // Hide message after 3 seconds
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
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-black p-8">
      <Card className="max-w-4xl mx-auto bg-white">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center text-red-600">husky gratitude board 🐶</CardTitle>
          <p className="text-center text-black">Share what you're thankful for at Northeastern University!</p>
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
                required
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
              className="bg-red-600 hover:bg-red-700 text-white w-full"
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
              {posts.map((post: any, index: number) => (
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
        </CardContent>
      </Card>
    </div>
  )
}