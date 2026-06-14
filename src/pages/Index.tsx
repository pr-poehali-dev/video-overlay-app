import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import SettingsPanel, { RecSettings } from '@/components/SettingsPanel';
import TelemetryHUD from '@/components/TelemetryHUD';

const PREVIEW = 'https://cdn.poehali.dev/projects/899973d2-ed12-44e3-a1e0-adc83bea3bef/files/e25ed890-d6a9-4db0-b873-761cd0e4a8c4.jpg';

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [settings, setSettings] = useState<RecSettings>({
    units: 'metric',
    camera: 'back',
    audio: true,
    resolution: '1080p',
    fps: 60,
    wide: false,
    overlays: { speed: true, map: true, altitude: true, distance: true },
  });

  const [speed, setSpeed] = useState(0);
  const [prevSpeed, setPrevSpeed] = useState(0);
  const [altitude, setAltitude] = useState(1240);
  const [distance, setDistance] = useState(0);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setSpeed((s) => {
        const next = Math.max(0, Math.min(180, s + (Math.random() - 0.45) * 18));
        setPrevSpeed(s);
        return next;
      });
      setAltitude((a) => Math.max(0, a + (Math.random() - 0.5) * 12));
      setNow(new Date());
    }, 800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
        setDistance((d) => d + speed / 3600);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
     
  }, [recording, speed]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const toggleRec = () => {
    if (recording) {
      setRecording(false);
    } else {
      setElapsed(0);
      setDistance(0);
      setRecording(true);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Camera viewport */}
      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col">
        <div className="relative flex-1 overflow-hidden">
          <img
            src={PREVIEW}
            alt="Предпросмотр камеры"
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ${
              settings.wide ? 'scale-100' : 'scale-110'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

          {/* Top bar */}
          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-4">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md">
              <div className="grid h-6 w-6 place-items-center rounded-md bg-primary">
                <Icon name="Video" size={14} className="text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-600 uppercase tracking-wider text-white">
                GoTrack
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                {settings.resolution} · {settings.fps}FPS
              </span>
              {recording && (
                <span className="flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-300 backdrop-blur-md">
                  <span className="h-2 w-2 animate-pulse-rec rounded-full bg-red-500" />
                  {fmt(elapsed)}
                </span>
              )}
            </div>
          </div>

          {/* Telemetry overlays */}
          <TelemetryHUD
            settings={settings}
            speed={speed}
            accel={(speed - prevSpeed) / 0.8}
            altitude={altitude}
            distance={distance}
            now={now}
          />

          {/* Big speed when not showing overlay speed - decorative center crosshair */}
          {settings.wide && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/15">
              <Icon name="Crosshair" size={64} />
            </div>
          )}
        </div>

        {/* Quick overlay toggles — floating glass pills above the dock */}
        <div className="pointer-events-auto absolute bottom-32 left-1/2 z-20 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 px-4">
          {[
            { on: settings.overlays.speed, icon: 'Wind', label: 'Скорость', key: 'speed' as const },
            { on: settings.overlays.map, icon: 'Map', label: 'Карта', key: 'map' as const },
            { on: settings.overlays.altitude, icon: 'Mountain', label: 'Высота', key: 'altitude' as const },
            { on: settings.overlays.distance, icon: 'Route', label: 'Дистанция', key: 'distance' as const },
          ].map((c) => (
            <button
              key={c.label}
              onClick={() =>
                setSettings({
                  ...settings,
                  overlays: { ...settings.overlays, [c.key]: !settings.overlays[c.key] },
                })
              }
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-all hover:scale-105 ${
                c.on
                  ? 'border-primary/50 bg-primary/20 text-primary shadow-[0_0_16px_hsl(var(--neon)/0.35)]'
                  : 'border-white/10 bg-black/40 text-white/60'
              }`}
            >
              <Icon name={c.icon} size={13} />
              {c.label}
            </button>
          ))}
        </div>

        {/* Floating glass dock */}
        <div className="pointer-events-auto absolute bottom-6 left-1/2 z-30 -translate-x-1/2 px-4">
          <div className="flex items-center gap-3 rounded-[2rem] border border-white/10 bg-black/50 p-2.5 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            <button
              onClick={() => setSettings({ ...settings, audio: !settings.audio })}
              className={`group grid h-14 w-14 place-items-center rounded-3xl transition-all hover:scale-105 ${
                settings.audio ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40'
              }`}
            >
              <Icon name={settings.audio ? 'Mic' : 'MicOff'} size={22} />
            </button>

            <button
              onClick={() => setSettings({ ...settings, camera: settings.camera === 'back' ? 'front' : 'back' })}
              className="grid h-14 w-14 place-items-center rounded-3xl bg-white/10 text-white transition-all hover:scale-105 hover:bg-white/20"
            >
              <Icon name="SwitchCamera" size={22} />
            </button>

            <button
              onClick={toggleRec}
              className={`grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border-[5px] transition-all duration-200 hover:scale-105 ${
                recording
                  ? 'border-red-400/80 bg-red-500/20'
                  : 'border-primary bg-primary/15 animate-glow'
              }`}
            >
              {recording ? (
                <span className="h-6 w-6 rounded-[7px] bg-red-500" />
              ) : (
                <span className="h-12 w-12 rounded-full bg-primary" />
              )}
            </button>

            <button
              onClick={() => setSettings({ ...settings, wide: !settings.wide })}
              className={`grid h-14 w-14 place-items-center rounded-3xl transition-all hover:scale-105 ${
                settings.wide ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40'
              }`}
            >
              <Icon name="Maximize" size={22} />
            </button>

            <button
              onClick={() => setSettingsOpen(true)}
              className="grid h-14 w-14 place-items-center rounded-3xl bg-white/10 text-white transition-all hover:scale-105 hover:bg-white/20"
            >
              <Icon name="Settings" size={22} />
            </button>
          </div>
        </div>
      </div>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={setSettings}
      />
    </div>
  );
};

export default Index;