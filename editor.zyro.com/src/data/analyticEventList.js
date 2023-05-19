export const eventNames = {
    builder: {
        add_section: 'builder.add_section',
        add_element: 'builder.add_element',
        save_integration: 'builder.save_integration',
        save_meta: 'builder.save_meta',
        click_help_article: 'builder.click_help_article',
    },
};

// this is map of events that goes to amplitude and GTM
export default {
    getEvent(eventName) {
        // Converts String to Object path and returns the accessed event
        try {
            return eventName.split('.').reduce((object, item) => object[item], this);
        } catch {
            return null;
        }
    },
    // PRO Plan events
    user: {
        // Builder events
        domain_check: {
            amplitude: 'user.domain-check',
            gtm: {
                event: 'domainCheck',
                category: 'site',
            },
        },
        openBlockLibrary: {
            amplitude: 'user.openBlockLibrary',
            gtm: {
                event: 'openBlockLibrary',
                category: 'site',
            },
        },
        addBlockFromLibrary: {
            amplitude: 'user.addBlockFromLibrary',
            gtm: {
                event: 'addBlockFromLibrary',
                category: 'site',
            },
        },
        consultationService: {
            amplitude: 'builder.consultationService',
        },
    },
    // User site events
    site: {
        published: {
            amplitude: 'site.published',
            gtm: {
                event: 'publish',
                category: 'site',
            },
        },
        eshopDoNotContainBlock: {
            amplitude: 'site.eshopDoNotContainBlock',
            gtm: {
                event: 'eshopDoNotContainBlock',
                category: 'site',
            },
        },
        updated: {
            amplitude: 'site.updated',
            gtm: {
                event: 'update',
                category: 'site',
            },
        },
    },
    template: {
        'eshop-block-added': {
            amplitude: 'template.eshop-block-added',
            gtm: {
                event: 'eshop-block-added',
                category: 'template',
            },
        },
        load: {
            amplitude: 'template.load',
            gtm: {
                event: 'load',
                category: 'template',
            },
        },
    },
    // AI events
    ai: {
        'select-text': {
            amplitude: 'ai.select-text',
            gtm: {
                event: 'selectText',
                category: 'ai',
            },
        },
    },
    // instagram events
    instagram: {
        connectAccount: {
            amplitude: 'instagram.connect_account',
            gtm: {
                event: 'connect_instagram',
                category: 'template',
            },
        },
    },
    builder: {
        header: {
            replace_logo: {
                amplitude: 'builder.header.replace_logo',
            },
            change_logo: {
                amplitude: 'builder.header.change_logo',
            },
        },
        seo: {
            change_website_title: {
                amplitude: 'builder.seo.change_website_title',
            },
            change_page_title: {
                amplitude: 'builder.seo.change_page_title',
            },
        },
        slideshow: {
            add: {
                amplitude: 'builder.slideshow.add',
                gtm: {
                    event: 'builder.slideshow.add',
                    category: 'builder',
                },
            },
            add_new_slide: {
                amplitude: 'builder.slideshow.add_new_slide',
                gtm: {
                    event: 'builder.slideshow.add_new_slide',
                    category: 'builder',
                },
            },
            duplicate_slide: {
                amplitude: 'builder.slideshow.duplicate_slide',
                gtm: {
                    event: 'builder.slideshow.duplicate_slide',
                    category: 'builder',
                },
            },
            remove_slide: {
                amplitude: 'builder.slideshow.remove_slide',
                gtm: {
                    event: 'builder.slideshow.remove_slide',
                    category: 'builder',
                },
            },
        },
        image_element: {
            choose_image: {
                amplitude: 'builder.image_element.choose_image',
            },
        },
        gallery_element: {
            manage: {
                amplitude: 'builder.gallery_element.manage',
            },
        },
        image_gallery: {
            set_layout: {
                amplitude: 'builder.image_gallery.set_layout',
            },
            add_images: {
                amplitude: 'builder.image_gallery.add_images',
            },
        },
        blog: {
            open_sidebar: {
                amplitude: 'builder.blog.open_sidebar',
            },
            add_blog_page: {
                amplitude: 'builder.blog.add_blog_page',
            },
            insert_blog_list: {
                amplitude: 'builder.blog.insert_blog_list',
            },
            create_new_post: {
                amplitude: 'builder.blog.create_new_post',
            },
            schedule_post: {
                amplitude: 'builder.blog.schedule_post',
            },
            publish_post: {
                amplitude: 'builder.blog.publish_post',
            },
        },
        styles: {
            open: {
                amplitude: 'builder.styles.open',
            },
            replace_typography: {
                amplitude: 'builder.styles.replace_typography',
            },
            replace_color_palette: {
                amplitude: 'builder.styles.replace_color_palette',
            },
            replace_button_styles: {
                amplitude: 'builder.styles.replace_button_styles',
            },
        },
        publish_modal: {
            loaded: {
                amplitude: 'builder.publish_modal.loaded',
            },
            close: {
                amplitude: 'builder.publish_modal.close',
            },
            select_custom_domain: {
                amplitude: 'builder.publish_modal.select_custom_domain',
            },
            click_button_continue: {
                custom_domain: {
                    amplitude: 'builder.publish_modal.click_button_continue.custom_domain',
                },
                free_domain: {
                    amplitude: 'builder.publish_modal.click_button_continue.free_domain',
                },
            },
        },
        published_website_modal: {
            close: {
                amplitude: 'builder.published_website_modal.close',
            },
            click_button_view_site: {
                amplitude: 'builder.published_website_modal.click_button_view_site',
            },
        },
        ai_heatmap: {
            generate_heatmap: {
                amplitude: 'builder.ai_heatmap.generate_heatmap',
            },
            close: {
                amplitude: 'builder.ai_heatmap.close',
            },
        },
        manageStore_store_modal: {
            click_button: {
                amplitude: 'builder.manage_store_modal.click_button',
            },
            close: {
                amplitude: 'builder.manage_store_modal.close',
            },
        },
        upgradeSite_store_modal: {
            click_button: {
                amplitude: 'builder.upgrade_store_modal.click_button',
            },
            close: {
                amplitude: 'builder.upgrade_store_modal.close',
            },
        },
        choose_store_modal: {
            click_button: {
                amplitude: 'builder.choose_store_modal.click_button',
            },
            close: {
                amplitude: 'builder.choose_store_modal.close',
            },
        },
        storefront: {
            'click_button(manage_store)': {
                amplitude: 'builder.storefront.click_button(manage_store)',
            },
        },
        onboarding: {
            amplitude: 'builder.onboarding',
        },
        buy_button: {
            product_picked: {
                amplitude: 'builder.buy_button.product_picked',
            },
            add_products: {
                amplitude: 'builder.buy_button.add_products',
            },
            edit_product: {
                amplitude: 'builder.buy_button.edit_product',
            },
        },
        add_section: {
            amplitude: eventNames.builder.add_section,
        },
        add_element: {
            amplitude: eventNames.builder.add_element,
        },
        click_help_article: {
            amplitude: eventNames.builder.click_help_article,
        },
        save_integration: {
            amplitude: eventNames.builder.save_integration,
        },
        save_meta: {
            amplitude: eventNames.builder.save_meta,
        },
        banners: {
            publish: {
                amplitude: 'builder.banners.publish',
            },
        },
    },
    // site settings events
    site_settings: {
        custom_domain: {
            start: {
                amplitude: 'site_settings.custom_domain.start',
            },
            enter_domain_name: {
                amplitude: 'site_settings.custom_domain.enter_domain_name',
            },
            see_instructions: {
                amplitude: 'site_settings.custom_domain.see_instructions',
            },
            verify_connection: {
                amplitude: 'site_settings.custom_domain.verify_connection',
            },
            domain_connected: {
                amplitude: 'site_settings.custom_domain.domain_connected',
            },
            domain_connection_failed: {
                amplitude: 'site_settings.custom_domain.domain_connection_failed',
            },
            remove_domain: {
                amplitude: 'site_settings.custom_domain.remove_domain',
            },
        },
        online_store: {
            upgraded_click_button: {
                amplitude: 'site_settings.online_store.upgraded_click_button',
            },
        },
    },
    // Domain related events
    domain: {
        connected: {
            amplitude: 'domain.connected',
        },
    },
    // Hostinger integration event
    website_builder: {
        gamefication: {
            enter: {
                amplitude: 'website_builder.gamefication.enter',
            },
            rated: {
                amplitude: 'website_builder.gamefication.rated',
            },
            completed: {
                amplitude: 'website_builder.gamefication.completed',
            },
        },
        game_start: {
            enter: {
                amplitude: 'website_builder.game_start.enter',
            },
            completed: {
                amplitude: 'website_builder.game_start.completed',
            },
        },
        game_edit_heading: {
            enter: {
                amplitude: 'website_builder.game_edit_heading.enter',
            },
            completed: {
                amplitude: 'website_builder.game_edit_heading.completed',
            },
        },
        game_update_image: {
            enter: {
                amplitude: 'website_builder.game_update_image.enter',
            },
            completed: {
                amplitude: 'website_builder.game_update_image.completed',
            },
        },
        game_edit_paragraph_text: {
            enter: {
                amplitude: 'website_builder.game_edit_paragraph_text.enter',
            },
            completed: {
                amplitude: 'website_builder.game_edit_paragraph_text.completed',
            },
        },
        game_add_your_own_log: {
            enter: {
                amplitude: 'website_builder.game_add_your_own_log.enter',
            },
            completed: {
                amplitude: 'website_builder.game_add_your_own_log.completed',
            },
        },
        game_update_social_media: {
            enter: {
                amplitude: 'website_builder.game_update_social_media.enter',
            },
            completed: {
                amplitude: 'website_builder.game_update_social_media.completed',
            },
        },
        game_check_your_mobile: {
            enter: {
                amplitude: 'website_builder.game_check_your_mobile.enter',
            },
            completed: {
                amplitude: 'website_builder.game_check_your_mobile.completed',
            },
        },
        game_get_found_on_google: {
            enter: {
                amplitude: 'website_builder.game_get_found_on_google.enter',
            },
            completed: {
                amplitude: 'website_builder.game_get_found_on_google.completed',
            },
        },
        game_go_live: {
            enter: {
                amplitude: 'website_builder.game_go_live.enter',
            },
            completed: {
                amplitude: 'website_builder.game_go_live.completed',
            },
        },
        feedback: {
            enter: {
                amplitude: 'website_builder.feedback.enter',
            },
        },
        website_settings: {
            enter: {
                amplitude: 'website_builder.website_settings.enter',
            },
        },
        languages: {
            enter: {
                amplitude: 'website_builder.languages.enter',
            },
        },
        ai_tools: {
            enter: {
                amplitude: 'website_builder.ai_tools.enter',
            },
        },
        blog: {
            enter: {
                amplitude: 'website_builder.blog.enter',
            },
        },
        website_styles: {
            enter: {
                amplitude: 'website_builder.website_styles.enter',
            },
        },
        pages_and_navigation: {
            enter: {
                amplitude: 'website_builder.pages_and_navigation.enter',
            },
        },
        add_page: {
            enter: {
                amplitude: 'builder.add_page.enter',
            },
            added: {
                amplitude: 'builder.add_page.added',
            },
        },
        add_element: {
            enter: {
                amplitude: 'website_builder.add_element.enter',
            },
        },
        builder: {
            back: {
                amplitude: 'website_builder.builder.back',
            },
            enter: {
                amplitude: 'website_builder.builder.enter',
            },
            saved: {
                amplitude: 'website_builder.builder.saved',
            },
            previewed: {
                amplitude: 'website_builder.builder.previewed',
            },
            website_published: {
                amplitude: 'website_builder.builder.website_published',
            },
            website_update: {
                amplitude: 'website_builder.builder.website_update',
            },
        },
        domain: {
            propagated: {
                amplitude: 'website_builder.domain.propagated',
            },
        },
        ai_builder: {
            enter: {
                amplitude: 'website_builder.ai_builder.enter',
            },
            create: {
                amplitude: 'website_builder.ai_builder.create',
            },
            created: {
                amplitude: 'website_builder.ai_builder.created',
            },
            back: {
                amplitude: 'website_builder.ai_builder.back',
            },
            try_again: {
                amplitude: 'website_builder.ai_builder.try_again',
            },
            builder_enter: {
                amplitude: 'website_builder.ai_builder.builder_enter',
            },
        },
        ai_builder_pages: {
            added: {
                amplitude: 'website_builder.ai_builder_pages.added',
            },
            deleted: {
                amplitude: 'website_builder.ai_builder_pages.deleted',
            },
        },
        ai_builder_text_generation: {
            redo: {
                amplitude: 'website_builder.ai_builder_text_generation.redo',
            },
            undo: {
                amplitude: 'website_builder.ai_builder_text_generation.undo',
            },
            rephrase: {
                amplitude: 'website_builder.ai_builder_text_generation.rephrase',
            },
        },
        ai_builder_image_generation: {
            redo: {
                amplitude: 'website_builder.ai_builder_image_generation.redo',
            },
            undo: {
                amplitude: 'website_builder.ai_builder_image_generation.undo',
            },
            regenerate: {
                amplitude: 'website_builder.ai_builder_image_generation.regenerate',
            },
        },
        ai_builder_survey: {
            description_filled: {
                amplitude: 'website_builder.ai_builder_survey.description_filled',
            },
            website_type_chosen: {
                amplitude: 'website_builder.ai_builder_survey.website_type_chosen',
            },
            brand_name_filled: {
                amplitude: 'website_builder.ai_builder_survey.brand_name_filled',
            },
        },
        ai_builder_styles: {
            enter: {
                amplitude: 'website_builder.ai_builder_styles.enter',
            },
            fonts_chosen: {
                amplitude: 'website_builder.ai_builder_styles.fonts_chosen',
            },
            colors_chosen: {
                amplitude: 'website_builder.ai_builder_styles.colors_chosen',
            },
        },
        text_box_threshold: {
            reached: {
                amplitude: 'website_builder.text_box_threshold.reached',
            },
        },
        home_page_text_threshold: {
            reached: {
                amplitude: 'website_builder.home_page_text_threshold.reached',
            },
        },
        change_template: {
            enter: {
                amplitude: 'website_builder.change_template.enter',
            },
        },
        template: {
            enter: {
                amplitude: 'website_builder.template.enter',
            },
            chosen: {
                amplitude: 'website_builder.template.chosen',
            },
        },
        help: {
            enter: {
                amplitude: 'website_builder.help.enter',
            },
        },
        help_articles: {
            enter: {
                amplitude: 'website_builder.help_articles.enter',
            },
            shown: {
                amplitude: 'website_builder.help_articles.shown',
            },
        },
        keyboard_shortcuts: {
            enter: {
                amplitude: 'website_builder.keyboard_shortcuts.enter',
            },
        },
        quick_tour: {
            enter: {
                amplitude: 'website_builder.quick_tour.enter',
            },
        },
        ecomm: {
            store_added: {
                amplitude: 'website_builder.ecomm.store_added',
            },
            enter: {
                amplitude: 'website_builder.ecomm.enter',
            },
            remove: {
                amplitude: 'website_builder.ecomm.remove',
            },
            store_manager_test: {
                amplitude: 'website_builder.ecomm.store_manager_test',
            },
        },
        ecomm_store: {
            enter: {
                amplitude: 'website_builder.ecomm_store.enter',
            },
        },
        ecomm_product_page: {
            enter: {
                amplitude: 'website_builder.ecomm_product_page.enter',
            },
        },
        ecomm_page_settings: {
            enter: {
                amplitude: 'website_builder.ecomm_page_settings.enter',
            },
            saved: {
                amplitude: 'website_builder.ecomm_page_settings.saved',
            },
        },
        ecomm_products: {
            add: {
                amplitude: 'website_builder.ecomm_products.add',
            },
            edit: {
                amplitude: 'website_builder.ecomm_products.edit',
            },
        },
        start_guide: {
            enter: {
                amplitude: 'website_builder.start_guide.enter',
            },
            change_logo: {
                enter: {
                    amplitude: 'website_builder.start_guide.change_logo.enter',
                },
            },
            get_found: {
                enter: {
                    amplitude: 'website_builder.start_guide.get_found.enter',
                },
            },
            publish_website: {
                enter: {
                    amplitude: 'website_builder.start_guide.publish_website.enter',
                },
            },
            step_completed: {
                amplitude: 'website_builder.start_guide.step_completed',
            },
            guide_completed: {
                amplitude: 'website_builder.start_guide.guide_completed',
            },
        },
        website_settings_general_settings: {
            enter: {
                amplitude: 'website_builder.website_settings_general_settings.enter',
            },
        },
        website_settings_integrations: {
            enter: {
                amplitude: 'website_builder.website_settings_integrations.enter',
            },
        },
        website_settings_analytics: {
            enter: {
                amplitude: 'website_builder.website_settings_analytics.enter',
            },
            help_article_enter: {
                amplitude: 'website_builder.website_settings_analytics.help_article_enter',
            },
        },
        website_settings_seo: {
            enter: {
                amplitude: 'website_builder.website_settings_seo.enter',
            },
        },
        website_settings_form_submissions: {
            enter: {
                amplitude: 'website_builder.website_settings_form_submissions.enter',
            },
        },
        website_settings_export_wordpress: {
            enter: {
                amplitude: 'website_builder.website_settings_export_wordpress.enter',
            },
        },
        website_settings_media_library: {
            enter: {
                amplitude: 'website_builder.website_settings_media_library.enter',
            },
        },
        social_link: {
            copied: {
                amplitude: 'website_builder.social_link.copied',
            },
            created: {
                amplitude: 'website_builder.social_link.created',
            },
        },
        styles_animation_style: {
            selected: {
                amplitude: 'website_builder.styles_animation_style.selected',
            },
        },
        animations: {
            close: {
                amplitude: 'website_builder.animations.close',
            },
            enter: {
                amplitude: 'website_builder.animations.enter',
            },
        },
        search: {
            typed: {
                amplitude: 'website_builder.search.typed',
            },
            enter: {
                amplitude: 'website_builder.search.enter',
            },
        },
        password_setup: {
            enter: {
                amplitude: 'website_builder.password_setup.enter',
            },
            enabled: {
                amplitude: 'website_builder.password_setup.enabled',
            },
            disabled: {
                amplitude: 'website_builder.password_setup.disabled',
            },
            saved: {
                amplitude: 'website_builder.password_setup.saved',
            },
        },
        seo_list_your_business_on_google: {
            enter: {
                amplitude: 'website_builder.seo_list_your_business_on_google.enter',
            },
        },
        seo_brand_name: {
            typed: {
                amplitude: 'website_builder.seo_brand_name.typed',
            },
        },
        seo_language: {
            selected: {
                amplitude: 'website_builder.seo_language.selected',
            },
        },
        seo_website_description: {
            typed: {
                amplitude: 'website_builder.seo_website_description.typed',
            },
        },
        seo_keywords: {
            chosen: {
                amplitude: 'website_builder.seo_keywords.chosen',
            },
        },
        seo_summary: {
            finished: {
                amplitude: 'website_builder.seo_summary.finished',
            },
        },
        connect_domain_manual: {
            enter: {
                amplitude: 'website_builder.connect_domain_manual.enter',
            },
        },
    },

    // Black Friday events
    black_friday: {
        editor_header_get_offer_clicked: {
            amplitude: 'black_friday.editor_header_get_offer_clicked',
            gtm: {
                event: 'editor_header_get_offer_clicked',
                category: 'black_friday',
            },
        },
    },
};