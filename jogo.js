
class Sprite {
    
    constructor(x, y, larg, alt, vermelho, verde, azul, img) {
        this.x = x;
        this.y = y;
        this.larg = larg;
        this.alt = alt;
        this.vermelho = vermelho;
        this.verde = verde;
        this.azul = azul;
        this.img = img;
    }

    desenha(ctx) {
        if (this.img) {
            ctx.drawImage(this.img, this.x, this.y, this.larg, this.alt);
        } else {
            ctx.fillStyle = 'rgb(' + this.vermelho + ',' + this.verde + ',' + this.azul + ')';
            ctx.fillRect(this.x, this.y, this.larg, this.alt);
        }
    }

    get centro() {
        return {
            x: this.x + this.larg/ 2,
            y: this.y + this.alt/ 2
        };
    }

    colidiu(outraSprite) {
        let w = Math.abs(outraSprite.centro.x - this.centro.x);
        let z = Math.abs(outraSprite.centro.y - this.centro.y);
        let j = Math.sqrt(w ** 2 + z ** 2);
        let raio1 = this.alt / 2;
        let raio2 = outraSprite.alt / 2;

        return j <= raio1 + raio2;
    }
}

class BolaFogo extends Sprite {
    constructor() {
        super(900,  Math.random() * 30 + 180 , 40, 40, 0, 0, 0, imgFogo);
        this.veloX = -5 * Math.random() - 2; 
    }

    atualizar() {
        this.x += this.veloX;

        if (this.x + this.larg < 0) 
            this.x = 900;
        
    }

    destruir() {
        this.x = 900;
    }

}

class Flecha extends Sprite {
    constructor(arqueira) {
        let inicioY = arqueira.centro.y - 10;
        super(arqueira.centro.x, inicioY, 90, 27, 0, 0, 0, imgFlecha);
        this.veloX = 5; 
    }

    atualizar() {
        this.x += this.veloX;

        if (this.x > 1100) 
            this.podeSerDestruido = true;
        
    }
}

let canvasEl = document.querySelector('#jogo');
let ctx = canvasEl.getContext('2d');
ctx.imageSmoothingEnabled = false;

let vidasArq = 5;
let vidasDrag = 5;

let imgArqueira = new Image();
imgArqueira.src = 'imgs/arqueira.png';
let arqueira = new Sprite(50, 50, 128, 150, 0, 0, 0, imgArqueira);

let imgDragao = new Image();
imgDragao.src = 'imgs/dragao.png';
let dragao = new Sprite(855, 120, 250, 250, 0, 0, 0, imgDragao);

let imgFogo = new Image();
imgFogo.src = 'imgs/bola.fogo.png';
let fogos = [];
fogos.push(new BolaFogo());
fogos.push(new BolaFogo());
fogos.push(new BolaFogo());

let imgFlecha = new Image();
imgFlecha.src = 'imgs/flecha.png';
let flechas = [];

let cenarios = [];
cenarios.push(new Sprite(0, 470, 1100, 30, 80, 43, 24));
cenarios.push(new Sprite(0, 440, 1100, 30, 121, 71, 44));
cenarios.push(new Sprite(0, 410, 1100, 30, 153, 101, 64));
cenarios.push(new Sprite(0, 360, 1100, 50, 97, 181, 44));

let iconArq = new Image();
iconArq.src = 'imgs/iconArq.png';
let quadArq = new Sprite(5, 5, 50, 50, 0, 0, 0, iconArq);

let coracaoArq = new Image();
coracaoArq.src = 'imgs/coracaoArq.png';
let coracaoArqs = [];
coracaoArqs.push(new Sprite(60, 30, 24, 20, 0, 0, 0, coracaoArq));
coracaoArqs.push(new Sprite(86, 30, 24, 20, 0, 0, 0, coracaoArq));
coracaoArqs.push(new Sprite(112, 30, 24, 20, 0, 0, 0, coracaoArq));
coracaoArqs.push(new Sprite(138, 30, 24, 20, 0, 0, 0, coracaoArq));
coracaoArqs.push(new Sprite(164, 30, 24, 20, 0, 0, 0, coracaoArq));

