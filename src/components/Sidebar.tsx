import { Home, Mail, MessageSquare, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "email", label: "Email Scanner", icon: Mail },
  { id: "sms", label: "SMS Scanner", icon: MessageSquare },
  { id: "url", label: "URL Scanner", icon: Link2 },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-card h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary">
            <img
              src="/favicon.ico"
              alt="AuthSentry"
              className="h-6 w-6"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg">AuthSentry</h1>
            <p className="text-xs text-muted-foreground">
              Credential & Phishing Protection
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-xs font-medium mb-1">AI-Powered Protection</p>
          <p className="text-xs text-muted-foreground">
            Detects phishing and credential theft before compromise.
          </p>
        </div>
      </div>
    </aside>
  );
}
