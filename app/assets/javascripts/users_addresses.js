document.addEventListener("DOMContentLoaded", () => {
	/* Create a new address */
	$(document)
		.on("submit", "#create_address_form", submitCreateAddressForm)

		/* Set the address route for deletion and open the modal */
		.on("click", ".delete_address", triggerSumbitDeleteAddress)

		/* Delete the address and the delete request */
		.on("click", "#confirm_delete_address_button", sumbitDeleteAddressForm)

		/* Copy the value from the selected card to the modal for updating */
		.on("click", ".address_card_footer .update_address", triggerUpdateAddressModal)

		/* Submit the update address */
		.on("submit", "#update_address_form", submitUpdateAddressForm)
});

function submitCreateAddressForm(e) {
	e.preventDefault();

	let create_address_form = $(this);

	$.post(create_address_form.attr("action"), create_address_form.serialize(), function (create_address_form_response) {
		if (create_address_form_response.status) {
			$("#addresses_list").append(create_address_form_response.address_card);
			$("#add_address_modal").modal("hide");
		}
	});

	create_address_form.trigger("reset");
}

function triggerSumbitDeleteAddress(e) {
	e.preventDefault();

	$("#delete_address_modal").modal("show");

	let address_id = $(this).closest(".address_card").data("address_id");
	$("#delete_address_form").attr("action", `/api/addresses/${address_id}`);
}

function sumbitDeleteAddressForm() {
	let delete_address_form = $("#delete_address_form");

	$.ajax({
		url: delete_address_form.attr("action"),
		type: "DELETE",
		data: delete_address_form.serialize(),
		success: function (delete_address_response) {
			if (delete_address_response.status) {
				$(`.address_${delete_address_response.address_id}`).remove();
			}

			$("#delete_address_modal").modal("hide");
		}
	})
}

function triggerUpdateAddressModal() {
	let address_id  = $(this).closest(".address_card").data("address_id");
	let address_url = `/api/addresses/${address_id}`;

	/* Fetch the address details and get the address details */
	$.get(address_url, function (fetch_address_response) {
		if (fetch_address_response.status) {
			/* Destructure the address details */
			let { id, user_id, full_name, phone_number, province, city, detailed_address, is_billing, is_default } = fetch_address_response;

			/* Add the address details to the modal */
			let update_address_form = $("#update_address_form");

			update_address_form.find("#update_full_name").val(full_name);
			update_address_form.find("#update_phone_number").val(phone_number);
			update_address_form.find("#update_province").val(province);
			update_address_form.find("#update_city").val(city);
			update_address_form.find("#update_detailed_address").val(detailed_address);
			update_address_form.find("#update_detailed_address").val(detailed_address);
			update_address_form.find("#update_is_billing").prop("checked", is_billing);
			update_address_form.find("#update_is_default").prop("checked", is_default);
			update_address_form.attr("action", address_url);

			/* Show the address modal */
			$("#update_address_modal").modal("show");
		}
	});
}

function submitUpdateAddressForm(e){
	e.preventDefault();

	let update_address_form = $(this);

	$.post(update_address_form.attr("action"), update_address_form.serialize(), function(update_address_form_response){
		if (update_address_form_response.status){
			$("#update_address_modal").modal("hide");
			$("#app_toast").toast("show");
		}
	});
}