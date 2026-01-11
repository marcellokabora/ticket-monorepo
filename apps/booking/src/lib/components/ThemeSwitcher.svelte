<script lang="ts">
  import "@ticketapp/ui";

  type ColorScheme = {
    id: string;
    name: string;
    description: string;
    preview: {
      dark: string;
      main: string;
      accent: string;
    };
    tokens: {
      // Primary palette overrides
      "color-primary-100": string;
      "color-primary-200": string;
      "color-primary-300": string;
      "color-primary-400": string;
      "color-primary-500": string;
      "color-primary-600": string;
      "color-primary-700": string;
      "color-primary-800": string;
      "color-primary-900": string;
    };
  };

  // Color schemes using Priority Pass UI design tokens
  // Default uses the green palette from tokens.css
  // Other schemes remap the primary palette to different color families
  const colorSchemes: ColorScheme[] = [
    {
      id: "default",
      name: "Priority Pass Green",
      description: "Default green theme",
      preview: {
        dark: "#0a412d",
        main: "#50b40a",
        accent: "#a0eb78",
      },
      tokens: {
        // Original green palette from tokens.css
        "color-primary-100": "#c8f0b4",
        "color-primary-200": "#beeba0",
        "color-primary-300": "#a0eb78",
        "color-primary-400": "#6ed22d",
        "color-primary-500": "#50b40a",
        "color-primary-600": "#328200",
        "color-primary-700": "#0f6446",
        "color-primary-800": "#0a412d",
        "color-primary-900": "#052819",
      },
    },
    {
      id: "ocean",
      name: "Ocean Blue",
      description: "Blue theme using secondary palette",
      preview: {
        dark: "#113e73",
        main: "#3473b2",
        accent: "#94b4d4",
      },
      tokens: {
        // Remap primary to secondary blue palette
        "color-primary-100": "#e6ecf3",
        "color-primary-200": "#dee5ed",
        "color-primary-300": "#b8cce0",
        "color-primary-400": "#94b4d4",
        "color-primary-500": "#698daf",
        "color-primary-600": "#478cd1",
        "color-primary-700": "#3473b2",
        "color-primary-800": "#113e73",
        "color-primary-900": "#0a2a4d",
      },
    },
    {
      id: "neutral",
      name: "Slate Gray",
      description: "Professional neutral theme",
      preview: {
        dark: "#001f3d",
        main: "#3d4d5c",
        accent: "#a9b8c6",
      },
      tokens: {
        // Remap primary to neutral grayscale
        "color-primary-100": "#f5f7fa",
        "color-primary-200": "#e3e6e8",
        "color-primary-300": "#c7ccd1",
        "color-primary-400": "#a9b8c6",
        "color-primary-500": "#73808c",
        "color-primary-600": "#3d4d5c",
        "color-primary-700": "#1a3040",
        "color-primary-800": "#001f3d",
        "color-primary-900": "#001020",
      },
    },
    {
      id: "success",
      name: "Vibrant Green",
      description: "Bright success green theme",
      preview: {
        dark: "#1a5c0a",
        main: "#4eb40c",
        accent: "#6ed22d",
      },
      tokens: {
        // Brighter green variant using system success as base
        "color-primary-100": "#d4f5c4",
        "color-primary-200": "#b8f0a0",
        "color-primary-300": "#8ee860",
        "color-primary-400": "#6ed22d",
        "color-primary-500": "#4eb40c",
        "color-primary-600": "#3a9000",
        "color-primary-700": "#2a6b00",
        "color-primary-800": "#1a5c0a",
        "color-primary-900": "#0d3000",
      },
    },
    {
      id: "alert",
      name: "Coral Red",
      description: "Warm coral theme",
      preview: {
        dark: "#7a2020",
        main: "#eb5757",
        accent: "#f5a0a0",
      },
      tokens: {
        // Red/coral theme based on system alert
        "color-primary-100": "#fde8e8",
        "color-primary-200": "#fbd0d0",
        "color-primary-300": "#f5a0a0",
        "color-primary-400": "#f07878",
        "color-primary-500": "#eb5757",
        "color-primary-600": "#d03030",
        "color-primary-700": "#a52020",
        "color-primary-800": "#7a2020",
        "color-primary-900": "#4a1010",
      },
    },
    {
      id: "royal",
      name: "Royal Purple",
      description: "Elegant purple theme",
      preview: {
        dark: "#3b0764",
        main: "#5d00f4",
        accent: "#a78bfa",
      },
      tokens: {
        // Purple theme based on system comments color
        "color-primary-100": "#ede9fe",
        "color-primary-200": "#ddd6fe",
        "color-primary-300": "#c4b5fd",
        "color-primary-400": "#a78bfa",
        "color-primary-500": "#8b5cf6",
        "color-primary-600": "#7c3aed",
        "color-primary-700": "#5d00f4",
        "color-primary-800": "#3b0764",
        "color-primary-900": "#1e0038",
      },
    },
  ];

  let drawerOpen = $state(false);
  let currentScheme = $state<string>("default");
  let mounted = $state(false);

  function applyColorScheme(scheme: ColorScheme) {
    const root = document.documentElement;

    // Override the primary color CSS variables from @ticketapp/ui tokens
    Object.entries(scheme.tokens).forEach(([token, value]) => {
      root.style.setProperty(`--${token}`, value);
    });

    currentScheme = scheme.id;

    // Save to localStorage
    localStorage.setItem("booking-color-scheme", scheme.id);
  }

  //   function resetToDefault() {
  //     const root = document.documentElement;
  //     const defaultScheme = colorSchemes.find((s) => s.id === "default")!;

  //     // Reset to original tokens
  //     Object.entries(defaultScheme.tokens).forEach(([token, value]) => {
  //       root.style.setProperty(`--${token}`, value);
  //     });

  //     currentScheme = "default";
  //     localStorage.removeItem("booking-color-scheme");
  //   }

  function selectScheme(scheme: ColorScheme) {
    applyColorScheme(scheme);
    drawerOpen = false;
  }

  function openDrawer() {
    drawerOpen = true;
  }

  function closeDrawer() {
    drawerOpen = false;
  }

  // Load saved scheme on mount
  $effect(() => {
    const savedSchemeId = localStorage.getItem("booking-color-scheme");
    if (savedSchemeId) {
      const savedScheme = colorSchemes.find((s) => s.id === savedSchemeId);
      if (savedScheme) {
        applyColorScheme(savedScheme);
      }
    }
    // Mark as mounted after theme is applied
    mounted = true;
  });
