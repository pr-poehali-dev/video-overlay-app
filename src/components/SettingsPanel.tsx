import Icon from '@/components/ui/icon';

export interface RecSettings {
  units: 'metric' | 'imperial' | 'nautical';
  camera: 'back' | 'front';
  audio: boolean;
  resolution: '720p' | '1080p' | '2K' | '4K';
  fps: 30 | 60;
  wide: boolean;
  overlays: {
    speed: boolean;
    map: boolean;
    altitude: boolean;
    distance: boolean;
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  settings: RecSettings;
  onChange: (s: RecSettings) => void;
}

const SegRow = ({
  label,
  icon,
  options,
  value,
  onSelect,
}: {
  label: string;
  icon: string;
  options: { key: string; label: string }[];
  value: string;
  onSelect: (k: string) => void;
}) => (
  <div className="space-y-2.5">
    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
      <Icon name={icon} size={16} className="text-primary" />
      {label}
    </div>
    <div className="grid grid-flow-col auto-cols-fr gap-1.5 rounded-xl bg-secondary p-1.5">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onSelect(o.key)}
          className={`rounded-lg py-2 text-sm font-semibold transition-all duration-200 ${
            value === o.key
              ? 'bg-primary text-primary-foreground shadow-[0_0_16px_hsl(var(--neon)/0.45)]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  </div>
);

const Toggle = ({
  label,
  icon,
  value,
  onToggle,
}: {
  label: string;
  icon: string;
  value: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    className="flex w-full items-center justify-between rounded-xl bg-secondary px-4 py-3 transition-colors hover:bg-muted"
  >
    <span className="flex items-center gap-2 text-sm font-medium">
      <Icon name={icon} size={16} className="text-primary" />
      {label}
    </span>
    <span
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
        value ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition-transform duration-200 ${
          value ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </span>
  </button>
);

const SettingsPanel = ({ open, onClose, settings, onChange }: Props) => {
  const set = (patch: Partial<RecSettings>) => onChange({ ...settings, ...patch });
  const setOverlay = (k: keyof RecSettings['overlays']) =>
    set({ overlays: { ...settings.overlays, [k]: !settings.overlays[k] } });

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-card transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-display text-2xl font-600 uppercase tracking-wide">
            Настройки
          </h2>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <SegRow
            label="Единицы измерения"
            icon="Ruler"
            value={settings.units}
            onSelect={(k) => set({ units: k as RecSettings['units'] })}
            options={[
              { key: 'metric', label: 'Метрич.' },
              { key: 'imperial', label: 'Имперск.' },
              { key: 'nautical', label: 'Морские' },
            ]}
          />

          <SegRow
            label="Камера"
            icon="SwitchCamera"
            value={settings.camera}
            onSelect={(k) => set({ camera: k as RecSettings['camera'] })}
            options={[
              { key: 'back', label: 'Задняя' },
              { key: 'front', label: 'Передняя' },
            ]}
          />

          <SegRow
            label="Разрешение видео"
            icon="MonitorPlay"
            value={settings.resolution}
            onSelect={(k) => set({ resolution: k as RecSettings['resolution'] })}
            options={[
              { key: '720p', label: '720p' },
              { key: '1080p', label: '1080p' },
              { key: '2K', label: '2K' },
              { key: '4K', label: '4K' },
            ]}
          />

          <SegRow
            label="Частота кадров"
            icon="Gauge"
            value={String(settings.fps)}
            onSelect={(k) => set({ fps: Number(k) as RecSettings['fps'] })}
            options={[
              { key: '30', label: '30 FPS' },
              { key: '60', label: '60 FPS' },
            ]}
          />

          <div className="space-y-2.5">
            <Toggle
              label="Запись звука"
              icon="Mic"
              value={settings.audio}
              onToggle={() => set({ audio: !settings.audio })}
            />
            <Toggle
              label="Широкоугольная камера"
              icon="Maximize"
              value={settings.wide}
              onToggle={() => set({ wide: !settings.wide })}
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Icon name="LayoutDashboard" size={16} className="text-primary" />
              Наложение на видео
            </div>
            <Toggle label="Скорость" icon="Wind" value={settings.overlays.speed} onToggle={() => setOverlay('speed')} />
            <Toggle label="Миникарта" icon="Map" value={settings.overlays.map} onToggle={() => setOverlay('map')} />
            <Toggle label="Высота" icon="Mountain" value={settings.overlays.altitude} onToggle={() => setOverlay('altitude')} />
            <Toggle label="Расстояние" icon="Route" value={settings.overlays.distance} onToggle={() => setOverlay('distance')} />
          </div>
        </div>

        <div className="border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-primary py-3 font-display text-lg font-600 uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Готово
          </button>
        </div>
      </aside>
    </>
  );
};

export default SettingsPanel;
