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
    clickToPlay: true, // Enable click to play/pause
    autopause: true,
    resetOnEnd: false,
    autoplay: false,
    muted: true,
    loop: { active: true }
  })
  
  // Track user interaction state
  let hasUserInteracted = false
  
  // Function to handle first interaction
  const handleFirstInteraction = () => {
    console.log('First user interaction - restarting with audio')
    hasUserInteracted = true
    
    // Stop current playback
    player.pause()
    
    // Reset to beginning
    player.currentTime = 0
    
    // Enable audio and disable loop
    player.muted = false
    player.loop = false
    
    // Add the CSS class that hides the overlay button
    const container = player.elements.container
    container.classList.add('user-clicked-audio')
    
    // Start playing
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
    
    // Intercept first click only
    const interceptFirstClick = (e) => {
      if (!hasUserInteracted) {
        e.preventDefault()
        e.stopPropagation()
        handleFirstInteraction()
        return false
      }
    }
    
    // Add capture phase listeners to intercept before Plyr
    container.addEventListener('click', interceptFirstClick, true)
    
    // Override overlay button behavior for first click
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (!hasUserInteracted) {
          e.preventDefault()
          e.stopPropagation()
          handleFirstInteraction()
        }
      }, true)
    }
  })
  
  // Maintain the user-clicked-audio class
  player.on('play', (e) => {
    if (hasUserInteracted && player.elements.container) {
      // Ensure the class stays on the container
      player.elements.container.classList.add('user-clicked-audio')
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