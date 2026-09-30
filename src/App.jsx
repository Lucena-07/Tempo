import "./App.css";
import { useState } from "react";

function App() {
  const [cidade, setCidade] = useState("");
  const [cidadeBuscada, setCidadeBuscada] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [clima, setClima] = useState("");
  const [umidade, setUmidade] = useState("");

  async function consultarClima() {
    if (cidade === "") {
      alert("Digite uma cidade!");
      return;
    }

    try {
      const resposta = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=b643db0bb0118812eb556a2c7b7b03da&units=metric&lang=pt_br`
      );

      const dados = await resposta.json();

      if (dados.cod !== 200) {
        alert("Cidade não encontrada!");
        return;
      }

      // Arredonda a temperatura para não ter casas decimais (estilo Apple)
      setTemperatura(Math.round(dados.main.temp) + "°");
      
      const condicaoClima = dados.weather[0].description;
      setClima(condicaoClima.charAt(0).toUpperCase() + condicaoClima.slice(1));
      
      setUmidade(dados.main.humidity + "%");
      setCidadeBuscada(dados.name); // Pega o nome exato da API
      setCidade(""); // Limpa o campo de busca


      // Enviando dados do react para uma api propria utilizando o metodo post


      // ===============================
// CONTEÚDO DA AULA DE HOJE
// Enviando dados do React para uma API própria
// utilizando o método POST.
// ===============================

// Faz uma requisição para a API de histórico criada pelos alunos
await fetch("http://localhost:3000/historico", {

  // Define o método HTTP utilizado
  method: "POST",

  // Informa que os dados enviados estarão no formato JSON
  headers: {
    "Content-Type": "application/json"
  },

  // Converte o objeto JavaScript para JSON
  body: JSON.stringify({

    // Envia o nome da cidade consultada
    cidade: cidade,

    // Envia a temperatura retornada pela API OpenWeatherMap
    temperatura: dados.main.temp + "°C",

    // Envia a descrição do clima
    clima: dados.weather[0].description,

    // Envia a umidade do ar
    umidade: dados.main.humidity + "%"

  })

});

// Fim do conteúdo da aula
// Neste momento os dados foram enviados para a API
// e armazenados no histórico de consultas.

    } catch (erro) {
      console.log(erro);
      alert("Erro ao consultar a API.");
    }
  }

  return (
    <div className="apple-weather-app">
      <div className="app-container">
        
        {/* Barra de Pesquisa */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar cidade..."
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && consultarClima()}
          />
          <button onClick={consultarClima}>Ir</button>
        </div>

        {/* Exibe o clima apenas se tiver uma temperatura carregada */}
        {temperatura && (
          <div className="weather-content">
            
            {/* Cabeçalho principal com Cidade, Temp e Clima */}
            <div className="main-info">
              <h1 className="city-name">{cidadeBuscada}</h1>
              <h2 className="temperature">{temperatura}</h2>
              <p className="condition">{clima}</p>
            </div>

            {/* "Widgets" estilo Apple para outras informações */}
            <div className="widgets-grid">
              <div className="widget">
                <span className="widget-icon">💧</span>
                <span className="widget-title">UMIDADE</span>
                <span className="widget-value">{umidade}</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;