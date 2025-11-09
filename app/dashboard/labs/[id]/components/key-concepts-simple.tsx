interface KeyConceptsSimpleProps {
  technologies: string[];
}

export function KeyConceptsSimple({ technologies }: KeyConceptsSimpleProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Key Concepts</h2>
      <ul className="space-y-2">
        {technologies.map((tech, index) => (
          <li key={index} className="flex items-center gap-2 text-base">
            <span className="text-foreground">• {tech}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
