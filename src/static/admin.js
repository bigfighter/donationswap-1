/* globals ajax, getElementsById */
/* jshint esversion: 6 */
(function () {
	'use strict';

	const ui = getElementsById();

	function handleError(response) {
		console.error(response);
		alert(`Error: ${response}`);
	}

	function updateUi(loggedIn) {
		ui.loginStuff.classList.toggle('hidden', loggedIn);
		ui.logoutStuff.classList.toggle('hidden', !loggedIn);
		ui.changePasswordStuff.classList.toggle('hidden', !loggedIn);
		ui.currencyStuff.classList.toggle('hidden', !loggedIn);
	}

	ui.btnLogin.onclick = () => {
		ajax('/ajax/login', {
			email: ui.txtEmail.value,
			password: ui.txtPassword.value,
		})
			.then(() => {
				ui.txtEmail.value = '';
				ui.txtPassword.value = '';
				window.location.reload();
			})
			.catch(() => {
				alert('Error. Wrong name? Wrong password?');
			});
	};

	ui.btnLogout.onclick = () => {
		ajax('/special-secret-admin/logout')
			.then(() => {
				updateUi(false);
			})
			.catch(handleError);
	};

	ui.btnChangePassword.onclick = () => {
		ajax('/special-secret-admin/change_password', {
			old_password: ui.txtOldPassword.value,
			new_password: ui.txtNewPassword.value,
		})
			.then(() => {
				ui.txtOldPassword.value = '';
				ui.txtNewPassword.value = '';
				alert('Your password has been changed.');
			})
			.catch(handleError);
	};

	ajax('/special-secret-admin/get_admin_info')
		.then(info => {
			updateUi(true);
			ui.adminname.textContent = info.email;

			ajax('/special-secret-admin/get_currencies')
				.then(currencies => {
					currencies.forEach(currency => {
						ui.selCurrency.appendChild(createNode({
							xtype: 'option',
							a_value: currency.id,
							p_textContent: currency.name,
						}));
					});
					ui.selCurrency.value = info.currency_id;

					ui.selCurrency.onchange = () => {
						ajax('/special-secret-admin/set_admin_currency', {
							currency_id: ui.selCurrency.value
						});
					};
				});
		})
		.catch(msg => {
			updateUi(false);
			ui.adminname.textContent = '<not logged in>';
		})
		.then(() => {
		});
}());
