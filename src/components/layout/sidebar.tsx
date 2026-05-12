import Link from "next/link";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Websites",
    href: "/websites",
  },
  {
    name: "Settings",
    href: "/settings",
  },
  {
    name: "Billing",
    href: "/billing",
  },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-6">
        <h2 className="text-2xl font-bold">PulseStat</h2>
      </div>
      <nav className="space-y-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-4 py-2 text-sm hover:bg-muted"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
