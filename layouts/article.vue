<template>
  <article ref="article">
    <!-- TODO: could be refactored as a transparent ButtonLink -->
    <NuxtLink
      :to="parentPath"
      class="back"
    >
      <Icon name="ph:arrow-left" />
      <span>
        Back
      </span>
    </NuxtLink>

    <ClientOnly>
      <div class="like-container">
        <button @click="likeArticle" class="like-button">❤️ {{ likes || 0 }}</button>
        
        <!-- Container for floating hearts -->
        <div class="hearts-container">
          <div
            v-for="heart in hearts"
            :key="heart.id"
            class="floating-heart"
            :style="{
              left: heart.x + 'px',
              animationDuration: heart.duration + 's'
            }"
          >
            ❤️
          </div>
        </div>
      </div>
    </ClientOnly>

    <header>
      <h1
        v-if="page?.title"
        class="title"
      >
        {{ page.title }}
      </h1>
      <time
        v-if="page?.date"
        :datetime="page.date"
      >
        {{ formatDate(page.date) }}
      </time>
    </header>

    <div class="prose">
      <slot />
      <div
        v-if="alpine?.backToTop"
        class="back-to-top"
      >
        <ProseA @click.prevent.stop="onBackToTop">
          {{ alpine?.backToTop?.text || 'Back to top' }}
          <Icon :name="alpine?.backToTop?.icon || 'material-symbols:arrow-upward'" />
        </ProseA>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">

const { page } = useContent()
const route = useRoute()
const hearts = ref<{ id: number; x: number; duration: number }[]>([])
let nextHeartId = 0
const alpine = useAppConfig().alpine
const slug = typeof route.params.slug === 'string' ? route.params.slug : route.params.slug[1] || route.params.slug[0]
const article = ref<HTMLElement | null>(null)

const likes = ref(0)

onMounted(async () => {
  const supabase = useSupabaseClient()
  
  // Fetch likes only on client-side
  const { data } = await supabase
    .from('likes')
    .select('likes')
    .eq('article_slug', slug)
    .maybeSingle()
  
  likes.value = data?.likes || 0
})

if (page.value) {
  const linkArray = []
  const metaArray = []
  
  if (page.value.cover) {
    metaArray.push({ property: 'og:image', content: page.value.cover })
  }
  if (page.value.canonical) {
    linkArray.push({ rel: 'canonical', href: page.value.canonical })
  }
  useHead({
    meta: metaArray,
    link: linkArray
  })
}

const parentPath = computed(
  () => {
    const pathTabl = route.path.split('/')
    pathTabl.pop()
    return pathTabl.join('/')
  }
)

const onBackToTop = () => {
  article.value?.scrollIntoView({
    behavior: 'smooth'
  })
}

function addFloatingHeart() {
  const id = nextHeartId++
  // Randomize position and animation duration for "snake" effect
  const x = Math.floor(Math.random() * 60) - 30 // Random position between -30px and +30px
  const duration = 1.5 + Math.random() * 1 // Random duration between 1.5s and 2.5s
  
  // Add the heart to the array
  hearts.value.push({ id, x, duration })
  
  // Remove the heart after animation completes
  setTimeout(() => {
    hearts.value = hearts.value.filter(h => h.id !== id)
  }, duration * 1000)
}

async function likeArticle() {
  if (process.client) {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase.rpc('increment_likes', { slug });
    
    if (!error) {
      likes.value = data as number
      
      // Add multiple hearts for a nicer effect
      for (let i = 0; i < 3; i++) {
        setTimeout(() => addFloatingHeart(), i * 100) // Stagger heart creation
      }
    }
  }
}

</script>

<style scoped lang="ts">
css({
  article: {
    position: 'relative',
    maxWidth: '{alpine.readableLine}',
    mx: 'auto',
    py: '{space.4}',
    '@sm': {
      py: '{space.12}',
    },
    '.back': {
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '{text.lg.fontSize}',
      borderBottom: '1px solid {elements.border.secondary.static}',
      '& :deep(svg)': {
        width: '{size.16}',
        height: '{size.16}',
        marginRight: '{space.2}'
      }
    },
    header: {
      marginTop: '{space.16}',
      marginBottom: '{space.12}',
    },
    '.title': {
      fontSize: '{text.5xl.fontSize}',
      lineHeight: '{text.5xl.lineHeight}',
      fontWeight: '{fontWeight.semibold}',
      marginBottom: '{space.4}'
    },
    time: {
      color: '{elements.text.secondary.color.static}'
    },
    '.prose': {
      '.back-to-top': {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        a: {
          cursor: 'pointer',
          fontSize: '{text.lg.fontSize}'
        }
      },
      '& :deep(h1)': {
        display: 'none'
      },
    }
  },

  '.like-container': {
    position: 'relative',
    display: 'inline-block',
    marginTop: '{space.4}',
  },

  '.like-button': {
    fontSize: '{text.2xl.fontSize}',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '{space.2}',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    '&:active': {
      transform: 'scale(0.9)',
    },
  },

  '.hearts-container': {
    position: 'absolute',
    width: '100px',
    height: '200px',
    bottom: '80%',
    left: '65%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
  },

  '.floating-heart': {
    position: 'absolute',
    bottom: '0',
    fontSize: '{text.2xl.fontSize}',
    animation: 'floatHeart 2s ease-in-out forwards',
  },

  '@keyframes floatHeart': {
    '0%': {
      transform: 'translateY(0) rotate(0deg)',
      opacity: '1',
    },
    '20%': {
      transform: 'translateY(-30px) translateX(10px) rotate(10deg)',
    },
    '40%': {
      transform: 'translateY(-60px) translateX(-15px) rotate(-10deg)',
    },
    '60%': {
      transform: 'translateY(-90px) translateX(10px) rotate(8deg)',
    },
    '80%': {
      transform: 'translateY(-120px) translateX(-5px) rotate(-8deg)',
      opacity: '0.6',
    },
    '100%': {
      transform: 'translateY(-150px) translateX(0) rotate(0deg)',
      opacity: '0',
    },
  },
})
</style>