<script>
  import "@ticketapp/ui";
  import "@ticketapp/ui/styles/tailwind.css";

  /** @type {{ id: string; name: string; type: 'app' | 'package'; framework?: string; description: string; path?: string; x: number; y: number; dependencies: string[] }[]} */
  const nodes = [
    // Packages (top row)
    {
      id: "ui",
      name: "@ticketapp/ui",
      type: "package",
      description: "Lit web components design system",
      x: 170,
      y: 60,
      dependencies: [],
    },
    {
      id: "api",
      name: "@ticketapp/api",
      type: "package",
      description: "ticketapp API client with Zod validation",
      x: 420,
      y: 60,
      dependencies: [],
    },
    {
      id: "utils",
      name: "@ticketapp/utils",
      type: "package",
      description: "Shared utilities and PersistentStore",
      x: 670,
      y: 60,
      dependencies: ["api"],
    },
    // Apps (bottom rows)
    {
      id: "booking",
      name: "Booking",
      type: "app",
      framework: "SvelteKit",
      description: "Flight booking with real-time pricing",
      path: "/booking/",
      x: 120,
      y: 220,
      dependencies: ["api", "ui", "utils"],
    },
    {
      id: "dashboard",
      name: "Dashboard",
      type: "app",
      framework: "Svelte",
      description: "Monorepo dashboard (this page)",
      path: "/dashboard/",
      x: 320,
      y: 220,
      dependencies: ["ui"],
    },
    {
      id: "homepage",
      name: "Homepage",
      type: "app",
      framework: "Next.js",
      description: "Landing page with React 19",
      path: "/",
      x: 520,
      y: 220,
      dependencies: ["ui", "utils"],
    },
    {
      id: "microfrontend",
      name: "Microfrontend",
      type: "app",
      framework: "JavaScript",
      description: "React, Vue & Svelte apps unified",
      path: "/react/",
      x: 720,
      y: 220,
      dependencies: ["api", "ui", "utils"],
    },
  ];

  const frameworkIcons = {
    SvelteKit:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
    Svelte:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
    "Next.js":
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    "Nuxt/Vue":
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    React:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    JavaScript:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  };

  const packageIcons = {
    api: "mdi:api",
    ui: "mdi:palette-swatch",
    utils: "mdi:tools",
  };

  /** @type {string | null} */
  let selectedNode = $state(null);
  let hoveredNode = $state(null);

  /**
   * Get connections for SVG lines
   * @returns {{ from: typeof nodes[0]; to: typeof nodes[0]; highlight: boolean }[]}
   */
  function getConnections() {
    /** @type {{ from: typeof nodes[0]; to: typeof nodes[0]; highlight: boolean }[]} */
    const connections = [];
    for (const node of nodes) {
      for (const depId of node.dependencies) {
        const depNode = nodes.find((n) => n.id === depId);
        if (depNode) {
          const isHighlighted =
            selectedNode === node.id ||
            selectedNode === depId ||
            hoveredNode === node.id ||
            hoveredNode === depId;
          connections.push({
            from: depNode,
            to: node,
            highlight: isHighlighted,
          });
        }
      }
    }
    return connections;
  }

  /**
   * @param {string} id
   */
  function handleNodeClick(id) {
    selectedNode = selectedNode === id ? null : id;
  }

  /**
   * @param {string | null} id
   */
  function handleNodeHover(id) {
    hoveredNode = id;
  }

  /**
   * Get node info for details panel
   */
  function getSelectedNodeInfo() {
    if (!selectedNode) return null;
    const node = nodes.find((n) => n.id === selectedNode);
    if (!node) return null;

    const dependents = nodes.filter((n) => n.dependencies.includes(node.id));
    const deps = node.dependencies
      .map((id) => nodes.find((n) => n.id === id))
      .filter(Boolean);

    return { node, dependents, deps };
  }

  let connections = $derived(getConnections());
  let selectedInfo = $derived(getSelectedNodeInfo());
</script>

<main
  class="min-h-screen bg-gradient-to-br from-primary-800 via-primary-700 to-primary-800 p-6"
