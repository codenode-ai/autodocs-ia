import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { UploadArea } from "@/components/UploadArea";
import { ReportsList } from "@/components/ReportsList";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "upload":
        return <UploadArea />;
      case "reports":
        return <ReportsList />;
      case "analytics":
        return (
          <div className="p-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Visualize métricas e estatísticas dos seus relatórios
            </p>
            <div className="mt-8 p-12 bg-gradient-subtle rounded-lg border border-border text-center">
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="p-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground mt-2">
              Configure preferências e integrações do sistema
            </p>
            <div className="mt-8 p-12 bg-gradient-subtle rounded-lg border border-border text-center">
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;