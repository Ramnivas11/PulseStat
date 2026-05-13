interface DeviceStatsProps {
  devices: {
    device: string;
    count: number;
  }[];
}

export function DeviceStats({
  devices,
}: DeviceStatsProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-xl font-semibold">
        Devices
      </h2>

      <div className="space-y-2">
        {devices.map((device) => (
          <div
            key={device.device}
            className="flex items-center justify-between"
          >
            <span>{device.device}</span>

            <span>{device.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}