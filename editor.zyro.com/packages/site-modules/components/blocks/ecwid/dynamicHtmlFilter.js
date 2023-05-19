/* eslint-disable max-len */

export const generateFilterHTML = ({
    headerText,
    name,
    logoSource,
}) => {
    const isOther = name === 'other';
    // rosettaMessages is a global var while in checkout stage and translations are taken from Ecwid Control Panel
    // eslint-disable-next-line no-undef
    const otherTranslation = rosettaMessages['new-frontend']['Checkout.LocalDelivery.title'];
    const initialHtml = `
	<div class="ec-form__cell ec-form__cell--4">
		<label>
			<div class="ec-form__title ec-header-h6">${isOther ? otherTranslation : headerText}</div>
		</label>
		<div class="form-control form-control--flexible form-control--empty">
			<label for="${name}">
				<div class="ec-radiogroup__radio">
					<div class="form-control--radio form-control ">
						<div class="form-control__radio-wrap">
							<input class="form-control__radio" type="radio" name="delivery-filter" value="${name}" data-filter="${name}">
							<div class="form-control__radio-view">
								<div class="form-control__radio-view-inner"></div>
							</div>
						</div>
						<div class="form-control__inline-label">
							<img class="filter-logo" src="${logoSource}" alt="${name}" title="${name}" />
							${isOther ? otherTranslation : ''}
						</div>
					</div>
				</div>
			</label>
		</div>
	</div>
	`;

    return initialHtml;
};