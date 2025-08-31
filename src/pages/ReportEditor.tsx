import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ArrowLeft, Download, FileText, Save } from "lucide-react";
import jsPDF from "jspdf";

const ReportEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, updateReport } = useApp();
  const { toast } = useToast();

  const report = state.reports.find(r => r.id === id);
  const [title, setTitle] = useState(report?.title || "");
  const [type, setType] = useState(report?.type || "technical");
  const [content, setContent] = useState(report?.content || "");
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  useEffect(() => {
    if (!report) {
      navigate("/");
      return;
    }
    setTitle(report.title);
    setType(report.type);
    setContent(report.content);
  }, [report, navigate]);

  // Auto-save functionality
  useEffect(() => {
    if (!report) return;
    
    const timeoutId = setTimeout(() => {
      if (title !== report.title || content !== report.content || type !== report.type) {
        handleAutoSave();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [title, content, type, report]);

  const handleAutoSave = async () => {
    if (!report) return;
    
    setIsAutoSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save delay
      updateReport(report.id, {
        title,
        content,
        type: type as any,
        status: 'draft'
      });
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleSave = () => {
    if (!report) return;

    updateReport(report.id, {
      title,
      content,
      type: type as any,
      status: 'completed'
    });

    toast({
      title: "Relatório salvo",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  const handleDownloadPDF = () => {
    if (!report) return;

    try {
      const doc = new jsPDF();
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - 2 * margin;

      // Header
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, 30);

      // Metadata
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Tipo: ${type}`, margin, 45);
      doc.text(`Criado em: ${new Date(report.createdAt).toLocaleDateString('pt-BR')}`, margin, 50);
      doc.text(`Atualizado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, 55);

      // Content
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      
      // Simple HTML to text conversion
      const textContent = content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');

      const lines = doc.splitTextToSize(textContent, maxWidth);
      let yPosition = 70;

      lines.forEach((line: string) => {
        if (yPosition > 270) { // Add new page if needed
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 40, 285);
      }

      doc.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);

      toast({
        title: "PDF gerado",
        description: "O relatório foi baixado como PDF.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o arquivo PDF.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadDoc = () => {
    if (!report) return;

    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Documento baixado",
      description: "O relatório foi baixado como arquivo editável.",
    });
  };

  if (!report) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="hover:bg-secondary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Editor de Relatório</h1>
                {isAutoSaving && (
                  <p className="text-sm text-muted-foreground">Salvando automaticamente...</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="hover:bg-secondary"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadDoc}
                className="hover:bg-secondary"
              >
                <FileText className="h-4 w-4 mr-2" />
                Baixar Editável
              </Button>
              <Button
                size="sm"
                onClick={handleDownloadPDF}
                className="bg-primary hover:bg-primary-hover"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with metadata */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título do Relatório</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título..."
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Tipo de Relatório</Label>
                  <Select value={type} onValueChange={(value) => setType(value as any)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Técnico</SelectItem>
                      <SelectItem value="analysis">Análise</SelectItem>
                      <SelectItem value="summary">Resumo</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Criado:</strong> {new Date(report.createdAt).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Modificado:</strong> {new Date(report.updatedAt).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Status:</strong> {report.status}</p>
                    <p><strong>Documentos:</strong> {report.documentIds.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main editor */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Conteúdo do Relatório</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Comece a escrever seu relatório..."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportEditor;