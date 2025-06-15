export default function Privacy() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <main className="flex grow justify-center px-4 py-18 lg:px-8">
        <div className="w-full max-w-3xl">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-6 relative">
            Política de Privacidade
            <span className="absolute left-0 -bottom-2 h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed">
            No <strong>AlerTHE</strong>, sua privacidade é levada a sério. Suas
            informações pessoais só são registradas se você optar por{" "}
            <strong>não enviar de forma anônima</strong>. Mesmo assim, esses
            dados são usados apenas para controle interno e{" "}
            <strong>nunca são divulgados publicamente</strong>.
          </p>

          <p className="mt-6 text-lg text-gray-700 leading-relaxed">
            Tudo o que você informa fica guardado em um ambiente seguro, com
            acesso permitido somente a pessoas autorizadas. Nossa equipe segue
            regras rígidas para garantir que suas informações{" "}
            <strong>fiquem protegidas e longe de olhares indevidos</strong>.
          </p>

          <div className="mt-10 border-l-4 border-blue-500 bg-blue-50 text-blue-800 px-4 py-4 rounded-md shadow-sm">
            <p className="text-sm">
              🔒 Seus dados são tratados com respeito, sigilo e
              responsabilidade. Você tem o controle sobre o que deseja
              compartilhar — inclusive a opção de permanecer anônimo.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
