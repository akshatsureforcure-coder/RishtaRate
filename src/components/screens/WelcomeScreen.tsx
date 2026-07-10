import Icon from "../Icon";

interface WelcomeScreenProps {
  onStart: () => void;
}

const HOW_IT_WORKS = [
  {
    icon: "school",
    color: "text-primary bg-primary/10",
    title: "Education Markup",
    body: `IIT/IIM? That's a 200% premium. BA in Philosophy? Auntie says "good luck beta."`,
  },
  {
    icon: "home",
    color: "text-secondary bg-secondary/10",
    title: "Real Estate Flex",
    body: "South Delhi kothi vs. 1BHK in Nallasopara. The math is simple, the judgment is harsh.",
  },
  {
    icon: "kitchen",
    color: "text-tertiary bg-tertiary/10",
    title: "The Tea Test",
    body: "Can you make round rotis? Do you know the difference between ginger and galangal?",
  },
];

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <>
      <main className="flex-grow pt-[128px] pb-24 px-[20px] flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
        <div className="space-y-4 mb-12">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-surface leading-tight">
            Calculate your &quot;Market Rate&quot;
            <span className="block text-primary italic">— for laughs only 😄</span>
          </h2>
          <p className="font-body-lg text-on-surface-variant max-w-md mx-auto">
            Ever wondered what Auntieji thinks you&apos;re worth? Join the satire-first matchmaking
            evaluation.
          </p>
        </div>

        <div className="relative w-full aspect-square max-w-sm mb-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="hero-float bg-surface-container-lowest card-shadow p-8 rounded-3xl w-4/5 border border-outline-variant/20 rotate-3">
              <div className="w-full aspect-video rounded-xl mb-4 bg-gradient-to-br from-secondary-container/40 via-primary-container/30 to-surface-container-low flex items-center justify-center">
                <Icon name="local_florist" className="text-6xl text-primary/60" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-secondary-container/20 text-on-secondary-container px-3 py-1 rounded-full font-label-bold">
                  PREMIUM TRAIT
                </span>
                <span className="text-secondary font-label-bold">★ 9.8</span>
              </div>
              <h3 className="font-headline-sm text-on-surface text-left">
                The &quot;Makes Great Chai&quot; Multiplier
              </h3>
            </div>
          </div>

          <div className="absolute top-0 right-0 hero-float" style={{ animationDelay: "-0.5s" }}>
            <div className="bg-primary-container text-on-primary-container p-4 rounded-2xl shadow-lg -rotate-12 border border-primary/10">
              <Icon name="favorite" className="text-3xl" />
            </div>
          </div>
          <div className="absolute bottom-4 left-0 hero-float" style={{ animationDelay: "-1s" }}>
            <div className="bg-secondary-container text-on-secondary-container p-4 rounded-full shadow-lg rotate-12 border border-secondary/10">
              <Icon name="currency_rupee" className="text-3xl" />
            </div>
          </div>
          <div className="absolute top-1/2 -left-4 hero-float" style={{ animationDelay: "-1.5s" }}>
            <div className="bg-surface-container text-on-surface-variant px-4 py-2 rounded-xl shadow-md -rotate-6 font-label-bold border border-outline-variant/30">
              Mummy&apos;s Boy -15%
            </div>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-6">
          <button
            type="button"
            onClick={onStart}
            className="coral-gradient w-full py-4 rounded-full text-white font-headline-sm shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            Calculate My Rate
            <Icon name="trending_up" />
          </button>
          <div className="flex items-center justify-center gap-4 text-on-surface-variant/60">
            <div className="flex items-center gap-1">
              <Icon name="verified" className="text-sm" />
              <span className="font-label-bold">10k+ Scrutinized</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/40" />
            <div className="flex items-center gap-1">
              <Icon name="group" className="text-sm" />
              <span className="font-label-bold">Auntie Approved</span>
            </div>
          </div>
        </div>
      </main>

      <section className="px-[20px] pb-16 max-w-6xl mx-auto w-full">
        <h4 className="font-headline-sm text-on-surface mb-8 text-center">How it works (allegedly)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.title}
              className="bento-card bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 flex flex-col items-center text-center"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${item.color}`}>
                <Icon name={item.icon} className="text-2xl" />
              </div>
              <h5 className="font-headline-sm mb-2">{item.title}</h5>
              <p className="font-body-sm text-on-surface-variant">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
