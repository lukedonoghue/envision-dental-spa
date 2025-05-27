import './styles.css'
import Alpine from 'alpinejs'
import intersect from '@alpinejs/intersect'
import { initToolbar } from '@stagewise/toolbar'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

Alpine.plugin(intersect)
window.Alpine = Alpine
Alpine.start()

// Initialize Plyr video player
document.addEventListener('DOMContentLoaded', () => {
  const player = new Plyr('#video-player', {
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
    settings: [],
    keyboard: { focused: true, global: false },
    tooltips: { controls: true, seek: true },
    hideControls: true,
    clickToPlay: false, // Disable default click to play
    autopause: true,
    resetOnEnd: false,
    autoplay: false,
    muted: true,
    loop: { active: true }
  })
  
  // Track user interaction state
  let hasClickedForAudio = false
  
  // Function to restart video with audio
  const restartWithAudio = () => {
    console.log('User clicked - restarting with audio from beginning')
    hasClickedForAudio = true
    
    // Hide the large play button overlay by adding CSS class
    const container = player.elements.container
    container.classList.add('user-clicked-audio')
    container.classList.add('plyr--playing')
    
    // Stop current playback
    player.pause()
    
    // Reset to beginning
    player.currentTime = 0
    
    // Enable audio
    player.muted = false
    
    // Disable looping
    player.loop = false
    
    // Start playing with audio
    player.play()
  }
  
  // When player is ready, start autoplay
  player.on('ready', () => {
    console.log('Player ready - starting muted autoplay')
    
    // Start muted autoplay after short delay
    setTimeout(() => {
      player.muted = true
      player.loop = true
      player.play()
      
      // Ensure large play button remains visible (CSS handles this)
      const container = player.elements.container
      container.classList.remove('plyr--playing') // Remove to show overlay
      
    }, 500)
    
    // Get all clickable elements
    const container = player.elements.container
    const video = container.querySelector('video')
    const overlay = container.querySelector('.plyr__control--overlaid')
    const playButton = container.querySelector('[data-plyr="play"]')
    
    // Add click listener to video element
    if (video) {
      video.addEventListener('click', (e) => {
        if (!hasClickedForAudio) {
          e.preventDefault()
          e.stopPropagation()
          restartWithAudio()
        }
      })
    }
    
    // Add click listener to overlay play button
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (!hasClickedForAudio) {
          e.preventDefault()
          e.stopPropagation()
          restartWithAudio()
        }
      })
    }
    
    // Add click listener to control bar play button
    if (playButton) {
      playButton.addEventListener('click', (e) => {
        if (!hasClickedForAudio) {
          e.preventDefault()
          e.stopPropagation()
          restartWithAudio()
        }
      })
    }
  })
  
  // Prevent default play behavior during muted autoplay phase
  player.on('play', (e) => {
    if (!hasClickedForAudio && !player.muted) {
      // This shouldn't happen, but if it does, ensure we're muted
      player.muted = true
    }
  })
  
  // Make player globally available
  window.plyrPlayer = player
})

// Initialize Stagewise toolbar in development mode
if (import.meta.env.DEV) {
  console.log('Initializing Stagewise toolbar...')
  
  // Initialize after a short delay to ensure DOM is ready
  setTimeout(() => {
    try {
      initToolbar({
        position: 'bottom-right',
        theme: 'dark',
        plugins: []
      })
      console.log('Stagewise toolbar initialized successfully')
    } catch (error) {
      console.error('Error initializing Stagewise toolbar:', error)
    }
  }, 1000)
}