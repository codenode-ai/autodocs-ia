import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { UploadArea } from "@/components/UploadArea";
import { ReportsList } from "@/components/ReportsList";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [previousTab, setPreviousTab] = useState("dashboard");

  const handleTabChange = (tab: string) => {
    setPreviousTab(activeTab);
    setActiveTab(tab);
  };

  const renderContent = () => {
    const getContentWithAnimation = (content: React.ReactNode) => (
      <div className="animate-fade-in">
        {content}
      </div>
    );

    switch (activeTab) {
      case "dashboard":
        return getContentWithAnimation(<Dashboard />);
      case "upload":
        return getContentWithAnimation(<UploadArea />);
      case "reports":
        return getContentWithAnimation(<ReportsList />);
      case "analytics":
        return getContentWithAnimation(
          <div className="p-8">
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Visualize métricas e estatísticas dos seus relatórios
            </p>
            <div className="mt-8 p-12 bg-gradient-subtle rounded-lg border border-border text-center animate-fade-in">
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </div>
          </div>
        );
      case "settings":
        return getContentWithAnimation(
          <div className="p-8">
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground mt-2">
              Configure preferências e integrações do sistema
            </p>
            <div className="mt-8 p-12 bg-gradient-subtle rounded-lg border border-border text-center animate-fade-in">
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </div>
          </div>
        );
      default:
        return getContentWithAnimation(<Dashboard />);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;