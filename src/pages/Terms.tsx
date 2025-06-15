export default function Terms() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <main className="flex grow justify-center px-4 py-18 lg:px-8">
        <div className="w-full max-w-3xl">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-6 relative">
            Termos de Uso
            <span className="absolute left-0 -bottom-2 h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed">
            Ao utilizar o <strong>AlerTHE</strong>, você concorda com os
            princípios de uso responsável do sistema. As informações registradas
            têm como objetivo melhorar o cuidado com a cidade, permitindo que
            problemas urbanos sejam acompanhados e encaminhados aos órgãos
            competentes.
          </p>

          <p className="mt-6 text-lg text-gray-700 leading-relaxed">
            O usuário se compromete a{" "}
            <strong>
              não enviar informações falsas, ofensivas ou discriminatórias
            </strong>
            . O uso do sistema deve ser feito com responsabilidade e respeito à
            coletividade.
          </p>

          <p className="mt-6 text-lg text-gray-700 leading-relaxed">
            As informações registradas podem ser compartilhadas com instituições
            públicas responsáveis por serviços urbanos, apenas quando necessário
            para a resolução das ocorrências.
          </p>

          <div className="mt-10 border-l-4 border-yellow-500 bg-yellow-50 text-yellow-800 px-4 py-4 rounded-md shadow-sm">
            <p className="text-sm">
              ⚠️ O descumprimento dos termos pode levar à suspensão do acesso ao
              sistema. A equipe do AlerTHE se reserva o direito de tomar as
              medidas necessárias para garantir o bom funcionamento da
              plataforma.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
