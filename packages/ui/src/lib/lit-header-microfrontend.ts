import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * A reusable header component with navigation links
 * This component works across all frameworks (React, Vue, Svelte, etc.)
 * 
 * @element lit-header-microfrontend
 * 
 * @fires nav-click - Fired when a navigation link is clicked with detail: { app: string, url: string }
 */
@customElement('lit-header-microfrontend')
export class LitHeaderMicrofrontend extends LitElement {
    private readonly reactUrl = '/react/';
    private readonly vueUrl = '/vue/';
    private readonly svelteUrl = '/svelte/';

    static styles = css`
        :host {
            display: block;
            width: 100%;
        }

        header {
            padding: 1rem 2rem;
            box-shadow: var(--shadow-md);
        }

        nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 1200px;
            margin: 0 auto;
        }

        .logo {
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
            font-family: inherit;
        }

        .nav-links {
            display: flex;
            gap: 1rem;
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .nav-link {
            background: var(--overlay-white-20);
            color: white;
            text-decoration: none;
            padding: 0.5rem 1.25rem;
            border-radius: 0.375rem;
            font-weight: 500;
            font-family: inherit;
            font-size: 0.875rem;
            transition: all 0.2s ease-in-out;
            border: 2px solid transparent;
            cursor: pointer;
        }

        .nav-link:hover {
            background: var(--overlay-white-30);
            border-color: var(--overlay-white-50);
            transform: translateY(-2px);
        }

        .nav-link:active {
            transform: translateY(0);
        }

        /* Responsive design */
        @media (max-width: 640px) {
            nav {
                flex-direction: column;
                gap: 1rem;
            }

            .nav-links {
                width: 100%;
                justify-content: center;
            }

            .nav-link {
                flex: 1;
                text-align: center;
            }
        }
    `;

    private handleNavClick(app: string, url: string, event: Event) {
        event.preventDefault();

        // Dispatch custom event that can be listened to
        this.dispatchEvent(new CustomEvent('nav-click', {
            detail: { app, url },
            bubbles: true,
            composed: true
        }));

        // Navigate to the URL
        window.location.href = url;
    }

    render() {
        return html`
            <header>
                <nav>
                    <div class="logo">Multi-Framework App</div>
                    <ul class="nav-links">
                        <li>
                            <a 
                                class="nav-link" 
                                href="${this.reactUrl}"
                                @click="${(e: Event) => this.handleNavClick('react', this.reactUrl, e)}"
                            >
                                React
                            </a>
                        </li>
                        <li>
                            <a 
                                class="nav-link" 
                                href="${this.vueUrl}"
                                @click="${(e: Event) => this.handleNavClick('vue', this.vueUrl, e)}"
                            >
                                Vue
                            </a>
                        </li>
                        <li>
                            <a 
                                class="nav-link" 
                                href="${this.svelteUrl}"
                                @click="${(e: Event) => this.handleNavClick('svelte', this.svelteUrl, e)}"
                            >
                                Svelte
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-header-microfrontend': LitHeaderMicrofrontend;
    }
}
