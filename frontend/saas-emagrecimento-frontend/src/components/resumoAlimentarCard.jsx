export default function ResumoAlimentarCard({ resumo }) {
  if (!resumo) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Resumo alimentar inteligente
        </h2>
        <p className="text-sm text-gray-500">
          Nenhum dado alimentar encontrado.
        </p>
      </div>
    );
  }

  const {
    possui_dados,
    classificacao,
    texto,
    pontos_positivos,
    pontos_atencao,
    recomendacao,
    metricas,
  } = resumo;

  const getBadgeClasses = () => {
    if (classificacao === "muito_bom") {
      return "bg-green-100 text-green-700 border border-green-200";
    }

    if (classificacao === "bom") {
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    }

    if (classificacao === "regular") {
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }

    if (classificacao === "precisa_melhorar") {
      return "bg-red-100 text-red-700 border border-red-200";
    }

    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const getBadgeLabel = () => {
    if (classificacao === "muito_bom") return "Muito bom";
    if (classificacao === "bom") return "Bom";
    if (classificacao === "regular") return "Regular";
    if (classificacao === "precisa_melhorar") return "Precisa melhorar";
    return "Sem dados";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Resumo alimentar inteligente
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Interpretação do padrão alimentar recente do usuário
          </p>
        </div>

        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${getBadgeClasses()}`}
        >
          {getBadgeLabel()}
        </span>
      </div>

      {!possui_dados ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">{texto}</p>
          <p className="text-sm text-gray-500 mt-3">{recomendacao}</p>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-gray-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-700 leading-6">{texto}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <p className="text-xs text-gray-500">Refeições</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {metricas?.total_refeicoes ?? 0}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <p className="text-xs text-gray-500">Média calorias</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {metricas?.media_calorias ?? 0}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <p className="text-xs text-gray-500">Proteínas</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {metricas?.media_proteinas ?? 0}g
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <p className="text-xs text-gray-500">Carboidratos</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {metricas?.media_carboidratos ?? 0}g
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <p className="text-xs text-gray-500">Gorduras</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {metricas?.media_gorduras ?? 0}g
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-green-700 mb-3">
                Pontos positivos
              </h3>

              {pontos_positivos && pontos_positivos.length > 0 ? (
                <ul className="space-y-2">
                  {pontos_positivos.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      • {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">
                  Ainda não há pontos positivos relevantes para destacar.
                </p>
              )}
            </div>

            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-red-700 mb-3">
                Pontos de atenção
              </h3>

              {pontos_atencao && pontos_atencao.length > 0 ? (
                <ul className="space-y-2">
                  {pontos_atencao.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      • {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">
                  Nenhum ponto crítico importante foi encontrado.
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-blue-700 mb-2">
              Recomendação da IA
            </h3>
            <p className="text-sm text-gray-700 leading-6">{recomendacao}</p>
          </div>
        </>
      )}
    </div>
  );
}