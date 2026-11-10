/* site.js — Utilities for momentum.inc
   Mobile nav, IntersectionObserver reveals, stat counter, code typing.
   Vanilla JS, no dependencies. */

(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── 1. Mobile Nav Toggle ── */
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (toggle && nav) {
        document.documentElement.classList.add('site-nav-ready');
        toggle.addEventListener('click', function () {
            var expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            nav.setAttribute('data-open', String(!expanded));
        });

        /* Close mobile nav when a link is clicked */
        var navLinks = nav.querySelectorAll('a');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                nav.setAttribute('data-open', 'false');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });

        /* Close mobile nav on Escape key */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
                nav.setAttribute('data-open', 'false');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
            }
        });
    }

    /* ── 2. Header scroll state (rAF-throttled) ── */
    var header = document.querySelector('.site-header');
    if (header) {
        var scrollTicking = false;
        window.addEventListener('scroll', function () {
            if (!scrollTicking) {
                scrollTicking = true;
                requestAnimationFrame(function () {
                    header.classList.toggle('scrolled', window.scrollY > 40);
                    scrollTicking = false;
                });
            }
        }, { passive: true });
        header.classList.toggle('scrolled', window.scrollY > 40);
    }

    /* ── 3. IntersectionObserver for reveals ── */
    if ('IntersectionObserver' in window && !reducedMotion) {
        var revealObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal').forEach(function (el) {
            revealObs.observe(el);
        });

        /* Legacy support: also handle .reveal-on-scroll from existing pages */
        var legacyObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    legacyObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

        var vh = window.innerHeight;
        var legacySelectors = [
            '.bridge-section > .container', '.section-header', '.pillars-grid',
            '.paths-grid', '.credibility-content', '.arch-stack', '.case-study-grid',
            '.partner-grid', '.team-grid', '.engage-grid', '.paper-list', '.value-grid',
            '.stack-grid', '.product-content', '.product-stats', '.magnitude-table',
            '.economics-grid', '.primitive-list', '.resource-list', '.principle-grid',
            '.compliance-grid', '.deployment-list', '.vision-callout .container',
            '.cta-content', '.contact-content', '.article-content > .container'
        ].join(', ');

        /* Read pass: measure all positions before any DOM writes */
        var legacyEls = [];
        document.querySelectorAll(legacySelectors).forEach(function (el) {
            legacyEls.push({ el: el, below: el.getBoundingClientRect().top > vh * 0.8 });
        });

        var staggerSelectors = [
            '.pillars-grid', '.paths-grid', '.stats-grid', '.case-study-grid',
            '.partner-grid', '.team-grid', '.engage-grid', '.value-grid',
            '.stack-grid', '.principle-grid', '.compliance-grid', '.deployment-list'
        ].join(', ');

        var staggerEls = [];
        document.querySelectorAll(staggerSelectors).forEach(function (g) {
            staggerEls.push({ el: g, below: g.getBoundingClientRect().top > vh * 0.8 });
        });

        /* Write pass: apply classes and observe (no interleaved reads) */
        legacyEls.forEach(function (item) {
            if (item.below) {
                item.el.classList.add('reveal-on-scroll');
                legacyObs.observe(item.el);
            }
        });

        staggerEls.forEach(function (item) {
            if (item.below) {
                item.el.classList.add('stagger-children');
            }
        });
    }

    /* ── 4. Stat Counter Animation ── */
    function animateCounter(el) {
        var target = parseFloat(el.getAttribute('data-target'));
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var isDecimal = String(target).indexOf('.') !== -1;

        /* Reduced motion: set final value immediately */
        if (reducedMotion) {
            if (isDecimal) {
                el.textContent = prefix + target.toFixed(1) + suffix;
            } else {
                el.textContent = prefix + target.toLocaleString() + suffix;
            }
            return;
        }

        var duration = 600;
        var start = null;

        /* Special case: no animation for values with < prefix */
        if (prefix === '<') {
            el.textContent = prefix + '$' + target + suffix;
            return;
        }

        function step(ts) {
            if (!start) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            /* Ease-out cubic */
            var t = 1 - Math.pow(1 - progress, 3);
            var current = t * target;

            if (isDecimal) {
                el.textContent = prefix + current.toFixed(1) + suffix;
            } else {
                el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                if (isDecimal) {
                    el.textContent = prefix + target.toFixed(1) + suffix;
                } else {
                    el.textContent = prefix + target.toLocaleString() + suffix;
                }
            }
        }

        requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
        var statObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-number[data-target]').forEach(function (el) {
            statObs.observe(el);
        });
    }

    /* ── 5. Code Line Reveal Animation ── */
    if ('IntersectionObserver' in window && !reducedMotion) {
        var codeObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var lines = entry.target.querySelectorAll('.code-line');
                    lines.forEach(function (line, i) {
                        setTimeout(function () {
                            line.classList.add('visible');
                        }, i * 80);
                    });
                    codeObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.code-typed').forEach(function (el) {
            codeObs.observe(el);
        });
    }

    /* ── 6. Scroll-Synced Code Panel ── */
    /* Supports multiple .code-scroll-layout sections on the same page.
     * Each layout is initialized independently with its own scene state. */
    (function initScrollCodePanels() {
        var layouts = document.querySelectorAll('.code-scroll-layout');
        if (!layouts.length) return;

        layouts.forEach(function (layout) {
            var chapters = layout.querySelectorAll('.code-chapter');
            if (!chapters.length) return;

            var panel = layout.querySelector('.code-panel');
            var scenes = panel.querySelectorAll('.code-scene');
            var titleEl = panel.querySelector('.title');
            var isMobile = window.innerWidth < 768;

            /* Build scene title map from data-title attributes on each scene */
            var sceneMeta = {};
            scenes.forEach(function (sc) {
                var name = sc.getAttribute('data-scene');
                var title = sc.getAttribute('data-title');
                if (name && title) sceneMeta[name] = title;
            });

            /* Mobile / reduced motion: show everything statically */
            if (reducedMotion || isMobile) {
                chapters.forEach(function (ch) { ch.style.opacity = '1'; });
                return;
            }

            /* First scene is determined by the first chapter's data-scene */
            var firstSceneName = chapters[0] ? chapters[0].getAttribute('data-scene') : null;
            var currentScene = firstSceneName;

            function activateScene(sceneName) {
                if (sceneName === currentScene) return;
                currentScene = sceneName;

                scenes.forEach(function (sc) {
                    sc.classList.toggle('active', sc.getAttribute('data-scene') === sceneName);
                });

                if (titleEl && sceneMeta[sceneName]) {
                    titleEl.textContent = sceneMeta[sceneName];
                }
            }

            /* Set initial state */
            chapters[0].style.opacity = '1';

            /* Progressive chapter opacity driven by intersection ratio.
             * Uses 20 thresholds so opacity updates smoothly as the user
             * scrolls, rather than jumping at a single trigger point. */
            if ('IntersectionObserver' in window) {
                var thresholds = [];
                for (var t = 0; t <= 20; t++) { thresholds.push(t / 20); }

                /* Store each chapter's current ratio to resolve conflicts.
                 * When two chapters are both partially visible, only the
                 * one with the HIGHER ratio wins — eliminates ping-pong. */
                var ratios = {};
                chapters.forEach(function (ch) {
                    ratios[ch.getAttribute('data-scene')] = 0;
                });

                var chapterObs = new IntersectionObserver(function (entries) {
                    /* Update ratios and opacity for every reported entry */
                    entries.forEach(function (entry) {
                        var ch = entry.target;
                        var name = ch.getAttribute('data-scene');
                        var ratio = entry.isIntersecting ? entry.intersectionRatio : 0;

                        ratios[name] = ratio;
                        ch.style.opacity = 0.15 + ratio * 0.85;
                        /* Promote to compositor layer only while near viewport */
                        ch.style.willChange = entry.isIntersecting ? 'opacity' : 'auto';
                    });

                    /* Find the chapter with the highest visibility */
                    var bestScene = currentScene;
                    var bestRatio = ratios[currentScene] || 0;
                    for (var name in ratios) {
                        if (ratios[name] > bestRatio) {
                            bestRatio = ratios[name];
                            bestScene = name;
                        }
                    }

                    /* Only switch if a different chapter is clearly dominant */
                    if (bestScene !== currentScene && bestRatio > 0.15) {
                        activateScene(bestScene);
                    }
                }, {
                    threshold: thresholds,
                    rootMargin: '-8% 0px -8% 0px'
                });

                chapters.forEach(function (ch) {
                    chapterObs.observe(ch);
                });
            }
        });
    })();

    /* ── 7. Initialize mesh if present ── */
    if (window.MomentumMesh) {
        if (document.getElementById('mesh-container')) {
            window.MomentumMesh.init('mesh-container');
        }
        if (document.getElementById('explore-mesh')) {
            window.MomentumMesh.init('explore-mesh', { compact: true });
        }
    }

    /* ── 8. Font load detection ── */
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            document.documentElement.classList.add('fonts-loaded');
        });
    }

    /* Keep long reference navigation available without filling the mobile page. */
    document.querySelectorAll('.docs-sidebar').forEach(function (sidebar, index) {
        var content = document.createElement('div');
        content.className = 'docs-sidebar-content';
        content.id = 'docs-navigation-' + index;
        while (sidebar.firstChild) content.appendChild(sidebar.firstChild);

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'docs-navigation-toggle';
        button.textContent = 'On this page';
        button.setAttribute('aria-controls', content.id);
        button.setAttribute('aria-expanded', 'false');
        sidebar.appendChild(button);
        sidebar.appendChild(content);
        sidebar.classList.add('docs-navigation-ready');

        button.addEventListener('click', function () {
            var expanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!expanded));
        });
        sidebar.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
                button.setAttribute('aria-expanded', 'false');
                button.focus();
            }
        });
        content.querySelectorAll('.docs-sidebar-link').forEach(function (link) {
            link.addEventListener('click', function () {
                button.setAttribute('aria-expanded', 'false');
                var target = document.getElementById(link.hash.slice(1));
                var heading = target && target.querySelector('h2, h3, h4');
                if (heading) {
                    heading.setAttribute('tabindex', '-1');
                    heading.focus({ preventScroll: true });
                }
            });
        });
    });

    /* Search headings, endpoints, and parameters in the sections already on the page. */
    var docsSearch = document.getElementById('docs-search');
    if (docsSearch) {
        var searchStatus = document.getElementById('docs-search-status');
        var searchableLinks = Array.from(document.querySelectorAll('.docs-sidebar-link')).map(function (link) {
            var section = document.getElementById(link.hash.slice(1));
            link.addEventListener('click', function () {
                var terms = docsSearch.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
                if (!section || !terms.length) return;
                section.querySelectorAll('details').forEach(function (details) {
                    var text = details.textContent.toLowerCase();
                    if (terms.every(function (term) { return text.indexOf(term) !== -1; })) details.open = true;
                });
            });
            return { link: link, text: (link.textContent + ' ' + (section ? section.textContent : '')).toLowerCase() };
        });
        var searchGroups = document.querySelectorAll('.docs-sidebar-group');
        var filterReference = function () {
            var query = docsSearch.value.trim().toLowerCase();
            var terms = query.split(/\s+/).filter(Boolean);
            var count = 0;
            searchableLinks.forEach(function (entry) {
                var match = terms.every(function (term) { return entry.text.indexOf(term) !== -1; });
                entry.link.hidden = !match;
                if (match) count++;
            });
            searchGroups.forEach(function (group) {
                group.hidden = !group.querySelector('.docs-sidebar-link:not([hidden])');
            });
            if (searchStatus) {
                searchStatus.textContent = query ? (count ? count + ' matching section' + (count === 1 ? '' : 's') : 'No matching sections. Try another term.') : '';
            }
        };
        docsSearch.addEventListener('input', filterReference);
        docsSearch.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                var first = searchableLinks.find(function (entry) { return !entry.link.hidden; });
                if (first) {
                    event.preventDefault();
                    first.link.click();
                }
            }
            if (event.key === 'Escape' && docsSearch.value) {
                event.stopPropagation();
                docsSearch.value = '';
                filterReference();
            }
        });
        filterReference();
        document.documentElement.classList.add('docs-search-ready');
    }

    /* Copy controls remain visible for keyboard and touch readers. */
    document.querySelectorAll('.code-panel').forEach(function (panel) {
        var code = panel.querySelector('pre code');
        if (!code) return;
        var actions = document.createElement('div');
        actions.className = 'code-actions';
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'code-copy-btn';
        button.textContent = 'Copy code';
        var status = document.createElement('span');
        status.className = 'code-copy-status';
        status.setAttribute('role', 'status');
        actions.appendChild(status);
        actions.appendChild(button);
        var header = panel.querySelector('.code-block-header');
        if (header && window.getComputedStyle(header).display !== 'none') {
            header.classList.add('has-code-actions');
            header.appendChild(actions);
        } else {
            code.parentNode.before(actions);
        }
        button.addEventListener('click', function () {
            var text = code.textContent.replace(/^\$\s/gm, '');
            var selectCode = function () {
                var range = document.createRange();
                range.selectNodeContents(code);
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                status.textContent = 'Code selected. Use your copy command.';
            };
            if (!navigator.clipboard || !navigator.clipboard.writeText) {
                selectCode();
                return;
            }
            navigator.clipboard.writeText(text).then(function () {
                status.textContent = 'Copied';
            }).catch(selectCode);
        });
    });

    /* ── Docs sidebar scroll-spy ──
       The Moxie/Mass API pages carry a <aside class="docs-sidebar"> that
       lists every section with a hash link; the page HTML marks
       "Introduction" as .active at load and then the server-rendered
       class never changes. This observer watches every section target
       and updates the .active class on the matching sidebar link as
       sections scroll into the reader's viewport. */
    var sidebarLinks = document.querySelectorAll('.docs-sidebar-link');
    if (sidebarLinks.length && 'IntersectionObserver' in window) {
        var linkById = new Map();
        var sectionIds = [];
        sidebarLinks.forEach(function (link) {
            var href = link.getAttribute('href') || '';
            if (href.charAt(0) !== '#') return;
            var id = href.slice(1);
            if (!id) return;
            linkById.set(id, link);
            sectionIds.push(id);
        });

        var activateLinkForId = function (id) {
            sidebarLinks.forEach(function (l) {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
            });
            var link = linkById.get(id);
            if (link) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'location');
            }
        };

        /* Track every section's last-seen intersection ratio; the one
           nearest the top of the viewport (but still visible) wins.
           rootMargin anchors the "active zone" to the upper third of
           the viewport, so a section becomes active as its heading
           crosses that line. */
        var visibilityById = new Map();
        var sidebarObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                visibilityById.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
            });
            /* Pick the first section (in document order) that is currently
               intersecting the active zone. */
            for (var i = 0; i < sectionIds.length; i++) {
                if ((visibilityById.get(sectionIds[i]) || 0) > 0) {
                    activateLinkForId(sectionIds[i]);
                    return;
                }
            }
        }, { rootMargin: '-20% 0px -70% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

        sectionIds.forEach(function (id) {
            var section = document.getElementById(id);
            if (section) sidebarObs.observe(section);
        });

        /* Clicking a sidebar link should also snap the .active class
           immediately — otherwise the observer lags by one scroll tick. */
        sidebarLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                var href = link.getAttribute('href') || '';
                if (href.charAt(0) === '#' && href.length > 1) {
                    activateLinkForId(href.slice(1));
                }
            });
        });
    }
})();
