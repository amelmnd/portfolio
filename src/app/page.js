import Hero from '../components/Hero/Hero'
import Skills from '../components/Skills/Skills'
import Projects from '../components/Projects/Projects'
import Contact from '../components/Contact/Contact'
import ReferenceCarousel from '../components/ReferenceCarousel/ReferenceCarousel'
import Timeline from '../components/Timeline/Timeline'
import BlogSection from '@/components/Portfolio/BlogSection'

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Timeline />
        <BlogSection />
        <ReferenceCarousel />
        <Contact />
      </main>
    </>
  );
}
