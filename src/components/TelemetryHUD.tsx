import Icon from '@/components/ui/icon';
import type { RecSettings } from '@/components/SettingsPanel';

interface Props {
  settings: RecSettings;
  speed: number;
  altitude: number;
  distance: number;
}

const unitMap = {
  metric: { speed: 'км/ч', alt: 'м', dist: 'км', spdMul: 1, altMul: 1, distMul: 1 },
  imperial: { speed: 'mph', alt: 'ft', dist: 'mi', spdMul: 0.621, altMul: 3.281, distMul: 0.621 },
  nautical: { speed: 'уз', alt: 'м', dist: 'мор.мили', spdMul: 0.54, altMul: 1, distMul: 0.54 },
};

const Stat = ({
  icon,
  value,
  unit,
  label,
}: {
  icon: string;
  value: string;
  unit: string;
  label: string;
}) => (
  <div className="rounded-2xl border border-white/10 bg-black/45 px-4 py-2.5 backdrop-blur-md">
    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/60">
      <Icon name={icon} size={11} className="text-primary" />
      {label}
    </div>
    <div className="flex items-baseline gap-1">
      <span className="font-display text-3xl font-700 leading-none text-white text-glow tabular-nums">
        {value}
      </span>
      <span className="text-xs font-medium text-white/70">{unit}</span>
    </div>
  </div>
);

const TelemetryHUD = ({ settings, speed, altitude, distance }: Props) => {
  const u = unitMap[settings.units];
  const { overlays } = settings;

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-4 top-4 flex flex-col gap-2.5">
        {overlays.speed && (
          <Stat
            icon="Wind"
            label="Скорость"
            value={Math.round(speed * u.spdMul).toString()}
            unit={u.speed}
          />
        )}
        {overlays.altitude && (
          <Stat
            icon="Mountain"
            label="Высота"
            value={Math.round(altitude * u.altMul).toString()}
            unit={u.alt}
          />
        )}
        {overlays.distance && (
          <Stat
            icon="Route"
            label="Расстояние"
            value={(distance * u.distMul).toFixed(1)}
            unit={u.dist}
          />
        )}
      </div>

      {overlays.map && (
        <div className="absolute bottom-4 right-4 h-28 w-28 overflow-hidden rounded-2xl border-2 border-primary/60 bg-black/50 shadow-[0_0_24px_hsl(var(--neon)/0.4)] backdrop-blur-md sm:h-32 sm:w-32">
          <div className="grid-bg absolute inset-0 opacity-40" />
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            <path
              d="M15 85 Q 35 60 30 40 T 60 20 L 85 15"
              fill="none"
              stroke="hsl(var(--neon))"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-[0_0_10px_hsl(var(--neon))]" />
          <div className="absolute bottom-1 left-2 text-[9px] font-semibold uppercase tracking-wider text-white/70">
            Карта
          </div>
        </div>
      )}
    </div>
  );
};

export default TelemetryHUD;
