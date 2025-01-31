// ---ALERT - SIMULAÇÃO DE AVANÇO---
function avancarCriar() {
    alert("Aguarde...");
}

// ---LOGIN---
function login(){
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;

    // Verifica se os inputs não estão vazios
    if (email === "" || senha === "") {
        alert("Preencha todos os campos");
        return;
    }

    // Envia os dados para o servidor para validar o login
    fetch('http://localhost:3000/cadastros', {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(resposta => resposta.json())
    .then(data => {
        // Verifica se existe um cadastro com o username e senha informados
        const usuarioValido = data.find(usuario => usuario.email === email && usuario.senha === senha);

        if (usuarioValido) {
            alert("Login realizado com sucesso!");
            setTimeout(() => {
                window.location.href = "boas-vindas.html" // Redireciona para a página principal
            }, 50);
        } else {
            alert("Usuário ou senha incorretos");
        }
    })
    // Caso tenha erro 
    .catch(error => {
        alert("Erro ao validar login: " + error);
    });
}

// ---CADASTRO---
// "validador" de senha
function senha_8_carac(senha) {
    return senha.length >= 8;
}
function cadastro() {
    const nome = document.getElementById('nome-cad').value.trim();
    const sobrenome = document.getElementById('sobrenome').value.trim();
    const rg = document.getElementById('rg').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const telefone = document.getElementById('tel').value.trim();

    if (!nome || !sobrenome || !rg || !email || !senha || !telefone) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (!senha_8_carac(senha)) {
        alert("A senha deve conter no mínimo 8 caracteres.");
        return; // Impede o cadastro se a senha for inválida
    }

 // enviar os dados
        fetch('http://localhost:3000/cadastros', {

            //Método CRUD
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' //Tipo de conteudo enviado pro Json
            },
            body: JSON.stringify({
                //Dados que serão enviados e convertidos
                nome: nome,
                sobrenome: sobrenome,
                rg: rg,
                email: email,
                senha: senha,
                telefone: telefone
            }) 
        }).then(() =>{
            // redirecionar para outra página se o cadastro for concluído
            window.location.href='boas-vindas.html'
        })
        .catch(error => {
            // Alert caso haja um erro no fetch
            alert("Erro ao enviar dados: " + error)
            return
        })
} 

// ---BOAS-VINDAS---
function logoutUser() {
    // Redireciona para a página de login
if (confirm("Tem certeza de que deseja fazer o log out")) {
    window.location.href = 'index.html';
            } else {
                alert('Ok. Continue navegando');
            }  
        }

function admPerm() {
     // Redireciona para a página de permissão
     window.location.href = 'login-admin.html';
}

function loginAdm(){
     if(email = 'mahvieira@gmail.com' && 'marisaferreirasantos@gmail.com'){
        alert('Acesso Permitido. Aguarde...');
        window.location.href = 'admin.html';}

        else{
            alert('Acesso Negado.');
            window.location.href = 'admin.html';
        }
     }


//---ADMIN---
// Função para buscar RG
function buscaDeRGNome() {
    const rgInput = document.getElementById('searchInput').value.trim();
    const nomeInput = document.getElementById('searchInput').value.trim();

    if (!rgInput && !nomeInput) {
        alert('Por favor, digite um RG ou nome válidos!');
        return;
    }

    fetch('http://localhost:3000/cadastros')
        .then(resposta => resposta.json())
        .then(dados => {
            const registro = dados.find(item =>(rgInput && item.rg === rgInput) || 
                (nomeInput && item.nome.toLowerCase() === nomeInput.toLowerCase()));

            if (registro) {
                document.getElementById('resultSection').style.display = 'block';
                preencherCampos(registro);
            } else {
                alert('Registro não encontrado!');
                document.getElementById('resultSection').style.display = 'none';
            }
        })
        .catch(error => alert("Erro ao buscar registro :(  -> " + error));
}

// Preencher campos do formulário
function preencherCampos(dados) {
    document.getElementById('rg').value = dados.rg;
    document.getElementById('nome').value = dados.nome;
    document.getElementById('sobrenome').value = dados.sobrenome;
    document.getElementById('email').value = dados.email;
    document.getElementById('senha').value = dados.senha;
}
// Salvar alterações de usuário
function salvarAlteracoes() {
    const rg = document.getElementById('rg').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const sobrenome = document.getElementById('sobrenome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!rg || !nome || !sobrenome || !email || !senha) {
        alert("Por favor, preencha todos os campos antes de salvar.");
        return;
    }

    // Busca o ID correspondente ao RG para atualizar
    fetch('http://localhost:3000/cadastros')
        .then(response => response.json())
        .then(dados => {
            const usuarioEncontrado = dados.find(usuario => usuario.rg === rg);

            if (usuarioEncontrado) {
                const id = usuarioEncontrado.id;

                // Atualiza o usuário com os dados preenchidos
                fetch(`http://localhost:3000/cadastros/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nome: nome,
                        sobrenome: sobrenome,
                        rg: rg,
                        email: email,
                        senha: senha
                    })
                })
                .then(() => {
                    alert("Alterações salvas com sucesso!");
                    recarregarCadastros(); // Atualiza a lista de cadastros
                    document.getElementById('editForm').reset(); // Limpa o formulário
                })
                .catch(error => alert("Erro ao salvar alterações: " + error));
            } else {
                alert("Usuário não encontrado para alteração.");
            }
        })
        .catch(error => alert("Erro ao buscar cadastro para alteração: " + error));
}

function excluirUser() {
    const rg = document.getElementById('rg').value; // Obtém o RG do input

    if (!rg) {
        alert('Por favor, preencha o RG para excluir o usuário.');
        return;
    }

    if (confirm("Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
        fetch(`http://localhost:3000/cadastros`)
            .then(response => response.json())
            .then(dados => {
                const pessoaEncontrada = dados.find(pessoa => pessoa.rg === rg);

                if (pessoaEncontrada) {
                    const id = pessoaEncontrada.id;

                    fetch(`http://localhost:3000/cadastros/${id}`, {
                        method: 'DELETE',
                    })
                        .then(() => {
                            alert('Exclusão feita com sucesso!');
                            recarregarCadastros(); // Atualiza a lista
                            document.getElementById('editForm').reset(); // Limpa o formulário
                        })
                        .catch(error => alert("Erro ao excluir usuário: " + error));
                } else {
                    alert('Usuário não encontrado para exclusão.');
                }
            })
            .catch(error => alert("Erro ao buscar cadastros: " + error));
    }
}


// Recarregar cadastros na tabela
function recarregarCadastros() {
    const tbody = document.getElementById('cadastro-login');
    tbody.innerHTML = '';

    fetch('http://localhost:3000/cadastros')
        .then(resposta => resposta.json())
        .then(dados => {
            dados.forEach(item => {
                const row = `
                    <tr>
                        <td>${item.nome}</td>
                        <td>${item.sobrenome}</td>
                        <td>${item.rg}</td>
                        <td>${item.email}</td>
                        <td>${item.senha}</td>
                    </tr>`;
                tbody.innerHTML += row;
            });
        })
        .catch(error => alert("Erro ao carregar cadastros: " + error));
}

// Inicialização
document.addEventListener('DOMContentLoaded', recarregarCadastros);