>
  <!-- Header -->
  <div class="text-center mb-6">
    <h1 class="text-white text-3xl font-bold mb-2 drop-shadow-lg">
      ticketapp Monorepo
    </h1>
    <p class="text-white/80 text-lg">
      Interactive dependency graph • Click nodes to explore connections
    </p>
  </div>

  <div class="flex gap-6 max-w-[1200px] mx-auto">
    <!-- Graph Container -->
    <div class="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-2xl">
      <svg viewBox="0 0 1000 320" class="w-full h-auto">
        <defs>
          <!-- Arrow marker -->
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#94b4d4" />
          </marker>
          <marker
            id="arrowhead-highlight"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#a0eb78" />
          </marker>
          <!-- Glow filter -->
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Connection Lines -->
        {#each connections as conn}
          <line
            x1={conn.from.x}
            y1={conn.from.y + 40}
            x2={conn.to.x}
            y2={conn.to.y - 45}
            class="connection-line"
            class:highlighted={conn.highlight}
            marker-end={conn.highlight
              ? "url(#arrowhead-highlight)"
              : "url(#arrowhead)"}
          />
        {/each}

        <!-- Package Nodes -->
        {#each nodes.filter((n) => n.type === "package") as node}
          <g
            class="node-group"
            class:selected={selectedNode === node.id}
            class:related={selectedNode &&
              (nodes
                .find((n) => n.id === selectedNode)
                ?.dependencies.includes(node.id) ||
                nodes
                  .find((n) => n.id === node.id)
                  ?.dependencies.includes(selectedNode))}
            onclick={() => handleNodeClick(node.id)}
            onmouseenter={() => handleNodeHover(node.id)}
            onmouseleave={() => handleNodeHover(null)}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === "Enter" && handleNodeClick(node.id)}
          >
            <rect
              x={node.x - 70}
              y={node.y - 35}
              width="140"
              height="70"
              rx="12"
              class="node-rect package"
            />
            <foreignObject
              x={node.x - 12}
              y={node.y - 28}
              width="24"
              height="24"
            >
              <lit-icon
                icon={packageIcons[node.id]}
                style="font-size: 24px; color: #113e73;"
              ></lit-icon>
            </foreignObject>
            <text
              x={node.x}
              y={node.y + 12}
              text-anchor="middle"
              class="node-label package"
            >
              {node.id}
            </text>
          </g>
        {/each}

        <!-- App Nodes -->
        {#each nodes.filter((n) => n.type === "app") as node}
          <g
            class="node-group"
            class:selected={selectedNode === node.id}
            class:related={selectedNode &&
              (nodes
                .find((n) => n.id === selectedNode)
                ?.dependencies.includes(node.id) ||
                node.dependencies.includes(selectedNode))}
            onclick={() => handleNodeClick(node.id)}
            onmouseenter={() => handleNodeHover(node.id)}
            onmouseleave={() => handleNodeHover(null)}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === "Enter" && handleNodeClick(node.id)}
          >
            <rect
              x={node.x - 70}
              y={node.y - 45}
              width="140"
              height="90"
              rx="12"
              class="node-rect app"
            />
            {#if node.framework && frameworkIcons[node.framework]}
              <image
                href={frameworkIcons[node.framework]}
                x={node.x - 14}
                y={node.y - 38}
                width="28"
                height="28"
              />
            {/if}
            <text
              x={node.x}
              y={node.y + 8}
              text-anchor="middle"
              class="node-label app"
            >
              {node.name}
            </text>
            <text
              x={node.x}
              y={node.y + 28}
              text-anchor="middle"
              class="node-framework"
            >
              {node.framework}
            </text>
          </g>
        {/each}
      </svg>
    </div>

    <!-- Details Panel -->
    <div class="w-80 bg-white/10 backdrop-blur-sm rounded-2xl p-5 shadow-2xl">
      {#if selectedInfo}
        <div class="text-white">
          <div class="flex items-center gap-3 mb-4">
            {#if selectedInfo.node.type === "app" && selectedInfo.node.framework}
              <img
                src={frameworkIcons[selectedInfo.node.framework]}
                alt={selectedInfo.node.framework}
                class="w-10 h-10"
              />
            {:else}
              <div
                class="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center"
              >
                <lit-icon
                  icon={packageIcons[selectedInfo.node.id]}
                  style="font-size: 24px; color: #113e73;"
                ></lit-icon>
              </div>
            {/if}
            <div>
              <h2 class="text-xl font-bold">{selectedInfo.node.name}</h2>
              <span
                class="text-xs px-2 py-0.5 rounded-full {selectedInfo.node
                  .type === 'app'
                  ? 'bg-primary-500 text-primary-900'
                  : 'bg-secondary-200 text-secondary-800'}"
              >
                {selectedInfo.node.type === "app"
                  ? selectedInfo.node.framework
                  : "Package"}
              </span>
            </div>
          </div>

          <p class="text-white/80 text-sm mb-5">
            {selectedInfo.node.description}
          </p>

          {#if selectedInfo.deps.length > 0}
            <div class="mb-4">
              <h3
                class="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2"
              >
                Dependencies ({selectedInfo.deps.length})
              </h3>
              <div class="flex flex-wrap gap-2">
                {#each selectedInfo.deps as dep}
                  <button
                    class="px-3 py-1.5 bg-secondary-800/50 hover:bg-secondary-800 rounded-lg text-sm transition-colors"
                    onclick={() => handleNodeClick(dep.id)}
                  >
                    {dep.id}
                  </button>
                {/each}
              </div>
            </div>
          {/if}

          {#if selectedInfo.dependents.length > 0}
            <div class="mb-5">
              <h3
                class="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2"
              >
                Used by ({selectedInfo.dependents.length})
              </h3>
              <div class="flex flex-wrap gap-2">
                {#each selectedInfo.dependents as dep}
                  <button
                    class="px-3 py-1.5 bg-primary-700/50 hover:bg-primary-700 rounded-lg text-sm transition-colors"
                    onclick={() => handleNodeClick(dep.id)}
                  >
                    {dep.name}
                  </button>
                {/each}
              </div>
            </div>
          {/if}

          {#if selectedInfo.node.path}
            <a
              href={selectedInfo.node.path}
              class="flex items-center justify-center gap-2 w-full py-3 bg-primary-500 hover:bg-primary-400 text-primary-900 font-semibold rounded-xl transition-colors"
            >
              <span>Open App</span>
              <lit-icon icon="mdi:arrow-right"></lit-icon>
            </a>
          {/if}
        </div>
      {:else}
        <div class="text-white/60 text-center py-8">
          <lit-icon icon="mdi:cursor-default-click" style="font-size: 48px;"
          ></lit-icon>
          <p class="mt-4">Click on a node to see details</p>
        </div>
      {/if}

      <!-- Legend -->
      <div class="mt-6 pt-5 border-t border-white/20">
        <h3
          class="text-sm font-semibold text-primary-200 uppercase tracking-wider mb-3"
        >
          Legend
        </h3>
        <div class="space-y-3 text-sm">
          <div class="flex items-center gap-3 text-white">
            <div
              class="w-6 h-6 rounded bg-secondary-100 border-2 border-secondary-300 shadow-sm"
            ></div>
            <span class="font-medium">Package</span>
          </div>
          <div class="flex items-center gap-3 text-white">
            <div
              class="w-6 h-6 rounded bg-white border-2 border-neutral-200 shadow-sm"
            ></div>
            <span class="font-medium">Application</span>
          </div>
          <div class="flex items-center gap-3 text-white">
            <div class="w-10 h-1 bg-primary-300 rounded-full shadow-sm"></div>
            <span class="font-medium">Dependency</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Quick Links -->
  <div class="max-w-[1200px] mx-auto mt-6">
    <div class="flex flex-wrap justify-center gap-3">
      <a href="/" class="quick-link">
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
          alt="Next.js"
          class="w-5 h-5"
        />
        <span>Homepage</span>
      </a>
      <a href="/booking/" class="quick-link">
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg"
          alt="Svelte"
          class="w-5 h-5"
        />
        <span>Booking</span>
      </a>
      <a href="/storybook/" class="quick-link">
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/storybook/storybook-original.svg"
          alt="Storybook"
          class="w-5 h-5"
        />
        <span>Storybook</span>
      </a>
      <a href="/react/" class="quick-link">
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
          alt="JavaScript"
          class="w-5 h-5"
        />
        <span>Microfrontend</span>
      </a>
    </div>
  </div>
</main>

<style>
  :global(lit-logo) {
    font-size: 48px;
    color: white;
  }

  .graph-label {
    fill: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .connection-line {
    stroke: #94b4d4;
    stroke-width: 2;
    fill: none;
    opacity: 0.4;
  }

  .connection-line.highlighted {
    stroke: #a0eb78;
    stroke-width: 3;
    opacity: 1;
  }

  .node-group {
    cursor: pointer;
  }

  .node-group:hover .node-rect {
    filter: url(#glow);
  }

  .node-group.selected .node-rect {
    stroke: #a0eb78;
    stroke-width: 3;
    filter: url(#glow);
  }

  .node-group.related .node-rect {
    stroke: #a0eb78;
    stroke-width: 2;
  }

  .node-rect.package {
    fill: #e6ecf3;
    stroke: #94b4d4;
    stroke-width: 2;
  }

  .node-rect.app {
    fill: white;
    stroke: #c7ccd1;
    stroke-width: 2;
  }

  .node-label {
    font-size: 13px;
    font-weight: 600;
    pointer-events: none;
  }

  .node-label.package {
    fill: #113e73;
  }

  .node-label.app {
    fill: #001f3d;
  }

  .node-framework {
    fill: #73808c;
    font-size: 11px;
    pointer-events: none;
  }

  .quick-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    border-radius: 12px;
    color: white;
    text-decoration: none;
    font-weight: 500;
  }

  .quick-link:hover {
    background: rgba(255, 255, 255, 0.2);
  }
</style>
