const ImageViewer = document.getElementById("ImageViewer");
const ImageViewerImg = document.getElementById("ImageViewerImg");
document.querySelectorAll("[component^=\"image-display-box\"]").forEach(el => {
	const image = [...el.children].find(e=>e.tagName == "IMG");
	
	if (!image){
		console.error("Error [image-display-box] must have a child of type <image>");
		return;
	}

	el.addEventListener("click",()=>{
		ImageViewer.showModal();
		ImageViewerImg.src = image.src;
		ImageViewerImg.alt = image.alt;
	});
});

function ZoomAtPoint(multiplier, x, y){
	let translatex = Number(ImageViewer.style.getPropertyValue("--translatex"))||0;
	let translatey = Number(ImageViewer.style.getPropertyValue("--translatey"))||0;
	let scale = Number(ImageViewer.style.getPropertyValue("--scale"))||1;
	ImageViewer.style.setProperty("--scale", scale*Number(multiplier));

	// console.log(world2real(x), x - (real2world(world2real(x))));

	ImageViewer.style.setProperty(
		"--translatex",
		translatex + x - x * (scale*Number(multiplier)) / scale
	);
	ImageViewer.style.setProperty(
		"--translatey",
		translatey + y - y * (scale*Number(multiplier)) / scale
	);
}

ImageViewer.querySelectorAll("[zoom]").forEach(el=>el.addEventListener("click", ()=>{
	let rect = ImageViewerImg.parentNode.getBoundingClientRect();
	ZoomAtPoint(
		el.getAttribute("zoom"),
		rect.width / 2,
		rect.height / 2
	);
}));
//there shouldnt realy be more than one but just in case used a for each
ImageViewer.querySelectorAll("[close]").forEach(
	el=>el.addEventListener("click",_=>ImageViewer.close())
);
ImageViewer.addEventListener("close", _=>{
	ImageViewer.style.setProperty("--scale", 1);
	ImageViewer.style.setProperty("--translatex", 0);
	ImageViewer.style.setProperty("--translatey", 0);
});
ImageViewerImg.parentNode.addEventListener("wheel", e=>{
	e.preventDefault();
	let rect = ImageViewerImg.parentNode.getBoundingClientRect();
	ZoomAtPoint(1 - e.deltaY * 0.001, e.clientX - rect.x, e.clientY - rect.y);
});
let xpos = null;
let ypos = null;
let moved = false;
ImageViewerImg.parentNode.addEventListener("contextmenu", e=>e.preventDefault());
ImageViewerImg.parentNode.addEventListener("mouseup", e=>{
	if (!moved){
		let rect = ImageViewerImg.parentNode.getBoundingClientRect();
		ZoomAtPoint((()=>{if (e.button == 0){
			return 1.1;
		}else if (e.button == 2){
			return 0.9;
		}else{
			return 1;
		}})(), e.clientX - rect.x, e.clientY - rect.y);
	}
});
ImageViewerImg.parentNode.addEventListener("mousedown", e=>{
	let rect = ImageViewerImg.parentNode.getBoundingClientRect();
	xpos = e.clientX - rect.x;
	ypos = e.clientY - rect.y;
	e.preventDefault();
});
ImageViewerImg.parentNode.addEventListener("mousemove", e=>{
	if (xpos !== null){
		moved = true;
		let rect = ImageViewerImg.parentNode.getBoundingClientRect();
		ImageViewer.style.setProperty(
			"--translatex",
			(Number(ImageViewer.style.getPropertyValue("--translatex"))||0) +
			e.clientX - rect.x - xpos
		);
		ImageViewer.style.setProperty(
			"--translatey",
			(Number(ImageViewer.style.getPropertyValue("--translatey"))||0) +
			e.clientY - rect.y - ypos
		);
		xpos = e.clientX - rect.x;
		ypos = e.clientY - rect.y;
	}
});
document.addEventListener("mouseup", ()=>{
	xpos = null;
	moved = false;
});
ImageViewer.addEventListener("click", e=>{
	let rect = ImageViewer.getBoundingClientRect();
	if (
		e.clientX < rect.left ||
		e.clientX > rect.right ||
		e.clientY < rect.top ||
		e.clientY > rect.bottom
	){ImageViewer.close();}
});
