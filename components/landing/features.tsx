import {
  CameraIcon,
  StackIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react/dist/ssr";
const features = [
  {
    icon: CameraIcon,
    title: "A studio without the setup",
    text: "Choose a scene, describe the light, and give your product a new setting. Your uploaded photo anchors every shot.",
  },
  {
    icon: StackIcon,
    title: "One idea, every format",
    text: "Build a campaign with images sized for Instagram, Facebook, LinkedIn, and your website.",
  },
  {
    icon: SlidersHorizontalIcon,
    title: "Space to make it yours",
    text: "Explore variations, revisit saved projects, and add a final touch in the canvas editor before exporting.",
  },
];
export default function Features() {
  return (
    <section id="features" className="section-wrap py-16 md:py-20">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-sm text-blue-600">
          Less production. More possibility.
        </p>
        <h2 className="text-3xl font-medium md:text-4xl">
          From a single photo
          <br />
          to a complete creative direction.
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((f) => (
          <article key={f.title}>
            <f.icon size={24} weight="light" className="mb-6" />
            <h3 className="mb-3 text-lg font-medium">{f.title}</h3>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              {f.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
