import { cn } from '@/lib/utils';

interface WHYWHATHOWBoxProps {
  why: string;
  what: string;
  how: string;
}

export function WHYWHATHOWBox({ why, what, how }: WHYWHATHOWBoxProps) {
  return (
    <div className="lg:sticky lg:top-20 lg:right-0 lg:w-80 lg:ml-8 mb-8 lg:mb-0">
      <div className="space-y-4">
        {/* WHY Card */}
        <div className="bg-gray-100 p-6 rounded-sm">
          <h3 className="font-monument text-sm font-medium text-ft-black uppercase mb-2">
            WHY
          </h3>
          <p className="font-riforma text-sm text-ft-black">{why}</p>
        </div>

        {/* WHAT Card */}
        <div className="bg-gray-100 p-6 rounded-sm">
          <h3 className="font-monument text-sm font-medium text-ft-black uppercase mb-2">
            WHAT
          </h3>
          <p className="font-riforma text-sm text-ft-black">{what}</p>
        </div>

        {/* HOW Card */}
        <div className="bg-gray-100 p-6 rounded-sm">
          <h3 className="font-monument text-sm font-medium text-ft-black uppercase mb-2">
            HOW
          </h3>
          <p className="font-riforma text-sm text-ft-black">{how}</p>
        </div>
      </div>
    </div>
  );
}

