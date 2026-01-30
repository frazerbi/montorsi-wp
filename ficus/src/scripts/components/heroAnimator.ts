import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
class HeroAnimator {

	hero: HTMLDivElement | null = null;
	arrowTrigger: HTMLDivElement | null = null;
	arrowUntrigger: HTMLDivElement | null = null;

	constructor() {
		gsap.registerPlugin(ScrollTrigger);
		this.hero = document.querySelector('.top_hero') as HTMLDivElement;
		this.arrowTrigger = document.querySelector('.arrow_trigger') as HTMLDivElement;
		this.arrowUntrigger = document.querySelector('.arrow_untrigger') as HTMLDivElement;
	}

	init() {
		if (window.matchMedia("(min-width: 1024px)").matches) {
			this.textEnterAnimation();
		} else {
			this.textEnterAnimationMobile();
		}

	}

	textEnterAnimationMobile() {
		if (!this.hero) {
			return;
		}
		const title = this.hero.querySelector('h1') as HTMLDivElement;
		const copy = this.hero.querySelector('.hero-copy') as HTMLDivElement;
		const tl = gsap.timeline();

		tl.fromTo(title, { opacity: 0, y: 100 }, { opacity: 1, y: 0 , duration: 1 }, "+=0.5")
		.fromTo(copy, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "-=0.5");
	}

	textEnterAnimation() {
		if (!this.hero) {
			return;
		}
		const title = this.hero.querySelector('h1') as HTMLDivElement;
		const copy = this.hero.querySelector('.hero-copy') as HTMLDivElement;
		const line = document.querySelector('#home_line path') as SVGPathElement;
		const tl = gsap.timeline();
		
		tl.set(line, { autoAlpha: 0 })
		.fromTo(title, { opacity: 0, y: 50 }, { opacity: 1, y: 0 , duration: 1.5 }, "+=0.8")
		.call(() => {
			this.lineFirstAnimation();
		}, [], "-=1") // Esegue 0.2s dopo l'ultimo tween
		.fromTo(copy, { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 1 }, "+=0.6")
	}

	lineFirstAnimation() {
		if (!this.hero) {
			return;
		}
		const line = document.querySelector('#home_line path') as SVGPathElement;
		const pathLength = line.getTotalLength();
		const screenRatio = window.innerWidth / window.innerHeight;

		const fromOffset = 0;
		const toOffset = pathLength;

		// Setup iniziale (linea invisibile, alpha a 0.2)
		gsap.set(line, {
			autoAlpha: 1,
			strokeDasharray: pathLength,
			strokeDashoffset: toOffset  // Linea nascosta
		});

		// Prima animazione: disegna la linea (con durata fissa)
		gsap.to(line, {
			strokeDashoffset: fromOffset,
			duration: 2.5 * screenRatio,
			ease: "power2.inOut",
			onComplete: () => {
				// Quando finisce, attiva l'animazione di scroll
				this.setupScrollAnimation();
				this.setupArrowOnScrollAnimation();
			}
		});
	}

	setupScrollAnimation() {
		if (!this.hero) {
			return;
		}
		const line = document.querySelector('#home_line path') as SVGPathElement;
		const pathLength = line.getTotalLength();
		
		// Animazione di scroll: da visibile a invisibile
		gsap.to(line, {
			strokeDashoffset: pathLength, // Nascondi la linea
			ease: "none",
			scrollTrigger: {
				trigger: this.hero,
				start: "top top",
				end: "75% top", 
				scrub: true,
				// markers: true
			},
		});
	}


	setupArrowOnScrollAnimation() {
		if (!this.arrowTrigger || !this.arrowUntrigger) {
			return;
		}
		ScrollTrigger.create({
			trigger: this.arrowTrigger,
			start: "top 25%",
			onEnter: () => {
				document.body.classList.add('side-arrow-in');
				document.body.classList.remove('side-arrow-gone');
				
			},
			onLeaveBack: () => {
				document.body.classList.remove('side-arrow-in');
				document.body.classList.remove('side-arrow-gone');
			}
		});

		ScrollTrigger.create({
			trigger: this.arrowUntrigger,
			start: "top 70%",
			onEnter: () => {
				document.body.classList.add('side-arrow-gone');
			},
			onLeaveBack: () => {
				document.body.classList.remove('side-arrow-gone');
			}
		})
	}
}

export default HeroAnimator;