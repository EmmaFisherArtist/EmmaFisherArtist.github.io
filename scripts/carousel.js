document.querySelectorAll("[component^=\"carousel\"]").forEach(el => {
	if (
		el.children.length != 3 ||
		el.children[0].tagName != "BUTTON" ||
		el.children[1].tagName != "UL" ||
		el.children[2].tagName != "BUTTON"
	){
		console.error("Error [carousel] must have exactly three children of type <button> <ul> <button>");
		return;
	}

	const prevBut = el.children[0];
	const scroll = el.children[1];
	const nextBut = el.children[2];

	const checkScrollEnd = () => {
		prevBut.disabled = scroll.scrollLeft === 0;
		nextBut.disabled = scroll.scrollLeft === (scroll.scrollWidth - scroll.offsetWidth);
	}
	
	checkScrollEnd();
	scroll.addEventListener("scroll",checkScrollEnd);

	prevBut.addEventListener("click",()=>{scroll.scrollBy({left:-el.scrollWidth});});
	nextBut.addEventListener("click",()=>{scroll.scrollBy({left:el.scrollWidth});});
});