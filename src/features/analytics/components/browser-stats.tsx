interface BrowserStatsProps {
  browsers: {
    browser: string;
    count: number;
  }[];
}

export function BrowserStats({
  browsers,
}: BrowserStatsProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-xl font-semibold">
        Browsers
      </h2>

      <div className="space-y-2">
        {browsers.map((browser) => (
          <div
            key={browser.browser}
            className="flex items-center justify-between"
          >
            <span>{browser.browser}</span>

            <span>{browser.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}