const API = "https://cine-flash-backend.vercel.app";


// ==================================================
// LISTAR FILMES
// ==================================================

async function carregarFilmes() {

    const lista = document.getElementById("lista-filmes");
    const carregando = document.getElementById("carregando");

    if (!lista) {
        return;
    }

    try {

        const resposta = await fetch(`${API}/todos-filmes`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar filmes.");
        }

        const filmes = await resposta.json();

        if (carregando) {
            carregando.style.display = "none";
        }

        if (filmes.length === 0) {

            lista.innerHTML = `
                <div class="mensagem">
                    NENHUM FILME CADASTRADO.
                    <br><br>
                    QUE TAL COLOCAR UM FILME EM CARTAZ?
                </div>
            `;

            return;
        }

        lista.innerHTML = filmes.map((filme, index) => {

            return `
                <article class="filme-card">

                    <div class="filme-numero">
                        INGRESSO #${String(index + 1).padStart(2, "0")}
                    </div>

                    <h2 class="filme-titulo">
                        ${filme.title}
                    </h2>

                    <p class="filme-genero">
                        ${filme.genre}
                    </p>

                    <div class="filme-info">

                        <span class="info">
                            ⏱ ${filme.duration} MIN
                        </span>

                        <span class="info">
                            🔞 ${filme.age_rating}
                        </span>

                    </div>

                    <div class="acoes">

                        <button
                            class="btn-editar"
                            onclick="editarFilme(${filme.id})"
                        >
                            ✎ EDITAR
                        </button>

                        <button
                            class="btn-apagar"
                            onclick="apagarFilme(${filme.id}, '${filme.title.replace(/'/g, "\\'")}')"
                        >
                            ✕ APAGAR
                        </button>

                    </div>

                </article>
            `;

        }).join("");

    } catch (erro) {

        if (carregando) {
            carregando.innerHTML = `
                NÃO FOI POSSÍVEL CONECTAR AO SERVIDOR.
                <br><br>
                Verifique a conexão com o servidor.
            `;
        }

        console.error(erro);
    }
}


// ==================================================
// APAGAR FILME
// ==================================================

async function apagarFilme(id, titulo) {

    const confirmar = confirm(
        `Deseja realmente retirar "${titulo}" de cartaz?`
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
            throw new Error("Erro ao apagar filme.");
        }

        alert("Filme retirado de cartaz com sucesso! 🎬");

        carregarFilmes();

    } catch (erro) {

        alert("Não foi possível apagar o filme.");

        console.error(erro);
    }
}


// ==================================================
// IR PARA EDITAR
// ==================================================

function editarFilme(id) {

    window.location.href = `editar.html?id=${id}`;

}


// ==================================================
// CADASTRAR FILME
// ==================================================

const formularioCadastro =
    document.getElementById("form-cadastro");

if (formularioCadastro) {

    formularioCadastro.addEventListener("submit", async (event) => {

        event.preventDefault();

        const mensagem =
            document.getElementById("mensagem-cadastro");

        const title =
            document.getElementById("title").value;

        const genre =
            document.getElementById("genre").value;

        const duration =
            document.getElementById("duration").value;

        const age_rating =
            document.getElementById("age_rating").value;


        try {

            const resposta = await fetch(
                `${API}/create-filmes`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        title,
                        genre,
                        duration,
                        age_rating
                    })
                }
            );


            if (!resposta.ok) {
                throw new Error("Erro ao cadastrar.");
            }


            mensagem.innerHTML =
                "🎟 FILME CADASTRADO COM SUCESSO!";


            formularioCadastro.reset();


            setTimeout(() => {

                window.location.href = "index.html";

            }, 1200);


        } catch (erro) {

            mensagem.innerHTML =
                "ERRO AO CADASTRAR O FILME.";

            console.error(erro);
        }

    });

}


// ==================================================
// CARREGAR FILME PARA EDIÇÃO
// ==================================================

async function carregarFilmeParaEditar() {

    const formulario =
        document.getElementById("form-editar");

    if (!formulario) {
        return;
    }


    const parametros =
        new URLSearchParams(window.location.search);

    const id =
        parametros.get("id");


    if (!id) {

        alert("Filme não encontrado.");

        window.location.href = "index.html";

        return;
    }


    try {

        const resposta =
            await fetch(`${API}/todos-filmes`);


        if (!resposta.ok) {
            throw new Error("Erro ao buscar filmes.");
        }


        const filmes =
            await resposta.json();


        const filme =
            filmes.find(item => item.id == id);


        if (!filme) {

            alert("Filme não encontrado.");

            window.location.href = "index.html";

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


        formulario.dataset.id = id;


    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar o filme.");
    }
}


// ==================================================
// EDITAR FILME
// ==================================================

const formularioEditar =
    document.getElementById("form-editar");

if (formularioEditar) {

    carregarFilmeParaEditar();


    formularioEditar.addEventListener("submit", async (event) => {

        event.preventDefault();


        const id =
            formularioEditar.dataset.id;


        const title =
            document.getElementById("title").value;

        const genre =
            document.getElementById("genre").value;

        const duration =
            document.getElementById("duration").value;

        const age_rating =
            document.getElementById("age_rating").value;


        const mensagem =
            document.getElementById("mensagem-editar");


        try {

            const resposta = await fetch(
                `${API}/update-filmes/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        title,
                        genre,
                        duration,
                        age_rating
                    })
                }
            );


            if (!resposta.ok) {
                throw new Error("Erro ao atualizar.");
            }


            mensagem.innerHTML =
                "✦ FILME ATUALIZADO COM SUCESSO!";


            setTimeout(() => {

                window.location.href = "index.html";

            }, 1200);


        } catch (erro) {

            mensagem.innerHTML =
                "ERRO AO ATUALIZAR O FILME.";

            console.error(erro);
        }

    });

}


// ==================================================
// INICIAR
// ==================================================

carregarFilmes();