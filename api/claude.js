{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Commit that, wait for redeploy, then test this URL in your browser:
```
https://ipl-fantasy-akashkotak85s-projects.vercel.app/api/claude
