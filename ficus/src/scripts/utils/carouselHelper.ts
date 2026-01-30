// Definisci il tipo per i parametri
interface CarouselOptions {
    $el: HTMLElement;
    hasArrows?: boolean;
    hasBullets?: boolean;
}

const carouselHelper = {

	/*
	 * Per far funzionare swiper c'è bisogno di slides, di un inner wrapper e di un wrapper
	 */
	setMarkup: ({$el, hasArrows = true, hasBullets = true}: CarouselOptions) => {
		if (!$el) {
			throw 'setSwiperMarkup requires an element';
		}
		$el.classList.add('swiper');
		//add new div
		let $inner = document.createElement('div');
		$inner.classList.add('swiper-wrapper');
		//move every child of $eli into inner
		while ($el.firstChild) {
			$inner.appendChild($el.firstChild);
		}
		$el.appendChild($inner);
		Array.from($inner.children).forEach(($child) => {
            ($child as HTMLElement).classList.add('swiper-slide');
        });
		if (hasArrows) {
			let $prev = document.createElement('div');
			$prev.setAttribute('role', 'button');
			$prev.setAttribute('tabindex', '0');
			$prev.setAttribute('aria-label', 'previous slide');
			$prev.classList.add('swiper-button-prev');
			let $next = document.createElement('div');
			$next.setAttribute('role', 'button');
			$next.setAttribute('tabindex', '0');
			$next.setAttribute('aria-label', 'Next slide');
			$next.classList.add('swiper-button-next');
			$el.appendChild($prev);
			$el.appendChild($next);
		}
		if (hasBullets) {
			let $bullets = document.createElement('ul');
			$bullets.setAttribute('role', 'tablist');
            $bullets.setAttribute('aria-label', 'Slides pagination');
			$bullets.classList.add('swiper-pagination');
			$el.appendChild($bullets);
		}
	},
};

export default carouselHelper;