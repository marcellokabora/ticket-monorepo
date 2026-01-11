export default function HomePage() {
    return (
        <main className="min-h-screen bg-linear-to-b from-primary-700 to-primary-900">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold text-neutral-white mb-6">
                        Welcome to{' '}
                        <span className="text-primary-300">ticketapp</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-2xl mx-auto">
                        Skip the queues and enjoy a premium airport experience.
                        Book your ticketapp pass today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/booking"
                            className="inline-flex items-center gap-3 px-8 py-4 text-base font-semibold rounded-full bg-primary-400 text-neutral-black hover:bg-primary-300 transition-colors"
                        >
                            Buy now
                            <span>→</span>
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
