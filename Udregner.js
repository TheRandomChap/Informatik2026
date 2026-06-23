function kr(v){
return Number(v).toLocaleString('da-DK') + ' kr';
}

function beregnHuspris(){
const husPris = Number(document.getElementById('husPris').value);

const realkredit = husPris * 0.80;
const banklaan = husPris * 0.15;
const udbetaling = husPris * 0.05;

document.getElementById('resultat1').innerHTML =
`<p>Realkreditlån: ${kr(realkredit)}</p>
<p>Banklån: ${kr(banklaan)}</p>
<p>Udbetaling: ${kr(udbetaling)}</p>`;
}

function beregnLaan(){
const husPris = Number(document.getElementById('husPris2').value);
const udbetaling = Number(document.getElementById('udbetaling2').value);

const samletLaan = husPris - udbetaling;

document.getElementById('resultat2').innerHTML =
`<p>Samlet lån: ${kr(samletLaan)}</p>`;
}

function beregnRaad(){
const udbetaling = Number(document.getElementById('udbetaling3').value);

const husPris = udbetaling / 0.05;

document.getElementById('resultat3').innerHTML =
`<p>Maksimal huspris: ${kr(husPris)}</p>`;
}
