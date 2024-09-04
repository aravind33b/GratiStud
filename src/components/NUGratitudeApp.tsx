'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockPosts = [
  { id: 1, author: "HuskyFan22", message: "Grateful for my amazing co-op experience at a tech startup!", hashtag: "#NUexperience" },
  { id: 2, author: "NEUGlobetrotter", message: "Just finished my study abroad in London. So thankful for the global opportunities at Northeastern!", hashtag: "#NUabroad" },
  { id: 3, author: "LibraryLover", message: "Snell Library's 24/7 hours are a lifesaver during finals week. Thanks, NU!", hashtag: "#SnellSavesLives" },
  { id: 4, author: "HuskyHockey", message: "Cheering for our team at Matthews Arena always brightens my day. Go Huskies!", hashtag: "#HowlinHuskies" },
  { id: 5, author: "CampusExplorer", message: "The beautiful fall colors on Centennial Common make me appreciate our campus every day.", hashtag: "#NUcampus" },
]

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
  const [posts, setPosts] = useState(mockPosts)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message) {
      const formattedHashtags = hashtags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')
        .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
        .join(' ')

      const newPost = {
        id: posts.length + 1,
        author: author.trim() || "Anonymous",
        message,
        hashtags: formattedHashtags,
        college: college || undefined,
      }
      setPosts([newPost, ...posts])
      setMessage('')
      setAuthor('')
      setCollege('')
      setHashtags('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-black p-8">
      <Card className="max-w-4xl mx-auto bg-white">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center text-red-600">Husky Gratitude Board</CardTitle>
          <p className="text-center text-black">Share what you're thankful for at Northeastern University!</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div>
              <Label htmlFor="author" className="text-black">Your Name (Optional)</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter your name or leave blank for anonymous"
                className="text-black"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-black">Gratitude Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What are you grateful for?"
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
                placeholder="Enter hashtags separated by commas (e.g., grateful, husky, northeastern)"
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
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">Share Gratitude</Button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post, index) => (
              <div 
                key={post.id} 
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}