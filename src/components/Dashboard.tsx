import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";

export const Dashboard = () => {
  const { state } = useApp();

  // Calculate real statistics from state
  const completedDocuments = state.documents.filter(doc => doc.status === 'completed').length;
  const processingDocuments = state.documents.filter(doc => doc.status === 'processing' || doc.status === 'uploading').length;
  const completedReports = state.reports.filter(report => report.status === 'completed').length;
  const processingReports = state.reports.filter(report => report.status === 'processing').length;
  const totalUploads = state.documents.length;

  const stats = [
    {
      title: "Documentos Processados",
      value: completedDocuments.toString(),
      change: totalUploads > 0 ? `${Math.round((completedDocuments / totalUploads) * 100)}% concluídos` : "Nenhum upload ainda",
      icon: FileText,
      color: "text-primary"
    },
    {
      title: "Relatórios Gerados",
      value: completedReports.toString(),
      change: state.reports.length > 0 ? `${state.reports.length} total` : "Nenhum relatório ainda",
      icon: CheckCircle,
      color: "text-accent"
    },
    {
      title: "Em Processamento",
      value: (processingDocuments + processingReports).toString(),
      change: processingDocuments > 0 || processingReports > 0 ? "Aguardando conclusão" : "Tudo processado",
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Total de Uploads",
      value: totalUploads.toString(),
      change: totalUploads > 0 ? `${Math.round(state.documents.reduce((acc, doc) => acc + doc.size, 0) / (1024 * 1024))} MB total` : "Comece enviando arquivos",
      icon: Upload,
      color: "text-purple-600"
    }
  ];

  // Get recent reports from state
  const recentReports = state.reports
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(report => ({
      title: report.title,
      type: getReportTypeLabel(report.type),
      date: formatRelativeDate(report.createdAt),
      status: getStatusLabel(report.status)
    }));

  function getReportTypeLabel(type: string) {
    const labels: Record<string, string> = {
      technical: 'Análise Técnica',
      analysis: 'Análise de Dados',
      summary: 'Resumo Executivo',
      custom: 'Personalizado'
    };
    return labels[type] || type;
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      draft: 'Rascunho',
      processing: 'Processando',
      completed: 'Concluído',
      error: 'Erro'
    };
    return labels[status] || status;
  }

  function formatRelativeDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else if (diffInDays === 0) {
      return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays === 1) {
      return `Ontem, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in bg-gradient-warm min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral dos seus documentos e relatórios
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className="animate-slide-up hover:shadow-large transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] transform bg-card/70 backdrop-blur-sm border border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground font-variant-numeric: tabular-nums">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports */}
      <Card className="animate-slide-up bg-card/80 backdrop-blur-sm" style={{ animationDelay: "400ms" }}>
        <CardHeader>
          <CardTitle className="text-xl">Relatórios Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentReports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum relatório gerado ainda</p>
              <p className="text-sm text-muted-foreground mt-1">
                Faça upload de documentos para começar a gerar relatórios
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-subtle rounded-lg border border-border"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">{report.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.date}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={report.status === "Concluído" ? "default" : "secondary"}
                    className={report.status === "Concluído" ? "bg-accent text-accent-foreground" : ""}
                  >
                    {report.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};