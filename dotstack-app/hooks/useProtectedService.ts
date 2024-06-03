import { useCallback, useState } from "react"
import { useToast } from "../components/ui/use-toast"

// For useProtectedService we don't need to pass an auth token. We can just call 'getSession' directly on the server.
// If the user is authenticated, we can return the random text. If not, we return an error.

export const useProtectedService = () => {
  const [randomText, setRandomText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { dismiss, toast } = useToast()

  const generate = useCallback(
    async () => {
      dismiss()
      setLoading(true)
      try {
        const res = await fetch("/api/protected", {
          method: "GET",
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setRandomText(data.randomText)
      } catch (e: any) {
        setRandomText(null)
        toast({
          title: "Failed to generate random text",
          description: e.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [dismiss, toast]
  )

  return { generate, randomText, loading }
}
