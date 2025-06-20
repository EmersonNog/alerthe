import { gerarRelatorioPDF } from "./Report";

export default function ExportReportButton() {
  const handleClick = async () => {
    try {
      await gerarRelatorioPDF();
    } catch (error) {
      console.error("Erro ao gerar o relatório:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="ml-4 mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition cursor-pointer"
    >
      Exportar relatório PDF do mês
    </button>
  );
}
