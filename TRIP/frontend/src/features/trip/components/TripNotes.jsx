import { MapPin, Info } from 'lucide-react';

export function TripNotes({ plan, onUpdateField }) {
  if (!plan) return null;

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-primary-900 tracking-tight">
          <MapPin className="text-accent-500 w-6 h-6" /> Accommodation
        </h3>
        <textarea
          className="w-full h-32 p-5 rounded-2xl border border-primary-900/10 bg-surface-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 text-primary-900 text-base transition-all resize-none outline-none font-medium placeholder:text-primary-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
          placeholder="Where are you staying? (e.g., Shinjuku Prince Hotel, Tokyo)"
          value={plan.hotel_info || ""}
          onChange={(e) => onUpdateField('hotel_info', e.target.value)}
        />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-primary-900 tracking-tight">
          <Info className="text-accent-500 w-6 h-6" /> General Notes
        </h3>
        <textarea
          className="w-full h-48 p-5 rounded-2xl border border-primary-900/10 bg-surface-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 text-primary-900 text-base transition-all resize-none outline-none font-medium placeholder:text-primary-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
          placeholder="Important reminders, packing list, or travel tips..."
          value={plan.general_notes || ""}
          onChange={(e) => onUpdateField('general_notes', e.target.value)}
        />
      </div>
    </div>
  );
}
