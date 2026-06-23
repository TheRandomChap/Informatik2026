
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

// Floating Action Button (FAB) toggle
document.addEventListener('DOMContentLoaded', ()=>{
	const fabToggle = document.getElementById('fabToggle');
	const fabContainer = document.getElementById('fabContainer');
	const fabMenu = document.getElementById('fabMenu');
	if(!fabToggle || !fabContainer || !fabMenu) return;

	fabToggle.addEventListener('click', (e)=>{
		e.stopPropagation();
		const open = fabContainer.classList.toggle('open');
		fabMenu.setAttribute('aria-hidden', (!open).toString());
	});

	document.addEventListener('click', (e)=>{
		if(!fabContainer.contains(e.target)){
			fabContainer.classList.remove('open');
			fabMenu.setAttribute('aria-hidden','true');
		}
	});

	document.addEventListener('keydown', (e)=>{
		if(e.key === 'Escape'){
			fabContainer.classList.remove('open');
			fabMenu.setAttribute('aria-hidden','true');
		}
	});
});
