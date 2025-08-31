import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Download, Plus, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { useAIProcessor } from "@/hooks/useAIProcessor";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Report } from "@/contexts/AppContext";

export const ReportsList = () => {
  const navigate = useNavigate();
  const { state, removeReport } = useApp();
  const { generateReport, isGenerating } = useAIProcessor();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [reportType, setReportType] = useState<Report['type']>('technical');
  const [reportTitle, setReportTitle] = useState('');

  const completedDocuments = state.documents.filter(doc => doc.status === 'completed');

  const handleCreateReport = async () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um documento para gerar o relatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      const reportId = await generateReport(selectedDocuments, reportType, reportTitle);
      toast({
        title: "Relatório gerado",
        description: "Seu relatório foi gerado com sucesso!",
      });
      setIsCreateDialogOpen(false);
      setSelectedDocuments([]);
      setReportTitle('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDocumentSelection = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  const handleDownloadReport = (report: Report) => {
    // For now, create a simple text file download
    const blob = new Blob([report.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado",
      description: "O relatório está sendo baixado.",
    });
  };

  const getStatusBadge = (status: Report["status"]) => {
    const config = {
      draft: { 
        variant: "outline" as const, 
        icon: FileText, 
        label: "Rascunho",
        className: "text-muted-foreground"
      },
      processing: { 
        variant: "secondary" as const, 
        icon: Clock, 
        label: "Processando",
        className: "text-primary"
      },
      completed: { 
        variant: "default" as const, 
        icon: CheckCircle, 
        label: "Concluído",
        className: "text-accent"
      },
      error: { 
        variant: "destructive" as const, 
        icon: AlertCircle, 
        label: "Erro",
        className: "text-destructive"
      }
    };

    const { variant, icon: Icon, label, className } = config[status];
    
    return (
      <Badge variant={variant} className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReportTypeLabel = (type: Report['type']) => {
    const labels = {
      technical: 'Técnico',
      analysis: 'Análise',
      summary: 'Resumo',
      custom: 'Personalizado'
    };
    return labels[type];
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie e visualize seus relatórios gerados
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Relatório
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Relatório</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Relatório</Label>
                <Input
                  id="title"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Digite o título do relatório..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Relatório</Label>
                <Select value={reportType} onValueChange={(value: Report['type']) => setReportType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Relatório Técnico</SelectItem>
                    <SelectItem value="analysis">Análise de Dados</SelectItem>
                    <SelectItem value="summary">Resumo Executivo</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <Label>Documentos para Análise</Label>
                {completedDocuments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum documento disponível. Faça upload de documentos primeiro.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {completedDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={doc.id}
                          checked={selectedDocuments.includes(doc.id)}
                          onCheckedChange={(checked) => handleDocumentSelection(doc.id, checked as boolean)}
                        />
                        <Label htmlFor={doc.id} className="flex-1 text-sm cursor-pointer">
                          {doc.name} ({Math.round(doc.size / 1024)}KB)
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isGenerating}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateReport}
                  disabled={selectedDocuments.length === 0 || isGenerating}
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {state.reports.length === 0 ? (
        <Card className="animate-slide-up">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum relatório gerado ainda
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
              Comece fazendo upload de documentos e gerando seu primeiro relatório automatizado.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(true)}
              disabled={completedDocuments.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Relatório
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {state.reports.map((report, index) => (
            <Card 
              key={report.id} 
              className="animate-slide-up hover:shadow-medium transition-shadow duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{report.title}</CardTitle>
                  {getStatusBadge(report.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Tipo:</span>
                    <span className="font-medium">{getReportTypeLabel(report.type)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Criado:</span>
                    <span>{formatDate(report.createdAt)}</span>
                  </div>
                  
                  {report.pages && (
                    <div className="flex justify-between">
                      <span>Páginas:</span>
                      <span>{report.pages}</span>
                    </div>
                  )}
                  
                  {report.documentSource && (
                    <div className="flex justify-between">
                      <span>Documentos:</span>
                      <span className="truncate max-w-32" title={report.documentSource}>
                        {report.documentSource}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/editor/${report.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  
                  {report.status === 'completed' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/editor/${report.id}`)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownloadReport(report)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};