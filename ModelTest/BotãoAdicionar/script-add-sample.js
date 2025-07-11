import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://vodddukcygftjtbwkuki.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvZGRkdWtjeWdmdGp0YndrdWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzQ4NzMsImV4cCI6MjA2NjYxMDg3M30.Jbn6OH4mq4YIj6Z3Le3JqTk4QwxFdVkIvyo4D-n48uc'; // sua chave
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('addSampleForm');
const dynamicSectionsContainer = document.getElementById('extraSectionsContainer');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    // Dados principais
    const abbr = formData.get('abbr');
    const box = formData.get('box');
    const boxLocation = formData.get('box.location');

    // Campos da tabela Seabass (exceto box)
    const baseData = {
        abbr,
        primer: formData.get('primer'),
        forward: formData.get('forward'),
        reverse: formData.get('reverse'),
        temperature_annealing: formData.get('temperature_annealing'),
        acession_number: formData.get('acession_number'),
        product_size: formData.get('product_size'),
        primers_test: formData.get('primers_test'),
    };

    // Preencher dados das seções (estáticos e dinâmicos)
    formData.forEach((value, key) => {
        if (
            key.includes('.') &&
            !['box.location'].includes(key) // evita incluir box.location na tabela errada
        ) {
            baseData[key] = value;
        }
    });

    const sampleToEdit = localStorage.getItem('sampleToEdit');
    let errorSeabass, errorBox;

    if (sampleToEdit) {
        // MODO EDIÇÃO
        const original = JSON.parse(sampleToEdit);

        ({ error: errorSeabass } = await supabase
            .from('TableTest')
            .update(baseData)
            .eq('abbr', original.abbr));

        ({ error: errorBox } = await supabase
            .from('TableTest_BOX')
            .update({ abbr, box, 'box.location': boxLocation })
            .eq('abbr', original.abbr));

        localStorage.removeItem('sampleToEdit');
    } else {
        // MODO ADIÇÃO
        ({ error: errorSeabass } = await supabase.from('TableTest').insert([baseData]));

        ({ error: errorBox } = await supabase.from('TableTest_BOX').insert([
            { abbr, box, 'box.location': boxLocation }
        ]));
    }

    // Verificação final
    if (errorSeabass || errorBox) {
        alert('Erro ao salvar:\n' +
            (errorSeabass?.message || '') + '\n' +
            (errorBox?.message || ''));
        console.error('Erro TableTest:', errorSeabass);
        console.error('Erro TableTest_BOX:', errorBox);
    } else {
        alert(sampleToEdit ? 'Amostra editada com sucesso!' : 'Amostra adicionada com sucesso!');
        form.reset();
        dynamicSectionsContainer.innerHTML = '';
        window.location.href = '../test-index.html';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const existingSample = localStorage.getItem('sampleToEdit');

    if (existingSample) {
        const sampleData = JSON.parse(existingSample);

        for (const key in sampleData) {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) input.value = sampleData[key];
        }

        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) saveBtn.textContent = 'Salvar Edição';
    }
});

function handleAddSample() {
    localStorage.removeItem('sampleToEdit');
    window.location.href = './Botão Adicionar/add-sample.html';
}
