// app/landing-2/page.tsx
import PageBackground from '@/components/PageBackground' // Your existing component
import Landing2Background from '@/components/Landing2Background' // New wrapper

export default function Landing2Page() {
  return (
    <Landing2Background>
      <PageBackground>
        {/* All your existing page content here */}
        <div>
          {/* Hero section */}
          {/* Interactive sections */}
          {/* Decorative elements (z-index: 1) */}
          {/* All other content */}
        </div>
      </PageBackground>
    </Landing2Background>
  )
}
