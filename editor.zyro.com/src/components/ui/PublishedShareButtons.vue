<template>
	<div class="website-share">
		<p class="z-body-small z-body-small--strong z-body-small--spaced">
			{{ $t('builder.shareWebsite') }}
		</p>
		<p class="z-body-small website-share__subtitle">
			{{ $t('builder.shareWebsiteSubtitle') }}
		</p>
		<div class="website-share__icons-list">
			<div
				v-for="link in shareLinks"
				:key="link.name"
			>
				<a
					:href="link.url"
					:title="link.name"
					target="_blank"
					class="website-share__icon-wrap"
					@click="trackShareClick(link.name)"
				>
					<ZyroSvgDeprecated
						:name="link.icon"
						class="website-share__icon"
					/>
				</a>
			</div>
			<div class="website-share__copy-link-wrap">
				<div
					class="website-share__icon-wrap"
					@click="copyLink"
				>
					<ZyroSvgDeprecated
						name="link"
						class="website-share__icon"
					/>
				</div>
				<p
					v-if="isLinkCopied"
					class="z-body-small website-share__link-copied"
				>
					{{ $t('builder.shareLinkCopied') }}
				</p>
			</div>
		</div>
	</div>
</template>
<script>
import {
	ref,
	computed,
	defineComponent,
} from 'vue';

import { useStore } from 'vuex';

import EventLogApi from '@/api/EventLogApi';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},
	props: {
		domainToShare: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		const { state } = useStore();

		const isLinkCopied = ref(false);

		const shareLinks = computed(() => [
			{
				name: 'facebook',
				icon: 'facebook',
				url: `https://www.facebook.com/sharer.php?display=page&u=https%3A%2F%2F${props.domainToShare}`,
			},
			{
				name: 'twitter',
				icon: 'twitter',
				url: `https://twitter.com/intent/tweet?url=https%3A%2F%2F${props.domainToShare}`,
			},
			{
				name: 'linkedin',
				icon: 'linkedin',
				url: `https://www.linkedin.com/shareArticle?url=https%3A%2F%2F${props.domainToShare}`,
			},
		]);

		const copyLink = () => {
			navigator.clipboard.writeText(`https://${props.domainToShare}`);

			isLinkCopied.value = true;

			setTimeout(() => {
				isLinkCopied.value = false;
			}, 1500);

			if (isHostingerBrand) {
				EventLogApi.logEvent({
					eventName: 'website_builder.social_link.copied',
					eventProperties: {
						website_id: state.websiteId,
						domain_name: props.domainToShare,
					},
					isHostingerEvent: true,
				});
			}
		};

		const trackShareClick = (name) => {
			if (isHostingerBrand) {
				EventLogApi.logEvent({
					eventName: 'website_builder.social_link.created',
					eventProperties: {
						social_media_type: name,
						website_id: state.websiteId,
						domain_name: props.domainToShare,
					},
					isHostingerEvent: true,
				});
			}
		};

		return {
			copyLink,
			shareLinks,
			isLinkCopied,
			trackShareClick,
		};
	},
});
</script>
<style lang="scss" scoped>
.website-share {
	text-align: center;

	&__subtitle {
		margin-bottom: 16px;
		color: $color-gray;
	}

	&__icons-list {
		display: flex;
		gap: 16px;
		align-items: center;
		justify-content: center;
	}

	&__icon-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		cursor: pointer;
		border: 1px solid $color-gray-border;
		border-radius: 50px;
		transition: all 0.3s ease;

		&:hover {
			background: $color-gray-light;
			box-shadow: 1px 2px 6px rgb(0 0 0 / 10%);
			transform: translateY(-2px);
		}
	}

	&__icon {
		width: 16px;
		height: 16px;
	}

	&__copy-link-wrap {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	&__link-copied {
		position: absolute;
		left: 56px;
		white-space: nowrap;
		animation: 1.5s alternate appear;
	}
}

@keyframes appear {
	0% {
		opacity: 0;
	}

	30% {
		opacity: 1;
	}

	80% {
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
}
</style>
