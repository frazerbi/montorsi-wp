interface CounterHandlerConfig {
  selector?: string;
  initialCount?: number;
}

export const counterHandler = (config: CounterHandlerConfig = {}): void => {
	const { selector = '.is-style-bigcounter_group', initialCount = 1 } = config;
	const groups = document.querySelectorAll(selector);
  groups.forEach((wrapper) => {
	if (wrapper instanceof HTMLElement) {
	  setNumberInElements(wrapper, initialCount);
	}
  });
}

function setNumberInElements(wrapper: HTMLElement, number: number) {
	if (!wrapper) return;
	if (wrapper.children.length < 2) return;
	let markerIterator = number;
	Array.from(wrapper.children).forEach((el) => {
		const marker = document.createElement('span');
		marker.classList.add('bigcounter_group-marker');
		marker.setAttribute('aria-hidden', 'true');
		marker.textContent = markerIterator.toString();
		if (markerIterator < 10) {
			marker.textContent = `.0${marker.textContent}`;
		} else {
			marker.textContent = `.${marker.textContent}`;
		}
		// se c'è un heading nell'el
		if(el.querySelector('.wp-block-heading')) {
			const heading = el.querySelector('.wp-block-heading') as HTMLElement;
			heading.prepend(marker);
			heading.classList.add('bigcounter_group-item');
		} else {
			el.prepend(marker);
			el.classList.add('bigcounter_group-item');
		}
		markerIterator++;
	});
}