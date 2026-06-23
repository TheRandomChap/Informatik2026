
const slider = document.getElementById('slider');
const sliderValue = document.getElementById('sliderValue');

if(slider){
slider.addEventListener('input',()=>{
sliderValue.textContent =
Number(slider.value).toLocaleString('da-DK') + ' kr';
});
}

function beregn(){
const pris = Number(slider.value);

const rk = pris*0.80;
const bl = pris*0.15;
const ud = pris*0.05;

document.getElementById('realkredit').innerText='Realkreditlån: '+rk.toLocaleString('da-DK')+' kr';
document.getElementById('banklaan').innerText='Banklån: '+bl.toLocaleString('da-DK')+' kr';
document.getElementById('udbetaling').innerText='Udbetaling: '+ud.toLocaleString('da-DK')+' kr';

document.getElementById('rk').style.height='80%';
document.getElementById('bl').style.height='15%';
document.getElementById('ud').style.height='5%';
}

if(slider){beregn();}

