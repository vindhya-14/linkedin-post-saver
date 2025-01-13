const POST_SELECTORS = {
    content: '.feed-shared-update-v2__description-wrapper',
    author: '.feed-shared-actor__name',
    timestamp: '.feed-shared-actor__sub-description',
    engagement: '.social-details-social-counts',
    images: '.feed-shared-image__container img',
    links: '.feed-shared-article__description-container a'
  }
  
  function extractPostData() {
    const post = {}
  
    // Extract basic post content
    post.content = document.querySelector(POST_SELECTORS.content)?.innerText || ''
    post.author = document.querySelector(POST_SELECTORS.author)?.innerText || ''
    post.timestamp = document.querySelector(POST_SELECTORS.timestamp)?.innerText || ''
    post.url = window.location.href
  
    // Extract engagement metrics
    const engagement = document.querySelector(POST_SELECTORS.engagement)
    if (engagement) {
      post.likes = engagement.querySelector('[aria-label*="reactions"]')?.innerText || '0'
      post.comments = engagement.querySelector('[aria-label*="comments"]')?.innerText || '0'
    }
  
    // Extract images
    const images = Array.from(document.querySelectorAll(POST_SELECTORS.images))
    post.images = images.map(img => img.src)
  
    // Extract links
    const links = Array.from(document.querySelectorAll(POST_SELECTORS.links))
    post.links = links.map(link => ({
      url: link.href,
      title: link.innerText
    }))
  
    return post
  }
  
  // Add save button to posts
  function addSaveButtons() {
    const posts = document.querySelectorAll('.feed-shared-update-v2')
    posts.forEach(post => {
      if (!post.querySelector('.post-saver-button')) {
        const buttonContainer = document.createElement('div')
        buttonContainer.className = 'post-saver-button'
        buttonContainer.innerHTML = `
          <button class="artdeco-button artdeco-button--2 artdeco-button--secondary">
            <span class="artdeco-button__text">Save Post</span>
          </button>
        `
        post.querySelector('.feed-shared-control-menu')?.appendChild(buttonContainer)
      }
    })
  }
  
  // Listen for scroll to add save buttons to new posts
  const observer = new MutationObserver(addSaveButtons)
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
  
  // Handle messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_POST_DATA') {
      sendResponse({ data: extractPostData() })
    }
    return true
  })
  
  // Initial add of save buttons
  addSaveButtons()