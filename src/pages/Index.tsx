import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { MessageScanner } from "@/components/MessageScanner";
import { UrlScanner } from "@/components/UrlScanner";
import { EmailScanner } from "@/components/EmailScanner";
import { Shield } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "email":
        return <EmailScanner />;
      case "sms":
        return <MessageScanner />;
      case "url":
        return <UrlScanner />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "email":
        return "Email Scanner";
      case "sms":
        return "SMS & Message Scanner";
      case "url":
        return "URL & Link Scanner";
      default:
        return "Dashboard";
    }
  };

  const getPageDescription = () => {
    switch (activeTab) {
      case "dashboard":
        return "Overview of your fraud detection activity and threat analysis";
      case "email":
        return "Analyze emails for phishing, scams, and malicious content";
      case "sms":
        return "Scan text messages and WhatsApp content for threats";
      case "url":
        return "Check links for phishing, malware, and suspicious domains";
      default:
        return "";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
              <p className="text-sm text-muted-foreground">{getPageDescription()}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-safe/10 text-safe text-sm font-medium">
              <Shield className="h-4 w-4" />
              <span>Protection Active</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
