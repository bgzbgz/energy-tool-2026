import { cn } from '@/lib/utils';

interface NumberedSectionProps {
  number: string; // "01", "02", "03", "04"
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export function NumberedSection({ number, title, children, className }: NumberedSectionProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="bg-ft-black text-ft-white py-2 px-3 w-full mb-3">
        <span className="font-plaak font-bold text-xl uppercase tracking-wide">
          [{number}] {title}
        </span>
      </div>
      {children}
    </div>
  );
}

