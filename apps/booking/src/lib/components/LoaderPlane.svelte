<script lang="ts">
  interface Props {
    size?: number;
    duration?: number;
  }

  let { size = 60, duration = 1600 }: Props = $props();

  const uniqueId = Math.random().toString(36).substr(2, 9);
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 60 60"
  shape-rendering="geometricPrecision"
  text-rendering="geometricPrecision"
  width={size}
  height={size}
  style="--animation-duration: {duration}ms"
  class="loader-plane"
>
  <defs>
    <clipPath id="clipper-circle-{uniqueId}">
      <circle r="30" transform="translate(30 30)" />
    </clipPath>
  </defs>

  <g clip-path="url(#clipper-circle-{uniqueId})">
    <circle class="circle" r="30.116551" fill="var(--color-primary-700)" />
    <path
      class="plane"
      d="M40.5787,28.5457v-.0012h-4.6969c-.6349,0-1.2365-.2803-1.6393-.7637l-6.7968-8.157c-.329-.3949-.8204-.6238-1.339-.6238h-1.7728l4.275,9.5444-5.6856.2435c-.5539.0237-1.0926-.1827-1.4847-.5689l-1.4198-1.3985c-.3392-.3341-.7994-.5219-1.2792-.5219h-1.5306L18.8445,30L17.209,33.7014h1.5306c.4798,0,.9399-.1878,1.2792-.5219l1.4198-1.3985c.3921-.3862.9308-.5926,1.4847-.5689l5.6856.2435L24.3339,41h1.7728c.5186,0,1.01-.2289,1.339-.6238l6.7968-8.157c.4028-.4834,1.0043-.7637,1.6392-.7637h4.6969v-.0012c.8535,0,3.2137-.6511,3.2137-1.4543s-2.3602-1.4543-3.2136-1.4543Z"
      fill="var(--color-primary-300)"
    />
  </g>
</svg>

<style>
  .loader-plane {
    display: inline-block;
  }

  .circle {
    animation: circle-anim var(--animation-duration)
      cubic-bezier(0.42, 0, 0.58, 1) infinite;
    transform-origin: 0 0;
  }

  @keyframes circle-anim {
    0% {
      transform: matrix(0.149979, 0, 0, 0.149979, 68.177974, 48.263399);
    }
    38%,
    62% {
      transform: matrix(0.99613, 0, 0, 0.99613, 29.8839, 29.8839);
    }
    100% {
      transform: matrix(0.149979, 0, 0, 0.149979, -10.34296, 48.245919);
    }
  }

  .plane {
    animation: plane-anim var(--animation-duration)
      cubic-bezier(0.42, 0, 0.58, 1) infinite;
    transform-origin: 0 0;
  }

  @keyframes plane-anim {
    0% {
      transform: matrix(0.3, 0, 0, 0.3, -15, 40);
    }
    38%,
    62% {
      transform: matrix(1, 0, 0, 1, 0, 0);
    }
    100% {
      transform: matrix(0.5, 0, 0, 0.5, 50, 25);
    }
  }
</style>
