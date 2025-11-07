interface ProjectTitleProps {
  title: string;
}

export function ProjectTitle({ title }: ProjectTitleProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        {title}
      </h1>
    </div>
  );
}
