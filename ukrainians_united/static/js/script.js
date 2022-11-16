document.querySelectorAll("a.donate").forEach(function(donate) {
	donate.addEventListener("click", slow_scroll);
});

document.querySelectorAll(".arrow").forEach(function(arrow) {
	arrow.addEventListener("click", show_slider);
});

document.querySelectorAll(".page span").forEach(function(circle) {
	circle.addEventListener("click", show_slider);
});

document.querySelectorAll(".payment-metod .custom-radio-button").forEach(function(radio_button) {
	radio_button.addEventListener("change", change_payment);
});

document.querySelectorAll(".amount .custom-radio-button").forEach(function(radio_button) {
	radio_button.addEventListener("change", change_amount);
});

document.querySelectorAll(".check-curr .custom-radio").forEach(function(radio) {
	radio.addEventListener("change", change_curr);
});

window.addEventListener("resize", change_text);

change_text();

function change_text() {
	let p_text = document.querySelector(".text-banner-p").innerHTML;
	if (window.outerWidth < 500){
		document.querySelector(".text-banner-p").innerHTML = p_text.replaceAll("<br>", "\n");
	} else {
		document.querySelector(".text-banner-p").innerHTML = p_text.replaceAll("\n", "<br>");
	}

}

function slow_scroll(e) {
	e.preventDefault();
	const blockID = this.getAttribute('href').substr(1);
	document.getElementById(blockID).scrollIntoView({
    	behavior: 'smooth',
    	block: 'start'
	});
}

function show_slider() {

	let all_slides = document.querySelectorAll(".image");
	let all_count_slides = all_slides.length;
	let slider = document.querySelector(".images ul");
	let list_circle = document.querySelectorAll(".page span");

	let active_slider = document.querySelector(".image.active");
	let active_slide_num = parseInt(active_slider.dataset.slide);
	let new_active_slide = 0;
	active_slider.classList.remove("active");

	if (this.dataset.slide == "next") {
		new_active_slide = active_slide_num+1;
	} else if (this.dataset.slide == "prev") {
		new_active_slide = active_slide_num-1;
	} else if (Number.isInteger(parseInt(this.dataset.slide))) {
		new_active_slide = parseInt(this.dataset.slide);
	}

	slider.style.transform = "translate(-"+100*(new_active_slide)+"%)";
	all_slides[new_active_slide].classList.add("active");

	list_circle[active_slide_num].classList.remove("active");
	list_circle[new_active_slide].classList.add("active");

	if (new_active_slide == 0) {
		document.querySelector(".arrow.ar-left").classList.add("hide");
	} else {
		document.querySelector(".arrow.ar-left").classList.remove("hide");
	}

	if (new_active_slide+1 == all_count_slides) {
		document.querySelector(".arrow.ar-right").classList.add("hide");
	} else {
		document.querySelector(".arrow.ar-right").classList.remove("hide");
	}
}

function change_payment() {
	let active_curr = document.querySelector(".payment-details.active");
	let payment_curr = document.querySelector("#payment-"+this.value);

	active_curr.classList.remove("active");
	payment_curr.classList.add("active");
}

function change_curr() {
	let radio_buttons = document.querySelectorAll(".amount .radio-button");
	let amount_get = document.querySelector("#amount-get");
	let div_amount = document.querySelector("#div-amount");

	if (this.value == "USD") {
		let list_price = [20, 50, 100, 200];

		radio_buttons.forEach(function(radio_button) {
			console.log(radio_button.children[0].checked);
			if (radio_button.children[0].value != "other") {
				let num = parseInt(radio_button.dataset.value);
				radio_button.children[0].value = list_price[num];
				radio_button.children[1].textContent = "$ " + list_price[num];
			}
		});

		div_amount.dataset.content = "$";

	} else if (this.value == "UAH") {
		let list_price = [500, 1000, 2000, 5000];

		radio_buttons.forEach(function(radio_button) {
			console.log(radio_button.children[0].checked);
			if (radio_button.children[0].value != "other") {
				let num = parseInt(radio_button.dataset.value);
				radio_button.children[0].value = list_price[num];
				radio_button.children[1].textContent = "₴ " + list_price[num];
			}
		});

		div_amount.dataset.content = "₴";

	} else if (this.value == "EUR") {
		let list_price = [20, 50, 100, 200];

		radio_buttons.forEach(function(radio_button) {
			console.log(radio_button.children[0].checked);
			if (radio_button.children[0].value != "other") {
				let num = parseInt(radio_button.dataset.value);
				radio_button.children[0].value = list_price[num];
				radio_button.children[1].textContent = "€ " + list_price[num];
			}
		});

		div_amount.dataset.content = "€";

	}

	radio_buttons[1].children[0].checked = true;
	amount_get.value = radio_buttons[1].children[0].value;
}

function change_amount() {
	let input_amount = document.querySelector("#amount-get");
	if (this.value == "other") {
		input_amount.value = "";
		input_amount.disabled = false;
		input_amount.focus();
	} else {
		input_amount.value = this.value;
		input_amount.disabled = true;
	}
}