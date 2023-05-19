export const generateSearchInput = () => {
    // rosettaMessages is a global var while in checkout stage and translations are taken from Ecwid Control Panel
    // eslint-disable-next-line no-undef
    const translation = rosettaMessages['new-frontend']['ProductSearch.Breadcrumbs.General'];

    return `
<div class="zyro-ecwid__search ec-form__row">
	<div class="ec-form__cell ec-form__cell--4">
		<label for="zyro-ecwid-search">
			<div class="ec-form__title ec-header-h6">
				<div class="marker-required marker-required--medium"></div>${translation}
			</div>
		</label>
		<div class="form-control form-control--flexible form-control--empty form-control--type-name">
			<input id="zyro-ecwid-search" class="form-control__text" type="text" name="name" maxlength="255">
			<div class="form-control__placeholder">
				<div class="form-control__placeholder-inner"></div>
			</div>
		</div>
	</div>
</div>
`;
};