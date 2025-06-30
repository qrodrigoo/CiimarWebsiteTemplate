// script-add-sample.js (corrigido)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://vodddukcygftjtbwkuki.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvZGRkdWtjeWdmdGp0YndrdWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzQ4NzMsImV4cCI6MjA2NjYxMDg3M30.Jbn6OH4mq4YIj6Z3Le3JqTk4QwxFdVkIvyo4D-n48uc'; // sua chave
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('addSampleForm');
const dynamicSectionsContainer = document.getElementById('extraSectionsContainer');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const abbr = formData.get('abbr');
  const box = formData.get('box');
  const boxLocation = formData.get('box.location');

  const baseData = {};
  formData.forEach((value, key) => {
    baseData[key] = value;
  });

  // Remove campos que pertencem a Seabass_BOX
  delete baseData.box;
  delete baseData['box.location'];

  const sampleToEdit = localStorage.getItem('sampleToEdit');
  let errorSeabass, errorBox;

  if (sampleToEdit) {
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
    ({ error: errorSeabass } = await supabase.from('TableTest').insert([baseData]));

    ({ error: errorBox } = await supabase.from('TableTest_BOX').insert([
      { abbr, box, 'box.location': boxLocation }
    ]));
  }

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

// Preenche campos ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
  const existingSample = localStorage.getItem('sampleToEdit');

  if (!existingSample) return;

  const sampleData = JSON.parse(existingSample);

  // Preenche campos normais
  for (const key in sampleData) {
    const input = document.querySelector(`[name="${key}"]`);
    if (input) input.value = sampleData[key];
  }

  // Busca dados da tabela Seabass_BOX
  const { data: boxData, error: boxError } = await supabase
    .from('TableTest_BOX')
    .select('box, "box.location"')
    .eq('abbr', sampleData.abbr)
    .single();

  if (!boxError && boxData) {
    const boxInput = document.querySelector('[name="box"]');
    const locationInput = document.querySelector('[name="box.location"]');
    if (boxInput) boxInput.value = boxData.box;
    if (locationInput) locationInput.value = boxData['box.location'];
  }

  // Atualiza o texto do botão
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) saveBtn.textContent = 'Save Changes';
});
