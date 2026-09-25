const API = "https://cine-flash-backend.vercel.app";


// ==================================================
// INICIAR
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

    // INDEX
    if (document.getElementById("lista-filmes")) {
        carregarFilmes();
    }

    // CADASTRO
    const formularioCadastro = document.getElementById("form-cadastro");

    if (formularioCadastro) {
        formularioCadastro.addEventListener(
            "submit",
            cadastrarFilme
        );
    }

    // EDIÇÃO
    const formularioEditar = document.getElementById("form-editar");

    if (formularioEditar) {
        carregarFilmeParaEditar();

        formularioEditar.addEventListener(
            "submit",
            atualizarFilme
        );
    }

});


// ==================================================
// LISTAR FILMES
// ==================================================

async function carregarFilmes() {

    const lista = document.getElementById("lista-filmes");
    const carregando = document.getElementById("carregando");

    try {

        const resposta = await fetch(API);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar filmes.");
        }

        const filmes = await resposta.json();

        if (carregando) {
            carregando.style.display = "none";
        }

        lista.innerHTML = "";

        if (filmes.length === 0) {

            lista.innerHTML = `
                <div class="mensagem">
                    NENHUM FILME CADASTRADO.
                </div>
            `;

            return;
        }

        filmes.forEach((filme, index) => {

            // CARD
            const card = document.createElement("div");
            card.className = "filme-card";


            // NÚMERO
            const numero = document.createElement("div");
            numero.className = "filme-numero";

            numero.textContent =
                `INGRESSO Nº ${String(index + 1).padStart(4, "0")}`;


            // TÍTULO
            const titulo = document.createElement("div");
            titulo.className = "filme-titulo";

            titulo.textContent = filme.title;


            // GÊNERO
            const genero = document.createElement("div");
            genero.className = "filme-genero";

            genero.textContent = filme.genre;


            // INFORMAÇÕES
            const informacoes = document.createElement("div");
            informacoes.className = "filme-info";


            // DURAÇÃO
            const duracao = document.createElement("span");
            duracao.className = "info";

            duracao.textContent =
                `${filme.duration} MIN`;


            // CLASSIFICAÇÃO
            const classificacao = document.createElement("span");
            classificacao.className = "info";

            classificacao.textContent =
                `${filme.age_rating} ANOS`;


            informacoes.appendChild(duracao);
            informacoes.appendChild(classificacao);


            // AÇÕES
            const acoes = document.createElement("div");
            acoes.className = "acoes";


            // BOTÃO EDITAR
            const botaoEditar = document.createElement("button");

            botaoEditar.type = "button";
            botaoEditar.className = "btn-editar";
            botaoEditar.textContent = "EDITAR";


            botaoEditar.addEventListener(
                "click",
                () => {

                    window.location.href =
                        `editar.html?id=${filme.id}`;

                }
            );


            // BOTÃO APAGAR
            const botaoApagar = document.createElement("button");

            botaoApagar.type = "button";
            botaoApagar.className = "btn-apagar";
            botaoApagar.textContent = "APAGAR";


            botaoApagar.addEventListener(
                "click",
                () => {

                    apagarFilme(
                        filme.id,
                        filme.title
                    );

                }
            );


            acoes.appendChild(botaoEditar);
            acoes.appendChild(botaoApagar);


            // MONTAR CARD
            card.appendChild(numero);
            card.appendChild(titulo);
            card.appendChild(genero);
            card.appendChild(informacoes);
            card.appendChild(acoes);


            lista.appendChild(card);

        });

    } catch (erro) {

        console.error(
            "Erro ao carregar filmes:",
            erro
        );

        if (carregando) {
            carregando.style.display = "none";
        }

        lista.innerHTML = `
            <div class="mensagem">
                NÃO FOI POSSÍVEL CONECTAR AO SERVIDOR.
                <br><br>
                Verifique a conexão com o servidor.
            </div>
        `;

    }

}


// ==================================================
// CADASTRAR FILME
// ==================================================

