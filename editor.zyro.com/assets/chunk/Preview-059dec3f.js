import {
    d as c,
    G as f,
    q as r,
    s as w,
    o as i,
    c as u,
    m as s,
    w as d,
    v as _,
    t as a,
    b as t,
    h as P,
    f as y,
    i as H,
    l as k,
    x as S,
    aQ as T
} from "./vendor-d0167e50.js";
import {
    I,
    Z as C,
    B as E,
    a as D,
    _ as p,
    b as q
} from "../js/index-294b1ce8.js";
const z = c({
        components: {
            Icon: I,
            ZyroButton: C,
            BuilderHeaderScreenToggleButton: E,
            BuilderHeaderPublishButton: D
        },
        computed: { ...f("gui", ["isMobileScreen"])
        }
    }),
    N = {
        class: "builder-header builder-header--preview-mode",
        "data-qa": "builder-header-preview"
    },
    R = {
        class: "builder-header__title"
    },
    U = {
        class: "z-subheading"
    },
    V = {
        class: "builder-header__last-item"
    };

function Z(e, o, m, v, b, h) {
    const n = r("Icon"),
        l = r("ZyroButton"),
        B = r("BuilderHeaderScreenToggleButton"),
        g = r("BuilderHeaderPublishButton"),
        $ = w("qa");
    return i(), u("div", N, [s(l, {
        "data-qa": "builder-preview-btn-backtoeditor",
        theme: "header",
        color: "white",
        onClick: o[0] || (o[0] = A => e.$emit("exit-preview"))
    }, {
        "icon-left": d(() => [s(n, {
            name: "chevron_left"
        })]),
        default: d(() => [_(" " + a(e.$t("builder.headerPreview.backToEditor")), 1)]),
        _: 1
    }), t("div", R, [P(e.$slots, "title", {}, () => [t("h3", U, a(e.$t("builder.headerPreview.previewMode")), 1)], !0)]), t("div", V, [e.isMobileScreen ? H("", !0) : (i(), y(B, {
        key: 0
    })), k(s(g, null, null, 512), [
        [$, "builder-preview-btn-publish"]
    ])])])
}
const M = p(z, [
    ["render", Z],
    ["__scopeId", "data-v-bf6795d4"]
]);
const G = c({
        name: "Preview",
        components: {
            BuilderHeaderPreview: M
        },
        setup() {
            return {
                BUILDER_ROUTE: q
            }
        },
        computed: { ...S(["currentPage", "isCurrentPageTypeBlog"])
        }
    }),
    L = {
        class: "blog-header"
    },
    O = {
        class: "z-body z-body--strong"
    },
    Q = {
        class: "z-body"
    };

function j(e, o, m, v, b, h) {
    const n = r("BuilderHeaderPreview");
    return i(), u("div", null, [s(n, {
        class: "page-layout__header page-layout__header--sticky",
        onExitPreview: o[0] || (o[0] = l => e.$router.push({
            name: e.BUILDER_ROUTE
        }))
    }, T({
        _: 2
    }, [e.isCurrentPageTypeBlog ? {
        name: "title",
        fn: d(() => [t("div", L, [t("h3", O, [_(a(e.currentPage.meta.title || e.currentPage.name) + " \xB7 ", 1), t("span", Q, a(e.currentPage.isDraft ? e.$t("common.draft") : e.$t("common.published")), 1)])])]),
        key: "0"
    } : void 0]), 1024)])
}
const K = p(G, [
    ["render", j],
    ["__scopeId", "data-v-c30eebd4"]
]);
export {
    K as
    default
};
//# sourceMappingURL=Preview-059dec3f.js.map