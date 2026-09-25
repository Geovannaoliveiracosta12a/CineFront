// ==================================================
// CONFIGURAÇÃO DA API
// ==================================================

const API = "https://cine-flash-backend.vercel.app";


// ==================================================
// LISTAR FILMES
// ==================================================

async function carregarFilmes() {

    const lista = document.getElementById("lista-filmes");
    const carregando = document.getElementById("carregando");

    if (carregando) {
        carregando.style.display = "block";
    }

    try {

        // A raiz do backend já retorna os filmes
        const resposta = await fetch(API);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const filmes = await resposta.json();

        if (carregando) {
            carregando.style.display = "none";
        }

        if (!lista) {
            return;
        }

        lista.innerHTML = "";

        if (!filmes || filmes.length === 0) {

            lista.innerHTML = `
                <p class="mensagem-vazia">
                    Nenhum filme cadastrado.
                </p>
            `;

            return;
        }

        filmes.forEach((filme) => {

            const card = document.createElement("div");

            card.className = "filme-card";

            card.innerHTML = `
                <h3>${filme.title}</h3>

                <p>
                    <strong>Gênero:</strong>
                    ${filme.genre}
                </p>

                <p>
                    <strong>Duração:</strong>
                    ${filme.duration} min
                </p>

                <p>
                    <strong>Classificação:</strong>
                    ${filme.age_rating}
                </p>

                <div class="acoes">

                    <button
                        type="button"
                        onclick="editarFilme(${filme.id})"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        onclick="apagarFilme(${filme.id}, '${String(filme.title).replace(/'/g, "\\'")}')"
                    >
                        Excluir
                    </button>

                </div>
            `;

            lista.appendChild(card);

        });

    } catch (erro) {

        console.error("Erro ao carregar filmes:", erro);

        if (carregando) {
            carregando.style.display = "none";
        }

        if (lista) {

            lista.innerHTML = `
                <div class="erro-servidor">
                    <h3>NÃO FOI POSSÍVEL CONECTAR AO SERVIDOR.</h3>
                    <p>
                        Verifique a conexão com o servidor.
                    </p>
                </div>
            `;

        }

    }

}


// ==================================================
// EXCLUIR FILME
// ==================================================

async function apagarFilme(id, titulo) {

    const confirmar = confirm(
        `Deseja realmente excluir o filme "${titulo}"?`
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
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const resultado = await resposta.json();

        alert(
            resultado.message || "Filme excluído com sucesso!"
        );

        carregarFilmes();

    } catch (erro) {

        console.error("Erro ao excluir filme:", erro);

        alert(
            "Não foi possível excluir o filme."
        );

    }

}


// ==================================================
// IR PARA A PÁGINA DE EDIÇÃO
// ==================================================

function editarFilme(id) {

    window.location.href = `editar.html?id=${id}`;

}


// ==================================================
// CADASTRAR FILME
// ==================================================

async function cadastrarFilme(event) {

    event.preventDefault();

    const form = event.target;

    const title = form.querySelector(
        '[name="title"]'
    )?.value.trim();

    const genre = form.querySelector(
        '[name="genre"]'
    )?.value.trim();

    const duration = form.querySelector(
        '[name="duration"]'
    )?.value;

    const age_rating = form.querySelector(
        '[name="age_rating"]'
    )?.value;

    if (
        !title ||
        !genre ||
        !duration ||
        !age_rating
    ) {

        alert(
            "Preencha todos os campos."
        );

        return;
    }

    try {

        const resposta = await fetch(
            `${API}/create-filmes`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: title,
                    genre: genre,
                    duration: duration,
                    age_rating: age_rating
                })
            }
        );

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const resultado = await resposta.json();

        alert(
            resultado.message ||
            "Filme cadastrado com sucesso!"
        );

        form.reset();

        window.location.href = "index.html";

    } catch (erro) {

        console.error(
            "Erro ao cadastrar filme:",
            erro
        );

        alert(
            "Não foi possível cadastrar o filme."
        );

    }

}


// ==================================================
// CARREGAR FILME PARA EDIÇÃO
// ==================================================

async function carregarFilmeParaEditar() {

    const parametros = new URLSearchParams(
        window.location.search
    );

    const id = parametros.get("id");

    if (!id) {
        return;
    }

    try {

        // Também usamos a rota principal,
        // que já está funcionando na Vercel.
        const resposta = await fetch(API);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const filmes = await resposta.json();

        const filme = filmes.find(
            (item) => String(item.id) === String(id)
        );

        if (!filme) {

            alert(
                "Filme não encontrado."
            );

            return;
        }

        const titulo = document.querySelector(
            '[name="title"]'
        );

        const genero = document.querySelector(
            '[name="genre"]'
        );

        const duracao = document.querySelector(
            '[name="duration"]'
        );

        const classificacao = document.querySelector(
            '[name="age_rating"]'
        );

        if (titulo) {
            titulo.value = filme.title;
        }

        if (genero) {
            genero.value = filme.genre;
        }

        if (duracao) {
            duracao.value = filme.duration;
        }

        if (classificacao) {
            classificacao.value = filme.age_rating;
        }

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

    const parametros = new URLSearchParams(
        window.location.search
    );

    const id = parametros.get("id");

    if (!id) {

        alert(
            "ID do filme não encontrado."
        );

        return;
    }

    const form = event.target;

    const title = form.querySelector(
        '[name="title"]'
    )?.value.trim();

    const genre = form.querySelector(
        '[name="genre"]'
    )?.value.trim();

    const duration = form.querySelector(
        '[name="duration"]'
    )?.value;

    const age_rating = form.querySelector(
        '[name="age_rating"]'
    )?.value;

    if (
        !title ||
        !genre ||
        !duration ||
        !age_rating
    ) {

        alert(
            "Preencha todos os campos."
        );

        return;
    }

    try {

        const resposta = await fetch(
            `${API}/update-filmes/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: title,
                    genre: genre,
                    duration: duration,
                    age_rating: age_rating
                })
            }
        );

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const resultado = await resposta.json();

        alert(
            resultado.message ||
            "Informações atualizadas com sucesso!"
        );

        window.location.href = "index.html";

    } catch (erro) {

        console.error(
            "Erro ao atualizar filme:",
            erro
        );

        alert(
            "Não foi possível atualizar o filme."
        );

    }

}


// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // Página inicial
        if (
            document.getElementById("lista-filmes")
        ) {

            carregarFilmes();

        }


        // Formulário de cadastro
        const formularioCadastro =
            document.querySelector(
                'form[data-form="cadastro"]'
            );

        if (formularioCadastro) {

            formularioCadastro.addEventListener(
                "submit",
                cadastrarFilme
            );

        }


        // Formulário de edição
        const formularioEdicao =
            document.querySelector(
                'form[data-form="editar"]'
            );

        if (formularioEdicao) {

            carregarFilmeParaEditar();

            formularioEdicao.addEventListener(
                "submit",
                atualizarFilme
            );

        }

    }
);