</script>

<!-- Floating Theme Button - only show after mount -->
{#if mounted}
  <button
    class="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer border-2 border-white/30 transition-transform hover:scale-110 active:scale-95 bg-primary-800"
    onclick={openDrawer}
    aria-label="Change color theme"
  >
    <lit-icon icon="mdi:palette" size="24" class="text-white"></lit-icon>
  </button>

  <!-- Theme Drawer -->
  <lit-drawer open={drawerOpen} ondrawer-close={closeDrawer}>
    <span slot="header">Choose Color Theme</span>
    <div slot="body" class="p-5">
      <p class="text-sm text-neutral-300 mb-4">
        Select a color scheme to customize the app's appearance. These themes
        use the Priority Pass design system tokens.
      </p>
      <div class="flex flex-col gap-3">
        {#each colorSchemes as scheme}
          <button
            class="w-full p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all border-2 {currentScheme ===
            scheme.id
              ? 'border-primary-500 bg-secondary-40'
              : 'border-transparent bg-secondary-20 hover:bg-secondary-40'}"
            onclick={() => selectScheme(scheme)}
          >
            <!-- Color Preview using design tokens -->
            <div class="flex gap-1">
              <div
                class="w-8 h-8 rounded-full shadow-sm"
                style="background-color: {scheme.preview.dark};"
              ></div>
              <div
                class="w-8 h-8 rounded-full shadow-sm -ml-3"
                style="background-color: {scheme.preview.main};"
              ></div>
              <div
                class="w-8 h-8 rounded-full shadow-sm -ml-3"
                style="background-color: {scheme.preview.accent};"
              ></div>
            </div>

            <!-- Scheme Info -->
            <div class="flex-1 text-left">
              <span class="font-semibold text-neutral-black block">
                {scheme.name}
              </span>
              <span class="text-xs text-neutral-300">
                {scheme.description}
              </span>
            </div>

            <!-- Check Icon for Selected -->
            {#if currentScheme === scheme.id}
              <lit-icon
                icon="mdi:check-circle"
                size="24"
                class="text-primary-500"
              ></lit-icon>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </lit-drawer>
{/if}
