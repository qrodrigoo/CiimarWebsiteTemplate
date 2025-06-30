// script.js (da sua página principal)

document.addEventListener('DOMContentLoaded', () => {
    const btnSeabass = document.getElementById('btn1');
    const btnSalmon = document.getElementById('btn2');
    const btnSole = document.getElementById('btn3');

    if (btn1) {
        btn1.addEventListener('click', () => {
            window.location.href = './ModelTest/test-index.html'; // Redireciona para a nova página
        });
    }

    if (btn2) {
        btn2.addEventListener('click', () => {
            window.location.href = './ModelTest/test-index.html'; // Redireciona para a nova página
        });
    }

    if (btn3) {
        btn3.addEventListener('click', () => {
            window.location.href = './ModelTest/test-index.html'; // Redireciona para a nova página
        });
    }

    if (btnsample) {
        btnsample.addEventListener('click', () => {
            window.location.href = './PedidosAmostra/pedido.html'; // Redireciona para a nova página
        });
    }
});