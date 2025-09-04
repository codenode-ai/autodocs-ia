import { useState } from "react";
import { Upload, File, X, CheckCircle, AlertCircle, FileText, FileSpreadsheet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { useFileProcessor } from "@/hooks/useFileProcessor";

export const UploadArea = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { state, removeDocument } = useApp();
  const { processFiles, isProcessing } = useFileProcessor();
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      try {
        await processFiles(droppedFiles);
        toast({
          title: "Upload concluído",
          description: `${droppedFiles.length} arquivo(s) processado(s) com sucesso.`,
        });
      } catch (error) {
        toast({
          title: "Erro no upload",
          description: "Alguns arquivos não puderam ser processados.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      try {
        await processFiles(selectedFiles);
        toast({
          title: "Upload concluído",
          description: `${selectedFiles.length} arquivo(s) processado(s) com sucesso.`,
        });
      } catch (error) {
        toast({
          title: "Erro no upload",
          description: "Alguns arquivos não puderam ser processados.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveFile = (fileId: string) => {
    removeDocument(fileId);
    toast({
      title: "Arquivo removido",
      description: "O arquivo foi removido da lista.",
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('word') || type.includes('document')) return FileText;
    if (type.includes('excel') || type.includes('spreadsheet')) return FileSpreadsheet;
    return File;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "error":
        return AlertCircle;
      default:
        return Upload;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-accent";
      case "error":
        return "text-destructive";
      default:
        return "text-primary";
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "completed":
        return "default";
      case "error":
        return "destructive";
      case "processing":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "uploading":
        return "Enviando";
      case "processing":
        return "Processando";
      case "completed":
        return "Concluído";
      case "error":
        return "Erro";
      default:
        return status;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in bg-gradient-warm min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upload de Documentos</h1>
        <p className="text-muted-foreground mt-2">
          Faça upload dos seus documentos para gerar relatórios automaticamente
        </p>
      </div>

      <Card className="animate-slide-up bg-card/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.6,1)] ${
              isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            } ${isProcessing ? 'opacity-50 pointer-events-none animate-pulse' : ''}`}
            style={{
              animation: isProcessing ? 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' : 'none'
            }}
          >
            <Upload className={`mx-auto h-12 w-12 mb-4 ${
              isProcessing ? 'text-primary animate-pulse' : 'text-muted-foreground'
            }`} />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {isProcessing ? 'Processando arquivos...' : 'Arraste arquivos aqui ou clique para selecionar'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isProcessing ? 'Aguarde enquanto processamos seus documentos' : 'Suporta PDF, Word, Excel e arquivos de texto (máx. 50MB)'}
            </p>
            
            <Button variant="outline" className="mt-2" disabled={isProcessing}>
              {isProcessing ? 'Processando...' : 'Selecionar Arquivos'}
            </Button>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
          </div>
        </CardContent>
      </Card>

      {state.documents.length > 0 && (
        <Card className="animate-slide-up bg-card/80 backdrop-blur-sm" style={{ animationDelay: "200ms" }}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Documentos Enviados ({state.documents.length})
            </h3>
            
            <div className="space-y-3">
              {state.documents.map((document) => {
                const Icon = getStatusIcon(document.status);
                const FileIcon = getFileIcon(document.type);
                
                return (
                  <div
                    key={document.id}
                    className={`flex items-center justify-between p-4 rounded-lg border border-border transition-all duration-300 ease-in-out ${
                      document.status === 'uploading' 
                        ? 'bg-primary/10 border-primary/20' 
                        : document.status === 'processing' 
                          ? 'bg-primary/5 border-primary/10' 
                          : document.status === 'completed' 
                            ? 'bg-accent/10 border-accent/20' 
                            : 'bg-destructive/10 border-destructive/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FileIcon className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{document.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(document.size)} • {document.type}
                        </p>
                        {document.extractedText && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Texto extraído: {document.extractedText.slice(0, 100)}...
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusVariant(document.status)}>
                        <Icon className="w-3 h-3 mr-1" />
                        {getStatusText(document.status)}
                      </Badge>
                      
                      {(document.status === "completed" || document.status === "error") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(document.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};