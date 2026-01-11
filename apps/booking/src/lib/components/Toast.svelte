<script lang="ts">
  import "@ticketapp/ui";

  interface Props {
    message: string | null;
    show?: boolean;
    onDismiss?: () => void;
  }

  let { message, show = false, onDismiss }: Props = $props();

  function handleDismiss() {
    onDismiss?.();
  }
</script>

{#if message}
  <div
    class="fixed top-0 left-0 right-0 flex justify-center px-4 pt-4 pointer-events-none transition-all duration-300"
    style="transform: translateY({show ? '0' : '-100%'}); opacity: {show
      ? '1'
      : '0'}; z-index: 9999;"
  >
    <div
      class="flex items-start gap-2 px-4 py-3 bg-neutral-white text-system-alert border-l-4 border-system-alert rounded-lg shadow-xl pointer-events-auto max-w-md w-full"
      role="alert"
      aria-live="assertive"
    >
      <lit-icon icon="mdi:alert-circle" size="20" class="shrink-0 mt-0.5"
      ></lit-icon>
      <p class="text-sm flex-1 break-all overflow-hidden">{message}</p>
      <button
        onclick={handleDismiss}
        class="shrink-0 p-1 hover:bg-secondary-20 rounded-full transition-colors"
        aria-label="Dismiss notification"
      >
        <lit-icon icon="mdi:close" size="18" color="#eb5757"></lit-icon>
      </button>
    </div>
  </div>
{/if}
