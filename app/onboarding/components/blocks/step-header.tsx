import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

interface StepHeaderProps {
  title: string;
  subtitle: string;
}

export function StepHeader({ title, subtitle }: StepHeaderProps) {
  const words = title.split(" ").map((word) => {
    return {
      text: word,
    };
  });

  return (
    <div className="text-center flex flex-col items-center justify-center mb-8 font-main">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h1>
      {/*<TypewriterEffectSmooth words={words} />*/}
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