let iconDrag = new Image();
iconDrag.src = 'imgs/iconDrag.png';
let quadDrag = new Sprite(1045, 5, 50, 50, 0, 0, 0, iconDrag);

let coracaoDrag = new Image();
coracaoDrag.src = 'imgs/coracaoDrag.png';
let coracaoDrags = [];
coracaoDrags.push(new Sprite(1010, 30, 24, 20, 0, 0, 0, coracaoDrag));
coracaoDrags.push(new Sprite(984, 30, 24, 20, 0, 0, 0, coracaoDrag));
coracaoDrags.push(new Sprite(958, 30, 24, 20, 0, 0, 0, coracaoDrag));
coracaoDrags.push(new Sprite(932, 30, 24, 20, 0, 0, 0, coracaoDrag));
coracaoDrags.push(new Sprite(906, 30, 24, 20, 0, 0, 0, coracaoDrag));


imgArqueira.addEventListener('load', (evento) => {           
    desenhaJogo();
});

canvasEl.addEventListener('mousemove', (evento) => {
    arqueira.x = evento.offsetX - arqueira.larg/3;
    arqueira.y = evento.offsetY - arqueira.alt/2;
    desenhaJogo();
});

function desenhaJogo() {
    ctx.clearRect(0, 0, 1100, 500);
    arqueira.desenha(ctx);
    dragao.desenha(ctx);
    quadArq.desenha(ctx);
    quadDrag.desenha(ctx);

    for (let cenario of cenarios) 
        cenario.desenha(ctx);
    

    for (let coracaoArq of coracaoArqs) 
        coracaoArq.desenha(ctx);
    

    for (let coracaoDrag of coracaoDrags) 
        coracaoDrag.desenha(ctx);
    

    for (let fogo of fogos) 
        fogo.desenha(ctx);
    

    for (let flecha of flechas) 
        flecha.desenha(ctx);
    
}

function atualizaInimigos() {
    for (let fogo of fogos) 
        fogo.atualizar();
    
}

function atualizaFlechas() {
    for (let flecha of flechas) 
        flecha.atualizar();
    

    for (let i = 0; i < flechas.length; i++) {
        if (flechas[i].podeSerDestruido) 
            flechas.splice(i, 1); 
    }
}


function verificaColisoes() {
    for(let fogo of fogos){
        const atingiuArq = fogo.colidiu(arqueira);
        if(atingiuArq) {
            fogo.destruir();
            coracaoArqs.splice((vidasArq - 1), 1);
            vidasArq--;
            if (vidasArq < 1) {
                alert('Jogador morreu!');
                document.location.reload(true);
            }
        }
    }

    for(let flecha of flechas){
        const atingiuDrag = flecha.colidiu(dragao);
        if(atingiuDrag) {
            flecha.podeSerDestruido = true;
            coracaoDrags.splice((vidasDrag - 1), 1);
            vidasDrag--;
            if (vidasDrag < 1) {
                alert('Jogador venceu!');
                document.location.reload(true);
            }
        }
    }

    for(let fogo of fogos) {
        for(let flecha of flechas) {
            const flechaAtingiu = flecha.colidiu(fogo);
            if(flechaAtingiu) {
                flecha.podeSerDestruido = true;
                fogo.destruir();
            }
        }
    }

    for(let fogo of fogos) {
        for(let cenario of cenarios) {
            const atingiuCen = fogo.colidiu(cenario);
            if(atingiuCen) 
                fogo.destruir();  
        }
    }
}

function atualizaLogicaJogo() {
    atualizaInimigos();
    atualizaFlechas();
    verificaColisoes();
    desenhaJogo();
}

setInterval(atualizaLogicaJogo, 33);

function atirar() {
    let flecha = new Flecha(arqueira);
    flechas.push(flecha);
}

document.body.addEventListener('keydown', e => {
    if (e.key === ' ') {
        atirar();
        e.preventDefault();
    }
});