async function cadastrarFilme(event) {

    event.preventDefault();


    const titulo =
        document.getElementById("title").value.trim();

    const genero =
        document.getElementById("genre").value.trim();

    const duracao =
        document.getElementById("duration").value;

    const classificacao =
        document.getElementById("age_rating").value;


    const dados = {
        title: titulo,
        genre: genero,
        duration: duracao,
        age_rating: classificacao
    };


    try {

        const resposta = await fetch(
            `${API}/create-filmes`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(dados)
            }
        );


        if (!resposta.ok) {
            throw new Error(
                "Erro ao cadastrar filme."
            );
        }


        const resultado =
            await resposta.json();


        const mensagem =
            document.getElementById(
                "mensagem-cadastro"
            );


        if (mensagem) {

            mensagem.textContent =
                resultado.message ||
                "Filme cadastrado com sucesso!";

        }


        alert(
            resultado.message ||
            "Filme cadastrado com sucesso!"
        );


        document
            .getElementById("form-cadastro")
            .reset();


        window.location.href = "index.html";


    } catch (erro) {

        console.error(
            "Erro ao cadastrar:",
            erro
        );


        const mensagem =
            document.getElementById(
                "mensagem-cadastro"
            );


        if (mensagem) {

            mensagem.textContent =
                "Não foi possível cadastrar o filme.";

        }


        alert(
            "Não foi possível cadastrar o filme."
        );

    }

}


// ==================================================
// CARREGAR FILME PARA EDITAR
// ==================================================

async function carregarFilmeParaEditar() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id = parametros.get("id");


    if (!id) {

        alert(
            "ID do filme não encontrado."
        );

        return;
    }


    try {

        const resposta = await fetch(API);


        if (!resposta.ok) {
            throw new Error(
                "Erro ao buscar filmes."
            );
        }


        const filmes =
            await resposta.json();


        const filme =
            filmes.find(
                item =>
                    String(item.id) === String(id)
            );


        if (!filme) {

            alert(
                "Filme não encontrado."
            );

            return;
        }


        document.getElementById("title").value =
            filme.title;


        document.getElementById("genre").value =
            filme.genre;


        document.getElementById("duration").value =
            filme.duration;


        document.getElementById("age_rating").value =
            filme.age_rating;


    } catch (erro) {

        console.error(
            "Erro ao carregar filme:",
            erro
        );


        alert(
            "Não foi possível carregar os dados do filme."
        );

    }

}


// ==================================================
// ATUALIZAR FILME
// ==================================================

async function atualizarFilme(event) {

    event.preventDefault();


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id = parametros.get("id");


    if (!id) {

        alert(
            "ID do filme não encontrado."
        );

        return;
    }


    const titulo =
        document.getElementById("title").value.trim();

    const genero =
        document.getElementById("genre").value.trim();

    const duracao =
        document.getElementById("duration").value;

    const classificacao =
        document.getElementById("age_rating").value;


    const dados = {
        title: titulo,
        genre: genero,
        duration: duracao,
        age_rating: classificacao
    };


    try {

        const resposta = await fetch(
            `${API}/update-filmes/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(dados)
            }
        );


        if (!resposta.ok) {
            throw new Error(
                "Erro ao atualizar filme."
            );
        }


        const resultado =
            await resposta.json();


        const mensagem =
            document.getElementById(
                "mensagem-editar"
            );


        if (mensagem) {

            mensagem.textContent =
                resultado.message ||
                "Informações atualizadas com sucesso!";

        }


        alert(
            resultado.message ||
            "Informações atualizadas com sucesso!"
        );


        window.location.href = "index.html";


    } catch (erro) {

        console.error(
            "Erro ao atualizar:",
            erro
        );


        const mensagem =
            document.getElementById(
                "mensagem-editar"
            );


        if (mensagem) {

            mensagem.textContent =
                "Não foi possível atualizar o filme.";

        }


        alert(
            "Não foi possível atualizar o filme."
        );

    }

}


// ==================================================
// APAGAR FILME
// ==================================================

async function apagarFilme(id, titulo) {

    const confirmar = confirm(
        `Tem certeza que deseja apagar "${titulo}"?`
    );


    if (!confirmar) {
        return;
    }


    try {

        const resposta = await fetch(
            `${API}/delete-filmes/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!resposta.ok) {
            throw new Error(
                "Erro ao apagar filme."
            );
        }


        const resultado =
            await resposta.json();


        alert(
            resultado.message ||
            "Filme apagado com sucesso!"
        );


        carregarFilmes();


    } catch (erro) {

        console.error(
            "Erro ao apagar:",
            erro
        );


        alert(
            "Não foi possível apagar o filme."
        );

    }

}