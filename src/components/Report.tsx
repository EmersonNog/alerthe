import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { generateTechnicalAnalysisAI } from "../services/geminiClient";
import { LOGO_BASE64 } from "../assets/logoBase64"; // seu arquivo base64.ts exportando o logo

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

interface Ocorrencia {
  id: string;
  description: string;
  category: string;
  anonymous: boolean;
  location: [number, number];
  contactNumber?: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
  bairro?: string;
  status?: string;
  title?: string;
  user?: {
    uid: string;
    name: string;
    email: string;
  };
}

export async function gerarRelatorioPDF() {
  const agora = new Date();
  const mes = agora.getMonth() + 1;
  const ano = agora.getFullYear();
  const ultimoDia = new Date(ano, mes, 0).getDate();

  const querySnapshot = await getDocs(collection(db, "ocorrencias"));
  const ocorrencias: Ocorrencia[] = [];

  querySnapshot.forEach((doc) => {
    ocorrencias.push({ id: doc.id, ...doc.data() } as Ocorrencia);
  });

  const ocorrenciasDoMes = ocorrencias.filter((oc) => {
    const createdAt = oc.createdAt?.seconds
      ? new Date(oc.createdAt.seconds * 1000)
      : null;
    return (
      createdAt &&
      createdAt.getMonth() === agora.getMonth() &&
      createdAt.getFullYear() === agora.getFullYear()
    );
  });

  const total = ocorrenciasDoMes.length;
  const categoriasBase = [
    "Infraestrutura",
    "Segurança",
    "Água",
    "Energia",
    "Outros",
  ];
  const contagem: Record<string, number> = {};
  categoriasBase.forEach((cat) => (contagem[cat] = 0));
  ocorrenciasDoMes.forEach((oc) => {
    const cat = oc.category || "Outros";
    contagem[cat] = (contagem[cat] || 0) + 1;
  });

  const doc = new jsPDF("p", "mm", "a4") as jsPDFWithAutoTable;
  doc.setFont("helvetica", "normal");

  // Cabeçalho com logo
  doc.addImage(LOGO_BASE64, "PNG", 14, 10, 28, 28);
  doc.setFontSize(14);
  doc.setTextColor(40, 100, 70);
  const titulo = "ALERTHE – AÇÃO LOCAL DE ENGAJAMENTO E REGISTROS EM TERESINA";
  const linhasTitulo = doc.splitTextToSize(titulo, 150);
  const tituloY = 20;
  doc.text(linhasTitulo, 45, tituloY);

  // altura ocupada pelo título
  const alturaTitulo = linhasTitulo.length * 6;

  // posiciona os demais textos abaixo do título
  const posSubtitulo = tituloY + alturaTitulo;
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(
    `Relatório Técnico Mensal - Nº ${String(mes).padStart(2, "0")}/${ano}`,
    45,
    posSubtitulo
  );
  doc.text(
    `Período: 01/${String(mes).padStart(2, "0")}/${ano} a ${ultimoDia}/${String(
      mes
    ).padStart(2, "0")}/${ano}`,
    45,
    posSubtitulo + 6
  );

  doc.setLineWidth(0.5);
  doc.line(14, 42, 195, 42);

  // Resumo Executivo
  let posY = 50;
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Resumo Executivo:", 14, posY);
  const textoResumo = `Durante o mês de ${agora.toLocaleDateString("pt-BR", {
    month: "long",
  })} de ${ano}, foram registradas ${total} ocorrências urbanas no sistema ALERTHE, distribuídas em 5 categorias. Este relatório visa subsidiar os órgãos públicos e privados na priorização das demandas reportadas pela população.`;
  const linhasResumo = doc.splitTextToSize(textoResumo, 180);
  doc.text(linhasResumo, 14, posY + 6);
  posY += 12 + linhasResumo.length * 5;

  // Resumo por Categoria
  doc.setFontSize(10);
  doc.text("Resumo por Categoria:", 14, posY);
  posY += 6;
  categoriasBase.forEach((cat) => {
    const qtde = contagem[cat];
    const perc = total > 0 ? ((qtde / total) * 100).toFixed(1) : "0.0";
    doc.text(`${cat}: ${qtde} (${perc}%)`, 20, posY);
    posY += 6;
  });

  // Tabela de Ocorrências
  const dadosTabela = ocorrenciasDoMes.map((oc, index) => [
    String(index + 1),
    oc.anonymous ? "Anônimo" : oc.user?.name ?? "-",
    oc.anonymous ? "-" : oc.contactNumber ?? "-",
    oc.category ?? "-",
    oc.description?.slice(0, 50) ?? "-",
    oc.createdAt?.seconds
      ? new Date(oc.createdAt.seconds * 1000).toLocaleDateString("pt-BR")
      : "-",
    `${oc.location?.[0]?.toFixed(5)}, ${oc.location?.[1]?.toFixed(5)}`,
  ]);

  autoTable(doc, {
    startY: posY + 5,
    head: [
      [
        "ID",
        "Usuário",
        "Contato",
        "Categoria",
        "Descrição",
        "Data",
        "Coordenadas",
      ],
    ],
    body: dadosTabela,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [144, 202, 173], textColor: 0, halign: "center" },
    theme: "grid",
    margin: { left: 14, right: 14 },
    pageBreak: "auto",
  });

  // Análise Técnica
  const analiseY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.text("Análise Técnica:", 14, analiseY);
  const resumoIA = categoriasBase
    .map((cat) => `${cat}: ${contagem[cat]} ocorrência(s)`)
    .join("\n");
  const textoIA = await generateTechnicalAnalysisAI(resumoIA);
  const linhasIA = doc.splitTextToSize(textoIA, 180);
  doc.text(linhasIA, 14, analiseY + 6);

  // Rodapé
  const rodapeY = doc.internal.pageSize.height - 10;
  doc.setDrawColor(144, 202, 173);
  doc.setLineWidth(0.3);
  doc.line(14, rodapeY - 4, 195, rodapeY - 4);
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(
    `Relatório gerado automaticamente em ${new Date().toLocaleString("pt-BR")}`,
    105,
    rodapeY,
    { align: "center" }
  );

  doc.save(`relatorio_alerthe_${String(mes).padStart(2, "0")}_${ano}.pdf`);
}
