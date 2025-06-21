import Header from '../components/Header/Header'
import Hero from '../components/Hero/Hero'
import Skills from '../components/Skills/Skills'
import Projects from '../components/Projects/Projects'
import Contact from '../components/Contact/Contact'
import ReferenceCarousel from '../components/ReferenceCarousel/ReferenceCarousel'
import WorkTimeline from '../components/WorkTimeline/WorkTimeline'
import EducationTimeline from '@/components/EducationTimeline/EducationTimeline'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* <Skills /> */}
        {/* <Projects /> */}
        <EducationTimeline />
        <WorkTimeline />
        <ReferenceCarousel />
        <Contact />
      </main>
    </>
  )
}
